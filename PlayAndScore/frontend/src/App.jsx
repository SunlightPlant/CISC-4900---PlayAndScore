import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import GameCard from './components/GameCard';

function App() {
  const URL = "https://api.igdb.com/v4/games";
  const [games, setGames] = useState([]);
  const [searchInput, setInput] = useState('');
  const [genres, setGenres] = useState('');

  const fetchGames = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/games', { searchInput, genres }, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      setGames(response.data);
    } catch (error) {
      console.error("Error found");
    }
  };
  useEffect(() => {
    fetchGames();
  }, []);

  const searchGame = (e) => {
    e.preventDefault();
    fetchGames();
  }

  const sortGames = (e) => {
    e.preventDefault();
    setGenres(e.target.value);
    fetchGames();
  }

  const showGames = () => (
    games.map(game => (
      <GameCard key={game.id} 
      game={game}>
      </GameCard>
    ))
  );

  return (
    <div>
      <h1>PlayAndScore</h1>
      <h3>Find and review all the games you know and love!</h3>
      <form onSubmit={searchGame}>
        <input type="text" onChange = {(e) => setInput(e.target.value)}></input>
        <button type="submit">Submit</button>
      </form>
      <form>
        <p>Sort By Genre</p>
        <input type="radio" id="Adventure" name="genre" value="Adventure" onChange={sortGames}></input>
        <label for="Adventure">Adventure</label>
        <input type="radio" id="Fighting" name="genre" value="Fighting" onChange={sortGames}></input>
        <label for="Fighting">Fighting</label>
        <input type="radio"id="Role-playing (RPG)" name="genre" value="Role-playing (RPG)" onChange={sortGames}></input>
        <label for="Role-playing (RPG)">Role Playing Game</label>
        <input type="radio" id="Puzzle" name="genre" value="Puzzle" onChange={sortGames}></input>
        <label for="Puzzle">Puzzle</label>
      </form>
      <div className="game-display">{showGames()}</div>
    </div>
  );
}

export default App;