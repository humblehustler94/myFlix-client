// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
// --- Import React-Bootstrap components ---
import { Container, Row, Col, Button, Form, FormControl } from "react-bootstrap";
// ----------------------------------------
// --- Import React-Router-Dom components ---
import { BrowserRouter, Routes, Route, Navigate, Link, useParams } from "react-router-dom"; // Added useParams here
// ----------------------------------------

// --- Import View Components ---
import MovieCard from "../MovieCard/movie-card";
import MovieView from "../MovieView/movie-view";
import LoginView from "../LoginView/login-view";
import SignupView from "../SignupView/signup-view";
import ProfileView from "../ProfileView/profile-view";
// Import the NavigationBar component
import NavigationBar from "../NavigationBar/navigation-bar";
// ----------------------------------------

// Define your API URL
const API_URL = "https://movies-flixx-19a7d58ab0e6.herokuapp.com/";


export const MainView = () => {
  // Get user and token from localStorage on initial load
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(storedUser || null); // Simplified initial state check
  const [token, setToken] = useState(storedToken || null); // Simplified initial state check
  const [filter, setFilter] = useState("");

  // Refactored: Removed 'async' keyword as these functions don't use await
  const handleLoggedIn = (loggedInUser, loggedInToken) => {
    setUser(loggedInUser);
    setToken(loggedInToken);
    // localStorage handled in LoginView
  };

  // Refactored: Removed 'async' keyword as this function doesn't use await
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    // Routing handles redirection
  };

  // Function to fetch the latest user data
  const fetchUserData = async (username, token) => {
    if (!username || !token) return null;

    try {
      const response = await fetch(`${API_URL}users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Session expired while fetching user data. Logging out.");
          handleLogout(); // Log out if session expired
          return null;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error data' })); // Catch JSON parse error too
        console.error("Error fetching user data:", response.status, errorData); // Include status
        throw new Error(errorData.message || `Failed to fetch user data (status ${response.status})`); // Better error message
      }

      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };


  const handleAddFavorite = async (movieId) => {
    if (!user || !token || !user.Username) return;

    try {
      const response = await fetch(`${API_URL}users/${user.Username}/movies/${movieId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Session expired while adding favorite. Logging out.");
          handleLogout(); // Log out if session expired
          return;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error data' })); // Catch JSON parse error
        console.error("Error adding favorite:", response.status, errorData);
        throw new Error(errorData.message || `Failed to add favorite (status ${response.status})`);
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser); // Update user state with new favorites list
      console.log("Movie added to favorites:", movieId);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    if (!user || !token || !user.Username) return;

    try {
      const response = await fetch(`${API_URL}users/${user.Username}/movies/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Session expired while removing favorite. Logging out.");
          handleLogout(); // Log out if session expired
          return;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error data' })); // Catch JSON parse error
        console.error("Error removing favorite:", response.status, errorData);
        throw new Error(errorData.message || `Failed to remove favorite (status ${response.status})`);
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser); // Update user state with new favorites list
      console.log("Movie removed from favorites:", movieId);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };


  useEffect(() => {
    // Fetch movies only if token exists AND movies array is empty
    // This prevents refetching movies unnecessarily
    if (token && movies.length === 0) {
      fetch(`${API_URL}movies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              console.warn("Session expired while fetching movies. Logging out.");
              handleLogout(); // Log out if session expired
              return; // Stop processing if logged out
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const moviesFromApi = data.map((movie) => ({
            id: movie._id,
            title: movie.Title,
            image: movie.ImagePath,
            description: movie.Description,
            genre: movie.Genre?.Name,
            director: movie.Director?.Name,
          }));
          setMovies(moviesFromApi);
        })
        .catch((e) => {
          console.error("Fetching movies error: ", e);
          // No need for alert here, the UI should handle empty state
        });
    }

    // Fetch user data initially or if token/user changes
    // Also fetches on mount if token/user exists
    if (token && storedUser && storedUser.Username && !user) { // Only fetch if token & storedUser exist, and user state is not yet set
      fetchUserData(storedUser.Username, token);
    }


  }, [token, storedUser, movies.length]); // Add movies.length to dependency array to prevent infinite loop,
  // and storedUser to re-fetch if user is restored from storage


  // Calculate the filtered list of movies
  // This calculation is clean and should not cause build errors
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );


  // --- Helper Functions for Rendering Routes ---
  // These functions encapsulate the conditional rendering logic
  // This makes the main return block cleaner
  const RenderLoginPage = () => {
    return user ? (
      <Navigate to="/" replace />
    ) : (
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h1>Welcome to myFlix!</h1>
          <LoginView onLoggedIn={handleLoggedIn} />
        </Col>
      </Row>
    );
  };

  const RenderSignupPage = () => {
    return user ? (
      <Navigate to="/" replace />
    ) : (
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h1>Welcome to myFlix!</h1>
          <SignupView />
        </Col>
      </Row>
    );
  };

  const RenderMovieDetailPage = () => {
    const { movieId } = useParams(); // Get ID inside the render function scope

    // Find the movie (ensure movies is available)
    const movie = movies.find((m) => m.id === movieId);

    if (!user) {
      return <Navigate to="/login" replace />;
    } else if (movies.length === 0) {
      return <Col><p>Loading movie details...</p></Col>; // Still loading movies
    } else if (!movie) {
      return <Col><p>Movie not found.</p></Col>; // Movie not found in the fetched list
    } else {
      return (
        <Row>
          <Col md={8} lg={9} className="mx-auto">
            <MovieView
              movie={movie} // Pass the specific movie object instead of the whole list
              user={user}
              token={token} // Keep token here if MovieView needs it directly for fetches
              onAddFavorite={handleAddFavorite}
              onRemoveFavorite={handleRemoveFavorite}
              movies={movies} // Still pass the full list for "similar movies" logic inside MovieView
            />
          </Col>
        </Row>
      );
    }
  };

  const RenderProfilePage = () => {
    return !user ? (
      <Navigate to="/login" replace />
    ) : (
      <Row>
        <Col md={8} lg={9} className="mx-auto">
          <ProfileView
            user={user}
            token={token}
            movies={movies} // Pass the full movie list to profile
            setUser={setUser}
            onLoggedOut={handleLogout}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </Col>
      </Row>
    );
  };

  const RenderHomePage = () => {
    return !user ? (
      <Navigate to="/login" replace />
    ) : (
      <>
        <Row className="justify-content-md-center mb-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Control
              type="text"
              placeholder="Search movies by title..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Col>
        </Row>

        <Row>
          {filteredMovies.length === 0 ? (
            <Col xs={12}>
              {movies.length === 0 ? (
                <p>Loading movies...</p>
              ) : filter.length > 0 ? (
                <p>No movies found matching "{filter}"</p>
              ) : (
                <p>No movies available.</p> // Should not happen if movies.length > 0 and filter is empty
              )}
            </Col>
          ) : (
            filteredMovies.map((movie) => (
              <Col key={movie.id} sm={6} md={4} lg={3} className="mb-4">
                <MovieCard
                  movie={movie}
                  user={user}
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              </Col>
            ))
          )}
        </Row>
      </>
    );
  };
  // --- End Helper Functions ---


  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={handleLogout} />

      <Container fluid>
        <Row className="justify-content-md-center">
          <Col>
            <Routes>
              {/* Use the helper functions in the element prop */}
              <Route path="/signup" element={<RenderSignupPage />} />
              <Route path="/login" element={<RenderLoginPage />} />
              <Route path="/movies/:movieId" element={<RenderMovieDetailPage />} />
              <Route path="/profile" element={<RenderProfilePage />} />
              <Route path="/" element={<RenderHomePage />} />

              {/* Optional: Catch-all Route for 404 Not Found */}
              {/* <Route path="*" element={<Col><p>Page Not Found</p></Col>} /> */}
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
};

export default MainView;