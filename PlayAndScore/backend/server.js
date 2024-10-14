const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user");
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

app.listen(5000, () => {
  console.log("Server active on port 5000");
});
