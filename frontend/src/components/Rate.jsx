import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function Rate() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const [error, setError] = useState("");
    const [ratings, setRatings] = useState({
        overall: 2.5,
        cleanliness: 0,
        amenities: 0,
        accessibility: 0,
        beauty: 0,
        nature: 0
    });

    // Redirect if no park data
    if (!location.state) {
        navigate('/');
        return null;
    }

    const park = location.state;

    const handleRatingChange = (category, value) => {
        setRatings(prev => ({
            ...prev,
            [category]: value
        }));
    };

    async function submitReview(e) {
        e.preventDefault();
        try {
            const formData = {
                reviewerId: user.id,
                parkId: park.parkCode,
                ratings: {
                    overallRating: ratings.overall,
                    cleanlinessRating: ratings.cleanliness,
                    ammenitiesRating: ratings.amenities,
                    accessibilityRating: ratings.accessibility,
                    beautyRating: ratings.beauty,
                    natureRating: ratings.nature
                },
                reviewTitle: e.target.ratingTitle.value.trim(),
                comments: e.target.comments.value.trim()
            };

            // Validate ratings
            if (Object.values(ratings).some(rating => rating === 0)) {
                setError("Please provide all ratings");
                return;
            }

            await axios.post("http://localhost:3000/newReview", formData);
            navigate(`/park/${park.parkCode}`);
        } catch(e) {
            setError(e.response?.data?.message || "An error occurred while submitting the review");
            console.error(e);
        }
    }

    return (
        <div className="container">
            <div className="header-nav">
                <button onClick={() => navigate("/")} className="back-button">
                    Back to Home
                </button>
            </div>

            <div className="review-form-container">
                <h2>Review {park.fullName}</h2>

                <form onSubmit={submitReview} className="review-form">
                    <div className="form-group">
                        <TextField 
                            required
                            id="ratingTitle" 
                            label="Review Title" 
                            variant="outlined"
                            fullWidth
                            placeholder="e.g., Great Family Experience, Beautiful Hiking Trails..."
                            helperText="Give your review a descriptive title"
                        />
                    </div>

                    <div className="form-group">
                        <label>Overall Rating</label>
                        <Rating
                            size="large"
                            name="overall-rating"
                            value={ratings.overall}
                            precision={0.5}
                            onChange={(_, value) => handleRatingChange('overall', value)}
                        />
                    </div>

                    <div className="ratings-grid">
                        {[
                            { id: 'cleanliness', label: 'Cleanliness' },
                            { id: 'amenities', label: 'Amenities' },
                            { id: 'accessibility', label: 'Accessibility' },
                            { id: 'beauty', label: 'Beauty' },
                            { id: 'nature', label: 'Nature' }
                        ].map(({ id, label }) => (
                            <div key={id} className="rating-item">
                                <label htmlFor={id}>{label}</label>
                                <Rating
                                    id={id}
                                    size="medium"
                                    value={ratings[id]}
                                    onChange={(_, value) => handleRatingChange(id, value)}
                                    precision={0.5}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <TextField 
                            multiline
                            required
                            id="comments" 
                            label="Your Review" 
                            variant="outlined"
                            rows={5}
                            fullWidth
                            placeholder="Share details about your experience: What did you enjoy? What activities did you do? Would you recommend it to others?"
                            helperText="Minimum 10 characters"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        className="submit-button"
                        fullWidth
                    >
                        Submit Review
                    </Button>
                </form>
            </div>

            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError("")}
            >
                <Alert severity="error" onClose={() => setError("")}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Rate;