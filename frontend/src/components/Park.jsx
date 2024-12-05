import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Rating from '@mui/material/Rating';
import axios from 'axios';

function Park() {
    const { id } = useParams();
    const [park, setPark] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function getPark() {
            const park = await axios.get(`http://localhost:3000/getPark/${id}`);
            console.log(park.data);
            const reviews = await axios.get(`http://localhost:3000/getReviews/${id}`);
            park.data.actualReviews = reviews.data;

            for (let review of park.data.actualReviews) {
                review['user'] = (await axios.get(`http://localhost:3000/getUser/${review.userId}`)).data;
            }

            setPark(park.data);
        }
        getPark();
    }, []);

    function moveBackImage() {
        setImageIndex((prevImageIndex) => {
            return prevImageIndex === 0 ? park.apiData.images.length - 1 : prevImageIndex - 1;
        });
    }

    function moveForwardImage() {
        setImageIndex((prevImageIndex) => {
            return prevImageIndex === park.apiData.images.length - 1 ? 0 : prevImageIndex + 1;
        });
    }

    if (!park) {
        return "Loading...";
    }

    return <div className="container">
        <button onClick={() => navigate("/")} className="back-button">
            Back to Home
        </button>
        
        <div className="park-outer">
            <div className="park-details card">
                <div className="park-header">
                    <h1>{park.apiData.fullName}</h1>
                    <p className="park-location">
                        {park.apiData.addresses.length && 
                            `${park.apiData.addresses[0].line1}, ${park.apiData.addresses[0].city}, ${park.apiData.addresses[0].stateCode} ${park.apiData.addresses[0].postalCode}`}
                    </p>

                    <p className="park-description">{park.apiData.description}</p>
                    
                    <Rating
                        readOnly
                        size="large"
                        name="overall-rating"
                        value={park.ratings.overallRating?.avg ?? 0}
                        precision={0.1}
                    />
                </div>

                <div className="park-ratings">
                    {[
                        { label: "Cleanliness", value: park.ratings.cleanlinessRating?.avg ?? 0 },
                        { label: "Amenities", value: park.ratings.ammenitiesRating?.avg ?? 0 },
                        { label: "Accessibility", value: park.ratings.accessibilityRating?.avg ?? 0 },
                        { label: "Beauty", value: park.ratings.beautyRating?.avg ?? 0 },
                        { label: "Nature", value: park.ratings.natureRating?.avg ?? 0 }
                    ].map(rating => (
                        <div key={rating.label} className="rating-item">
                        <span className="rating-label">{rating.label}</span>
                        <Rating
                            readOnly
                            size="small"
                            value={rating.value}
                            precision={0.1}
                        />
                        </div>
                    ))}
                </div>

                <div className="park-gallery-container">
                    <ChevronLeftIcon
                        className="gallery-nav prev"
                        onClick={moveBackImage}
                    />
                    <div className="park-gallery">
                        <span tooltip={park.apiData.images[imageIndex].altText}>
                            <img
                                src={park.apiData.images[imageIndex].url}
                                alt={park.apiData.images[imageIndex].altText}
                                className="gallery-image"
                            />
                        </span>
                    </div>
                    <ChevronRightIcon
                        className="gallery-nav next"
                        onClick={moveForwardImage}
                    />
                </div>

                <button 
                    onClick={() => navigate("/rate", { state: park.apiData })}
                    className="review-button"
                >
                    Write a Review
                </button>

                {park.actualReviews.length > 0 ?
                    <div>
                        <hr></hr>
                        <h2> Reviews </h2>
                        <div className="reviews">
                            {park.actualReviews.map(review =>
                                <span className="review card">
                                    <span class="tooltip-wrapper">
                                        <Rating
                                            readOnly
                                            size="small"
                                            value={review.ratings.overallRating}
                                            precision={0.1}
                                        />
                                        <span class="tooltip-content">
                                            <span className="park-ratings-tooltip">
                                                {[
                                                    { label: "Cleanliness", value: park.ratings.cleanlinessRating?.avg ?? 0 },
                                                    { label: "Amenities", value: park.ratings.ammenitiesRating?.avg ?? 0 },
                                                    { label: "Accessibility", value: park.ratings.accessibilityRating?.avg ?? 0 },
                                                    { label: "Beauty", value: park.ratings.beautyRating?.avg ?? 0 },
                                                    { label: "Nature", value: park.ratings.natureRating?.avg ?? 0 }
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
                                    <span tooltip={review.user.username}>
                                        <img src={review.user.profilePicture} alt={review.user.username}  class="PFP" loading="lazy"/>
                                    </span>
                                    <br />
                                    <b>{review.title}</b>
                                    <p>{review.text}</p>
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

export default Park;
