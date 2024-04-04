import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routers/product.js";
import morgan from "morgan";
import xssReqSanitizer from "xss-req-sanitizer";

const app = express();
const server = http.createServer(app);

// Middlewares
dotenv.config();
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(xssReqSanitizer());

// Request Interceptor Middleware
app.use((req, _, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/v1/products", productRoutes);

const port = process.env.PORT || 5000;
const appStart = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

appStart();
