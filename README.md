# LocalLive

LocalLive is a React + Vite app that helps you discover events using the Ticketmaster API and save favorites.

## Features
- Browse events and view event details
- Search + filters (MVP)
- Favorites (saved per user)
- Authentication (Register/Login/Logout) using a mock JWT-style token (demo)
- Protected routes: Favorites and Admin
- Role-based access: Admin can view all users’ favorites

## Tech Stack
- React, React Router
- Context API for state management
- Ticketmaster API
- Vitest + React Testing Library

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root:
```env
VITE_TICKETMASTER_API_KEY=YOUR_KEY_HERE
```

3. Run the dev server:
```bash
npm run dev
```

## Authentication (Demo)
- Register an account at `/register`
- Login at `/login`
- Token is stored in **sessionStorage** (better than localStorage for security)
- Protected routes redirect to login when not authenticated
- Admin role is selectable at registration for testing

## Testing
Run unit tests:
```bash
npm run test
```

## Deploy (Vercel)
- Import your GitHub repo into Vercel
- Add `VITE_TICKETMASTER_API_KEY` under **Project Settings → Environment Variables**
- Redeploy after adding env vars

## Notes on Security
- React escapes text by default → helps prevent XSS
- Registration validates usernames; we avoid `dangerouslySetInnerHTML`
- CSRF is primarily a cookie-based concern; this demo uses sessionStorage tokens, and includes a simple CSRF token check in auth forms for learning.
