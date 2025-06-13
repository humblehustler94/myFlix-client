// src/components/movie-card/movie-card.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Heart, HeartFill } from 'react-bootstrap-icons';

// The MovieCard component, optimized with React.memo
const MovieCard = React.memo(({ movie, user, onAddFavorite, onRemoveFavorite }) => {
  if (!movie) return null;

  const { id, title, description, image } = movie;

  // This logic is perfect. It safely checks if the movie is a favorite.
  const isFavorite = user?.FavoriteMovies?.includes(id);

  // The main card structure. The Link wrapping the entire card is a great UX choice.
  // When using this pattern, stopping event propagation on button clicks is essential.
  return (
    <Card className="h-100 movie-card">
      <Link to={`/movies/${id}`} className="text-decoration-none text-dark">
        <Card.Img
          variant="top"
          src={image}
          alt={`Poster for ${title}`}
          style={{ height: '400px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="flex-grow-1">{title}</Card.Title>
          {/* Truncating description is a good practice for card layouts */}
          <Card.Text>
            {description ? `${description.substring(0, 80)}...` : 'No description available.'}
          </Card.Text>
        </Card.Body>
      </Link>
      
      {/* --- REFACTORED FAVORITES BUTTON LOGIC --- */}
      {/* This section is placed in a Card.Footer for consistent placement */}
      <Card.Footer className="bg-white border-0">
        {isFavorite ? (
          // RENDER "REMOVE" BUTTON IF IT'S A FAVORITE
          <Button
            variant="danger"
            className="w-100"
            onClick={(e) => {
              e.stopPropagation(); // Prevent Link navigation
              onRemoveFavorite(id);
            }}
          >
            <HeartFill className="me-2" /> Remove Favorite
          </Button>
        ) : (
          // RENDER "ADD" BUTTON IF IT'S NOT A FAVORITE
          <Button
            variant="primary"
            className="w-100"
            onClick={(e) => {
              e.stopPropagation(); // Prevent Link navigation
              onAddFavorite(id);
            }}
          >
            <Heart className="me-2" /> Add to Favorites
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
});

// --- PropTypes remain largely the same, but they are crucial for good components ---
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    FavoriteMovies: PropTypes.arrayOf(PropTypes.string)
  }),
  onAddFavorite: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func.isRequired,
};

MovieCard.displayName = 'MovieCard';

export default MovieCard;