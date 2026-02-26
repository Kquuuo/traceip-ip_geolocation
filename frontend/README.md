Local Setup

Prerequisites: Node.js - v18 or higher npm - vv9 or higher Git - any version

#Clone Repository

Copy URL: https://github.com/Kquuuo/traceip-ip_geolocation.git
Clone the repository
Change directory to "traceip-ip_geolocation"
#Backend Setup

Change directory to "backend"
Run "npm install"
Create .env file inside the backend folder
PORT:8080
JWT_SECRET=your_random_secret_string
DATABASE_URL=your_postgresql_connection_string (create account in neon and paste your connection string here)
NODE_ENV=development
Run "npm run seed" to create test users
Start the backend server "npm run dev"
#Frontend Setup

New Terminal
Change directory to "frontend"
Run "npm install"
Create .env file inside the frontend folder
REACT_APP_API_URL=http://localhost:8000/api
Start the react app: "npm start"