// src/components/ProfileView/profile-view.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Assuming you will display favorite movies using MovieCard
import MovieCard from "../MovieCard/movie-card";

// Define your API URL (could also import from a config file or MainView)
const API_URL = "https://movies-flixx-19a7d58ab0e6.herokuapp.com/"; // <-- !! ENSURE THIS IS YOUR CORRECT API URL !!


const ProfileView = ({ user, token, movies, setUser, onLoggedOut, onRemoveFavorite }) => {
    const [username, setUsername] = useState(user?.Username || "");
    const [password, setPassword] = useState(""); // Don't pre-fill password
    const [email, setEmail] = useState(user?.Email || "");
    const [birthday, setBirthday] = useState(user?.Birthday ? user.Birthday.substring(0, 10) : ""); // Format date for input type="date"

    const navigate = useNavigate(); // Get navigate function

    // useEffect to update form state if user prop changes (e.g., after a favorite is added elsewhere)
    useEffect(() => {
        if (user) {
            setUsername(user.Username || "");
            setEmail(user.Email || "");
            // Format birthday for date input, handle null/undefined
            setBirthday(user.Birthday ? user.Birthday.substring(0, 10) : "");
            // Do NOT update password state here
        }
    }, [user]);


    // Filter movies to get only the user's favorites
    // Ensure user and user.FavoriteMovies exist and movies array exists
    const favoriteMovies = user && user.FavoriteMovies && movies
        ? movies.filter(m => user.FavoriteMovies.includes(m.id))
        : [];

    // Handle form submission for updating user info
    const handleUpdate = async (event) => {
        event.preventDefault();

        const data = {
            Username: username,
            Password: password, // Only send if password field is not empty
            Email: email,
            Birthday: birthday,
        };

        // Remove password from data if it's empty
        if (password === "") {
            delete data.Password;
        }

        try {
            const response = await fetch(`${API_URL}users/${user.Username}`, { // Update endpoint
                method: "PUT", // Use PUT for updating
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send token
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update profile' }));
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedUser = await response.json();
            localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage
            setUser(updatedUser); // Update state in MainView

            alert("Profile updated successfully!");
            setPassword(""); // Clear password field after successful update

        } catch (error) {
            console.error("Profile update error:", error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    // Handle user deregistration
    const handleDeregister = async () => {
        if (!user || !user.Username || !token) return;

        // Ask for user confirmation
        const confirmDeregister = window.confirm("Are you sure you want to deregister your account?");
        if (!confirmDeregister) {
            return; // Stop if user cancels
        }

        try {
            const response = await fetch(`${API_URL}users/${user.Username}`, { // Deregister endpoint
                method: "DELETE", // Use DELETE for deregistration
                headers: {
                    Authorization: `Bearer ${token}`, // Send token
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to deregister' }));
                throw new Error(errorData.message || 'Failed to deregister');
            }

            // If successful, log the user out and redirect to home/login
            onLoggedOut();
            alert("Your account has been successfully deregistered.");
            // Navigate to home or login after logout
            navigate("/"); // Or navigate("/login") if you prefer

        } catch (error) {
            console.error("Deregistration error:", error);
            alert(`Failed to deregister: ${error.message}`);
        }
    };

    // Handle removing a favorite movie from the profile view
    // This function calls the onRemoveFavorite prop which lives in MainView
    const handleRemoveFav = (movieId) => {
        if (onRemoveFavorite) {
            onRemoveFavorite(movieId);
        }
    };


    // If user object is not available (shouldn't happen due to route protection, but good practice)
    if (!user) {
        return <Col>Loading user data...</Col>; // Or redirect, though route handles this
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={8} lg={6}> {/* Adjust column size for layout */}
                    <h2 className="mt-4 mb-4 text-center">Profile</h2>

                    {/* Display Current User Info */}
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Your Information</Card.Title>
                            <p><strong>Username:</strong> {user.Username}</p>
                            <p><strong>Email:</strong> {user.Email}</p>
                            <p><strong>Birthday:</strong> {user.Birthday ? new Date(user.Birthday).toLocaleDateString() : 'N/A'}</p>
                            {/* Display registration date if available */}
                            {user.RegistrationDate && <p><strong>Member Since:</strong> {new Date(user.RegistrationDate).toLocaleDateString()}</p>}
                        </Card.Body>
                    </Card>

                    {/* Update Profile Form */}
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Update Your Information</Card.Title>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group controlId="formUpdateUsername" className="mb-3">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        minLength={5}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formUpdatePassword" className="mb-3">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={8} // Required applies only if filling the field
                                        placeholder="Leave blank to keep current password"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formUpdateEmail" className="mb-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formUpdateBirthday" className="mb-3">
                                    <Form.Label>Birthday:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                    // Add 'required' if your API mandates it
                                    // required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="mt-3">
                                    Update Profile
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Favorite Movies Section */}
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Favorite Movies</Card.Title>
                            {favoriteMovies.length === 0 ? (
                                <p>You haven't added any movies to your favorites yet.</p>
                            ) : (
                                <Row> {/* Use a Row for the grid of favorite movie cards */}
                                    {favoriteMovies.map((movie) => (
                                        <Col key={movie.id} xs={12} sm={6} md={4} className="mb-4">
                                            {/* You can render MovieCard here, but the remove button should be in ProfileView */}
                                            {/* because ProfileView has the logic to update the display list after removal. */}
                                            <Card> {/* Basic card for favorite movie in profile */}
                                                {/* Optional: Link to movie view */}
                                                {/* <Link to={`/movies/${movie.id}`}> */}
                                                <Card.Img
                                                    variant="top"
                                                    src={movie.image}
                                                    alt={movie.title}
                                                    style={{ objectFit: 'cover', height: '200px' }}
                                                />
                                                <Card.Body>
                                                    <Card.Title style={{ fontSize: '1rem' }}>{movie.title}</Card.Title>
                                                    {/* </Link> */} {/* Close Link */}
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveFav(movie.id)} // Call local handler
                                                        className="mt-2"
                                                    >
                                                        Remove
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Card.Body>
                    </Card>


                    {/* Deregister Account Button */}
                    <Row className="justify-content-md-center mb-4">
                        <Col xs="auto"> {/* Use auto to fit content width */}
                            <Button variant="danger" onClick={handleDeregister}>
                                Deregister Account
                            </Button>
                        </Col>
                    </Row>

                </Col> {/* End main Col */}
            </Row> {/* End main Row */}
        </Container>
    );
};

ProfileView.propTypes = {
    user: PropTypes.shape({
        Username: PropTypes.string.isRequired,
        Email: PropTypes.string.isRequired,
        Birthday: PropTypes.string, // Optional field
        FavoriteMovies: PropTypes.array, // Optional field, default to empty array
        RegistrationDate: PropTypes.string, // Optional
    }).isRequired,
    token: PropTypes.string.isRequired,
    movies: PropTypes.array.isRequired, // Expect the full movies array
    setUser: PropTypes.func.isRequired, // Function to update user state in MainView
    onLoggedOut: PropTypes.func.isRequired, // Function to log out from MainView
    onRemoveFavorite: PropTypes.func.isRequired, // Function to remove favorite via API in MainView
    // Note: onAddFavorite is not needed IN ProfileView itself,
    // but might be needed if you render full MovieCards with Add buttons here.
    // Using a simple Remove button next to a mini-card is simpler.
};


export default ProfileView;
