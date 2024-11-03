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

const getParks = async () => {
    const parkCollection = await parks();
    return await parkCollection.find({}).toArray();
}

const getReviews = async(id) => {
    validation.checkNull(id);
    const reviews = [];

    const park = await getByID(id);
    for (let i = 0; i < park.reviews.length; i++) {
        try {
            const review = await reviewData.getByID(park.reviews[i]);
            reviews.push(review);
        } catch(e) {
            console.log(e);
        }
    }
    return reviews;
}

const calculateParkRatings = async(park) => {
    const reviews = park.reviews;
    const averages = [0, 0, 0, 0, 0, 0];
    let numReviews = 0;

    for (let i = 0; i < reviews.length; i++) {
        try {
            const review = await reviewData.getByID(reviews[i]);
            numReviews++;
            averages[0] += parseFloat(review.ratings.overallRating);
            averages[1] += parseFloat(review.ratings.cleanlinessRating);
            averages[2] += parseFloat(review.ratings.ammenitiesRating);
            averages[3] += parseFloat(review.ratings.accessibilityRating);
            averages[4] += parseFloat(review.ratings.beautyRating);
            averages[5] += parseFloat(review.ratings.natureRating);
        } catch(e) {
            //Do nothing
        }
    }

    return averages.map((avg) => numReviews === 0 ? 0 : parseFloat((avg / numReviews).toFixed(1)) );
}

const getTopParks = async() => {
    const parks = await getParks();

    const parksWithRatings = await Promise.all(parks.map(async (park) => {
        const ratings = await calculateParkRatings(park);
        return { park, rating: ratings[0] };
    }));

    parksWithRatings.sort((a, b) => b.rating - a.rating);

    return parksWithRatings.map(({ park }) => park);
}

const addReview = async (parkId, reviewId) => {
    let parkCollection;
    try {
        parkCollection = await parks();
    }
    catch (error) {
        return "Database error.";
    }

    let oldRatings = await getByID(parkId);

    await parkCollection.updateOne({
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

    await parkCollection.updateOne({
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
    removeReview,
    getParks,
    getReviews,
    getTopParks,
    calculateParkRatings
};
