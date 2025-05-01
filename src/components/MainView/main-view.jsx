// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
//import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
// --- Import React-Bootstrap components ---
import { Container, Row, Col, Button } from "react-bootstrap";
// ----------------------------------------
import MovieCard from "../MovieCard/movie-card";
import MovieView from "../MovieView/movie-view";
import LoginView from "../LoginView/login-view"; // Import LoginView
import SignupView from "../SignupView/signup-view"; // Import SignupView

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
    // LoginView handles setting localStorage
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setSelectedMovie(null); // Also clear selected movie on logout
    localStorage.clear(); // Clear localStorage on logout
  };

  // useEffect hook to fetch movies when the token changes (i.e., after login)
  useEffect(() => {
    if (!token) {
      // Don't fetch movies if there's no token
      setMovies([]); // Clear movies if token is removed (logout)
      return;
    }

    // Fetch movies from your API using the token
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/movies", { // <-- !! ENSURE THIS IS YOUR CORRECT API URL !!
      headers: { Authorization: `Bearer ${token}` }, // Send token in header
    })
      .then((response) => {
        if (!response.ok) {
          // If token is expired or invalid, log out the user
          if (response.status === 401 || response.status === 403) {
            handleLogout();
            // Use alert or a more sophisticated notification system
            alert("Session expired or invalid. Please log in again.");
            throw new Error("Unauthorized access"); // Throw to stop processing
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Process and set movie data
        const moviesFromApi = data.map((movie) => ({
          // Adapt this mapping based on your API response structure
          id: movie._id,
          title: movie.Title,
          image: movie.ImagePath,
          description: movie.Description,
          genre: movie.Genre?.Name, // Use optional chaining for safety
          director: movie.Director?.Name, // Use optional chaining for safety
          // Add any other fields needed by MovieCard/MovieView
        }));
        setMovies(moviesFromApi);
      })
      .catch((e) => {
        // Avoid alerting for the handled unauthorized case
        if (e.message !== "Unauthorized access") {
          console.error("Fetching movies error: ", e);
          alert(`Failed to fetch movies: ${e.message}`);
        }
      });
  }, [token]); // Re-run this effect when the token changes

  // --- Main Render Logic ---
  return (
    <Container fluid> {/* Use fluid container for full width, or standard Container */}
      {/* THE SINGLE TOP-LEVEL ROW */}
      <Row className="justify-content-md-center">
        {/* A Single Column that spans the full width (or adjust breakpoints if needed) */}
        {/* All conditional content will be rendered inside this Column */}
        <Col>
          {/* --- Conditional Rendering Logic Placed Inside the Column --- */}

          {/* 1. If user is NOT logged in, show Login or Signup View */}
          {!user ? (
            // Use a nested Row/Col structure for centering the login/signup forms
            <Row className="justify-content-md-center mt-5">
              <Col md={6}> {/* Limit width of login/signup form area */}
                <h1>Welcome to myFlix!</h1>
                {showSignup ? (
                  <>
                    <SignupView />
                    <Button variant="link" onClick={() => setShowSignup(false)} className="mt-3 d-block text-center">
                      Already have an account? Log in
                    </Button>
                  </>
                ) : (
                  <>
                    <LoginView onLoggedIn={handleLoggedIn} />
                    <Button variant="link" onClick={() => setShowSignup(true)} className="mt-3 d-block text-center">
                      Don't have an account? Sign up
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          ) : /* 2. If user IS logged in */ (
            <>
              {/* Header Row (Nested inside the main Col) */}
              <Row className="my-3 align-items-center border-bottom pb-3 mb-4">
                <Col>
                  <h1>My Flix App</h1>
                  {user && <p className="mb-0">Logged in as: {user.Username}</p>}
                </Col>
                <Col xs="auto">
                  <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
                </Col>
              </Row>

              {/* Content Row (Nested inside the main Col) */}
              <Row>
                {selectedMovie ? (
                  /* 2a. If a movie is selected, show MovieView */
                  // Centering MovieView within the remaining space
                  <Col md={8} lg={9} className="mx-auto"> {/* Use mx-auto for centering */}
                    <MovieView
                      movie={selectedMovie}
                      onBackClick={() => setSelectedMovie(null)}
                    />
                  </Col>
                ) : (
                  /* 2b. If no movie is selected, show movie list */
                  <> {/* Use Fragment because movies.map returns multiple Cols */}
                    {movies.length === 0 ? (
                      <Col><p>Loading movies or the list is empty...</p></Col> // Message if no movies
                    ) : (
                      movies.map((movie) => (
                        // Each movie gets its own Column. Adjust breakpoints as needed.
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
                  </>
                )}
              </Row> {/* End of Content Row */}
            </>
          )}
        </Col> {/* End of the Single Top-Level Column */}
      </Row> {/* End of the Single Top-Level Row */}
    </Container>
  );
};

// Optional: Export default if this is the primary export
export default MainView;