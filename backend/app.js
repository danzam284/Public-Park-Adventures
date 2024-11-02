import express from "express";
import cors from "cors";
import Datastore from "@seald-io/nedb";
import axios from "axios";
import {userData} from "./data/index.js";

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
        await userData.getUserByID(id);
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

app.post("/review", async (req, res) => {
    console.log(req.body);
    res.status(200).send("Got review");
});

//Temporary request to get 3 parks
app.get("/getSamplePark", async (_, res) => {
    const { data } = await axios.get("https://developer.nps.gov/api/v1/parks", {
        params: {
            api_key: "QrLp7DRXSIHRyLUBfVZKDxDxexWLyXiJb4fyNqnB",
            stateCode: "NJ"
        }
    });
    return res.status(200).json(data.data.slice(0, 1));
})

app.listen(3000, () => {
    console.log(`Public Park Adventures listening at http://localhost:3000`);
});
