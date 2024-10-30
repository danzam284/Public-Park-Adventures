import { useLocation } from "react-router-dom";
import { useState } from "react";
import Rating from '@mui/material/Rating';
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
    const { user } = useUser();
    const park = location.state;
    const [rating, setRating] = useState(2.5)
    const [submitted, setSubmitted] = useState(false);

    async function submitReview(e) {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/review",
                {
                    reviewerId: user.id,
                    parkId: park.id,
                    overallRating: rating,
                    cleanlinessScore: document.getElementById("cleanliness").value,
                    ammenitiesScore: document.getElementById("ammenities").value,
                    accessibilityScore: document.getElementById("accessibility").value,
                    beautyScore: document.getElementById("beauty").value,
                    natureScore: document.getElementById("nature").value
                }
            );
            setSubmitted(true);
        } catch(e) {
            alert(e);
        }
    }

    if (submitted) {
        return <div>Review Submitted</div>
    }
    return <div>
        <h2>Rating {park.fullName}</h2>
        <h3>Overall Rating</h3>

        <form onSubmit={async (e) => await submitReview(e)}>
            <Rating
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

            <textarea id="comments" required placeholder="Enter your comments" cols={40} rows={10}></textarea><br></br>
            <input type="submit"></input>
        </form>
    </div>
}

export default Rate;