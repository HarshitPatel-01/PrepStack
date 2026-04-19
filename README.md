# PrepStack

PrepStack is a modern Online Judge platform for practicing coding problems, similar to LeetCode, with integrated code execution and visualization.

## Features

- **Problem Set**: A wide range of coding problems categorized by difficulty and topic.
- **Code Execution**: Support for multiple languages (C++, Python, Java, C) using a Docker-based execution engine.
- **Execution Visualizer**: Step-by-step code execution visualization (similar to Python Tutor).
- **Authentication**: Secure user login and registration.
- **Responsive UI**: Sleek, modern design built with React.

## Tech Stack

- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Execution**: Docker, Judge0 API (optional integration)
- **Infrastructure**: Docker Compose (setup scripts included)

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Docker (for execution engine)

### Backend Setup
1. Navigate to the `server` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Seed the database: `node utils/seed.js`
5. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Deployment
This project is configured to be pushed to GitHub with sensitive files ignored. Make sure to set your environment variables in your deployment platform.
