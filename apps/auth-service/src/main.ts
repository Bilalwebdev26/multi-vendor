import express from "express";
import cors from "cors";
// import rateLimit from "express-rate-limit";
// import * as path from "path";
import morgan from "morgan";
// import swaggerUi from "swagger-ui-express";
// import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
// import axios from "axios";
import {errorMiddleare} from "../../../packages/error-handler/error.middleware"


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
app.use(errorMiddleare)
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});
const PORT = process.env.PORT || 6001;
const server = app.listen(PORT,()=>{
  console.log(`Auth service running on PORT : ${PORT}`)
})
server.on("error",(err)=>{
  console.log("Server Error : ",err)
})