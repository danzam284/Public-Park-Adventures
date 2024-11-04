import { useState } from "react";
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Rating } from "@mui/material";
import { useNavigate } from 'react-router-dom';
function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [noneFound, setNoneFound] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        setNoneFound(false);
        try {
            const { data } = await axios.get("http://localhost:3000/searchPark", {
                params: { query: searchQuery }
            });

            if (data.length === 0) {
                setNoneFound(true);
            }
            setSearchResults(data);
        } catch (error) {
            console.error("Error searching for parks:", error);
        }
    };

    return <div>
        <button onClick={() => navigate("/")}>Home</button>
        <h1>Search</h1>
        
        <div style={{backgroundColor: "aliceblue", padding: "30px"}}>
            <TextField
                id="ratingTitle" 
                label="Search For Parks" 
                variant="outlined"
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
            /><br></br><br></br>
            
            <button onClick={handleSearch}>Search</button>
        </div>

        {/* Display Search Results */}
        {noneFound && "No results found"}
        {searchResults.length > 0 && (
            <div>
                <h2>Search Results</h2>
                {searchResults.map((park) => (
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
                            <img width={200} src={park.apiData.images[0].url}></img><br></br>
                            <button onClick={() => navigate(`/park/${park.apiData.parkCode}`)}>More Info</button>
                            <br></br><br></br>
                        </div><br></br><br></br>
                    </div>
                ))}
            </div>
        )}
    </div>
}

export default Search;