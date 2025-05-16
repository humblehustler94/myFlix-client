// src/components/movie-card/movie-card.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
// Import Link from react-router-dom
import { Link } from "react-router-dom";
// Import Icons for favorites
import { Heart, HeartFill } from 'react-bootstrap-icons';

// Assuming you might use CSS Modules or plain CSS later,
// but demonstrating Bootstrap classes for spacing/layout control.
// You might control width via a parent grid component (e.g., <Col xs={12} md={4} lg={3}>)

// Refactored MovieCard component
// Now accepts movie, user, onAddFavorite, and onRemoveFavorite as props
const MovieCard = React.memo(({ movie, user, onAddFavorite, onRemoveFavorite }) => {
  // Destructure props first
  if (!movie) return null;

  // Destructure movie properties for cleaner access
  const { id, title, description, image } = movie; // Use 'id' and 'image' as defined in MainView mapping

  // Check if the current movie is in the user's favorite list
  // Ensure user and user.FavoriteMovies exist before checking includes
  const isFavorite = user && user.FavoriteMovies && user.FavoriteMovies.includes(id);


   // Handler for the favorite button click
  const handleFavoriteClick = (e) => {
     e.stopPropagation(); // Prevent the Link click event when clicking the button
     if (isFavorite) {
       onRemoveFavorite(id); // Use 'id' from the movie object
     } else {
       onAddFavorite(id); // Use 'id' from the movie object
     }
   };


  return (
    // Use a Link component that wraps the Card
    // This makes the entire card clickable to navigate to the movie details page
    <Link to={`/movies/${id}`} className="text-decoration-none">
       <Card className="h-100 mb-4"> {/* h-100 helps if cards are in a row for equal height */}
         {/* Conditionally render image only if image exists */}
         {image && (
           <Card.Img
             variant="top"
             src={image} // Use the 'image' prop
             alt={`Poster for ${title}`} // Essential for accessibility
             style={{ objectFit: 'cover', height: '250px' }} // Example style for consistent image size
           />
         )}
         {/* Fallback if no image? */}
         {!image && <div style={{ height: '250px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d' }}>
           No Image Available
         </div>}

         <Card.Body className="d-flex flex-column"> {/* Flex column helps align button to bottom */}
           <Card.Title>{title}</Card.Title>

           {/* Conditionally render description */}
           {description && (
             <Card.Text className="flex-grow-1"> {/* flex-grow pushes button down */}
               {description.substring(0, 100)}... {/* Optional: Truncate long descriptions */}
             </Card.Text>
           )}
           {!description && <div className="flex-grow-1"></div>} {/* Placeholder for layout consistency */}

            {/* Favorite Button (inside the card, separate from the Link) */}
           {user && onAddFavorite && onRemoveFavorite && ( // Only show if user is logged in and handlers are provided
              <Button
                 variant="outline-danger" // Use outline initially
                 size="sm" // Smaller button
                 onClick={handleFavoriteClick} // Use the extracted handler
                 aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                 className={`mt-auto align-self-end ${isFavorite ? 'active-favorite' : ''}`} // Align to bottom right, add class for styling
                 // Add active class or change variant on isFavorite if desired
                 // variant={isFavorite ? "danger" : "outline-secondary"} // Example: red button if favorite
              >
                {isFavorite ? <HeartFill /> : <Heart />} {/* Heart icon */}
              </Button>
           )}

           {/* The "View Details" button is removed because the entire card is now a Link */}
           {/* You could keep a "View Details" button if you prefer, but then make the Link
               only wrap the image/title section, not the whole card, or handle the click
               event on the button and call navigate explicitly. Wrapping the whole card
               in Link is simpler. */}

         </Card.Body>
       </Card>
    </Link>
  );
}); // Close React.memo


// PropTypes should match the destructured props and usage
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired, // Changed from _id to id
    title: PropTypes.string.isRequired,
    description: PropTypes.string,   // Optional field
    image: PropTypes.string,         // Changed from ImagePath to image (matches MainView mapping)
  }).isRequired,
  // User object shape should match what you store in MainView
  user: PropTypes.shape({
      Username: PropTypes.string,
      FavoriteMovies: PropTypes.arrayOf(PropTypes.string) // Array of movie IDs
  }),
  onAddFavorite: PropTypes.func.isRequired, // Handler for adding favorite
  onRemoveFavorite: PropTypes.func.isRequired, // Handler for removing favorite
  // Removed onMovieClick prop
};

// Optional: Add display name for better debugging with React.memo
MovieCard.displayName = 'MovieCard';

export default MovieCard;