# 🚀 myFlix-client

<div align="center">

![myFlix Logo](https://raw.githubusercontent.com/humblehustler94/myFlix-client/main/MainView%20to%20myFlix.png) <!-- Using a prominent screenshot as a de-facto logo/banner -->

[![GitHub stars](https://img.shields.io/github/stars/humblehustler94/myFlix-client?style=for-the-badge)](https://github.com/humblehustler94/myFlix-client/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/humblehustler94/myFlix-client?style=for-the-badge)](https://github.com/humblehustler94/myFlix-client/network)
[![GitHub issues](https://img.shields.io/github/issues/humblehustler94/myFlix-client?style=for-the-badge)](https://github.com/humblehustler94/myFlix-client/issues)
[![GitHub license](https://img.shields.io/github/license/humblehustler94/myFlix-client?style=for-the-badge)](LICENSE)

**A dynamic, responsive client for the myFlix movie database, offering personalized film browsing and user management.**

[Live Demo](https://my-flix-client-3sc4skagx-itzel-elizabeth-flores-projects.vercel.app/)

</div>

## 📖 Overview

The `myFlix-client` is the front-end application for the myFlix movie platform, providing users with an intuitive interface to discover, explore, and manage their movie preferences. Built as a single-page application (SPA), it seamlessly interacts with a RESTful myFlix API to fetch movie data, handle user authentication, and personalize content. This client-side application is designed for a modern web experience, focusing on usability and responsiveness across various devices.

## ✨ Features

-   🎯 **User Authentication:** Secure user registration and login functionalities.
-   🎬 **Movie Catalog Browsing:** View a comprehensive list of movies available in the database.
-   🔍 **Detailed Movie Views:** Access in-depth information for individual movies, including director, genre, and description.
-   ⭐ **Favorite Movies Management:** Users can add or remove movies from their personalized list of favorites.
-   👤 **User Profile Management:** Update personal information, change passwords, and manage favorite movies from a dedicated profile page.
-   📱 **Responsive Design:** Optimized layout and functionality for both desktop and mobile viewing experiences.
-   🗺️ **Dynamic Routing:** Seamless navigation between different application views (login, signup, main catalog, movie details, profile).

## 🖥️ Screenshots

| Login View | Sign Up View | Main Movie Catalog |
|---|---|---|
| ![Login View](https://raw.githubusercontent.com/humblehustler94/myFlix-client/main/LoginView%20to%20myFlix.png) | ![Signup View](https://raw.githubusercontent.com/humblehustler94/myFlix-client/main/SignupView%20to%20myFlix.png) | ![Main View](https://raw.githubusercontent.com/humblehustler94/myFlix-client/main/MainView%20to%20myFlix.png) |

| Detailed Movie View | User Profile View |
|---|---|
| ![Movie View](https://raw.githubusercontent.com/humblehustler94/myFlix-client/main/movieview.png) | ![Profile View](https://raw.githubusercontent.com/humblehustler94/myFlix-client/main/ProfileView%20to%20myFlix.png) |

## 🛠️ Tech Stack

**Frontend:**
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/en/main)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Prop-Types](https://img.shields.io/badge/Prop--Types-007ACC?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/prop-types)
[![Redux (inferred for state management)](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)

**Backend:**
This repository contains only the client-side code. It communicates with an external myFlix API.

**DevOps:**
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Netlify (optional)](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

## 🚀 Quick Start

Follow these steps to get the myFlix-client application up and running on your local machine.

### Prerequisites
-   **Node.js**: The project requires Node.js (version 18.x.x, as indicated in `.nvmrc`).
    -   It is recommended to use `nvm` (Node Version Manager) to manage Node.js versions:
        ```bash
        nvm install 18.17.1 # Or the version specified in .nvmrc
        nvm use 18.17.1
        ```
-   **npm**: Node Package Manager, which comes with Node.js.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/humblehustler94/myFlix-client.git
    cd myFlix-client
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment setup**
    This application requires an external API to function. You will need to configure the API URL as an environment variable. While no `.env.example` is provided, a common practice is to create a `.env` file in the project root:
    ```bash
    # Create .env in the root directory
    touch .env
    ```
    Then add the API URL to it:
    ```
    # .env
    REACT_APP_API_URL=YOUR_MYFLIX_API_URL_HERE
    ```
    Replace `YOUR_MYFLIX_API_URL_HERE` with the actual URL of your myFlix backend API.

4.  **Start development server**
    ```bash
    npm start
    ```

5.  **Open your browser**
    Visit `http://localhost:3000` to view the application.

## 📁 Project Structure

```
myFlix-client/
├── public/                 # Static assets (e.g., index.html)
├── src/                    # Main application source code
│   ├── components/         # Reusable React components (e.g., MovieCard, Navbar)
│   ├── views/              # Main application views/pages (e.g., LoginView, MainView, ProfileView)
│   ├── store/              # State management related files (if using Redux or similar)
│   ├── styles/             # Global or component-specific SCSS styling
│   ├── utils/              # Utility functions and helper modules
│   ├── App.jsx             # Main application component
│   └── index.js            # Application entry point
├── dist/                   # Output directory for production builds
├── .gitattributes          # Git configuration for attribute settings
├── .gitignore              # Files and directories ignored by Git
├── .nvmrc                  # Node Version Manager configuration
├── netlify.toml            # Netlify deployment configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # npm dependency lock file
└── README.md               # Project documentation
└── [Various .png files]    # Project screenshots and documentation images
```

## ⚙️ Configuration

### Environment Variables
The application relies on environment variables for configuration. These are typically provided via a `.env` file in development or directly in the deployment environment.

| Variable          | Description                                    | Default   | Required |
|-------------------|------------------------------------------------|-----------|----------|
| `REACT_APP_API_URL` | The base URL of the myFlix backend API service | `N/A`     | Yes      |

### Configuration Files
-   `netlify.toml`: Configures deployment settings for Netlify, including build commands and publish directories.

## 🔧 Development

### Available Scripts
In the project directory, you can run:

| Command           | Description                                                        |
|-------------------|--------------------------------------------------------------------|
| `npm start`       | Runs the app in development mode. Opens `http://localhost:3000`. |
| `npm run build`   | Builds the app for production to the `dist` folder.                 |
| `npm test`        | Launches the test runner (if configured).                          |

### Development Workflow
Changes made to the source files (e.g., in `src/`) will be automatically reloaded by the development server. Linting warnings and build errors will be shown in the console.

## 🧪 Testing

This project is configured to use a standard React testing setup, likely powered by Jest and React Testing Library (inferred from common React project setups).

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```
*(Please refer to the `package.json` scripts for exact testing commands if they differ from standard `react-scripts` defaults.)*

## 🚀 Deployment

The `myFlix-client` application is designed for easy deployment to modern hosting platforms.

### Production Build
To create an optimized production build:
```bash
npm run build
```
This command bundles React in production mode and optimizes the build for the best performance. The build artifacts will be placed in the `dist/` directory.

### Deployment Options
-   **Vercel:** As indicated by the live demo link, this project is compatible with Vercel. You can connect your GitHub repository to Vercel for automatic deployments.
-   **Netlify:** A `netlify.toml` file is present, suggesting support for Netlify deployments. Simply connect your GitHub repository to Netlify, and it will use the configuration provided to build and deploy your application.

## 📚 API Reference

This client application consumes an external RESTful API, referred to as the "myFlix API". Details regarding the API endpoints, data models, and authentication mechanisms should be sought in the documentation of the myFlix backend project. This client primarily uses standard HTTP methods (GET, POST, PUT, DELETE) to interact with these endpoints.

## 🤝 Contributing

We welcome contributions to the myFlix-client project! Please consider the following guidelines:

1.  **Fork the repository** and clone it to your local machine.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  **Make your changes**, ensuring they align with the project's coding style.
4.  **Run tests** (`npm test`) to ensure everything is working as expected.
5.  **Commit your changes** with a clear and descriptive message.
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** against the `main` branch of this repository.

## 📄 License

This project is open-source and licensed under the [LICENSE_NAME](LICENSE) - see the LICENSE file for details.
<!-- TODO: Replace LICENSE_NAME with actual license (e.g., MIT, Apache 2.0) and create a LICENSE file if not present. -->

## 🙏 Acknowledgments

-   **myFlix API**: For providing the backend services and data.
-   **React Community**: For the powerful and flexible UI library.
-   **Bootstrap**: For responsive UI components.
-   **Axios**: For simplified HTTP client interactions.
-   **Vercel / Netlify**: For effortless deployment and hosting.

## 📞 Support & Contact

If you have any questions, encounter issues, or want to provide feedback:

-  🐛 Issues: [GitHub Issues](https://github.com/humblehustler94/myFlix-client/issues)
-  👤 Author: [humblehustler94](https://github.com/humblehustler94)
-  📧 Email: [flores.itzel94@gmail.com]
---

<div align="center">

**⭐ Star this repo if you find it helpful!**

**Made with ❤️ by [humblehustler94](https://github.com/humblehustler94)**

</div>
