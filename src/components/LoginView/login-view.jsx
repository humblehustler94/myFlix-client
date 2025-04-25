// Create new component folder LoginView and create the following file login-view.jsx add the following code 
// src/components/login-view/login-view.jsx
import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

// Import React-Bootstrap components
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    // Replace with your actual API endpoint
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/login", {
      // <-- !! REPLACE YOUR_API_URL !!
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


  // Use React-Bootstrap Form components
  return (
    <Form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {/*Username Input Group*/}
      <Form.Group controlId="formUsername">
        {""}
        {/*controlId links Label to Control for accessibility */}
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="6" // Basic validation
          placeholder="Enter username"
        />
      </Form.Group>
      <br />
      {/*Password Input Group*/}
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="8"
          placeholder="Enter password"
        />
      </Form.Group>

      <br />
      {/*Submit Button*/}
      <Button variant="primary" type="submit" style={{ marginTop: "1rem" }}>
        {""}
        {/*Added some margin-top*/}
        Submit

      </Button>
    </Form>
  );
};

// Prop type validation
LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};
