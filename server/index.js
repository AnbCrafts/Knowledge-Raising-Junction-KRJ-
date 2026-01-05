import express from "express";
import dotenv, { configDotenv } from "dotenv";
import cors from "cors";
import connectDB from "./src/Configs/Database/connectDB.Config.js";

configDotenv();

connectDB();

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to Database
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

// Routes
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Server Started Successfully, you are in the homepage...");
});
