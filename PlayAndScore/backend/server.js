const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user");
const Review = require("./review");
const authenticate = require("./auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/jwt", {})
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.post("/api/games", async (req, res) => {
  console.log("POST received");
  const { searchInput, genres } = req.body;
  try {
    const response = await axios.post(
      "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
      `${
        searchInput ? `search "${searchInput}";` : ""
      } fields name, cover.url, genres.name, platforms.name, first_release_date, involved_companies.developer, summary, total_rating_count, total_rating; where cover.url != null ${
        genres ? `& genres.name = "${genres}"` : ""
      } & category = (0,2) & version_parent = null; limit 36;`,
      {
        headers: {
          "Client-ID": process.env.VITE_APP_CLIENT_ID,
          Authorization: `Bearer ${process.env.VITE_APP_API_KEY}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    res.send(response.data);
  } catch (error) {
    console.error("Error found");
  }
});

app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
      username,
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields must be filled in order to log in" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No email found" });
    }

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res.status(400).json({ message: "The password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
    });
  } catch (error) {
    console.error("Error logging in:", error);
  }
});

app.post("/api/reviews", authenticate, async (req, res) => {
  const { gameId, rating, reviewText } = req.body;
  const userId = req.user.id;
  const username = req.user.username;

  try {
    console.log("review data:", req.body);
    const newReview = new Review({
      gameId,
      userId,
      rating,
      username,
      reviewText,
      date: new Date(),
    });
    await newReview.save();
    console.log(req.body);

    res.status(201).json({ message: "Review successfully submitted!" });
  } catch (error) {
    res.status(500).json({ message: "Error while submitting review" });
  }
});

/* app.get("/api/game/:gameId", async (req, res) => {
  const { gameId } = req.params;

  try {
    const gameResponse = await axios.post(
      "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games",
      `fields name, summary, genres.name, platforms.name, cover.url; where id = ${gameId};`,
      {
        headers: {
          "Client-ID": process.env.VITE_APP_CLIENT_ID,
          Authorization: `Bearer ${process.env.VITE_APP_API_KEY}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const gameDetails = gameResponse.data[0];

    const reviews = await Review.find({ gameId });

    res.status(200).json({ gameDetails, reviews });
  } catch (error) {
    console.error("Error fetching game info or reviews:", error.message);
    res.status(500).json({ message: "Error fetching game info" });
  }
});
*/
app.listen(5000, () => {
  console.log("Server active on port 5000");
});
