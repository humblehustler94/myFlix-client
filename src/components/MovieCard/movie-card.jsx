import React from "react";

const MovieCard = ({ movie, onMovieClick }) => {
  if (!movie) return null; // Prevents errors if movie is undefined

  return (
    <div
      onClick={() => onMovieClick && onMovieClick(movie)} // Ensuring function exists
      style={{
        border: "1px solid black",
        padding: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      role="button" // Improves accessibility
      aria-label={`View details for ${movie.title}`}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
    >
      <h2>{movie.title}</h2>
    </div>
  );
};

export default MovieCard