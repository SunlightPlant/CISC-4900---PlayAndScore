import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Modal.css";
import axios from "axios";

const Modal = ({ game, onClose, onSubmitReview }) => {
  if (!game) return null;
  const releaseDate = new Date(game.first_release_date * 1000);
  const roundedScore = Math.round(game.total_rating * 100) / 100;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedList, setSelectedList] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 0 || rating > 10) {
      alert("You can only rate the game between 0 and 10");
      return;
    }

    const reviewData = {
      gameId: game.id,
      rating,
      reviewText,
    };

    onSubmitReview(reviewData);
    onClose();
  };

  const handleListUpdate = async (listName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to manage lists!");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/lists/${localStorage.getItem("username")}`,
        { gameId: game.id, listName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Game added to your list!`);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <button className="closeButton" onClick={() => onClose()}>
          X
        </button>
        <h2>{game.name}</h2>
        <div>
          <h4>Manage Lists:</h4>
          <button onClick={() => handleListUpdate("played")}>Played</button>
          <button onClick={() => handleListUpdate("playing")}>Playing</button>
          <button onClick={() => handleListUpdate("wanttoplay")}>
            Want to Play
          </button>
        </div>
        <h4>Released on {releaseDate.toLocaleDateString("en-US")}</h4>
        <h4>
          Released for{" "}
          {game.platforms.map((platform) => platform.name).join(", ")}
        </h4>
        <h4>Genres : {game.genres.map((genre) => genre.name).join(", ")}</h4>
        {game.cover && (
          <img
            src={game.cover.url.replace("t_thumb", "t_cover_big")}
            alt={game.name}
          ></img>
        )}
        <p>
          Total rating : {roundedScore}/100 with {game.total_rating_count}{" "}
          ratings
        </p>
        <p>{game.summary}</p>
        <div>
          <Link to={`/game/${game.id}`} className="gameInfoLink">
            More Info
          </Link>
        </div>
        <div className="reviewForm">
          <h3> Leave a Review </h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label for="rating">Rating from 1 to 10: </label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="0"
                max="10"
                required
              ></input>
            </div>
            <div>
              <label for="reviewText">Review: </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
