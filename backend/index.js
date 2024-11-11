// Import dependencies at the top
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/connection");
const userRoutes = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const cloudinary = require("cloudinary").v2;
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const sendError = require("./utils/sendError");



// Load .env file regardless of environment
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// Body Parser
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

// Cookie Parser
app.use(cookieParser());

// JSON Parsing
app.use(express.json());

// Express File Upload
app.use(expressFileUpload());

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

// Database Connection
connectDB();

// JWT Middleware for Authentication
const isAuthUser = async (req, res, next) => {
  try {
    // Get Token From Cookies
    if (req.cookies.token) {
      // Verify Token
      const { userId } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      // Get User from Token
      req.user = await userModel.findById(userId).select("-password");
      next();
    } else {
      sendError(res, 400, "Authentication Failed: Token Not Found");
    }
  } catch (error) {
    sendError(res, 400, "Authentication Failed: Invalid Token");
  }
};

// Load Routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);

// Example of Protected Route
app.use("/api/protected", isAuthUser, (req, res) => {
  res.status(200).send({ message: "Protected route accessed successfully!" });
});

// Frontend Static Files (if serving React app)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-All for React Router
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Centralized Error Handling (if needed)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Server Port
const PORT = process.env.PORT || 8000;
app.listen(PORT, "localhost", () => {
  console.log(`Server Running At http://localhost:${PORT}`);
});
