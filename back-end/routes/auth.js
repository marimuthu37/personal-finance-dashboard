const express = require("express");
const db = require("../db");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// User role to table mapping
const tableMap = {
    user: "user_details",
    consultant: "consultants",
    admin: "admin"
};

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const tableName = tableMap[role];
    if (!tableName) {
        return res.status(400).json({ error: "Invalid role specified!" });
    }

    try {
        // Check if user already exists
        const checkQuery = `SELECT id FROM ${tableName} WHERE email = ?`;
        db.query(checkQuery, [email], async (err, results) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "User already exists!" });
            }

            // Hash password securely
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert new user
            const insertQuery = `INSERT INTO ${tableName} (name, email, password) VALUES (?, ?, ?)`;
            db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("❌ Insert error:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                const userId = result.insertId; // Get inserted user ID
                const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

                res.status(201).json({
                    id: userId,
                    name,
                    email,
                    role,
                    token,
                    message: "Signup successful!"
                });
            });
        });
    } catch (error) {
        console.error("❌ Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
    }

    const checkUser = (table, role) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ${table} WHERE email = ?`;
            db.query(query, [email], async (err, results) => {
                if (err) {
                    console.error("❌ Database error:", err);
                    return reject("Database error");
                }

                if (results.length === 0) return resolve(null);

                const user = results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    return resolve({ id: user.id, name: user.name, email: user.email, role, token });
                } else {
                    return resolve(null);
                }
            });
        });
    };

    (async () => {
        try {
            let user = await checkUser("user_details", "user");
            if (!user) user = await checkUser("consultants", "consultant");
            if (!user) user = await checkUser("admin", "admin");

            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(401).json({ error: "Invalid email or password" });
            }
        } catch (error) {
            console.error("❌ Login error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    })();
});

module.exports = router;
