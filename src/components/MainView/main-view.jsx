// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
// --- Import React-Bootstrap components ---
// Added Form and FormControl for the search input
import { Container, Row, Col, Button, Form, FormControl } from "react-bootstrap";
// ----------------------------------------
// --- Import React-Router-Dom components ---
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
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
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  // New state for the filter query
  const [filter, setFilter] = useState("");


  const handleLoggedIn = (loggedInUser, loggedInToken) => {
    setUser(loggedInUser);
    setToken(loggedInToken);
    // localStorage is handled in LoginView now
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    // Routing handles redirection
  };

  // Function to fetch the latest user data (moved from useEffect for reusability)
  const fetchUserData = async (username, token) => {
    // ... (same as before) ...
    if (!username || !token) return null;

    try {
      const response = await fetch(`${API_URL}users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Session expired while fetching user data. Logging out.");
          handleLogout();
          return null;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user data' }));
        console.error("Error fetching user data:", errorData);
        throw new Error(errorData.message || 'Failed to fetch user data');
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
    // ... (same as before) ...
    if (!user || !token || !user.Username) return;

    try {
      const response = await fetch(`${API_URL}users/${user.Username}/movies/${movieId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Session expired while adding favorite. Logging out.");
          handleLogout();
          return;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to add favorite' }));
        console.error("Error adding favorite:", errorData);
        throw new Error(errorData.message || 'Failed to add favorite');
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log("Movie added to favorites:", movieId);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    // ... (same as before) ...
    if (!user || !token || !user.Username) return;

    try {
      const response = await fetch(`${API_URL}users/${user.Username}/movies/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Session expired while removing favorite. Logging out.");
          handleLogout();
          return;
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to remove favorite' }));
        console.error("Error removing favorite:", errorData);
        throw new Error(errorData.message || 'Failed to remove favorite');
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log("Movie removed from favorites:", movieId);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };


  useEffect(() => {
    // Fetch user data on mount if token and storedUser exist
    if (token && storedUser && storedUser.Username) {
      fetchUserData(storedUser.Username, token); // Fetch latest user data
      // Then fetch movies
      fetch(`${API_URL}movies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              console.warn("Session expired while fetching movies. Logging out.");
              handleLogout();
              return;
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
          if (!e.message.includes("Session expired")) {
            // alert(`Failed to fetch movies: ${e.message}`); // Optional alert
          }
        });
    } else {
      // Clear movies and user state if no token or user
      setMovies([]);
      setUser(null);
      setToken(null);
      localStorage.clear();
    }
  }, [token, storedUser]);

  // Calculate the filtered list of movies whenever 'movies' or 'filter' changes
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );


  return (
    <BrowserRouter>
      {/* Add the NavigationBar component here */}
      {/* Pass the user state and the handleLogout function */}
      <NavigationBar user={user} onLoggedOut={handleLogout} />

      <Container fluid>
        <Row className="justify-content-md-center">
          <Col>
            <Routes>

              {/* Route for Signup */}
              <Route
                path="/signup"
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    // SignupView is now rendered directly by the Route
                    // The Row/Col layout for centering is applied *outside* the component
                    <Row className="justify-content-md-center mt-5">
                      <Col md={6}>
                        {/* Add welcome title here if you want it */}
                        <h1>Welcome to myFlix!</h1>
                        <SignupView />
                        {/* Link back to Login is now inside SignupView */}
                        {/* <Button variant="link" as={Link} to="/login" className="mt-3 d-block text-center">...</Button> */}
                      </Col>
                    </Row>
                  )
                }
              />

              {/* Route for Login */}
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    // LoginView is now rendered directly by the Route
                    // The Row/Col layout for centering is applied *outside* the component
                    <Row className="justify-content-md-center mt-5">
                      <Col md={6}>
                        {/* Add welcome title here if you want it */}
                        <h1>Welcome to myFlix!</h1>
                        <LoginView onLoggedIn={handleLoggedIn} />
                        {/* Link to Signup is now inside LoginView */}
                        {/* <Button variant="link" as={Link} to="/signup" className="mt-3 d-block text-center">...</Button> */}
                      </Col>
                    </Row>
                  )
                }
              />

              {/* Route for Movie Detail */}
              <Route
                path="/movies/:movieId"
                element={
                  !user ? (
                    <Navigate to="/login" replace />
                  ) : movies.length === 0 ? (
                    <Col><p>Loading movie details...</p></Col>
                  ) : (
                    <Row>
                      <Col md={8} lg={9} className="mx-auto">
                        <MovieView
                          movies={movies} // Pass the full movie list
                          user={user}
                          token={token}
                          onAddFavorite={handleAddFavorite}
                          onRemoveFavorite={handleRemoveFavorite}
                        />
                      </Col>
                    </Row>
                  )
                }
              />

              {/* Route for User Profile */}
              <Route
                path="/profile"
                element={
                  !user ? (
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
                  )
                }
              />


              {/* Route for the Home page (Movie List) */}
              <Route
                path="/"
                element={
                  !user ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <> {/* Use fragment to wrap multiple elements */}
                      {/* Row for Search Input */}
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

                      {/* Row for Movie Cards */}
                      <Row>
                        {/* Conditional rendering based on filteredMovies */}
                        {filteredMovies.length === 0 ? (
                          <Col xs={12}>
                            {/* Show "Loading" if movies haven't loaded yet */}
                            {movies.length === 0 ? (
                              <p>Loading movies...</p>
                            ) : filter.length > 0 ? (
                              // Show "No movies found" if filter is active and no results
                              <p>No movies found matching "{filter}"</p>
                            ) : (
                              // This case should ideally not happen if movies.length > 0 and filter is empty
                              <p>No movies available.</p>
                            )}
                          </Col>
                        ) : (
                          // Map and render MovieCards for the filtered list
                          filteredMovies.map((movie) => (
                            <Col key={movie.id} sm={6} md={4} lg={3} className="mb-4">
                              <MovieCard
                                movie={movie}
                                user={user}
                                // token={token} // Not strictly needed if handlers are passed
                                onAddFavorite={handleAddFavorite}
                                onRemoveFavorite={handleRemoveFavorite}
                              />
                            </Col>
                          ))
                        )}
                      </Row>
                    </>
                  )
                }
              />

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