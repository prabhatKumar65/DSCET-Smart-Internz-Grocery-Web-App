const sendError = require("../utils/sendError");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const isAuthUser = async (req, res, next) => {
  try {
    // Check if the token is present in cookies
    const token = req.cookies.token;
    if (!token) {
      return sendError(res, 400, "Token not provided.");
    }

    // Verify the token using the JWT secret from .env
    const decoded = jwt.verify(token, process.env.myFavoriteSecretKey);

    // Check if the token has a userId (it should in a valid token)
    if (!decoded.userId) {
      return sendError(res, 400, "Invalid token: Missing userId.");
    }

    // Fetch the user from the database using the decoded userId
    const user = await userModel.findById(decoded.userId).select("-password");
    
    // If no user found, return an error
    if (!user) {
      return sendError(res, 400, "User not found.");
    }

    // Attach user to the request object for use in subsequent middleware/routes
    req.user = user;
    
    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    // Catch any errors (e.g., token verification failed)
    console.error(error);
    sendError(res, 400, "Token verification failed. Please log in again.");
  }
};

module.exports = isAuthUser;
