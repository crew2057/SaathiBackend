import express from "express";

import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { router as userRoute } from "./routes/userRoutes.js";
import { router as therapistRoute } from "./routes/therapistRoute.js";
import "dotenv/config.js";

import { connectDB } from "./config/db.js";
import { login } from "./controller/loginController.js";

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRoute);
app.post("/login", login);
app.use("/therapist", therapistRoute);
app.use(errorHandler);
app.listen(port, () => {
  console.log("server is up and running...");
});
