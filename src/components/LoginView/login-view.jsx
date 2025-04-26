// src/components/login-view/login-view.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

// Import React-Bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    // Replace with your actual API endpoint if different
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle different error statuses if needed
          throw new Error("Login failed. Please check username and password.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user && data.token) {
          // Store user and token in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          // Call the callback function passed from MainView
          onLoggedIn(data.user, data.token);
        } else {
          alert("Login failed: No user data or token returned.");
        }
      })
      .catch((e) => {
        console.error("Login error:", e);
        alert(`Something went wrong: ${e.message}`);
      });
  };

  return (
    // Use React-Bootstrap Form component
    <Form onSubmit={handleSubmit}>
      <h2>Login</h2>

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
    </Form>
  );
};

// Prop type validation remains the same
LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};

export default LoginView;