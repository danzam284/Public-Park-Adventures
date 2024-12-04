import '../App.css'
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Rating } from '@mui/material';

import { SignOutButton } from "@clerk/clerk-react";

function Home() {
    const { isSignedIn, user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [parks, setParks] = useState(null);
    
    //Sends a request to register the user if they have not been already
    useEffect(() => {
        if (isSignedIn) {
            axios.post(
                "http://localhost:3000/newUser",
                {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    username: user.username,
                    profilePicture: user.imageUrl
                }
            )
        }
    }, [isSignedIn]);

    useEffect(() => {
        async function getPark() {
            const {data} = await axios.get("http://localhost:3000/getTopParks");
            setLoading(false);
            setParks(data);
        }

        getPark()
        console.log(user);
    }, []);

    if (loading) {
        return "Loading..."
    }

    return <div className="container">
        <div className="header-buttons">
            <button onClick={() => navigate(`/search`)}>Search For Parks</button>
            <button onClick={() => navigate(`/location`)}>Parks Near Me</button>
            <SignOutButton mode="modal">
                <button>Sign Out</button>
            </SignOutButton>
            <img src={user.imageUrl} alt={user.username} class="PFP_HOME" loading="lazy"/>
        </div>
        
        <h1 className="main-title">Public Park Adventures</h1>
        
        <h2>Top Rated Parks</h2>
        <div className="grid">
            {parks.map((park) => (
                <div key={park._id} className="card park-card">
                    <Rating
                        readOnly
                        size="large"
                        name="overall-rating"
                        value={park.ratings?.overallRating?.avg ?? 0}
                        precision={0.1}
                    />
                    <h3>{park.apiData.fullName}</h3>
                    <p className="park-location">
                        {park.apiData.addresses.length && 
                            `${park.apiData.addresses[0].city}, ${park.apiData.addresses[0].stateCode}`}
                    </p>
                    <div className="park-image">
                        <img src={park.apiData.images[0].url} alt={park.apiData.fullName} />
                    </div>
                    <button onClick={() => navigate(`/park/${park.apiData.parkCode}`)}>
                        More Info
                    </button>
                </div>
            ))}
        </div>
    </div>
}

export default Home;
