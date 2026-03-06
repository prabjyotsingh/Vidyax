# Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then edit .env and add your GROQ_API_KEY

# Start both frontend and backend
npm run dev:all

# Or run separately:
# Frontend only (Vite)
npm run dev

# Backend API only (Express)
npm run server

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Status

✅ **Fully Functional Vite + React App with AI Backend**

- Frontend development server running at http://localhost:3000/
- Backend API server running at http://localhost:3001/
- Production build tested and working
- All routes configured and accessible
- Tailwind CSS properly integrated
- React Router navigation working
- Groq AI chatbot integrated (StudyBuddy)

## Available Routes

- `/` - Dashboard (default)
- `/playlists` - Playlists management
- `/progress` - Learning progress tracking
- `/notes` - AI Notes library
- `/analytics` - Analytics dashboard

## Features Working

✅ Responsive sidebar navigation
✅ All page components rendering
✅ Tailwind CSS styling
✅ React Router client-side routing
✅ Hot Module Replacement (HMR)
✅ Production build optimization
✅ AI Chatbot (StudyBuddy) with Groq API
✅ Express API server with streaming responses

## Known Non-Issues

The CSS linting warnings about `@tailwind` and `@apply` are expected - they're handled by PostCSS/Tailwind at build time and don't affect functionality.

## Troubleshooting

If the dev server doesn't start:
1. Make sure yous 3000 (frontend) and 3001 (backend) are available
4. Make sure `.env` file exists with valid `GROQ_API_KEY`

If the chatbot doesn't work:
1. Verify your Groq API key is valid in `.env`
2. Check that the backend server is running on port 3001
3. Look for errors in browser console and terminal logsy` directory
2. Run `npm install` to ensure all dependencies are installed
3. Check if port 3000 is available
