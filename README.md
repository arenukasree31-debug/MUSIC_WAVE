# MusicWave — React + Vite Music Player

A Spotify-inspired dark music player built with React, Vite, React Router and browser Local Storage.

## Features
- Signup and login with client-side validation
- Separate listener and admin experiences
- User song search, playback, volume, seeking and liked songs
- Admin dashboard: add, edit and delete tracks; view and remove listener accounts
- Responsive desktop and mobile layout
- Local Storage persistence for users, current session and song catalogue

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Demo admin login

- Email: `admin@musicwave.com`
- Password: `Admin@123`

Signups always create listener accounts. The demo admin account is seeded by the app and is not created through the signup form.

## Deploy to Vercel

1. Create a GitHub repository and push this project.
2. Sign in at https://vercel.com and choose **Add New → Project**.
3. Import the GitHub repository.
4. Vercel should detect **Vite**. Use these settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Click **Deploy**. The included `vercel.json` rewrites application routes to `index.html`, so direct navigation and refresh work.
6. Open the deployed URL and test signup, login, song playback and admin operations.

## Important security and data notes

This is a coursework/demo implementation. Local Storage is controlled by the browser user, passwords are stored in readable form, and the admin demo credentials are present in frontend code. A user can inspect or modify this data, so **do not use real passwords or personal data** and do not treat this as secure production authentication. For a real deployment, use a backend/API, hashed passwords, server-side role checks and a database.

The sample tracks use externally hosted demo MP3 URLs and sample artwork. Replace them with audio and artwork you have permission to use. Playback depends on those third-party hosts being reachable. Admin-added tracks should use direct, browser-accessible MP3 URLs.

## Local Storage keys

- `musicwave_users`: registered listener accounts
- `musicwave_session`: current signed-in account email
- `musicwave_songs`: editable music catalogue

Clear these keys in browser developer tools to reset the demo data.
