import jwt from "jsonwebtoken";

export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access is required",
    });
  }

  return next();
};
