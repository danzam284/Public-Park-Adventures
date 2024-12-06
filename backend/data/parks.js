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

const searchParks = async(searchQuery, orderBy) => {
    const parks = await getSortedParksByCategory(orderBy);
    const queryRegex = new RegExp(searchQuery, 'i');
    const filteredParks = parks.filter((park) => {
        return (
            queryRegex.test(park.apiData.fullName) ||
            queryRegex.test(park.apiData.description)
        );
    });
    return filteredParks;
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


const getTopParks = async() => {
    const parks = await getParks();
    parks.sort((a, b) => (b.ratings.overallRating?.avg ?? 0) - (a.ratings.overallRating?.avg ?? 0));
    return parks;
}

const getSortedParksByCategory = async(category) => {
    const parks = await getParks();
    parks.sort((a, b) => (b.ratings[category]?.avg ?? 0) - (a.ratings[category]?.avg ?? 0))
    return parks;
}

const getCloseParks = async (latitude, longitude) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    const parks = await getParks();
    parks.sort((a, b) => {
        const distanceA = calculateDistance(latitude, longitude, parseFloat(a.apiData.latitude), parseFloat(a.apiData.longitude));
        const distanceB = calculateDistance(latitude, longitude, parseFloat(b.apiData.latitude), parseFloat(b.apiData.longitude));
        return distanceA - distanceB;
    });
    return parks;
}

const addReview = async (parkId, reviewId) => {
    let parkCollection;
    try {
        parkCollection = await parks();
    }
    catch (error) {
        return "Database error.";
    }

    let review = await reviewData.getByID(reviewId);
    let ratings = (await getByID(parkId)).ratings;
    let total;
    let count;
    let avg;
    for (let reviewRating in review.ratings) {
        if (ratings.hasOwnProperty(reviewRating)) {
            total = ratings[reviewRating].count * ratings[reviewRating].avg + review.ratings[reviewRating];
            count = ratings[reviewRating].count + 1;
        }
        else {
            ratings[reviewRating] = {};
            total = review.ratings[reviewRating];
            count = 1;
        }
        avg = total / count;
        ratings[reviewRating].avg = avg;
        ratings[reviewRating].count = count;
    }

    await parkCollection.updateOne({
            _id: parkId
        },
        {
            $push: {"reviews": reviewId},
            $set: {"ratings": ratings}
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

    let review = await reviewData.getByID(reviewId);
    let ratings = (await getByID(parkId)).ratings;
    for (let reviewRating in review.ratings) {
        if (ratings[reviewRating].count > 1) {
            let total = ratings[reviewRating].count * ratings[reviewRating].avg - review.ratings[reviewRating];
            let count = ratings[reviewRating].count - 1;
            let avg = total / count;
            ratings[reviewRating].avg = avg;
            ratings[reviewRating].count = count;
        }
        else {
            delete ratings[reviewRating];
        }
    }

    await parkCollection.updateOne({
            _id: parkId
        },
        {
            $pull: {"reviews": reviewId},
            $set: {"ratings": ratings}
        }
    );
}

const updateReview = async (parkId, reviewId) => {
    await removeReview(parkId, reviewId); // The simplest solution is doing what the user would've done, but on the backend.
    await addReview(parkId, reviewId); // Especially since we do not store the past ratings for each review in the aggregates, this is almost certainly the ONLY way without a refactor.
}

export default {
    create,
    update,
    getByID,
    addReview,
    removeReview,
    updateReview,
    getParks,
    getReviews,
    getTopParks,
    getSortedParksByCategory,
    getCloseParks,
    searchParks
};
