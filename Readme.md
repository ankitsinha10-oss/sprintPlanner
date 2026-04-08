SprintOS 

A Full-Stack MERN application designed to manage sprints, track employee tasks, and visualize progress.

 Quick Start

1. Prerequisites
Node.js

MongoDB (Local instance or Atlas URI)

npm 

2. Environment Setup
Create a .env file in the root of the backend folder:

Code snippet
PORT=8000
MONGODB_URI=your_mongodb_connection_string


3. Installation

Backend Setup:

Bash
cd backend
npm install
    (Package,	
    mongoose,	
    cors,	
    dotenv,	
    nodemon)

Frontend Setup:

Bash
cd frontend
npm install
    (react-router-dom,
    axios,
    react-bootstrap bootstrap,)

4. Running the Application

You will need two terminal windows open:

Terminal 1 (Backend):

Bash
cd backend
npm run dev

Terminal 2 (Frontend):

Bash
cd frontend
npm start

The app will be available at http://localhost:3000.