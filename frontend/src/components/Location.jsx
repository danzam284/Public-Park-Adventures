import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
        <div>
            <button onClick={() => navigate("/")}>Home</button>
            <h2>Parks Near Me</h2>
            {parks ? (
                parks.map((park) => (
                    <div key={park._id}>
                        <div style={{backgroundColor: "aliceblue", color: "black", borderRadius: "10px"}}>
                            <Rating
                                readOnly
                                size="large"
                                name="overall-rating"
                                value={park.ratings.overallRating?.avg ?? 0}
                                precision={0.1}
                            />
                            <h2>{park.apiData.fullName}</h2>
                            <p>{park.apiData.addresses.length && `${park.apiData.addresses[0].city}, ${park.apiData.addresses[0].stateCode}`}</p>
                            <p>{park.distance.toFixed(2)} miles away</p>
                            <img width={200} src={park.apiData.images[0].url}></img><br></br>
                            <button onClick={() => navigate(`/park/${park.apiData.parkCode}`)}>More Info</button>
                            <br></br><br></br>
                        </div><br></br><br></br>
                    </div>
                ))
            ) : error ? (
                <div>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            ) : (
                <p>Fetching location...</p>
            )}
        </div>
    );
}

export default Location;