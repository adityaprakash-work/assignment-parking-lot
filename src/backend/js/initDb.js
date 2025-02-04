const SQL = require("sqlite3");

const Database = new SQL.Database("Database/Main.db", (err) => {
    if (err) {
        console.error("Error Opening the database! (InitDB.js)");
    } else {
        console.log("Database initialized successfully! (InitDB.js)");
    }
});

function AddParkingSlots(numberOfSlots = 9) {
    const query = `INSERT INTO ParkingLot DEFAULT VALUES`;
    let insertCount = 0;
    let errorsOccurred = false;

    for (let i = 0; i < numberOfSlots; ++i) {
        Database.run(query, (err) => {
            insertCount++;

            if (err) {
                console.error(`Failed to insert parking slot ${i + 1}:`, err.message);
                errorsOccurred = true;
            }

            if (insertCount === numberOfSlots) {
                if (!errorsOccurred) {
                    console.log(`${numberOfSlots} parking slots inserted successfully!`);
                } else {
                    console.log("Some errors occurred during the insertions.");
                }
            }
        });
    }
}

Database.serialize(() => {
    Database.run(
        `CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );`
        , (err) => {
            if (err) {
                console.error("Users Table creation failed!", err.message);
            } else {
                console.log("Users Table created successfully!");
            }
        });

    Database.run(
        `CREATE TABLE IF NOT EXISTS ParkingLot (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            occupant INTEGER NOT NULL DEFAULT -1,
            FOREIGN KEY(occupant) REFERENCES Users(id) ON DELETE SET DEFAULT
        );`
        , (err) => {
            if (err) {
                console.error("Parking Lot Table creation failed!", err.message);
            } else {
                console.log("Parking Lot Table created successfully!");
                AddParkingSlots();
            }
        });

    Database.run(
        `CREATE TABLE IF NOT EXISTS Reviews (
            userId INTEGER NOT NULL,
            review TEXT NOT NULL,
            FOREIGN KEY(userId) REFERENCES Users(id)
        );`
        , (err) => {
            if (err) {
                console.error("Reviews Table creation failed!", err.message);
            } else {
                console.log("Reviews Table created successfully!");
            }
        });


});

setTimeout(() => {
    Database.close((err) => {
        if (err) {
            console.error("Error Closing the Database! (InitDB.js)", err.message);
        } else {
            console.log("Closed the Database successfully! (InitDB.js)");
        }
    });
}, 1000);
