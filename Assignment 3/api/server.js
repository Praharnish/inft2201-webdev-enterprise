const express = require("express");
const rateLimit = require("./middleware/rateLimit");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const mailRoutes = require("./routes/mail");
const statusRoutes = require("./routes/status");

const app = express();

app.use(express.json());

// Middleware order matters: log and rate-limit every request before routing.
app.use(requestLogger);
app.use(rateLimit);

// Mount the feature routes under their API prefixes.
app.use("/status", statusRoutes);
app.use("/auth", authRoutes);
app.use("/mail", mailRoutes);

// Centralized error handler LAST so every failure returns one consistent format.
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Assignment 3 API listening on port ${PORT}`);
});