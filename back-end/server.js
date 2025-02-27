const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user"); // Import user routes
const authRoutes = require("./routes/auth"); // Import auth routes
const consultantRoutes = require("./routes/consultants"); // Import consultant routes
const adminRoutes = require("./routes/admin"); // Import admin routes
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/consultants", consultantRoutes);
app.use("/api/admin", adminRoutes);

app.listen(7777, () => {
    console.log("Server running on port 7777");
});
