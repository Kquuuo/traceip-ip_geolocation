# Local Setup

Prerequisites:
Node.js - v18 or higher
npm - vv9 or higher
Git - any version

## Clone Repository
1. Copy URL: https://github.com/Kquuuo/traceip-ip_geolocation.git
2. Clone the repository
3. Change directory to "traceip-ip_geolocation"

## Backend Setup
1. Change directory to "backend"
2. Run "npm install"
3. Create .env file inside the backend folder
    - PORT:8080
    - JWT_SECRET=your_random_secret_string
    - DATABASE_URL=your_postgresql_connection_string (create account in neon and paste your connection string here)
    - NODE_ENV=development
4. Run "npm run seed" to create test users
5. Start the backend server "npm run dev"

## Frontend Setup
1. New Terminal
2. Change directory to "frontend"
3. Run "npm install"
4. Create .env file inside the frontend folder
     - REACT_APP_API_URL=http://localhost:8000/api
5. Start the react app: "npm start"







