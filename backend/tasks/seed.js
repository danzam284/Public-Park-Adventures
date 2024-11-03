import { userData, parkData, reviewData } from "../data/index.js";
import axios from "axios";

const NPS_API_BASE_URL = 'https://developer.nps.gov/api/v1/parks';
const API_KEY = "IIfou7ZMfuvbav7BUTGOcPyCJ385jXfxnZTdShVl";

const seed = async () => {
    let parks = (await axios.get(NPS_API_BASE_URL,
                                   {
                                       params: {
                                           start: 0,
                                           limit: 1000000, //Should be sufficient I hope.
                                           api_key: API_KEY
                                }
                                }
    )).data.data;

    for (let park of parks) {
        try {
            await parkData.getByID(park.parkCode);
            console.log(await parkData.update(park));
        }
        catch (error) {
            console.log(await parkData.create(park));
        }
    }

    console.log("Done seeding parks!");
}

await seed();

export default seed;
