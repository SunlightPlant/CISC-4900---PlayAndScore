import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameInfo = () => {
  const { gameName } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchGameByName = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/games", {
          searchInput: gameName,
        });
        if (response.data.length > 0) {
          setGame(response.data[0]);
        } else {
          console.error("No game found for the given name.");
        }
      } catch (error) {
        console.error("Error fetching game info:", error);
      }
    };

    fetchGameByName();
  }, [gameName]);

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

  if (!game) return <div>Loading...</div>;

  return (
    <div>
      <h1>{game.name}</h1>
      {game.cover && (
        <img
          src={game.cover.url.replace("t_thumb", "t_cover_big")}
          alt={game.name}
        />
      )}
      <p>{game.summary}</p>
      <p>Genres: {game.genres.map((genre) => genre.name).join(", ")}</p>
      <p>
        Platforms: {game.platforms.map((platform) => platform.name).join(", ")}
      </p>
      <p>
        Involved Companies:{" "}
        {game.involved_companies
          .filter((company) => company.developer)
          .map((company) => company.company.name)
          .join(", ")}
      </p>
      <p>Total Rating: {game.total_rating || "N/A"}</p>

      <div>
        <h2>Reviews:</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id}>
              <h4>{review.username}</h4>
              <p>Rating: {review.rating}/10</p>
              <p>{review.reviewText}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet for this game.</p>
        )}
      </div>
    </div>
  );
};

export default GameInfo;
