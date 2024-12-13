const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./PlayAndScore/backend/user");
const Review = require("./PlayAndScore/backend/review");
const authenticate = require("./PlayAndScore/backend/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server active on port ${PORT}`);
});

app.post("/api/games", async (req, res) => {
  console.log("POST received");
  const { gameId, genres, page = 1, limit = 36 } = req.body;
  const offset = (page - 1) * limit;

  try {
    if (gameId) {
      const response = await axios.post(
        "https://mboxszpjq5.execute-api.us-west-2.amazonaws.com/production/v4/games",
        `fields name, cover.url, genres.name, platforms.name, first_release_date, involved_companies.company.name, involved_companies.developer, summary, total_rating_count, total_rating;
        where id = ${gameId}; 
        limit 1;`,
        {
          headers: {
            "x-api-key": process.env.AWS_API_KEY,
          },
        }
      );
      res.send(response.data);
    } else {
      const { searchInput } = req.body;
      const response = await axios.post(
        "https://mboxszpjq5.execute-api.us-west-2.amazonaws.com/production/v4/games",
        `
        ${searchInput ? `search "${searchInput}";` : ""}
        fields name, cover.url, genres.name, platforms.name, first_release_date, involved_companies.company.name, involved_companies.developer, summary, total_rating_count, total_rating;
        where cover.url != null
        ${genres ? `& genres.name = "${genres}"` : ""}
        & category = (0,2,6,7,8,9,10) & version_parent = null
        & (total_rating_count != null); 
        limit ${limit}; offset ${offset};
        ${searchInput ? "" : "sort total_rating_count desc;"}
        `,
        {
          headers: {
            "x-api-key": process.env.AWS_API_KEY,
          },
        }
      );
      res.send(response.data);
    }
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

app.get("/api/reviews/:gameId", async (req, res) => {
  const { gameId } = req.params;

  try {
    const reviews = await Review.find({ gameId }).populate(
      "userId",
      "username"
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviews = await Review.find({ userId: user._id });

    res.json({
      username: user.username,
      reviews,
      lists: {
        played: user.played,
        playing: user.playing,
        wanttoplay: user.wanttoplay,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile", error.message);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

app.post("/api/lists/:username", authenticate, async (req, res) => {
  const { username } = req.params;
  const { gameId, listName } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.played = user.played.filter(
      (id) => id.toString() !== gameId.toString()
    );
    user.playing = user.playing.filter(
      (id) => id.toString() !== gameId.toString()
    );
    user.wanttoplay = user.wanttoplay.filter(
      (id) => id.toString() !== gameId.toString()
    );

    if (listName === "played" && !user.played.includes(gameId)) {
      user.played.push(gameId);
    } else if (listName === "playing" && !user.playing.includes(gameId)) {
      user.playing.push(gameId);
    } else if (listName === "wanttoplay" && !user.wanttoplay.includes(gameId)) {
      user.wanttoplay.push(gameId);
    }

    await user.save();

    res.status(200).json({ message: "Game added to list" });
  } catch (error) {
    console.error("Error managing lists:", error);
    res.status(500).json({ message: "Server error" });
  }
});
