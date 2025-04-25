// src/components/signup-view/signup-view.jsx
import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    // Prevent the default form submission behavior which causes a page reload
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    // Replace with your actual API endpoint for user registration
    // API call logic remains the same
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/users", {
      // <-- !! REPLACE YOUR_API_URL !!
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // Use async to easily get text body or error
        if (response.ok) {
          alert("Signup successful! Please log in.");
          // Optionally clear the form or redirect (though here we just alert)
          // Clear form
          setUsername("");
          setPassword("");
          setEmail("");
          setBirthday("");
          // You might want to trigger a switch back to the login view here
          // depending on your UI setup in MainView
        } else {
          response.text().then((text) => {
            // Read response body for details
            // Try to get more specific error message from the API response body.
            const errorText = await response.text();
            throw new Error(`Signup failed: ${text || response.statusText}`);
          });
        }
      })
      .catch((e) => {
        console.error("Signup error:", e);
        // Display a more user-friendly error from the catch block
        alert(`Something went wrong during signup: ${e.message}`);
      });
  };

  return (
    // Use React-Bootstrap From component
    <Form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      {/*Username field*/}
      <Form.Group controlId="formUsername">
        {""}
        {/*Group label and input*/}
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={5} // Use numeric prop for minLength
          placeholder="Enter username (min 5 characters)"
        />
      </Form.Group>

      {/* Password Field */}
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8} // Use numeric prop for minLength
          placeholder="Enter password (min 8 characters)"
        />
      </Form.Group>

      {/* Email Field */}
      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      {/* Birthday Field */}
      <Form.Group controlId="formBirthday">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </Form.Group>

      {/* Submit Button */}
      <Button variant="primary" type="submit" className="mt-3">
        {" "}
        {/* Added margin-top */}
        Submit
      </Button>
    </Form>
  );
};

// No props needed for this basic version, but you could add one
// e.g., to signal success back to MainView if needed for UI changes.