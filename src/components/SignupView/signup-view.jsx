// src/components/signup-view/signup-view.jsx
import React, { useState } from "react";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    // Replace with your actual API endpoint for user registration
    fetch("https://movies-flixx-19a7d58ab0e6.herokuapp.com/users", {
      // <-- !! REPLACE YOUR_API_URL !!
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Signup successful! Please log in.");
          // Optionally clear the form or redirect (though here we just alert)
          setUsername("");
          setPassword("");
          setEmail("");
          setBirthday("");
          // You might want to trigger a switch back to the login view here
          // depending on your UI setup in MainView
        } else {
          response.text().then((text) => {
            // Read response body for details
            throw new Error(`Signup failed: ${text || response.statusText}`);
          });
        }
      })
      .catch((e) => {
        console.error("Signup error:", e);
        alert(`Something went wrong: ${e.message}`);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="5" // Example validation
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="8" // Example validation
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Birthday:
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

// No props needed for this basic version, but you could add one
// e.g., to signal success back to MainView if needed for UI changes.