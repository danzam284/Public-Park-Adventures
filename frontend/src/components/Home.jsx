import '../App.css'
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home() {
    const { isSignedIn, user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
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

    const handleSearch = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/searchPark", {
                params: { query: searchQuery }
            });
            setSearchResults(data);
        } catch (error) {
            console.error("Error searching for parks:", error);
        }
    };

    if (loading) {
        return "Loading..."
    }

    return <div>
        <h1>Public Park Adventures Homepage</h1>
        
        {/* Search Form */}
        <div>
            <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search for parks..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>

        {/* Display Search Results */}
        {searchResults.length > 0 && (
            <div>
                <h2>Search Results</h2>
                {searchResults.map((park) => (
                    <div key={park.id}>
                        <h3>{park.fullName}</h3>
                        <img width={200} src={park.images[0]?.url} alt={park.fullName} />
                        <p>{park.description}</p>
                    </div>
                ))}
            </div>
        )}

        {/* Rate Park Button */}
        <div>
            <h2>{park.fullName}</h2>
            <img width={200} src={park.images[0].url}></img><br></br>
            <button onClick={() => navigate("/rate", { state: park })}>Rate</button>
            <p>{park.description}</p>
        </div>
    </div>
}

export default Home;