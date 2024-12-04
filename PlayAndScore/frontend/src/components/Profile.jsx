import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [games, setGames] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${username}`
        );
        setUser(response.data.username);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchGameData = async () => {
      const gameIds = reviews.map((review) => review.gameId);
      gameIds.forEach(async (gameId) => {
        try {
          const response = await axios.post("http://localhost:5000/api/games", {
            gameId,
          });
          setGames((prevGames) => ({
            ...prevGames,
            [gameId]: response.data[0],
          }));
        } catch (error) {
          console.error("Error fetching game data:", error);
        }
      });
    };

    if (reviews.length > 0) {
      fetchGameData();
    }
  }, [reviews]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user}'s Profile</h1>
      <div>
        <h2>Reviews:</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const game = games[review.gameId];

            return game ? (
              <div key={review._id}>
                <h4>{review.username}</h4>
                <p>Rating: {review.rating}/10</p>
                <p>{review.reviewText}</p>
                {game.cover && (
                  <img
                    src={game.cover.url.replace("t_thumb", "t_cover_big")}
                    alt={game.name}
                  />
                )}
              </div>
            ) : (
              <p>Loading game info...</p>
            );
          })
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
