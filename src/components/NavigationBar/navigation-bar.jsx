// src/components/navigation-bar/navigation-bar.jsx
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link for navigation
import PropTypes from "prop-types"; // Import PropTypes

// Define the NavigationBar component
// It receives the user object and the onLoggedOut handler as props
export const NavigationBar = ({ user, onLoggedOut }) => {
  return (
    // Use React-Bootstrap's Navbar component
    <Navbar bg="light" expand="lg" className="mb-4"> {/* Add margin-bottom for spacing */}
      <Container fluid> {/* Use fluid container for full width */}
        {/* Brand/Title - Link to Home */}
        {/* Use as={Link} to="/" to integrate with react-router-dom */}
        <Navbar.Brand as={Link} to="/">
          My Flix App
        </Navbar.Brand>

        {/* Toggler for responsive collapse */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Collapse */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"> {/* me-auto pushes content to the right */}
            {/* Conditional rendering based on authentication state */}
            {user ? (
              // Render these links if user is logged in
              <>
                {/* Link to Home (Movie List) */}
                {/* Use Nav.Link as={Link} to="..." for proper styling */}
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>

                {/* Link to Profile */}
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>

                {/* Logout Link/Button */}
                {/* This will likely just trigger the logout handler,
                    MainView's routing will then handle redirection to login */}
                <Nav.Link onClick={onLoggedOut}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              // Render these links if user is NOT logged in
              <>
                {/* Link to Login */}
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>

                {/* Link to Signup */}
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Optional: Display logged-in username */}
          {user && (
             <Nav> {/* Use another Nav for right-aligned items */}
               <Nav.Link disabled> {/* Use disabled to make it non-clickable */}
                 Logged in as: {user.Username}
               </Nav.Link>
             </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// PropTypes for validation
NavigationBar.propTypes = {
  // user is an object if logged in, or null
  user: PropTypes.shape({
      Username: PropTypes.string,
      // Include other user properties you might use, e.g., FavoriteMovies
      FavoriteMovies: PropTypes.arrayOf(PropTypes.string)
  }),
  onLoggedOut: PropTypes.func.isRequired, // Function to handle logout
};

export default NavigationBar;