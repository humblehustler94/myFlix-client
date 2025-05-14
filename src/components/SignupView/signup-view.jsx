// src/components/signup-view/signup-view.jsx
import React, { useState } from "react";
// Import React-Bootstrap components
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// Import Link from react-router-dom if you want the "Already have an account?" link here
import { Link } from "react-router-dom";

// Define the component
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
      Birthday: birthday, // Ensure your API expects this format (YYYY-MM-DD)
    };

    try {
      // API call logic using async/await
      // Replace with your actual API endpoint if different
      // Consider passing API_URL as a prop from MainView or using a constant
      const response = await fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response was successful (status code 2xx)
      if (response.ok) {
        alert("Signup successful! Please log in.");
        // Clear the form after successful signup
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");
        // Optional: You can add navigation logic here if you want to
        // automatically navigate to the login page after successful signup.
        // import { useNavigate } from "react-router-dom";
        // const navigate = useNavigate();
        // navigate('/login'); // Uncomment these lines if you want auto-navigation

      } else {
        // If response is not OK, try to get error message from API response body
        // It's better to read as JSON if your API returns JSON errors
        let errorMessage = `Signup failed: Status ${response.status}`;
         try {
             const errorData = await response.json();
             if (errorData.message) {
                 errorMessage = `Signup failed: ${errorData.message}`;
             } else if (errorData.errors && errorData.errors.length > 0) {
                 errorMessage = `Signup failed: ${errorData.errors.map(err => err.msg).join(', ')}`;
             }
         } catch (jsonError) {
             // If JSON parsing fails, fall back to text or generic message
             const errorText = await response.text();
             errorMessage = `Signup failed: ${errorText || response.statusText}`;
         }
        // Throw an error to be caught by the catch block
        throw new Error(errorMessage);
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
      {/* Title removed as it's handled in MainView */}

      {/* Username field */}
      <Form.Group controlId="formUsername">
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
        Submit
      </Button>

    </Form>
  );
};

// Use default export for the component (standard practice)
export default SignupView;