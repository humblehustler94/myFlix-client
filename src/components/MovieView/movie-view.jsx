// src/components/movie-view/movie-view.jsx
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { useParams, useNavigate } from "react-router-dom"; // Import hooks from react-router-dom
// Import React-Bootstrap components
import { Button, Card, Row, Col } from "react-bootstrap"; // Removed unused 'Container'
// Import Icons
import { Heart, HeartFill } from 'react-bootstrap-icons';

// Import the MovieCard component
import MovieCard from "../MovieCard/movie-card";

import "./movie-view.scss"; // Assuming you have an scss file for this component

// Define the component
// Now accepts movies array, user, and favorite handlers as props (removed 'token')
export const MovieView = ({ movies, user, onAddFavorite, onRemoveFavorite }) => { // Removed 'token' prop
  // Use useParams to get the movie ID from the URL
  const { movieId } = useParams();
  // Use useNavigate for programmatic navigation (like going back)
  const navigate = useNavigate();

  // Find the specific movie from the passed movies array using the ID from the URL
  const movie = movies.find((m) => m.id === movieId);

  // Check if the movie was found
  // Render a loading or error message if the movie isn't found in the list yet
  // or if the ID is invalid.
  if (!movie) {
    // Render within the same Row/Col structure for consistency
    return (
      <Row className="justify-content-md-center">
        <Col md={8} lg={9}>
           <p>Movie not found or still loading...</p>
           {/* Add a back button here too in case movie is not found */}
           <Button variant="secondary" onClick={() => navigate(-1)}>
             Back
           </Button>
        </Col>
      </Row>
     );
  }

   // Check if the current movie is in the user's favorite list
   // Ensure user and user.FavoriteMovies exist before checking includes
   const isFavorite = user && user.FavoriteMovies && user.FavoriteMovies.includes(movie.id);


  // Handler for the favorite button click
  // Removed 'async' keyword as no 'await' is used inside
  const handleFavoriteClick = () => {
    if (isFavorite) {
      // If it's already a favorite, call the remove handler
      onRemoveFavorite(movie.id);
    } else {
      // If it's not a favorite, call the add handler
      onAddFavorite(movie.id);
    }
  };

  // Logic to filter for similar movies
  // Similar movies share at least one genre or the same director
  // Exclude the current movie itself
  // Comparison uses the genre/director names as strings, matching MainView mapping
  const similarMovies = movies.filter(m =>
    m.id !== movie.id && // Exclude the movie currently being viewed
    (
      (movie.genre && m.genre && m.genre === movie.genre) || // Same genre name strings
      (movie.director && m.director && m.director === movie.director) // Same director name strings
    )
  );


  return (
     // No need for outer Container here as it's provided by MainView's layout
     <Card className="movie-view-card"> {/* Use Bootstrap Card for structure */}
        <Card.Header as="h1">{movie.title}</Card.Header> {/* Card title */}
        <Card.Body>
           {/* Image */}
           <Row className="mb-3">
              <Col className="text-center">
                  <Card.Img
                     src={movie.image}
                     alt={`Poster for ${movie.title}`} // Added alt text for accessibility
                     style={{ maxWidth: "300px", height: "auto" }} // Adjust max width for better view
                     className="img-fluid" // Ensure image is responsive within container
                  />
              </Col>
           </Row>

            {/* Favorite Button */}
           {user && onAddFavorite && onRemoveFavorite && ( // Only show favorite button if user is logged in and handlers provided
              <Row className="mb-3 justify-content-center">
                 <Col xs="auto">
                     <Button
                        variant={isFavorite ? "danger" : "outline-danger"} // Red for favorite, outline for not
                        onClick={handleFavoriteClick}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                     >
                       {isFavorite ? <HeartFill className="me-1" /> : <Heart className="me-1" />} {/* Heart icon */}
                       {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                     </Button>
                 </Col>
              </Row>
           )}


            {/* Movie Details */}
            <Row className="mb-2">
               <Col>
                 <Card.Text>
                   <strong>Description:</strong> {movie.description}
                 </Card.Text>
               </Col>
            </Row>

            {/* Genre */}
             {movie.genre && ( // Conditionally render if genre exists
                <Row className="mb-2">
                   <Col>
                      <Card.Text>
                         <strong>Genre:</strong> {movie.genre}
                      </Card.Text>
                   </Col>
                </Row>
             )}

            {/* Director */}
             {movie.director && ( // Conditionally render if director exists
                <Row className="mb-2">
                   <Col>
                      <Card.Text>
                         <strong>Director:</strong> {movie.director}
                      </Card.Text>
                   </Col>
                </Row>
             )}


            {/* Section for Similar Movies */}
            {/* Only render this section if there are similar movies found */}
            {similarMovies.length > 0 && (
               <> {/* Use a fragment <> to group the heading and the row */}
                  <h2 className="mt-5 mb-3 text-center">Similar Movies</h2> {/* Add spacing and center heading */}
                  {/* Using justify-content-center on the Row centers the cards horizontally */}
                  <Row className="justify-content-md-center">
                     {/* Map over the similarMovies array and render MovieCard for each */}
                     {similarMovies.map((similarMovie) => (
                        // Use Col with grid classes for responsive layout
                        <Col key={similarMovie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                           <MovieCard
                              movie={similarMovie} // Pass the similar movie object
                              user={user} // Pass user prop
                              onAddFavorite={onAddFavorite} // Pass add favorite handler
                              onRemoveFavorite={onRemoveFavorite} // Pass remove favorite handler
                              // No need to pass token to MovieCard if handlers are passed
                           />
                        </Col>
                     ))}
                  </Row>
               </>
            )}


            {/* Back Button */}
            <Row className="mt-4">
               <Col className="text-center"> {/* Center the back button */}
                  <Button variant="secondary" onClick={() => navigate(-1)}> {/* Use Bootstrap button */}
                    Back
                  </Button>
               </Col>
            </Row>

        </Card.Body>
     </Card>
  );
};


// Add PropTypes for validation
MovieView.propTypes = {
  // movies is the full array of movies passed from MainView
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string, // Image might be optional
      description: PropTypes.string,
      genre: PropTypes.string, // Genre might be optional (Name string)
      director: PropTypes.string, // Director might be optional (Name string)
    })
  ).isRequired,
  user: PropTypes.object, // user object might be null initially. Could be more specific if needed.
  // Removed token propType as it's not used within MovieView
  onAddFavorite: PropTypes.func.isRequired, // Handler for adding favorite
  onRemoveFavorite: PropTypes.func.isRequired, // Handler for removing favorite
};


export default MovieView;