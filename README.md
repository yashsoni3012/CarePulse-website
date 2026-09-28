# CarePulse (React + Vite + Tailwind)
npm install && npm run dev
Routes: / , /diseases , /diseases/:slug , /doctors , /doctors/:id (slot booking) , /login , /register , /dashboard (protected)
All data (users, session, appointments, contact messages) is stored in localStorage: see src/context/AuthContext.jsx.
Swap register/login/book/setStatus for real API calls when you add a backend.
Deploy note: public/_redirects and vercel.json make direct links work on Netlify and Vercel.
