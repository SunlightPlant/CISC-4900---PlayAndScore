import React from "react";
import "./Modal.css";

const Modal = ({ game, onClose, onSubmitReview }) => {
  if (!game) return null;
  const releaseDate = new Date(game.first_release_date * 1000);
  const roundedScore = Math.round(game.total_rating * 100) / 100;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 0 || rating > 10) {
      alert("You can only rate the game between 0 and 10");
      return;
    }

    const reviewData = {
      gameId: game.id,
      rating,
      reviewText,
    };

    onSubmitReview(reviewData);
    onClose();
  };
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
        <p>
          Total rating : {roundedScore}/100 with {game.total_rating_count}{" "}
          ratings
        </p>
        <p>{game.summary}</p>
        <div className="reviewForm">
          <h3> Leave a Review </h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label for="rating">Rating from 1 to 10: </label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="0"
                max="10"
                required
              ></input>
            </div>
            <div>
              <label for="reviewText">Review: </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
