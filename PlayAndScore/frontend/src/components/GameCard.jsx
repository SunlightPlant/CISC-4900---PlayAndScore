import React from 'react';

const GameCard = ({game,onClick}) => {
    return (
      <div className="game-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="game-title">
        <h3 >{game.name.slice()}</h3>
        </div>
        <div className="game-cover">
        {game.cover ? <img src={game.cover.url.replace('t_thumb','t_cover_big')}></img> : null}
        </div>
      </div>
    );
  };
  
export default GameCard;