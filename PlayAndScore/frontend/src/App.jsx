import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import GameCard from './components/GameCard';

function App() {
  const URL = "https://api.igdb.com/v4/games";
  const [games, setGames] = useState([]);

  const fetchGames = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/games', {
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
      <div className="game-display">
       {showGames()}
    </div>
    </div>
  );
}

export default App;