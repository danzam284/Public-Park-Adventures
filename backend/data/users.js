import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";

const create = async (
  id,
  email,
  username,
  profilePicture,
  password
) => {
  //Validation Handling
  // Validate Null
  validation.checkNull(email);
  validation.checkNull(username);
  validation.checkNull(password);

  // * Validate String params
  email = validation.checkString(email, "Email");
  username = validation.checkString(username, "User Name");
  password = validation.checkString(password, "Password");

  // * Validate Email
  validation.validateEmail(email);

  // * Password validation and hashing
  validation.validatePassword(password);

  const saltRounds = 16;
  const hash = await bcrypt.hash(password, saltRounds);

  //Create user object to put into collection
  let newUser = {
    _id: id,
    email: email,
    username: username,
    profilePicture: profilePicture,
    hashedPass: hash,
    reviews: [],
    heartedParks: [],
  };

  const userCollection = await users();

  if (await userCollection.findOne({ _id: id }) !== null)
    throw "User with ID " + id + " already exists.";

  if (await userCollection.findOne({ email: email }) !== null)
    throw "User with email " + email + " already exists.";

  const newInsertInformation = await userCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw "Insert failed";
  return await getByID(_id);
};

const getByID = async (id) => {
  validation.checkNull(id);
  const userCollection = await users();
  const user = await userCollection.findOne({
    _id: id,
  });
  if (!user) throw "Error: User not found";
  const {hashedPass, ...allElse} = user;
  return allElse;
};

const remove = async (id) => {
  validation.checkNull(id);
  let user = await getByID(id);

  const userCollection = await users();
  const userDeletionInfo = await userCollection.findOneAndDelete({
    _id: id,
  });

  if (!userDeletionInfo) {
    throw `Could not delete user with id of ${id}`;
  }

  return `User: ${id} has been deleted`;
};

const update = async (id, email, username, password, profilePicture) => {
  validation.checkNull(id);

  let user = await getByID(id);
  let newUser = {};

  const userCollection = await users();

  if (email) {
    validation.validateEmail(email);
    if (await userCollection.findOne({ email: email }) !== null)
      throw "User with email " + email + " already exists.";
    newUser.email = email;
  }

  if (username) {
    validation.checkNull(username);
    username = validation.checkString(username);
    newUser.username = username;
  }

  if (password) {
    validation.validatePassword(password);
    const saltRounds = 16;
    const hash = await bcrypt.hash(password, saltRounds);
    newUser.hashedPass = hash;
  }

  if (profilePicture)
    newUser.profilePicture = profilePicture;


  let updateUser = await userCollection.updateOne(
    { _id: id },
    { $set: newUser }
  );

  if (!updateUser) throw "Error: User could not be updated";
  return await getByID(id);
};

const login = async (email, password) => {
  let userCollection;
  try {
    userCollection = await users();
  }
  catch (error) {
    return "Database error.";
  }

  validation.validateEmail(email);
  validation.validatePassword(password);

  let user = await userCollection.findOne({ email: email });
  if (user == null) throw "Incorrect User Name or Password";

  let authenticated = await bcrypt.compare(password, user.hashedPass);
  if (!authenticated) throw "Incorrect User Name or Password";

  return await getByID(user._id);
};

const addReview = async (userId, reviewId) => {
  let userCollection;
  try {
    userCollection = await users();
  }
  catch (error) {
    return "Database error.";
  }

  userCollection.update({
    _id: userId
  },
  {
    $push: {"reviews": reviewId}
  }
  );
}

const removeReview = async (userId, reviewId) => {
  let userCollection;
  try {
    userCollection = await users();
  }
  catch (error) {
    return "Database error.";
  }

  userCollection.update({
    _id: userId
  },
  {
    $pull: {"reviews": reviewId}
  }
  );
}

const addHeartedPark = async (userId, parkId) => {
  let userCollection;
  try {
    userCollection = await users();
  }
  catch (error) {
    return "Database error.";
  }

  userCollection.update({
    _id: userId
  },
  {
    $push: {"heartedParks": parkId}
  }
  );
}

const removeHeartedPark = async (userId, parkId) => {
  let userCollection;
  try {
    userCollection = await users();
  }
  catch (error) {
    return "Database error.";
  }

  userCollection.update({
    _id: userId
  },
  {
    $pull: {"heartedParks": parkId}
  }
  );
}

export default {
  create,
  getByID,
  remove,
  update,
  login,
  addReview,
  removeReview,
  addHeartedPark,
  removeHeartedPark
};
