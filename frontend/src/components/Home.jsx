import '../App.css'
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home() {
    const { isSignedIn, user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [park, setPark] = useState(null);

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
            const {data} = await axios.get("http://localhost:3000/getSamplePark");
            setLoading(false);
            setPark(data[0]);
        }

        getPark();
    }, []);

    if (loading) {
        return "Loading..."
    }

    return <div>
        <h1>Public Park Advetures Homepage</h1>
        <div>
            <h2>{park.fullName}</h2>
            <img width={200} src={park.images[0].url}></img><br></br>
            <button onClick={() => navigate("/rate", { state: park })}>Rate</button>
            <p>{park.description}</p>
        </div>
    </div>
}

export default Home;