// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
// --- Import React-Bootstrap components ---
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

// Define your API URL (--- CHANGE 1: Removed trailing slash for robust pathing ---)
const API_URL = "https://movies-flixx-19a7d58ab0e6.herokuapp.com";


export const MainView = () => {
  // Get user and token from localStorage on initial load
  const storedToken = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user")); 

  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  // New state for the filter query
  const [filter, setFilter] = useState("");


  const handleLoggedIn = (loggedInUser, loggedInToken) => {
    setUser(loggedInUser);
    setToken(loggedInToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // Function to fetch the latest user data (moved from useEffect for reusability)
  const fetchUserData = async (username, token) => {
    if (!username || !token) return null;

    try {
      const response = await fetch(`${API_URL}/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          return null;
        }
        throw new Error('Failed to fetch user data');
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
      const response = await fetch(`${API_URL}/users/${user.Username}/movies/${movieId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    if (!user || !token || !user.Username) return;

    try {
      const response = await fetch(`${API_URL}/users/${user.Username}/movies/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      setMovies([]);
      setUser(null);
      return;
    }

    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userFromStorage && userFromStorage.Username) {
        fetchUserData(userFromStorage.Username, token);
    }
    
    fetch(`${API_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            handleLogout();
            return null;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          // --- CHANGE 2: THIS IS THE CORRECTED IMAGE PATH LOGIC ---
          const moviesFromApi = data.map((movie) => {
            // Remove the "public/" prefix from the ImagePath string if it exists
            const imagePath = movie.ImagePath.startsWith('public/')
              ? movie.ImagePath.slice(7) // slice(7) removes 'public/'
              : movie.ImagePath;

            return {
              id: movie._id,
              title: movie.Title,
              // Construct the URL with the corrected path
              image: `${API_URL}/${imagePath}`, 
              description: movie.Description,
              genre: movie.Genre?.Name,
              director: movie.Director?.Name,
            };
          });
          setMovies(moviesFromApi);
        }
      })
      .catch((e) => {
        console.error("Fetching movies error: ", e);
      });

  }, [token]);


  // Calculate the filtered list of movies
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );


  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={handleLogout} />

      <Container fluid className="my-4">
        <Row className="justify-content-md-center">
          <Col>
            <Routes>
              {/* Route for Signup */}
              <Route
                path="/signup"
                element={
                  user ? <Navigate to="/" /> : (
                    <Row className="justify-content-md-center mt-5"><Col md={6}>
                        <h1>Welcome to myFlix!</h1><SignupView />
                    </Col></Row>
                  )
                }
              />

              {/* Route for Login */}
              <Route
                path="/login"
                element={
                  user ? <Navigate to="/" /> : (
                    <Row className="justify-content-md-center mt-5"><Col md={6}>
                        <h1>Welcome to myFlix!</h1><LoginView onLoggedIn={handleLoggedIn} />
                    </Col></Row>
                  )
                }
              />

              {/* Route for Movie Detail */}
              <Route
                path="/movies/:movieId"
                element={
                  !user ? <Navigate to="/login" replace /> : movies.length === 0 ? (
                    <Col><p>Loading movie details...</p></Col>
                  ) : (
                    <MovieView
                      movies={movies}
                      user={user}
                      onAddFavorite={handleAddFavorite}
                      onRemoveFavorite={handleRemoveFavorite}
                    />
                  )
                }
              />

              {/* Route for User Profile */}
              <Route
                path="/profile"
                element={
                  !user ? <Navigate to="/login" replace /> : (
                    <ProfileView
                      user={user}
                      movies={movies}
                      setUser={setUser}
                      onLoggedOut={handleLogout}
                      onRemoveFavorite={handleRemoveFavorite}
                    />
                  )
                }
              />

              {/* Route for the Home page (Movie List) */}
              <Route
                path="/"
                element={
                  !user ? <Navigate to="/login" replace /> : (
                    <>
                      {/* Search Input */}
                      <Row className="justify-content-center mb-4">
                        <Col xs={12} md={6}>
                          <Form.Control
                            type="text"
                            placeholder="Search movies by title..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                          />
                        </Col>
                      </Row>

                      {/* Movie Cards */}
                      <Row>
                        {filteredMovies.length === 0 ? (
                          <Col><p>No movies found.</p></Col>
                        ) : (
                          filteredMovies.map((movie) => (
                            <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
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
                  )
                }
              />
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
};

export default MainView;