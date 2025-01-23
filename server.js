const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lotteryRoutes = require("./routes/lotteryRoutes");

const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:5173", "https://gain-invest.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lottery", lotteryRoutes);

app.get("/", async (req, res) => {
  res.send("Gain is connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
