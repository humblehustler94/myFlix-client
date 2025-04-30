import React from "react";

import "./movie-view.scss";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <h1>{movie.title}</h1>
      <img src={movie.image} alt={movie.title} style={{ width: "150px" }} />
      <p>
        <strong>Description:</strong>
        {movie.description}
      </p>
      <p>
        <strong>Genre:</strong>
        {movie.genre}
      </p>
      <p>
        <strong>Director:</strong>
        {movie.director}
      </p>
      <button onClick={onBackClick} className="back-button" style={{cursor: "pointer"}}>Back</button>
    </div>
  );
};

export default MovieView;