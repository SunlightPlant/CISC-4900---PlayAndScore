import React from "react";
import "./Modal.css";

const Modal = ({ game, onClose }) => {
  if (!game) return null;
  const releaseDate = new Date(game.first_release_date * 1000);
  const roundedScore = Math.round(game.total_rating * 100) / 100;
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <button onClick={() => onClose()}>X</button>
        <h2>{game.name}</h2>
        <h4>Released on {releaseDate.toLocaleDateString("en-US")}</h4>
        <h4>
          Released for{" "}
          {game.platforms.map((platform) => platform.name).join(", ")}
        </h4>
        <h4>Genres : {game.genres.map((genre) => genre.name).join(", ")}</h4>
        {game.cover && (
          <img src={game.cover.url.replace("t_thumb", "t_cover_big")}></img>
        )}
        <p>Your rating : </p>
        <p>
          Total rating : {roundedScore}/100 with {game.total_rating_count}{" "}
          ratings
        </p>
        <p>{game.summary}</p>
      </div>
    </div>
  );
};

export default Modal;
