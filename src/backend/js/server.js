require('dotenv').config({ path: '../../env/.env' });
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { CreateUser, CheckUser, BookParking, AddReview, FetchParkingSlots, FetchBookings } = require("./databaseUtils.js");
const { ValidateToken } = require("./authUtils.js");

const homePageURL = process.env.HOME_PAGE_URL;
const app = express();
const PORT = process.env.PORT || 8080;
const KEY = process.env.JWT_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const message = await CreateUser(username, email, password);
        const token = jwt.sign({ email: email }, KEY, { expiresIn: "1h" });
        res.status(200).json({ success: true, message: message, redirectTo: homePageURL, token: token });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const message = await CheckUser(email, password);
        const token = jwt.sign({ email: email }, KEY, { expiresIn: "1h" });
        res.status(200).json({ success: true, message: message, redirectTo: homePageURL, token: token });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/review", async (req, res) => {
    const { userId, review } = req.body;
    try {
        const message = await AddReview(userId, review);
        res.status(200).json({ success: true, message: message, redirectTo: homePageURL });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/parkingSlots", async (req, res) => {
    try {
        const message = await FetchParkingSlots();
        if (!message || message.length == 0) {
            res.status(404).json({ success: false, message: "No, Parking Slots Available!" });
        }
        res.status(200).json({ success: true, message: message });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post("/api/booking", async (req, res) => {
    const { parkingId, userId } = req.body;
    try {
        const message = await BookParking(parkingId, userId);
        res.status(200).json({ success: true, message: message });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/fetchBookings", async (req, res) => {
    const userId = req.query.userId;
    try {
        const message = await FetchBookings(userId);
        res.status(200).json({ success: true, message: message });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/api/protected", ValidateToken, (req, res) => {
    res.status(200).json({ success: true, message: "You are authenticated!", user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
