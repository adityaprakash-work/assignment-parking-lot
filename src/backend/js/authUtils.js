const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../../env/.env' });

const KEY = process.env.JWT_KEY;

function ValidateToken(request, result, next) {
    const token = request.headers["authorization"];
    if (!token) {
        return result.status(403).json({ success: false, message: "No Token Provided!" });
    }

    jwt.verify(token, KEY, (err, user) => {
        if (err) {
            return result.status(401).json({ success: false, message: "Invalid token" });
        }
        request.user = user;
        next();
    });
}

module.exports = { ValidateToken };
