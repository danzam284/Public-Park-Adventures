import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircularProgress from '@mui/material/CircularProgress';

function Location() {
    const [parks, setParks] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        async function findCloseParks(lat, lon) {
            const { data } = await axios.post("http://localhost:3000/findCloseParks", {
                latitude: lat,
                longitude: lon
            });

            data.map((park) => {
                const toRadians = (degrees) => degrees * (Math.PI / 180);
                const calculateDistance = (lat1, lon1, lat2, lon2) => {
                    const R = 3958.8; // Radius of the Earth in miles
                    const dLat = toRadians(lat2 - lat1);
                    const dLon = toRadians(lon2 - lon1);
                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(toRadians(lat1)) *
                            Math.cos(toRadians(lat2)) *
                            Math.sin(dLon / 2) *
                            Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                };

                const distance = calculateDistance(lat, lon, parseFloat(park.apiData.latitude), parseFloat(park.apiData.longitude));
                park.distance = distance;
                return park;
            });

            setParks(data);
        }
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => findCloseParks(position.coords.latitude, position.coords.longitude),
            (err) => setError(`Error fetching location: ${err.message}`)
        );
    }, []);

    return (
        <div className="container">
            <div className="header-nav">
                <button onClick={() => navigate("/")} className="back-button">
                    Home
                </button>
            </div>

            <div className="location-container">
                <div className="location-header">
                    <LocationOnIcon className="location-icon" />
                    <h1>Parks Near Me</h1>
                </div>

                {parks ? (
                    <div className="parks-grid">
                        {parks.map((park) => (
                            <div key={park._id} className="park-card location-card">
                                <div className="park-image">
                                    <span title={park.apiData.images[0].altText}>
                                        <img
                                            src={park.apiData.images[0].url}
                                            alt={park.apiData.images[0].altText}
                                        />
                                        </span>
                                    <div className="distance-badge">
                                        {park.distance.toFixed(1)} miles
                                    </div>
                                </div>
                                <div className="park-content">
                                    <Rating
                                        readOnly
                                        size="large"
                                        name="overall-rating"
                                        value={park.ratings.overallRating?.avg ?? 0}
                                        precision={0.1}
                                    />
                                    <h3>{park.apiData.fullName}</h3>
                                    <p className="park-location">
                                        {park.apiData.addresses.length && 
                                            `${park.apiData.addresses[0].city}, ${park.apiData.addresses[0].stateCode}`}
                                    </p>
                                    <button 
                                        onClick={() => navigate(`/park/${park.apiData.parkCode}`)}
                                        className="details-button"
                                    >
                                        More Info
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <h2>Location Error</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate("/search")}>
                            Search Parks Instead
                        </button>
                    </div>
                ) : (
                    <div className="loading-container">
                        <CircularProgress size={60} />
                        <p>Finding parks near you...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Location;
