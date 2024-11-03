import '../App.css'
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Rating } from '@mui/material';

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

        getPark();
    }, []);

    if (loading) {
        return "Loading..."
    }

    return <div>
        <button onClick={() => navigate(`/search`)}>Search For Parks</button>
        <h1>Public Park Adventures</h1>

        <h4>Top Rated Parks</h4>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            {parks.map((park) => (
                <div key={park._id} style={{backgroundColor: "aliceblue", color: "black", borderRadius: "10px", width: "30%", height: "450px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <Rating
                    readOnly
                    size="large"
                    name="overall-rating"
                    value={isNaN(park.ratings[0]) ? 0 : parseFloat(park.ratings[0])}
                    precision={0.1}
                />
                <h2>{park.apiData.fullName}</h2>
                <img width={200} src={park.apiData.images[0].url}></img><br></br>
                <button onClick={() => navigate(`/park/${park.apiData.parkCode}`)}>More Info</button>
            </div>
            ))}
        </div>
    </div>
}

export default Home;