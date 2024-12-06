import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import axios from 'axios';

function Profile() {
    const [reviews, setReviews] = useState(null);
    const navigate = useNavigate();
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        async function getUserReviews() {
            const reviewData = await axios.get(`http://localhost:3000/getReviewsByUser/${user.id}`);
            const reviews = reviewData.data.filter((review) => review !== null);
            console.log(reviews);
            setReviews(reviews);
        }

        if (!isSignedIn) {
            return;
        }

        getUserReviews();
    }, [isSignedIn, user]);

    async function deleteReview(id) {
        await axios.get(`http://localhost:3000/deleteReview/${id}`);

        setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== id)
        );
    }

    if (!reviews || !isSignedIn) {
        return "Loading...";
    }

    return <div className="container">
        <button onClick={() => navigate("/")} className="back-button">
            Back to Home
        </button>
        
        <div className="park-outer">
            <div className="park-details card">
                <div className="park-header" style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "15px"}}>
                    <h1>{user.username}</h1>
                    <span tooltip={user.username}>
                        <img src={user.imageUrl} alt={user.username} tooltip={user.username} className="PFP_HOME" loading="lazy"/>
                    </span>
                </div>

                {reviews.length > 0 ?
                    <div>
                        <hr></hr>
                        <h2> Reviews </h2>
                        <div className="reviews">
                            {reviews.map(review =>
                                <span className="review card" key = {review._id}>
                                    <span className="tooltip-wrapper">
                                        <Rating
                                            readOnly
                                            size="small"
                                            value={review.ratings.overallRating}
                                            precision={0.1}
                                        />
                                        <span className="tooltip-content">
                                            <span className="park-ratings-tooltip">
                                                {[
                                                    { label: "Cleanliness", value: review.ratings.cleanlinessRating },
                                                    { label: "Amenities", value: review.ratings.ammenitiesRating},
                                                    { label: "Accessibility", value: review.ratings.accessibilityRating},
                                                    { label: "Beauty", value: review.ratings.beautyRating},
                                                    { label: "Nature", value: review.ratings.natureRating}
                                                ].map(rating => (
                                                    <span key={rating.label} className="rating-item">
                                                        <span className="rating-label">{rating.label}</span>
                                                        <Rating
                                                            readOnly
                                                            size="small"
                                                            value={rating.value}
                                                            precision={0.1}
                                                        />
                                                    </span>
                                            ))}
                                            </span>
                                        </span>
                                    </span>
                                    <br />
                                    <b>{review.title}</b>
                                    <p>{review.text}</p>
                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                                        <button style={{width: "50%"}} onClick={() => {deleteReview(review._id)}}>Delete Review</button>
                                        <button style={{width: "50%"}} onClick={() => {navigate(`/park/${review.parkId}`)}}>View Park</button>
                                    </div>
                                </span>
                            )}
                        </div>
                    </div>:
                    <div></div>
                }

            </div> 
        </div>
        
    </div>
}

export default Profile;
