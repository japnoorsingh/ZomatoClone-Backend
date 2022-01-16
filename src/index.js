// Environment Variables
require("dotenv").config();

// Libraries
import express from "express";
import cors from "cors";
import helmet from "helmet";     // HELMET - Middleware that provides security to backend
import passport from "passport";

// Database Connection
import ConnectDB from "./database/connection";

// Google Authentication Config
import googleAuthConfig from "./config/google.config";

// Private Route Authentication Config
import privateRouteConfig from "./config/route.config";

// APIs
import Auth from "./API/Auth";
import Restaurant from "./API/Restaurant";
import Food from "./API/Food";
import Menu from "./API/Menu";
import Image from "./API/Image";
import Order from "./API/Orders";
import Review from "./API/Reviews";
import User from "./API/User";

// passport Configrations
googleAuthConfig(passport);
privateRouteConfig(passport);

const zomato = express();

// Application Middlewares
zomato.use(cors());
zomato.use(express.json());
zomato.use(helmet());
zomato.use(passport.initialize());

// Application Routes
zomato.use("/auth", Auth);
zomato.use("/restaurant", Restaurant);
zomato.use("/food", Food);
zomato.use("/menu", Menu);
zomato.use("/image", Image);
zomato.use("/order", Order);
zomato.use("/review", Review);
zomato.use("/user", User);

zomato.get("/", (req, res) => res.json({ message: "Setup Successful" }));

// Server Setup
const port = process.env.PORT || 4000;

zomato.listen(port, () =>
  ConnectDB()
    .then(() => console.log("Server is Running 🚀"))
    .catch(() =>  // error
      console.log("Server is Running, but Database Connection Failed... ")
    )
);