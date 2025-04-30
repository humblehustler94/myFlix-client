import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";

// Assuming you might use CSS Modules or plain CSS later,
// but demonstrating Bootstrap classes for spacing/layout control.
// You might control width via a parent grid component (e.g., <Col xs={12} md={4} lg={3}>)

const MovieCard = React.memo(({ movie, onMovieClick }) => { // Added React.memo (optional)
  // Destructure props first
  if (!movie) return null;

  // Destructure movie properties for cleaner access
  const { _id, Title, Description, ImagePath } = movie;

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent potential parent clicks if needed
    // Ensure onMovieClick is callable before calling it
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  return (
    // Use Bootstrap margin bottom class instead of inline style
    // Width is often better controlled by parent grid columns (e.g., <Col>)
    <Card className="h-100 mb-4"> {/* h-100 helps if cards are in a row for equal height */}
      {/* Conditionally render image only if ImagePath exists */}
      {ImagePath && (
        <Card.Img
          variant="top"
          src={ImagePath}
          alt={`Poster for ${Title}`} // Essential for accessibility
          style={{ objectFit: 'cover', height: '250px' }} // Example style for consistent image size
        />
      )}
      {/* Fallback if no image? You could add an element here */}
      {/* {!ImagePath && <div className="no-image-placeholder">No Image Available</div>} */}

      <Card.Body className="d-flex flex-column"> {/* Flex column helps align button to bottom */}
        <Card.Title>{Title}</Card.Title>

        {/* Conditionally render description */}
        {Description && (
          <Card.Text className="flex-grow-1"> {/* flex-grow pushes button down */}
            {Description}
          </Card.Text>
        )}

        {/* Button rendering logic remains similar */}
        {onMovieClick && (
          <Button
            variant="primary"
            onClick={handleButtonClick} // Use the extracted handler
            aria-label={`View details for ${Title}`}
            className="mt-auto" // Aligns button to the bottom if Card.Body is flex column
          >
            View Details
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}); // Close React.memo

// PropTypes should match the destructured props and usage
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string, // Optional field
    ImagePath: PropTypes.string,   // Optional field
  }).isRequired,
  onMovieClick: PropTypes.func,
};

// Optional: Add display name for better debugging with React.memo
MovieCard.displayName = 'MovieCard';

export default MovieCard;