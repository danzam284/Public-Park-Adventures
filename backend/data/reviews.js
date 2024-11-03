import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import { userData, parkData } from "./index.js";
import date from "date-and-time";

const create = async (
    userId,
    parkId,
    ratings,
    title,
    text,
    image
) => {
    //Validation Handling
    // Validate Null
    validation.checkNull(userId);
    validation.checkNull(parkId);
    validation.checkNull(ratings);

    // * Validate String params
    if (title)
        title = validation.checkString(title, "Title");
    if (text)
        text = validation.checkString(text, "Review Text");

    let foundUser = await userData.getByID(userId);

    for (let review of foundUser.reviews)
        if (review.parkId === parkId)
            throw "This park has already been reviewed by this user, please edit it instead.";

    if (typeof ratings !== 'object')
        throw "Ratings must be an object with category keys and numerical integer values between 0 and 10";
    for (let rating in ratings)
        if (!(Number.isInteger(ratings[rating])) || ratings[rating] < 0 || ratings[rating] > 10)
            throw `Rating ${rating} must be an integer between 0 and 10, please check your ratings again.`;

    let newReview = {
        userId: userId,
        parkId: parkId,
        ratings: ratings,
        title: title,
        text: text,
        image: image,
        foundHelpful: 0
    };

    const reviewCollection = await reviews();

    const newInsertInformation = await reviewCollection.insertOne(newReview);
    if (!newInsertInformation.insertedId) throw "Insert failed";

    let _id = newInsertInformation.insertedId.toString();
    userData.addReview(userId, _id);
    parkData.addReview(parkId, _id);
    return await getByID(_id);
};

const getByID = async (id) => {
    id = validation.checkId(id);
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({
        _id: id,
    });
    if (!review) throw "Error: Review not found";
    return review;
};

const remove = async (id) => {
    id = validation.checkId(id);
    let review = getByID(id);

    userData.removeReview(userId, id);
    parkData.removeReview(parkId, id);

    const reviewCollection = await reviews();

    const reviewDeletionInfo = await reviewCollection.findOneAndDelete({
        _id: id,
    });

    if (!reviewDeletionInfo)
        throw `Could not delete review with id of ${id}`;

    return `Review: ${id} has been deleted`;
};

const update = async (id, ratings, title, text, image) => {
    validation.checkNull(id);
    id = validation.checkId(id);

    let newReview = {};

    if (ratings) {
        validation.checkNull(ratings);
        if (typeof ratings !== 'object')
            throw "Ratings must be an object with category keys and numerical integer values between 0 and 10";
        for (let rating in ratings)
            if (!(Number.isInteger(ratings[rating])) || ratings[rating] < 0 || ratings[rating] > 10)
                throw `Rating ${rating} must be an integer between 0 and 10, please check your ratings again.`;

        newReview.ratings = ratings;
    }

    if (title) {
        validation.checkNull(title);
        title = validation.checkString(title, "Title");
        newReview.title = title;
    }

    if (text) {
        validation.checkNull(text);
        text = validation.checkString(text, "Text");
        newReview.text = text;
    }

    if (image)
        newReview.image = image;

    const userCollection = await users();

    let updateReview = await reviewCollection.updateOne(
        { _id: id },
        { $set: newReview }
    );

    if (!updateReview) throw "Error: Review could not be updated";
    return await getByID(id);
};

const findHelpful = async (id) => {
    validation.checkNull(id);
    id = validation.checkId(id);

    const userCollection = await users();
    userCollection.update(
        {
            _id: id
        },
        {
            $inc {
                foundHelpful: 1
            }
        }
    );
};

const findUnhelpful = async (id) => {
    validation.checkNull(id);
    id = validation.checkId(id);

    const userCollection = await users();
    userCollection.update(
        {
            _id: id
        },
        {
            $inc {
                foundHelpful: -1
            }
        }
    );
};

export default {
    create,
    getByID,
    remove,
    update,
    findHelpful,
    findUnhelpful
};
