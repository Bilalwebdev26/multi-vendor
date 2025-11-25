import express from "express";
import cors from "cors";
// import rateLimit from "express-rate-limit";
// import * as path from "path";
import morgan from "morgan";
// import swaggerUi from "swagger-ui-express";
// import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
// import axios from "axios";
//  import {errorMiddlware} from "../../../packages/error-handler/error.middleware"

import productRoutes from "./routes/product.routes.js";
import { errorMiddlware } from "@packages/error-handler/error.middleware.js";
// const swaggerDocument = require("./swagger-output.json");
// import swaggerDocument from "./swagger-output.json"
const app = express();
app.use(
  cors({
    origin: ["http://localhost:8080"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Content-Range", "X-Total-Count"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 600,
  })
);
app.use(errorMiddlware);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  console.log(">>> Incoming:", req.method, req.url);
  console.log("Host header:", req.headers.host);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});
app.get("/", (req, res) => {
  res.send({ message: "Hello Product API" });
});
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", productRoutes);
const PORT = process.env.PRODUCT_PORT || 6002;
const server = app.listen(PORT, () => {
  console.log(`Product service running on PORT : ${PORT}`);
  console.log(`Product service API Docs : http://localhost:${PORT}/api-docs/`);
});
server.on("error", (err) => {
  console.log("Server Error : ", err);
});
