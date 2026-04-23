# Lost & Found Item Management System (MERN)

A full MERN stack application for managing lost and found items in a college campus. Users can register, login securely, report lost or found items, view all items, search items, and manage their own entries.

## Project Structure

- `backend/` - Express API, MongoDB schemas, JWT authentication
- `frontend/` - React app with register, login, dashboard for item management

## Backend Setup

1. Open a terminal in `backend/`
2. Run `npm install`
3. Copy `.env.example` to `.env` and update values:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (optional, defaults to `http://localhost:5173`)
4. Start backend:
   - `npm run dev`

### MongoDB Authentication

If you are using MongoDB Atlas, use a connection string with authentication, for example:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lost-found-management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

The backend reads `MONGODB_URI` from environment variables, so your Atlas user and password are set in that URI.

## Frontend Setup

1. Open a terminal in `frontend/`
2. Run `npm install`
3. Start frontend:
   - `npm run dev`
4. Open browser at `http://localhost:5173`

## API Endpoints

- `POST /api/register` - register a new user
- `POST /api/login` - login and receive JWT token
- `POST /api/items` - add item (requires Bearer token)
- `GET /api/items` - get all items
- `GET /api/items/:id` - get item by ID
- `PUT /api/items/:id` - update item (requires Bearer token, owner only)
- `DELETE /api/items/:id` - delete item (requires Bearer token, owner only)
- `GET /api/items/search?name=xyz` - search items

## Authentication

- Passwords are hashed using `bcryptjs`
- JWT is returned after login and register
- Protected routes use middleware to verify the token and attach the user

## Deployment Notes

### Deploy Backend

- Use a platform like Render, Railway, or Heroku
- Set environment variables in the cloud service:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT`
- Build command: none
- Start command: `npm start`

### Deploy Frontend

- Use Vercel, Netlify, or Render Static Sites
- Build command: `npm run build`
- Publish directory: `dist`
- If deploying to Render, set `VITE_API_URL` to the backend service URL

### Render Deployment

This repository includes `render.yaml` with two services:
- `expense-manager-backend` (Node web service)
- `expense-manager-frontend` (static site)

To deploy on Render:
1. Connect your GitHub repository to Render.
2. Deploy the backend service using the `backend` build and start commands.
3. Add environment variables to the backend service:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (the Render static site URL)
4. Deploy the frontend service using the `frontend` build command.
5. Add environment variable to the frontend service:
   - `VITE_API_URL` set to the backend render URL, e.g. `https://expense-manager-backend.onrender.com`

### Recommended Deployment Flow

1. Deploy backend first and obtain the production API URL.
2. Update `frontend/src/services/api.js` to use the deployed backend URL instead of `/api`.
3. Build and deploy the frontend.

## Notes

- The frontend stores JWT in `localStorage`.
- The dashboard supports expense filtering by category and total amount calculation.
- The backend allows only authenticated users to add and view their own expenses.
