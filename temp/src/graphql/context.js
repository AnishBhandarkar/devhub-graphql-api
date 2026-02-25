const jwt = require("jsonwebtoken");
require("dotenv").config();

const Developer = require("../modules/developer/developer.model");

const context = async ({ req, res }) => {
  let developer = null;

  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const accessToken = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET
      );

      developer = await Developer.findById(decoded.userId).select("-password");

      // Optional: if user deleted but token still exists
      if (!developer) {
        throw new Error("User no longer exists");
      }
    }
  } catch (error) {
    // Token invalid or expired
    developer = null;

    // Optional: you can log error in dev mode
    if (process.env.NODE_ENV === "development") {
      console.error("Auth Error:", error.message);
    }
  }

  return { req, res, developer };
};

module.exports = context;