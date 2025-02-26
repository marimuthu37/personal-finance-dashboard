const express = require("express");
const db = require("../db");
const router = express.Router();

// ✅ Get all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM user_details", (err, results) => {
        if (!err) {
            res.status(200).send(results);
        } else {
            res.status(400).send(err);
        }
    });
});

// ✅ Get payment summary for a specific user (requires user ID in query)
router.get("/summary/:userId", (req, res) => {
    const { userId } = req.params; 

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    db.query("SELECT * FROM payment_summary WHERE user_id = ?", [userId], (err, results) => {
        if (!err) {
            res.status(200).send(results);
        } else {
            res.status(400).send(err);
        }
    });
});

// ✅ Add new payment for a specific user (requires user ID in request body)
router.post("/summary/add", async (req, res) => {
    try {
        const { userId, description, category, amount, payment_method } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const sql = `INSERT INTO payment_summary (user_id, description, category, amount, payment_method, created_at)
                     VALUES (?, ?, ?, ?, ?, NOW())`;

        await db.execute(sql, [userId, description, category, amount, payment_method]);

        res.status(201).json({ message: "Transaction added successfully" });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database query failed" });
    }
});

// ✅ Update transaction (requires user ID in request body)
router.put("/summary/update/:id", (req, res) => {
    const { id } = req.params;
    const { userId, description, category, amount, payment_method } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const query = `UPDATE payment_summary 
                   SET description=?, category=?, amount=?, payment_method=? 
                   WHERE id=? AND user_id=?`;

    db.query(query, [description, category, amount, payment_method, id, userId], (err, results) => {
        if (!err) {
            res.status(200).send("Updated successfully");
        } else {
            res.status(400).send(err);
        }
    });
});

// ✅ Delete transaction (requires user ID in request body)
router.delete("/summary/delete/:id", (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    db.query("DELETE FROM payment_summary WHERE id=? AND user_id=?", [id, userId], (err, results) => {
        if (!err) {
            res.status(200).send("Deleted successfully");
        } else {
            res.status(400).send(err);
        }
    });
});

// ✅ Get last 3 transactions for a specific user
router.get("/summary/last-three/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const sql = `SELECT id, description, amount, payment_method
                     FROM payment_summary
                     WHERE user_id = ? 
                     ORDER BY created_at DESC 
                     LIMIT 3`;

        const [rows] = await db.promise().query(sql, [userId]);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
