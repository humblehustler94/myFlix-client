// src/components/login-view/login-view.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
// Import React-Bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// No longer need useNavigate here, as MainView handles the navigation
// import { useNavigate } from "react-router-dom";

const LoginView = ({ onLoggedIn }) => { // Still receive onLoggedIn prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // We don't need the navigate hook here anymore because
  // MainView's Route logic will automatically navigate to "/"
  // when the user state in MainView becomes non-null after onLoggedIn is called.
  // const navigate = useNavigate();

  const handleSubmit = (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    // Replace with your actual API endpoint if different
    // It's better to pass the API URL from MainView or use a global constant
    // For now, using the hardcoded one from MainView
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Check for specific HTTP error statuses if needed
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Incorrect username or password.");
            }
             if (response.status === 400) {
                throw new Error("Invalid request. Please check your input.");
            }
          // For other errors, try to read the response body for more info
          return response.json().catch(() => {
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user && data.token) {
          // localStorage is handled here as before
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          // Call the callback function passed from MainView
          onLoggedIn(data.user, data.token);
          // MainView will detect the state change and navigate to "/"
          // navigate("/"); // This line is no longer strictly necessary due to MainView's routing logic
        } else {
          // Handle cases where the API might return OK but without user/token
           console.error("Login failed: API response missing user data or token.");
          alert("Login failed: Invalid response from server.");
        }
      })
      .catch((e) => {
        console.error("Login error:", e);
        // Display user-friendly error messages from the thrown errors
        alert(`Login failed: ${e.message}`);
      });
  };

  return (
    // Use React-Bootstrap Form component
    <Form onSubmit={handleSubmit}>
      {/* Title removed as it's handled in MainView */}

      {/* Username Field */}
      <Form.Group controlId="formUsername"> {/* Good practice for accessibility */}
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={6} // Use number for prop value
          placeholder="Enter username" // Optional: improves UX
        />
      </Form.Group>

      {/* Password Field */}
      <Form.Group controlId="formPassword" className="mt-3"> {/* Add margin top */}
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8} // Use number for prop value
          placeholder="Enter password" // Optional: improves UX
        />
      </Form.Group>

      {/* Submit Button */}
      <Button variant="primary" type="submit" className="mt-3"> {/* Add margin top and primary styling */}
        Submit
      </Button>

      {/* The "Don't have an account? Sign up" link is now in MainView */}

    </Form>
  );
};

// Prop type validation remains the same
LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};

export default LoginView;