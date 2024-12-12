import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import GameCard from "./components/GameCard";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Modal from "./components/Modal";
import GameInfo from "./components/GameInfo";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./components/Profile";

function App() {
  const URL = "https://api.igdb.com/v4/games";
  const [games, setGames] = useState([]);
  const [searchInput, setInput] = useState("");
  const [genres, setGenres] = useState("");
  const [clickedGame, setClickedGame] = useState(null);
  const [username, setUsername] = useState(null);
  const [page, setPage] = useState(1);

  const fetchGames = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/games",
        { searchInput, genres, page, limit: 36 },
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
  }, [page, searchInput, genres]);

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const gameClick = (game) => {
    setClickedGame(game);
  };

  const closeModal = () => {
    setClickedGame(null);
  };

  const searchGame = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const sortGames = (e) => {
    e.preventDefault();
    setPage(1);
    setGenres(e.target.value);
  };

  const resetFilter = (e) => {
    e.preventDefault();
    setPage(1);
    setGenres("");
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
                <nav className="firstline">
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
                      <Link to={`/users/${username}`}>Your Profile</Link>
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
                <div className="search">
                  <form onSubmit={searchGame}>
                    <input
                      type="text"
                      onChange={(e) => setInput(e.target.value)}
                    ></input>
                  </form>
                </div>
                <form>
                  <div className="sortoptions">
                    <select name="genre" onChange={sortGames}>
                      <option value="">Select Genre</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Fighting">Fighting</option>
                      <option value="Role-playing (RPG)">
                        Role-Playing Game
                      </option>
                      <option value="Puzzle">Puzzle</option>
                      <option value="Indie">Indie</option>
                      <option value="Arcade">Arcade</option>
                      <option value="MOBA">MOBA</option>
                      <option value="Shooter">Shooter</option>
                      <option value="Simulator">Simulator</option>
                      <option value="Strategy">Strategy</option>
                      <option value="Sport">Sports</option>
                      <option value="Platform">Platform</option>
                    </select>
                    <button onClick={resetFilter}>Clear Genre Filter</button>
                  </div>
                </form>
                <div className="game-display">{showGames()}</div>
                <div>
                  <Modal
                    game={clickedGame}
                    onClose={closeModal}
                    onSubmitReview={handleReview}
                  />
                </div>
                <div>
                  <button onClick={prevPage} disabled={page === 1}>
                    Previous
                  </button>
                  <button onClick={nextPage}>Next</button>
                </div>
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game/:gameId" element={<GameInfo />} />
          <Route path="/users/:username" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
