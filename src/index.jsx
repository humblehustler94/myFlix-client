import React from "react";
import { createRoot } from "react-dom/client";
import  MainView  from "./components/MainView/main-view"; // Import MainView

import Container from "react-bootstrap/Container"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss"; // Import styles

// Main component renders MainView
const MyFlixApplication = () => {
    return (
        <Container className="my-flix">
            <MainView />
        </Container>
    );
};

// Finds the root of your app!
const container = document.querySelector("#root");

if (container) {
    const root = createRoot(container);
    // Render the app in the root DOM element
    root.render(<MyFlixApplication />);
} else {
    console.error("Root element not found. Make sure index.html has a <div id='root'></div>.");
}
