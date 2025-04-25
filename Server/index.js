const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDatabase = require("./utils/database.util");
const authRoutes = require("./routes/auth.routes");
const codeRoutes = require("./routes/code.routes");
const { authenticateToken } = require("./middleware/auth.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure storage directories exist
const STORAGE_DIR = path.join(__dirname, "storage", "codes");
fs.ensureDirSync(STORAGE_DIR);

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/", codeRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
