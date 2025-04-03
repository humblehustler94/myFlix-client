import React, { useState, useEffect } from "react";
import MovieCard from "../MovieCard/movie-card";
import MovieView from "../MovieView/movie-view";

const MainView = () => {
  // Step 1: Set the initial value of movies to an empty array and add setMovies function
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Step 2: Fetch movies from API and update state
  useEffect(() => {
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/movies")
      .then((response) => response.json())
      .then((data) => {
        console.log("movies from API:", data);
        setMovies(data); // Update the state with fetched movies
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  return (
    <div>
      {selectedMovie ? (
        <MovieView movie={selectedMovie} onBack={() => setSelectedMovie(null)} />
      ) : (
        <div>
          <h1>Movies List</h1>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {movies.map((movie) => (
              <MovieCard
                key={movie._id} // Ensure you're using the correct ID property
                movie={movie}
                onMovieClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainView;
