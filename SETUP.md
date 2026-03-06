# 🚀 VidyaX AI - Setup Guide

This guide will help you set up the VidyaX AI learning tracker with StudyBuddy AI chatbot.

## Prerequisites

- Node.js v16 or higher
- npm (comes with Node.js)
- A Groq API key (free)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd yt-play
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React Router
- Tailwind CSS
- Express server
- Groq SDK
- Other dependencies

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

### 4. Get Your Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in (it's free!)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### 5. Add API Key to .env

Open the `.env` file and paste your API key:

```env
GROQ_API_KEY=gsk_your_actual_api_key_here
PORT=3001
```

### 6. Run the Application

#### Option A: Run Everything at Once (Recommended)

```bash
npm run dev:all
```

This starts both the frontend (Vite) and backend (Express) in one command.

#### Option B: Run Separately

If you prefer to run them in separate terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### 7. Open the App

Open your browser and navigate to:

```
http://localhost:3000
```

## What You Should See

- ✅ The VidyaX AI dashboard
- ✅ Navigation sidebar with all pages
- ✅ A floating orange/pink chatbot button in the bottom-right
- ✅ Click the chatbot to interact with StudyBuddy

## Testing the Chatbot

1. Click the floating StudyBuddy button (bottom-right)
2. Type a question like:
   - "What is VidyaX?"
   - "How do I add a playlist?"
   - "Give me study tips"
   - "Explain React hooks"
3. You should see streaming responses instantly!

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

**Windows:**
```powershell
# Find process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill it (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

### API Key Not Working

- Make sure there are no spaces in your `.env` file
- Verify the key starts with `gsk_`
- Try regenerating a new key from Groq console

### Chatbot Not Responding

1. Check terminal for errors
2. Open browser DevTools (F12) → Console tab
3. Verify backend is running: `http://localhost:3001/api/health`
4. Check that proxy is configured in `vite.config.js`

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (Vite dev server) |
| `npm run server` | Start backend only (Express API) |
| `npm run dev:all` | Start both frontend & backend concurrently |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
yt-play/
├── src/
│   ├── components/
│   │   └── StudyBuddy.jsx    # AI chatbot component
│   ├── pages/                 # All page components
│   └── App.jsx                # Main app with routing
├── server/
│   ├── index.js               # Express server
│   └── chat.js                # Chat API endpoint
├── .env                       # Your API keys (DO NOT COMMIT)
├── .env.example               # Template for .env
└── package.json               # Dependencies and scripts
```

## Learn More

- [Groq API Documentation](https://console.groq.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

## Need Help?

If you encounter issues not covered here:
1. Check the browser console for errors
2. Check terminal logs for server errors
3. Verify all dependencies are installed
4. Make sure your API key is valid

---

**Happy Learning! 🚀📚**
