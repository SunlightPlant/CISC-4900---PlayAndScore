import React from 'react';

const GameCard = ({game}) => {
    return (
      <div className="game-card">
        <div className="game-title">
        <h3 >{game.name.slice()}</h3>
        </div>
        <div className="game-cover">
        {game.cover ? <img src={game.cover.url}></img> : null}
        </div>
      </div>
    );
  };
  
export default GameCard;