const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format." });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token." });
        req.user = decoded;
        next();
    });
};

router.get("/", async (req, res) => {
    try {
        db.query("SELECT id, name, email, specialization, created_at FROM consultants", (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error fetching consultants:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/data/:id", verifyToken, (req, res) => {
    const { id } = req.params;

    db.query("SELECT id, name, email, specialization, created_at FROM consultants WHERE id = ?", [id], (err, results) => {
        if (!err && results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ error: "Consultant data not found" });
        }
    });
});

router.get("/summary/:id", (req, res) => {
    const consultantId = Number(req.params.id);
  
    const query = `
      SELECT cr.id, u.name AS userName, cr.request_date AS date, cr.status  
      FROM consultant_requests cr  
      LEFT JOIN user_details u ON cr.user_id = u.id  
      WHERE cr.consultant_id = ? AND cr.status = 'completed'  
      ORDER BY cr.request_date DESC
    `;
  
    db.query(query, [consultantId], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      } 
      res.json(results);
    });
  });
  
router.get("/all-ids", (req, res) => {
    const query = "SELECT id FROM consultants"; 

    db.query(query, (err, results) => {
        if (err) {
            console.error(" Error fetching consultant IDs:", err);
            return res.status(500).json({ error: "Database error" });
        }

        console.log("Consultant IDs fetched:", results);
        res.json(results); 
    });
});

  
router.post("/request", verifyToken, async (req, res) => {
    const { user_id, consultant_id } = req.body;

    if (!user_id || !consultant_id) {
        return res.status(400).json({ error: "User ID and Consultant ID are required." });
    }

    const query = `
        INSERT INTO consultant_requests (user_id, consultant_id, status, request_date) 
        VALUES (?, ?, 'pending', NOW())
    `;

    db.query(query, [user_id, consultant_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error while saving request." });
        }
        res.status(200).json({ message: "Consultation request sent successfully!" });
    });
});

router.get("/requests/:consultantId", verifyToken, async (req, res) => {
    const { consultantId } = req.params;

    try {
        const query = `
            SELECT cr.id, cr.user_id, cr.consultant_id, cr.status, 
            cr.request_date,  
            u.name AS user_name
            FROM consultant_requests cr
            LEFT JOIN user_details u ON cr.user_id = u.id
            WHERE cr.consultant_id = ?;
        `;

        db.query(query, [consultantId], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error fetching consultant requests:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.put("/requests/:id/accept", verifyToken, async (req, res) => {
    const { id } = req.params; 
    const consultantId = req.user.id;

    try{
        db.query("SELECT * FROM consultant_requests WHERE id = ?", [id], (err, request) => {
            if (err || request.length === 0) {
                console.error("Request not found:", err);
                return res.status(404).json({ error: "Request not found." });
            }

            if (request[0].consultant_id !== consultantId) {
                console.error("Unauthorized request acceptance attempt.");
                return res.status(403).json({ error: "Unauthorized. You can only accept requests assigned to you." });
            }

            db.query(
                "UPDATE consultant_requests SET status = 'completed' WHERE id = ?",
                [id],
                (err, result) => {
                    if (err) {
                        console.error("Error updating consultation request:", err);
                        return res.status(500).json({ error: "Database update failed." });
                    }

                    if (result.affectedRows > 0) {
                        console.log("Request accepted successfully:", id);
                        return res.json({ success: true, message: "Request accepted successfully." });
                    } else {
                        return res.status(404).json({ error: "Request not found." });
                    }
                }
            );
        });
    } catch (error) {
        console.error("Error in request acceptance:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


module.exports = router;
