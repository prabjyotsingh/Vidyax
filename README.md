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

---

## ✨ Key Features

- 📊 **Dashboard Overview**  
  Centralized dashboard showing study stats and playlists at a glance.

- 🎬 **Playlist Tracking**  
  Track individual playlists and monitor completion progress visually.

- 🔥 **Progress & Streaks**  
  View daily study streaks and time distribution to stay consistent.

- 🧠 **AI Notes Library**  
  Dedicated notes section to store and revisit AI-generated summaries.

- 🤖 **AI Chatbot Assistant (VidyaX LLM)**  
  Intelligent hybrid chatbot that adapts to your device:
  - **Desktop**: Powered by TinyLlama 1.1B (WebLLM) running locally on GPU via WebGPU
  - **Mobile**: Powered by DistilBERT (Transformers.js) for lightweight Q&A
  - No server required, fully client-side AI

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
  - **WebLLM**: TinyLlama 1.1B for desktop GPU inference
  - **Transformers.js**: DistilBERT for mobile Q&A
  - Client-side AI with no backend required  

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 📌 Prerequisites

- Node.js (v16 or higher)  
- npm (or yarn / pnpm)  

---

### 📦 Installation

Install dependencies:

```bash
npm install
```

### ▶️ Run the Development Server

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

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
│   └── WebLLMChatBot.jsx  # Hybrid AI chatbot (WebLLM + Transformers.js)
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
