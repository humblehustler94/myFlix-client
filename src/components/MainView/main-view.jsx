import React, { useState } from "react";
import MovieCard from "../MovieCard/movie-card";
import MovieView from "../MovieView/movie-view";

const MainView = () => {
  const [movies] = useState([
    {
      id: 1,
      title: "The Dark Knight",
      description:
        "Batman faces the Joker, a criminal mastermind unleashing chaos in Gotham City.",
      image: "https://via.placeholder.com/150",
      genre: "Action",
      director: "Christopher Nolan",
    },
    {
      id: 2,
      title: "The Life Aquatic with Steve Zissou",
      description:
        "An eccentric oceanographer seeks revenge against a mythical shark while documenting his journey.",
      image: "https://via.placeholder.com/150",
      genre: "Comedy",
      director: "Wes Anderson",
    },
    {
      id: 3,
      title: "Inception",
      description:
        "A skilled thief leads a team of dream extractors to plant an idea into a target's subconscious.",
      image: "https://via.placeholder.com/150",
      genre: "Science Fiction",
      director: "Christopher Nolan",
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

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
                key={movie.id}
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

