import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import GameCard from "./components/GameCard";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Modal from "./components/Modal";
import GameInfo from "./components/GameInfo";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const URL = "https://api.igdb.com/v4/games";
  const [games, setGames] = useState([]);
  const [searchInput, setInput] = useState("");
  const [genres, setGenres] = useState("");
  const [clickedGame, setClickedGame] = useState(null);
  const [username, setUsername] = useState(null);

  const fetchGames = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/games",
        { searchInput, genres },
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      setGames(response.data);
    } catch (error) {
      console.error("Error found");
    }
  };
  useEffect(() => {
    const currentUser = localStorage.getItem("username");
    setUsername(currentUser);
    fetchGames();
  }, []);

  const gameClick = (game) => {
    setClickedGame(game);
  };

  const closeModal = () => {
    setClickedGame(null);
  };

  const searchGame = (e) => {
    e.preventDefault();
    fetchGames();
  };

  const sortGames = (e) => {
    e.preventDefault();
    setGenres(e.target.value);
    fetchGames();
  };

  const resetFilter = (e) => {
    e.preventDefault();
    setGenres("");
    fetchGames();
  };

  const showGames = () =>
    games.map((game) => (
      <GameCard
        key={game.id}
        game={game}
        onClick={() => gameClick(game)}
      ></GameCard>
    ));

  const handleReview = async (reviewData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Review submitted successfully!");
    } catch (error) {
      console.error(
        "Error submitting review:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to submit the review.");
    }
  };

  return (
    <div className="appbody">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>PlayAndScore</h1>
                <h3>Find and review all the games you know and love!</h3>
                <nav>
                  {username ? (
                    <div>
                      <p> {username}'s account. </p>
                      <button
                        onClick={() => {
                          localStorage.removeItem("username");
                          localStorage.removeItem("token");
                          setUsername(null);
                        }}
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Link to="/register" className="navlinks">
                        Register
                      </Link>
                      <Link to="/login" className="navlinks">
                        Log In
                      </Link>
                    </div>
                  )}
                </nav>
                <div className="firstline">
                  <h4>Search Game by Name</h4>
                </div>
                <div className="sortoptions">
                  <form onSubmit={searchGame}>
                    <input
                      type="text"
                      onChange={(e) => setInput(e.target.value)}
                    ></input>
                    <button type="submit">Submit</button>
                  </form>
                  <form>
                    <h4>Sort By Genre</h4>
                    <input
                      type="radio"
                      id="Adventure"
                      name="genre"
                      value="Adventure"
                      onChange={sortGames}
                    ></input>
                    <label for="Adventure">Adventure</label>
                    <input
                      type="radio"
                      id="Fighting"
                      name="genre"
                      value="Fighting"
                      onChange={sortGames}
                    ></input>
                    <label for="Fighting">Fighting</label>
                    <input
                      type="radio"
                      id="Role-playing (RPG)"
                      name="genre"
                      value="Role-playing (RPG)"
                      onChange={sortGames}
                    ></input>
                    <label for="Role-playing (RPG)">Role Playing Game</label>
                    <input
                      type="radio"
                      id="Puzzle"
                      name="genre"
                      value="Puzzle"
                      onChange={sortGames}
                    ></input>
                    <label for="Puzzle">Puzzle</label>
                    <input
                      type="radio"
                      id="Indie"
                      name="genre"
                      value="Indie"
                      onChange={sortGames}
                    ></input>
                    <label for="Indie">Indie</label>
                    <input
                      type="radio"
                      id="Arcade"
                      name="genre"
                      value="Arcade"
                      onChange={sortGames}
                    ></input>
                    <label for="Arcade">Arcade</label>
                    <input
                      type="radio"
                      id="MOBA"
                      name="genre"
                      value="MOBA"
                      onChange={sortGames}
                    ></input>
                    <label for="MOBA">MOBA</label>
                    <input
                      type="radio"
                      id="Shooter"
                      name="genre"
                      value="Shooter"
                      onChange={sortGames}
                    ></input>
                    <label for="Shooter">Shooter</label>
                    <input
                      type="radio"
                      id="Simulator"
                      name="genre"
                      value="Simulator"
                      onChange={sortGames}
                    ></input>
                    <label for="Simulator">Simulator</label>
                    <input
                      type="radio"
                      id="Strategy"
                      name="genre"
                      value="Strategy"
                      onChange={sortGames}
                    ></input>
                    <label for="Strategy">Strategy</label>
                    <input
                      type="radio"
                      id="Sport"
                      name="genre"
                      value="Sport"
                      onChange={sortGames}
                    ></input>
                    <label for="Sport">Sports</label>
                    <input
                      type="radio"
                      id="Platform"
                      name="genre"
                      value="Platform"
                      onChange={sortGames}
                    ></input>
                    <label for="Platform">Puzzle</label>
                    <button onClick={resetFilter}>Clear Genre Filter</button>
                  </form>
                </div>
                <div className="game-display">{showGames()}</div>
                <div>
                  <Modal
                    game={clickedGame}
                    onClose={closeModal}
                    onSubmitReview={handleReview}
                  />
                </div>
              </div>
            }
          />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/game/:gameName" element={<GameInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
