<div align="center">

# 📚 VidyaX AI — Playlists Tracker

**Track your learning playlists, monitor progress, and stay consistent**  
*Built for focused study, streaks, and analytics*

<p>
  <img src="https://img.shields.io/badge/React-JSX-61dafb?style=flat&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8?style=flat&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/AI-Powered-blueviolet?style=flat&logo=openai" alt="AI Powered" />
  <img src="https://img.shields.io/badge/Live_Demo-Available-green?style=flat&logo=vercel" alt="Live Demo" />
</p>

</div>

---

## 📖 About The Project

**StudyTracker** is a productivity-focused web application designed to help learners track **YouTube playlists**, monitor **study progress**, maintain **daily streaks**, and organize **AI-generated notes**.

It’s ideal for students, self-learners, and developers who learn primarily through video playlists and want better visibility into their learning habits.

--

## ✨ Key Features.

- 📊 **Dashboard Overview**  
  Centralized dashboard showing study stats and playlists at a glance.

- 🎬 **Playlist Tracking**  
  Track individual playlists and monitor completion progress visually.

- 🔥 **Progress & Streaks**  
  View daily study streaks and time distribution to stay consistent.

- 🧠 **AI Notes Library**  
  Dedicated notes section to store and revisit AI-generated summaries.

- 🤖 **AI Chatbot Assistant (StudyBuddy)**  
  Intelligent AI chatbot powered by Groq:
  - **Powered by**: Llama 3 8B via Groq API (ultra-fast inference)
  - Answers questions about the app, study tips, coding, and more
  - Real-time streaming responses for instant feedback
  - Always available with cloud-based processing

- 📈 **Analytics (Planned)**  
  Chart placeholders ready for advanced insights and visual reports.

- 📱 **Fully Responsive**  
  Optimized for desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

This project is built using modern web technologies:

- **Framework**: React 18 (JSX) + Vite  
- **Routing**: React Router v6  
- **Styling**: Tailwind CSS  
- **State Management**: React Hooks (useState, useEffect, useCallback)  
- **AI Features**:  
  - **Groq AI**: Ultra-fast Llama 3 8B inference
  - Real-time streaming responses
  - Server-side processing via Express API  

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 📌 Prerequisites

- Node.js (v16 or higher)  
- npm (or yarn / pnpm)  

---

### 📦 Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your Groq API key:

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> 🔑 Get your free API key at [console.groq.com](https://console.groq.com/keys)

### ▶️ Run the Development Server

Run both the frontend and backend server:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend (Vite)
npm run dev

# Terminal 2 - Backend (Express API)
npm run server
```

Open in browser:

```
http://localhost:3000
```

The frontend runs on port 3000, and the API server runs on port 3001.

---

## 🧭 Available Pages

| Route        | Description                              |
| ------------ | ---------------------------------------- |
| `/`          | Dashboard with stats and playlists grid  |
| `/playlists` | All playlists with progress tracking     |
| `/progress`  | Study streaks & time distribution        |
| `/notes`     | AI notes library                         |
| `/analytics` | Analytics & charts (placeholders)        |

---

## 📂 Project Structure

```bash
src/
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
├── components/
│   ├── Card.jsx        # Reusable card component
│   ├── ProgressBar.jsx # Progress visualization
│   ├── Toggle.jsx      # Toggle switch component
│   └── StudyBuddy.jsx     # AI chatbot powered by Groq
└── pages/
    ├── Dashboard.jsx   # Main dashboard
    ├── Playlists.jsx   # Playlists overview
    ├── PlaylistView.jsx # Individual playlist
    ├── Progress.jsx    # Study streaks & time tracking
    ├── Notes.jsx       # AI notes library
    └── Analytics.jsx   # Analytics placeholders
```

---

## 🎨 Styling & Theming

- Tailwind utility classes for rapid UI development  
- Global styles managed in:

```
src/App.css
```

- Designed for easy dark-mode expansion in future versions  

---

## 🧪 Project Status

- Core pages implemented  
- Analytics charts planned  
- Backend & persistence to be added  

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository  
2. Create a feature branch:

```bash
git checkout -b feature/new-feature
```

3. Commit your changes  
4. Push to the branch  
5. Open a Pull Request  

---

<div align="center">
  <p>Built for learners who value consistency 📈</p>
</div>
