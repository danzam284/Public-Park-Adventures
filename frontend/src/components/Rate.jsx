import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

function limitDecimal(input) {
    const value = input.value;
    if (parseFloat(value) > 5) {
        input.value = 5;
    }
    if (parseFloat(value) < 0) {
        input.value = 0;
    }

    if (value.includes('.') && value.split('.')[1].length > 1) {
        input.value = parseFloat(value).toFixed(1);
    }
}

function Rate() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const park = location.state;
    const [rating, setRating] = useState(2.5)
    const [submitted, setSubmitted] = useState(false);

    async function submitReview(e) {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/newReview",
                {
                    reviewerId: user.id,
                    parkId: park.parkCode,
                    ratings: {
                        overallRating: parseFloat(rating),
                        cleanlinessRating: parseFloat(document.getElementById("cleanliness").value),
                        ammenitiesRating: parseFloat(document.getElementById("ammenities").value),
                        accessibilityRating: parseFloat(document.getElementById("accessibility").value),
                        beautyRating: parseFloat(document.getElementById("beauty").value),
                        natureRating: parseFloat(document.getElementById("nature").value)
                    },
                    reviewTitle: document.getElementById("ratingTitle").value,
                    comments: document.getElementById("comments").value
                }
            );
            setSubmitted(true);
        } catch(e) {
            console.log(e);
        }
    }

    if (submitted) {
        navigate(`/park/${park.parkCode}`)
    }
    return <div>
        <button onClick={() => navigate("/")}>Home</button><br></br><br></br>
        <div style={{backgroundColor: "aliceblue", color: "black", padding: "20px", borderRadius: "10px"}}>
            <h2>Reviewing {park.fullName}</h2><br></br>

            <form onSubmit={async (e) => await submitReview(e)}>
                <TextField 
                    required
                    id="ratingTitle" 
                    label="Review Title" 
                    variant="outlined"
                /><br></br><br></br>
                <Rating
                    size="large"
                    name="overall-rating"
                    value={rating}
                    precision={0.1}
                    onChange={(_, newValue) => {
                        setRating(newValue);
                    }}
                />
                <div>
                    <p>Cleanliness:  <input id="cleanliness" required type="number" min={0} max={5} step={0.1} onInput={(e) => limitDecimal(e.target)}></input></p>
                    <p>Ammenities: <input id="ammenities" required type="number" min={0} max={5} step={0.1} onInput={(e) => limitDecimal(e.target)}></input></p>
                    <p>Accessibility:  <input  id="accessibility"required type="number" min={0} max={5} step={0.1} onInput={(e) => limitDecimal(e.target)}></input></p>
                    <p>Beauty: <input id="beauty" required type="number" min={0} max={5} step={0.1} onInput={(e) => limitDecimal(e.target)}></input></p>
                    <p>Nature: <input id="nature" required type="number" min={0} max={5} step={0.1} onInput={(e) => limitDecimal(e.target)}></input></p>
                </div>

                <TextField 
                    multiline
                    id="comments" 
                    label="Enter comments" 
                    variant="outlined"
                    rows={5}
                    sx={{width: "70%"}}
                /><br></br><br></br>
                <Button type="submit" variant="contained">Submit</Button>
            </form>
        </div>
    </div>
}

export default Rate;