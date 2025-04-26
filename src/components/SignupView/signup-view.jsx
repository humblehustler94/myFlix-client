// src/components/signup-view/signup-view.jsx
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Define the component without exporting it directly here
const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  // Use async/await for cleaner promise handling within handleSubmit
  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior which causes a page reload
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    try {
      // API call logic using async/await
      const response = await fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Signup successful! Please log in.");
        // Clear the form after successful signup
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");
        // Optionally: You might want to trigger a switch back to the login view here
        // depending on your UI setup in MainView (e.g., by calling a prop function)
      } else {
        // If response is not OK, try to get error message from API response body
        const errorText = await response.text(); // Read response body as text
        // Throw an error to be caught by the catch block
        throw new Error(`Signup failed: ${errorText || response.statusText}`);
      }
    } catch (e) {
      // Catch errors from the fetch call (network error) or the thrown error above
      console.error("Signup error:", e);
      // Display a user-friendly error message
      alert(`Something went wrong during signup: ${e.message}`);
    }
  };

  return (
    // Use React-Bootstrap Form component
    <Form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      {/* Username field */}
      <Form.Group controlId="formUsername">
        {/* Removed unnecessary {""} */}
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={5} // Use numeric prop for minLength (HTML5 validation)
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
          minLength={8} // Use numeric prop for minLength (HTML5 validation)
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
          // Add 'required' here if your API mandates the birthday field
          // required
        />
      </Form.Group>

      {/* Submit Button */}
      <Button variant="primary" type="submit" className="mt-3">
        {/* Removed unnecessary {""} */}
        Submit
      </Button>
    </Form>
  );
};

// Use default export for the component (standard practice)
export default SignupView;