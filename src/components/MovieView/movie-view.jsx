// src/components/movie-view/movie-view.jsx
import React from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col } from "react-bootstrap";
import { Heart, HeartFill } from 'react-bootstrap-icons';
import MovieCard from "../MovieCard/movie-card";
import "./movie-view.scss";

// The MovieView component
export const MovieView = ({ movies, user, onAddFavorite, onRemoveFavorite }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    return (
      <Row className="justify-content-md-center">
        <Col md={8}>
          <p>Movie not found or still loading...</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>
    );
  }

  // This is the correct logic for determining favorite status
  const isFavorite = user?.FavoriteMovies?.includes(movie.id);

  // Filter for similar movies - this logic is excellent
  const similarMovies = movies.filter(m =>
    m.id !== movie.id && (
      (movie.genre && m.genre === m.genre) ||
      (movie.director && m.director === m.director)
    )
  );

  return (
    <Card className="movie-view-card border-0">
      <Row>
        {/* Left column for Image */}
        <Col md={4} className="text-center">
          <Card.Img
            src={movie.image}
            alt={`Poster for ${movie.title}`}
            className="img-fluid rounded"
            style={{ maxHeight: '600px', width: 'auto' }}
          />
        </Col>

        {/* Right column for Details */}
        <Col md={8}>
          <Card.Body>
            <Card.Title as="h1" className="mb-3">{movie.title}</Card.Title>
            <Card.Text>
              <strong>Description:</strong> {movie.description}
            </Card.Text>
            {movie.genre && (
              <Card.Text>
                <strong>Genre:</strong> {movie.genre}
              </Card.Text>
            )}
            {movie.director && (
              <Card.Text>
                <strong>Director:</strong> {movie.director}
              </Card.Text>
            )}

            {/* --- REFACTORED FAVORITES BUTTON LOGIC --- */}
            <div className="mt-4 d-flex gap-2">
              {isFavorite ? (
                // RENDER "REMOVE" BUTTON IF IT'S A FAVORITE
                <Button
                  variant="danger"
                  onClick={() => onRemoveFavorite(movie.id)}
                >
                  <HeartFill className="me-2" /> Remove from Favorites
                </Button>
              ) : (
                // RENDER "ADD" BUTTON IF IT'S NOT A FAVORITE
                <Button
                  variant="primary"
                  onClick={() => onAddFavorite(movie.id)}
                >
                  <Heart className="me-2" /> Add to Favorites
                </Button>
              )}
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>

      {/* Section for Similar Movies */}
      {similarMovies.length > 0 && (
        <>
          <hr className="my-5" /> {/* Visual separator */}
          <h2 className="mb-4 text-center">Similar Movies</h2>
          <Row>
            {similarMovies.slice(0, 4).map((similarMovie) => ( // Use .slice(0, 4) to show a max of 4
              <Col key={similarMovie.id} xs={12} sm={6} lg={3} className="mb-4">
                <MovieCard
                  movie={similarMovie}
                  user={user}
                  onAddFavorite={onAddFavorite}
                  onRemoveFavorite={onRemoveFavorite}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Card>
  );
};

// PropTypes are correctly defined and are very good practice.
MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
      description: PropTypes.string,
      genre: PropTypes.string,
      director: PropTypes.string,
    })
  ).isRequired,
  user: PropTypes.object,
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
};

export default MovieView;