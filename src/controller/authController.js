import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const ACCESS_TOKEN_EXPIRES_IN = "1d";
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 24 * 60 * 60;

export const register = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword, role } = req.body;
    const normalizedUsername = (username || name || "").trim().toLowerCase();
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedRole = (role || "user").trim().toLowerCase();

    if (
      !normalizedUsername ||
      !normalizedEmail ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message:
          "username, email, password, and confirmPassword are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirmPassword do not match",
      });
    }

    if (!["user", "admin"].includes(normalizedRole)) {
      return res.status(400).json({
        message: "role must be either user or admin",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const expiresAt = new Date(
      Date.now() + ACCESS_TOKEN_EXPIRES_IN_SECONDS * 1000
    ).toISOString();

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      token: accessToken,
      tokenType: "Bearer",
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      expiresInSeconds: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      expiresAt,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

