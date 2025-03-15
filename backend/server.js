import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/admin", adminRouter);

// Root route
app.get('/', (req, res) => {
    res.json({ success: true, message: "API is running!" });
});

// 404 Handler (for undefined routes)
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// General Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Server Error" });
});

// Start server
app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});

