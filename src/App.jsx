import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Playlists from './pages/Playlists';
import PlaylistView from './pages/PlaylistView';
import Progress from './pages/Progress';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import './App.css';

function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex min-h-screen relative">
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-700/50 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] backdrop-blur-xl">
        <Link
          to="/"
          className="mx-3 mt-5 mb-2 px-4 py-3 text-xl font-bold text-left rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg transition-all"
        >
          🎓 YT Study
        </Link>
        <nav className="px-3 space-y-2 mt-4">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              isActive('/') 
                ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className="text-lg">📊</span>
            Dashboard
          </Link>
          <Link 
            to="/playlists" 
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              isActive('/playlists') 
                ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className="text-lg">📚</span>
            Playlists
          </Link>
          <Link 
            to="/progress" 
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              isActive('/progress') 
                ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className="text-lg">📈</span>
            Progress
          </Link>
          <Link 
            to="/notes" 
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              isActive('/notes') 
                ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className="text-lg">🤖</span>
            AI Notes
          </Link>
          <Link 
            to="/analytics" 
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              isActive('/analytics') 
                ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className="text-lg">📉</span>
            Analytics
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-400 text-center">
            Built with ❤️ for learning
          </div>
        </div>
      </aside>
      <main className="flex-1 relative">
        <header className="sticky top-0 z-20 bg-[#0f0f23]/80 backdrop-blur-xl border-b border-gray-700/50">
          <div className="flex items-center gap-3 px-6 h-16">
            <button className="md:hidden p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">☰</button>
            <div className="flex-1">
              <input 
                placeholder="Search playlists..." 
                className="w-full max-w-md bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all" 
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-primary">✨ Share</button>
              <button className="p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all">🔔</button>
              <button className="p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all">⚙️</button>
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlist/:id" element={<PlaylistView />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}
