import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    const user = await User.findById(decoded.id).select("-password");
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};

export const admin = (req, res, next) => {
  if(req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Not an admin" });
};