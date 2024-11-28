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

    return (
        <div className="container">
            <div className="header-nav">
                <button onClick={() => navigate("/")} className="back-button">
                    Home
                </button>
            </div>

            <div className="search-container">
                <h1>Search Parks</h1>
                
                <div className="search-controls">
                    <TextField
                        className="search-input"
                        id="search-field" 
                        label="Search Parks"
                        variant="outlined"
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        helperText="Enter park name, city, or state (leave empty to see all parks)"
                        placeholder="e.g., Yellowstone, New York, California..."
                        fullWidth
                    />

                    <FormControl className="sort-control">
                        <InputLabel>Order Results By</InputLabel>
                        <Select
                            value={order}
                            label="Order Results By"
                            onChange={(e) => setOrder(e.target.value)}
                        >
                            <MenuItem value={"overallRating"}>Overall Rating</MenuItem>
                            <MenuItem value={"cleanlinessRating"}>Cleanliness Rating</MenuItem>
                            <MenuItem value={"ammenitiesRating"}>Amenities Rating</MenuItem>
                            <MenuItem value={"accessibilityRating"}>Accessibility Rating</MenuItem>
                            <MenuItem value={"beautyRating"}>Beauty Rating</MenuItem>
                            <MenuItem value={"natureRating"}>Nature Rating</MenuItem>
                        </Select>
                    </FormControl>

                    <button 
                        onClick={handleSearchClick}
                        className="search-button"
                    >
                        Search Parks
                    </button>
                </div>

                {/* Display Search Results */}
                {noneFound && (
                    <div className="no-results">
                        <h2>No parks found matching your search</h2>
                        <p>Try adjusting your search terms or browse all parks</p>
                    </div>
                )}
                
                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h2>Search Results</h2>
                        <div className="parks-grid">
                            {searchResults.map((park) => (
                                <div key={park._id} className="park-card">
                                    <div className="park-image">
                                        <img 
                                            src={park.apiData.images[0].url} 
                                            alt={park.apiData.fullName}
                                        />
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
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;