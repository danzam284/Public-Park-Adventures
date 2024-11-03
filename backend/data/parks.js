import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { parks } from "../config/mongoCollections.js";
import { userData, reviewData } from "./index.js";

const create = async (
    apiData
) => {
    let newPark = {
        _id: apiData.parkCode,
        apiData: apiData,
        reviews: [],
        ratings: {}
    };

    const parkCollection = await parks();

    const newInsertInformation = await parkCollection.insertOne(newPark);
    if (!newInsertInformation.insertedId) throw "Insert failed";
    return await getByID(newPark._id);
};

const update = async (
    apiData
) => {
    let newPark = {
        apiData: apiData
    };

    const parkCollection = await parks();

    const newUpdateInformation = await parkCollection.updateOne(
        {
            _id: apiData.parkCode
        },
        {
            $set: {"apiData": apiData}
        }
    );
    return await getByID(apiData.parkCode);
};

const getByID = async (id) => {
    validation.checkNull(id);
    const parkCollection = await parks();
    const park = await parkCollection.findOne({
        _id: id,
    });
    if (!park) throw "Error: Park not found";
    return park;
};

const addReview = async (parkId, reviewId) => {
    let parkCollection;
    try {
        parkCollection = await parks();
    }
    catch (error) {
        return "Database error.";
    }

    let oldRatings = getByID(parkId);

    parkCollection.update({
        _id: parkId
    },
    {
        $push: {"reviews": reviewId}
    }
    );
}

const removeReview = async (parkId, reviewId) => {
    let parkCollection;
    try {
        parkCollection = await parks();
    }
    catch (error) {
        return "Database error.";
    }

    parkCollection.update({
        _id: parkId
    },
    {
        $pull: {"reviews": reviewId}
    }
    );
}

export default {
    create,
    update,
    getByID,
    addReview,
    removeReview
};
