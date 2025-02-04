const bcrypt = require('bcrypt');
const sqlite3 = require("sqlite3");

const database = new sqlite3.Database("Database/Main.db", (err) => {
    if (err) {
        console.error("Error opening the database! (databaseUtils.js)");
    } else {
        console.log("Database initialized successfully! (databaseUtils.js)");
    }
});

function createUser(username, email, password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                reject(err);
            } else {
                database.run(
                    `INSERT INTO Users (username, email, password) VALUES (?, ?, ?)`,
                    [username, email, hashedPassword],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ text: "User created successfully!", userId: this.lastID });
                        }
                    }
                );
            }
        });
    });
}

function checkUser(email, password) {
    return new Promise((resolve, reject) => {
        database.get(
            `SELECT * FROM Users WHERE email = ?`,
            [email],
            (err, row) => {
                if (err) {
                    reject(new Error("User lookup failed! (databaseUtils.js)"));
                } else if (!row) {
                    reject(new Error("No user with provided credentials found! (databaseUtils.js)"));
                } else {
                    bcrypt.compare(password, row.password, (err, result) => {
                        if (err) {
                            reject(new Error("Error comparing passwords! (databaseUtils.js)"));
                        } else if (result) {
                            resolve({ text: "Logged in successfully!", userId: row.id });
                        } else {
                            reject(new Error("Incorrect password! (databaseUtils.js)"));
                        }
                    });
                }
            }
        );
    });
}

function bookParking(parkingId, userId) {
    return new Promise((resolve, reject) => {
        database.get(
            `SELECT * FROM ParkingLot WHERE id = ?`,
            [parkingId],
            (err, row) => {
                if (err) {
                    reject(new Error("Error booking (databaseUtils.js)"));
                } else if (!row) {
                    reject(new Error("Invalid parking ID! (databaseUtils.js)"));
                } else {
                    if (row.occupant == -1) {
                        database.run(
                            `UPDATE ParkingLot SET occupant = ? WHERE id = ?`,
                            [userId, parkingId],
                            function (err) {
                                if (err) {
                                    reject(new Error("Error updating parking slot occupant (databaseUtils.js)"));
                                } else if (this.changes == 0) {
                                    reject(new Error("Parking slot was not updated (databaseUtils.js)"));
                                } else {
                                    resolve("Parking slot booked successfully.");
                                }
                            }
                        );
                    } else {
                        reject(new Error("Parking already booked (databaseUtils.js)"));
                    }
                }
            });
    });
}

function addReview(userId, review) {
    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO Reviews (userId, review) VALUES (?, ?)`,
            [userId, review],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("Review added successfully!");
                }
            }
        );
    });
}

function fetchParkingSlots() {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT * FROM ParkingLot`,
            [],
            (err, rows) => {
                if (err) {
                    reject(new Error("Error fetching parking slots (databaseUtils.js)"));
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

function fetchBookings(userId) {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT * FROM ParkingLot WHERE occupant = ?`,
            [userId],
            (err, rows) => {
                if (err) {
                    reject(new Error("Error fetching bookings (databaseUtils.js)"));
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

module.exports = { createUser, checkUser, bookParking, addReview, fetchParkingSlots, fetchBookings };
