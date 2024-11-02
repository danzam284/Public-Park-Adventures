import { userData, mealData } from "../data/index.js";

const seed = async () => {
    let Franklin = await userData.create(
        "Ben",
        "Franklin",
        "1-800-999-9999",
        "NY",
        "SamplePassWord12345+",

        "Mount Marcy",
        "Monster",
        "1970-01-01",
        "Doctor Frankenstein",
        ["Zombism", "Social Isolation", "Super Strength", "Super Intelligence"],
        "I pledge allegiance to the flag of the United States of America, and to the Republic for which it stands, one nation, under god, indivisible, with liberty, and justice for all.",

        "BeeMail@bees.org",
        80,
        220,
    );

    let Jupiter = await userData.create(
        "Jupiter",
        "Ultor",
        "1-800-123-4567",
        "Greece",
        "GiantMagnet+318",

        "Mount Olympus",
        "Regal Deity",
        "1970-01-01",
        "Doctor Hygeia",
        [],
        "I consent to medical treatment.",

        "Jove@Parthenon.org",
        99,
        450,
    );

    let food = await mealData.create(
        "Cookies",
        "Nutritiously Terrible, But Delicious.",
        Franklin._id.toString(),
        1,
        492,
        {
            "carbohydrates": {
                "sugars": 24.0,
                "fiber": 2.4
            },
            "protein": {
                "total": 1.1
            },
            "fats": {
                "Saturated": 1.0,
                "Monounsaturated": 1.2,
                "Polyunsaturated": 0.8,
                "Trans": 0.0
            },
            "minerals": {
                "vitaminA": 0.000048,
                "vitaminE": 0.001,
                "sodium": 0.361,
                "potassium": 0.123,
                "calcium": 0.056,
                "iron": 0.003
            }
        }
    );

    console.log(food);

    food = await mealData.create(
        "Kiwis",
        "A delectable snack, very healthy. Eat more of this please.",
        Franklin._id.toString(),
        1,
        61,
        {
            "carbohydrates": {
                "sugars": 8.9,
                "fiber": 3
            },
            "protein": {
                "total": 1.1
            },
            "fats": {
                "Saturated": 1.0,
                "Monounsaturated": 1.2,
                "Polyunsaturated": 0.8,
                "Trans": 0.0
            },
            "other": {
                "vitaminC": 0.0927,
                "vitaminK": 0.0000403,
                "vitaminE": 0.0015,
                "potassium": 0.312,
                "calcium": 0.034,
                "magnesium": 0.017
            }
        }
    );

    console.log(food);

    food = await mealData.create(
        "Ichor",
        "A devine honeylike snack that grants immortality..",
        Jupiter._id.toString(),
        10,
        61,
        {
            "carbohydrates": {
                "sugars": 8.9,
                "fiber": 3
            },
            "protein": {
                "total": 1.1
            },
            "fats": {
                "Saturated": 1.0,
                "Monounsaturated": 1.2,
                "Polyunsaturated": 0.8,
                "Trans": 0.0
            },
            "other": {
                "vitaminC": 0.0927,
                "vitaminK": 0.0000403,
                "vitaminE": 0.0015,
                "potassium": 0.312,
                "calcium": 0.034,
                "magnesium": 0.017
            }
        }
    );

    console.log(food);

    Jupiter = await userData.getUserByID(Jupiter._id.toString());

    console.log(Jupiter);
    console.log("Password: GiantMagnet+318");

    Franklin = await userData.getUserByID(Franklin._id.toString());

    console.log(Franklin);
    console.log("Password: SamplePassWord12345+");

    console.log("Done seeding, happy testing!");
}

await seed();

export default seed;
