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
            const reviews = await axios.get(`http://localhost:3000/getReviews/${id}`);
            park.data.actualReviews = reviews.data;
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

    return <div>
        <button onClick={() => navigate("/")}>Home</button><br></br><br></br>
        <div style={{backgroundColor: "aliceblue", color: "black", borderRadius: "10px", width: "60%", marginLeft: "20%"}}>
            <h2>{park.apiData.fullName}</h2>

            <Rating
                readOnly
                size="large"
                name="overall-rating"
                value={park.ratings.overallRating?.avg ?? 0}
                precision={0.1}
            /><br></br>

            <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                <ChevronLeftIcon
                    onClick={moveBackImage}
                    className="hoverIcon"
                    fontSize="large"
                    style={{backgroundColor: "darkgray", borderRadius: "50%"}}
                />
                <img height={300} src={park.apiData.images[imageIndex].url}></img><br></br>
                <ChevronRightIcon
                    onClick={moveForwardImage}
                    className="hoverIcon"
                    fontSize="large"
                    style={{backgroundColor: "darkgray", borderRadius: "50%"}}
                />
            </div><br></br>


            <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Cleanliness <Rating
                readOnly
                size="small"
                name="cleanliness-rating"
                value={park.ratings.cleanlinessRating?.avg ?? 0}
                precision={0.1}
            /></p>
            <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Ammenities <Rating
                readOnly
                size="small"
                name="ammenities-rating"
                value={park.ratings.ammenitiesRating?.avg ?? 0}
                precision={0.1}
            /></p>
            <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Accessibility <Rating
                readOnly
                size="small"
                name="accessibility-rating"
                value={park.ratings.accessibilityRating?.avg ?? 0}
                precision={0.1}
            /></p>
            <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Beauty <Rating
                readOnly
                size="small"
                name="beauty-rating"
                value={park.ratings.beautyRating?.avg ?? 0}
                precision={0.1}
            /></p>
            <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Nature <Rating
                readOnly
                size="small"
                name="nature-rating"
                value={park.ratings.natureRating?.avg ?? 0}
                precision={0.1}
            /></p>

            <button onClick={() => navigate("/rate", { state: park.apiData })}>Review This Park</button>
            <p style={{padding: "10px"}}>{park.apiData.description}</p>

            <h3>Reviews</h3>
            {park.actualReviews.length === 0 && <p>This park has no reviews.</p>}
            {park.actualReviews.map((review) => (
                <div key={review._id}>
                    <hr></hr>
                    <Rating
                        readOnly
                        size="large"
                        name="overall-rating"
                        value={review.ratings.overallRating}
                        precision={0.1}
                    />
                    <h4>{review.title}</h4>
                    <p>{review.text}</p>


                    <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Cleanliness <Rating
                        readOnly
                        size="small"
                        name="cleanliness-rating"
                        value={review.ratings.cleanlinessRating}
                        precision={0.1}
                    /></p>
                    <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Ammenities <Rating
                        readOnly
                        size="small"
                        name="ammenities-rating"
                        value={review.ratings.ammenitiesRating}
                        precision={0.1}
                    /></p>
                    <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Accessibility <Rating
                        readOnly
                        size="small"
                        name="accessibility-rating"
                        value={review.ratings.accessibilityRating}
                        precision={0.1}
                    /></p>
                    <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Beauty <Rating
                        readOnly
                        size="small"
                        name="beauty-rating"
                        value={review.ratings.beautyRating}
                        precision={0.1}
                    /></p>
                    <p style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Nature <Rating
                        readOnly
                        size="small"
                        name="nature-rating"
                        value={review.ratings.natureRating}
                        precision={0.1}
                    /></p>
                </div>
            ))}

        </div>
    </div>
}

export default Park;