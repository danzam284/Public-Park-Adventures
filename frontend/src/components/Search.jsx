import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Rating } from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [noneFound, setNoneFound] = useState(false);
    const [order, setOrder] = useState("overallRating");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get("query") || '';
        const sortOrder = searchParams.get("sortOrder") || 'overallRating';

        setSearchQuery(query);
        setOrder(sortOrder);

        if (query || sortOrder) {
            handleSearch(query, sortOrder);
        }
    }, [searchParams]);

    const handleSearch = async (query=searchQuery, sortOrder=order) => {
        setNoneFound(false);
        try {
            const { data } = await axios.get("http://localhost:3000/searchPark", {
                params: { query, sortOrder }
            });

            if (data.length === 0) {
                setNoneFound(true);
            }
            setSearchResults(data);
        } catch (error) {
            console.error("Error searching for parks:", error);
        }
    };

    const handleSearchClick = () => {
        setSearchParams({ query: searchQuery, sortOrder: order });
        handleSearch();
    };

    return <div>
        <button onClick={() => navigate("/")}>Home</button><br></br><br></br><br></br><br></br>
        
        <div>

            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

                <TextField
                    sx={{marginTop: "23px"}}
                    id="ratingTitle" 
                    label="Enter Search..."
                    variant="outlined"
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    helperText="Leave Empty to Search All"
                />

                <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel>Order Results By</InputLabel>
                    <Select
                        defaultValue={"overallRating"}
                        label="Order Results By"
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        <MenuItem value={"overallRating"}>Overall Rating</MenuItem>
                        <MenuItem value={"cleanlinessRating"}>Cleanliness Rating</MenuItem>
                        <MenuItem value={"ammenitiesRating"}>Ammenities Rating</MenuItem>
                        <MenuItem value={"accessibilityRating"}>Accessibility Rating</MenuItem>
                        <MenuItem value={"beautyRating"}>Beauty Rating</MenuItem>
                        <MenuItem value={"natureRating"}>Nature Rating</MenuItem>

                    </Select>
                </FormControl>

            </div>

            <br></br>
            
            <button onClick={handleSearchClick}>Search</button>
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
                            <p>{park.apiData.addresses.length && `${park.apiData.addresses[0].city}, ${park.apiData.addresses[0].stateCode}`}</p>
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