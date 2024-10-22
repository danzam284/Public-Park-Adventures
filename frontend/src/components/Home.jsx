import '../App.css'
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';

function Home() {
    const { isSignedIn, user } = useUser();

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

    
    return <div>
        <h1>Public Park Advetures Homepage</h1>
    </div>
}

export default Home;