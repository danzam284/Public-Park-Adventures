import express from "express";
import cors from "cors";
import Datastore from "@seald-io/nedb";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // rhasan1 - 10/30/2024 - Added dotenv to load environment variables

const NPS_API_KEY = process.env.NPS_API_KEY;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersDB = new Datastore({ filename: "database/users.db", autoload: true });

/**
 * Checks whether a user is already registered in the database based on their ID
 * @param {id} The ID of the user to be checked.
 * @returns A boolean whether the user already exists
 */
async function userExists(id) {
    return new Promise((resolve, reject) => {
        usersDB.findOne({ id }, (err, exists) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!exists);
            }
        });
    });
}

/**
 * Adds a new user to the DB
 */
async function createUser(id, email, username, pic) {
    const newUser = {
        id,
        email,
        username,
        reviews: [],
        profilePicture: pic,
    }
    usersDB.insert(newUser, (error, newDoc) => {
        if (error) {
            console.error(err)
        }
    });
}

app.post("/newUser", async (req, _) => {
    const exists = await userExists(req.body.id);
    if (!exists) {
        createUser(req.body.id, req.body.email, req.body.username, req.body.profilePicture);
    }
});

app.post("/review", async (req, res) => {
    console.log(req.body);
    res.status(200).send("Got review");
});

// Temporary request to get 3 parks
app.get("/getSamplePark", async (_, res) => {
    const { data } = await axios.get("https://developer.nps.gov/api/v1/parks", {
        params: {
            api_key: NPS_API_KEY,
            stateCode: "NJ"
        }
    });
    return res.status(200).json(data.data.slice(0, 1));
})
// rhasan1 - 10/30/2024 - replaced the API key with the one from the environment variables



app.listen(3000, () => {
    console.log(`Public Park Adventures listening at http://localhost:3000`);
});
