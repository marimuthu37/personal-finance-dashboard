const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/users", (req, res) => {
    db.query("SELECT id, name, email FROM user_details", (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.status(200).json(results);
    });
});

router.get("/consultants", (req, res) => {
    db.query("SELECT id, name, email FROM consultants", (err, results) => {
        if (!err) {
            res.status(200).send(results);
        } else {
            res.status(400).send(err);
        }
    });
});

router.get("/consultation-list", (req, res) => {
    const query = `
        SELECT u.name AS user_name, c.name AS consultant_name 
        FROM consultant_requests cr
        JOIN user_details u ON cr.user_id = u.id
        JOIN consultants c ON cr.consultant_id = c.id
        WHERE cr.status = 'completed'
    `;
    
    db.query(query, (err, results) => {
        if (!err) {
            res.status(200).send(results);
        } else {
            res.status(400).send(err);
        }
    });
});

module.exports = router;
