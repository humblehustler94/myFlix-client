// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
// --- Import React-Bootstrap components ---
import { Container, Row, Col, Button } from "react-bootstrap"; // Import Button as well for consistency
// ----------------------------------------
import { MovieCard } from "../MovieCard/movie-card";
import { MovieView } from "../MovieView/movie-view";
import { LoginView } from "../LoginView/login-view"; // Import LoginView
import { SignupView } from "../SignupView/signup-view"; // Import SignupView

export const MainView = () => {
  // Get user and token from localStorage on initial load
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Initialize user and token state from localStorage
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  // State to toggle between login and signup view
  const [showSignup, setShowSignup] = useState(false);

  // Function to handle successful login
  const handleLoggedIn = (loggedInUser, loggedInToken) => {
    setUser(loggedInUser);
    setToken(loggedInToken);
    // No need to set localStorage here, LoginView already does it
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear(); // Clear localStorage on logout
  };

  // useEffect hook to fetch movies when the token changes (i.e., after login)
  useEffect(() => {
    if (!token) {
      // Don't fetch movies if there's no token
      return;
    }

    // Fetch movies from your API using the token
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/movies", {
      // <-- !! REPLACE YOUR_API_URL !!
      headers: { Authorization: `Bearer ${token}` }, // Send token in header
    })
      .then((response) => {
        if (!response.ok) {
          // If token is expired or invalid, log out the user
          if (response.status === 401 || response.status === 403) {
            handleLogout();
            throw new Error("Session expired or invalid. Please log in again.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Process and set movie data
        const moviesFromApi = data.map((movie) => ({
          // Adapt this mapping based on your API response structure
          id: movie._id, // Assuming your API returns _id
          title: movie.Title,
          image: movie.ImagePath,
          description: movie.Description,
          genre: movie.Genre.Name, // Example: nested object
          director: movie.Director.Name, // Example: nested object
          // Add any other fields needed by MovieCard/MovieView
        }));
        setMovies(moviesFromApi);
      })
      .catch((e) => {
        console.error("Fetching movies error: ", e);
        alert(`Failed to fetch movies: ${e.message}`);
      });
  }, [token]); // Re-run this effect when the token changes

  // --- Conditional Rendering Logic ---

  // 1. If a movie is selected, show MovieView (wrapped in Container for consistency)
  if (selectedMovie) {
    return (
      <Container>
        <Row className="justify-content-md-center"> {/* Optional centering */}
          <Col md={8}> {/* Adjust width as needed */}
            <MovieView
              movie={selectedMovie}
              onBackClick={() => setSelectedMovie(null)}
            />
          </Col>
        </Row>
      </Container>
    );
  }

  // 2. If user is logged in, show movie list and logout button using Bootstrap layout
  if (user) {
    return (
      <Container> {/* Wrap the main content area */}
        <Row className="my-3 align-items-center"> {/* Add some margin and align items */}
          <Col>
            <h1>My Flix App</h1>
            <p>Logged in as: {user.Username}</p> {/* Display username */}
          </Col>
          <Col xs="auto"> {/* Column shrinks to content width */}
            <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button> {/* Logout button */}
          </Col>
        </Row>
        <hr />
        <Row> {/* Row for the movie list */}
          {movies.length === 0 ? (
            <Col><div>The list is empty!</div></Col> // Message if no movies
          ) : (
            movies.map((movie) => (
              // Each movie gets its own Column. Adjust breakpoints as needed.
              // sm={6}: 2 columns on small screens
              // md={4}: 3 columns on medium screens
              // lg={3}: 4 columns on large screens
              // className="mb-4": Adds margin below each card
              <Col key={movie.id} sm={6} md={4} lg={3} className="mb-4">
                <MovieCard
                  movie={movie}
                  onMovieClick={(newSelectedMovie) => {
                    setSelectedMovie(newSelectedMovie);
                  }}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    );
  }

  // 3. If user is not logged in, show Login or Signup View (wrapped in Container)
  return (
    <Container> {/* Wrap login/signup area */}
      <Row className="justify-content-md-center mt-5"> {/* Center content horizontally, add top margin */}
        <Col md={6}> {/* Limit width of login/signup form area */}
          <h1>Welcome to myFlix!</h1>
          {showSignup ? (
            <>
              <SignupView />
              <Button variant="link" onClick={() => setShowSignup(false)} className="mt-3">
                Already have an account? Log in
              </Button>
            </>
          ) : (
            <>
              <LoginView onLoggedIn={handleLoggedIn} />
              <Button variant="link" onClick={() => setShowSignup(true)} className="mt-3">
                Don't have an account? Sign up
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};