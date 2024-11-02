import { users, parks, reviews } from "../config/mongoCollections.js";

const clean = async () => {
    let userCollection = await users();
    let parkCollection = await parks();
    let reviewCollection = await reviews();

    await userCollection.deleteMany({});
    await parkCollection.deleteMany({});
    await reviewCollection.deleteMany({});

    console.log("Done deleting! Happy repopulating :D!");
}

await clean();

export default clean;
