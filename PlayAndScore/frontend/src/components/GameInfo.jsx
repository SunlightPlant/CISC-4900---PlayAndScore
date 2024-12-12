import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./GameInfo.css";

const GameInfo = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGameById = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/games", {
          gameId,
        });
        if (response.data.length > 0) {
          setGame(response.data[0]);
        } else {
          console.error("No game found for the given ID.");
        }
      } catch (error) {
        console.error("Error fetching game info:", error);
      }
    };

    fetchGameById();
  }, [gameId]);

  useEffect(() => {
    if (game) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/reviews/${game.id}`
          );
          setReviews(response.data);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }
  }, [game]);

  const handleListUpdate = async (listName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to manage play lists");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/lists/${localStorage.getItem("username")}`,
        { gameId: game.id, listName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Game added to your play list`);
    } catch (error) {
      console.error("Error updating play list:", error);
    }
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div>
      <Link to={`/`}>Home</Link>
      <h1>{game.name}</h1>
      <div className="buttons">
        <h4>Manage Play Lists:</h4>
        <button onClick={() => handleListUpdate("played")}>Played</button>
        <button onClick={() => handleListUpdate("playing")}>Playing</button>
        <button onClick={() => handleListUpdate("wanttoplay")}>
          Want to Play
        </button>
      </div>
      <div className="main">
        <div className="cover">
          {game.cover && (
            <img
              src={game.cover.url.replace("t_thumb", "t_1080p")}
              alt={game.name}
            />
          )}
        </div>
        <div className="desc">
          <p>{game.summary}</p>
        </div>
        <p>Genres: {game.genres.map((genre) => genre.name).join(", ")}</p>
        <p>
          Platforms:{" "}
          {game.platforms.map((platform) => platform.name).join(", ")}
        </p>
        <p>
          Developers:{" "}
          {game.involved_companies
            .filter((company) => company.developer)
            .map((company) => company.company.name)
            .join(", ")}
        </p>
        <p>Total Rating: {game.total_rating || "N/A"}</p>
        <h2>User Reviews:</h2>
      </div>
      <div>
        <div className="review">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="reviewContent" key={review._id}>
                <a href={`/users/${review.username}`}>{review.username}</a>
                <p> - </p>
                <p>{review.rating}/10 - </p>
                <p>{review.reviewText}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet for this game.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
