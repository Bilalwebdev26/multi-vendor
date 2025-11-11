/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import * as path from "path";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import axios from "axios";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Content-Range", "X-Total-Count"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 600,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req: any) => (req.user ? 1000 : 100),
    message: (req: any) => (req.user ? "Too many requests, please try again later." : "Too many requests, please try again later."),
    handler: (req: any, res: any) => {
      res.status(429).json({
        message: req.user ? "Too many requests, please try again later." : "Too many requests, please try again later.",
      });
    },
    standardHeaders:true,
    legacyHeaders:true,
    keyGenerator:(req:any)=>req.ip,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("trust proxy", 1);
//-----------------------------------------------------
app.get("/apigateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});
app.use("/auth",proxy("http://localhost:6001"))

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
