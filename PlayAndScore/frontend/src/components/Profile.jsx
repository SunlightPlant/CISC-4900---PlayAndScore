import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [games, setGames] = useState({});
  const [lists, setLists] = useState({
    played: [],
    playing: [],
    wanttoplay: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${username}`
        );
        setUser(response.data.username);
        setReviews(response.data.reviews);
        setLists(response.data.lists);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchGameData = async () => {
      const gameIds = [
        ...new Set([
          ...reviews.map((review) => review.gameId),
          ...lists.played,
          ...lists.playing,
          ...lists.wanttoplay,
        ]),
      ];
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

    if (
      reviews.length > 0 ||
      Object.values(lists).some((list) => list.length > 0)
    ) {
      fetchGameData();
    }
  }, [reviews, lists]);

  if (!user) return <div>Loading...</div>;

  const renderList = (list, listName) => (
    <div>
      <h2>{listName}</h2>
      {list.length > 0 ? (
        list.map((gameId) => {
          const game = games[gameId];
          return game ? (
            <div key={gameId} className="listContent">
              <Link to={`/game/${gameId}`}>
                {game.cover && (
                  <img
                    src={game.cover.url.replace("t_thumb", "t_cover_small")}
                    alt={game.name}
                  />
                )}
              </Link>
            </div>
          ) : (
            <p>Loading game info...</p>
          );
        })
      ) : (
        <p>No games in this list.</p>
      )}
    </div>
  );

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>{user}'s Profile</h1>
      <div className="reviewSection">
        <h2>Reviews:</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const game = games[review.gameId];
            return game ? (
              <div key={review._id} className="reviewContent">
                <Link to={`/game/${review.gameId}`}>
                  {game.cover && (
                    <img
                      src={game.cover.url.replace("t_thumb", "t_cover_small")}
                      alt={game.name}
                    />
                  )}
                </Link>
                <div>
                  <h2>{game.name}</h2>
                  <p>
                    Rating: <span>{review.rating}/10</span>
                  </p>
                  <p>{review.reviewText}</p>
                </div>
              </div>
            ) : (
              <p>Loading game info...</p>
            );
          })
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      <div className="listSection">
        {renderList(lists.played, "Played")}
        {renderList(lists.playing, "Playing")}
        {renderList(lists.wanttoplay, "Want to Play")}
      </div>
    </div>
  );
};

export default Profile;
