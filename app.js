const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const GlobalError = require("./src/middlewares/globalErrorMiddleware");
const { corsOptions } = require("./src/middlewares/corsMiddleware");
const router = require("./src/routes/route");
require("dotenv").config();

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://joinmeetup-client.vercel.app",
      "https://joinmeetup-client-r5f6.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", router);
app.use(GlobalError);

module.exports = app;
