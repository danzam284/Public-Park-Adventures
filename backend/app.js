import express from "express";
import cors from "cors";
import Datastore from "@seald-io/nedb";
import axios from "axios";

import dotenv from "dotenv";
import {userData, reviewData, parkData} from "./data/index.js";


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
    /*
    return new Promise((resolve, reject) => {
        usersDB.findOne({ id }, (err, exists) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!exists);
            }
        });
    });
    */
    try {
        await userData.getByID(id);
        return true;
    }
    catch (error) {
        return false;
    }
}

/**
 * Adds a new user to the DB
 */
async function createUser(id, email, username, pic, password) {
    /*
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
    */
    await userData.create(id, email, username, pic, password);
}

app.post("/newUser", async (req, _) => {
    const exists = await userExists(req.body.id);
    if (!exists) {
        //createUser(req.body.id, req.body.email, req.body.username, req.body.profilePicture);
        userData.create(req.body.id, req.body.email, req.body.username, req.body.profilePicture, req.body.password);
    }
});

app.post("/newReview", async (req, res) => {
    try {
        await reviewData.create(
            req.body.reviewerId,
            req.body.parkId,
            req.body.ratings,
            req.body.reviewTitle,
            req.body.comments
        );
        return res.status(200).send("Got review");
    } catch(e) {
        console.log(e);
        return res.status(400).send(e);
    }
});

app.get("/getParks", async (_, res) => {
    try {
        res.status(200).json(await parkData.getParks());
    } catch(e) {
        return res.status(400).send(e);
    }
});

app.get("/getPark/:id", async (req, res) => {
    try {
        const park = await parkData.getByID(req.params.id.trim());
        res.status(200).json(park);
    } catch(e) {
        console.log(e);
        return res.status(400).send(e);
    }
});

app.get("/getReviews/:id", async (req, res) => {
    try {
        const reviews = await parkData.getReviews(req.params.id.trim());
        res.status(200).json(reviews);
    } catch(e) {
        console.log(e);
        return res.status(400).send(e);
    }
});

app.get("/getTopParks", async (_, res) => {
    try {
        let topParks = await parkData.getTopParks();
        res.status(200).json(topParks.slice(0, 3));
    } catch(e) {
        console.log(e);
        return res.status(400).send(e);
    }
});

app.get("/searchPark", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send("Query parameter is required");
    }

    try {
        const parks = await parkData.getParks();
        const queryRegex = new RegExp(query, 'i');
        const filteredParks = parks.filter((park) => {
            return (
                queryRegex.test(park.apiData.fullName) ||
                queryRegex.test(park.apiData.description)
            );
        });
        return res.status(200).json(filteredParks);
    } catch (error) {
        console.error(error);
        return res.status(500).send("apps.js: An error occurred while searching for parks");
    }
});
// rhasan1 - 10/30/2024 - Added a searchPark endpoint to search for parks by name


app.listen(3000, () => {
    console.log(`Public Park Adventures listening at http://localhost:3000`);
});
