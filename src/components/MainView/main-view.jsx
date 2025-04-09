// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
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

  // 1. If a movie is selected, show MovieView
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  // 2. If user is logged in, show movie list and logout button
  if (user) {
    // Check if user object exists
    return (
      <div>
        <h1>My Flix App</h1>
        <p>Logged in as: {user.Username}</p> {/* Display username */}
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        <hr />
        {movies.length === 0 ? (
          <div>The list is empty!</div>
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onMovieClick={(newSelectedMovie) => {
                setSelectedMovie(newSelectedMovie);
              }}
            />
          ))
        )}
      </div>
    );
  }

  // 3. If user is not logged in, show Login or Signup View
  // Use the showSignup state to toggle between Login and Signup
  return (
    <div>
      <h1>Welcome to myFlix!</h1>
      {showSignup ? (
        <>
          <SignupView />
          <button onClick={() => setShowSignup(false)}>
            Already have an account? Log in
          </button>
        </>
      ) : (
        <>
          <LoginView onLoggedIn={handleLoggedIn} />
          <button onClick={() => setShowSignup(true)}>
            Don't have an account? Sign up
          </button>
        </>
      )}
    </div>
  );
};
