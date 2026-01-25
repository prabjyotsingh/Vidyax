import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Playlists from './pages/Playlists';
import PlaylistView from './pages/PlaylistView';
import Progress from './pages/Progress';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import './App.css';

function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-col border-r border-gray-700/50 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] backdrop-blur-xl transform transition-transform duration-300 md:transform-none ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } flex`}>
        <Link
          to="/"
          className="mx-3 mt-5 mb-2 px-4 py-3 text-xl font-bold text-left rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg transition-all"
        >
          🎓 YT Study
        </Link>
        <nav className="px-3 space-y-2 mt-4">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
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
            onClick={() => setMobileMenuOpen(false)}
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
            onClick={() => setMobileMenuOpen(false)}
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
            onClick={() => setMobileMenuOpen(false)}
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
            onClick={() => setMobileMenuOpen(false)}
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
        <header className="sticky top-0 z-30 bg-[#0f0f23]/80 backdrop-blur-xl border-b border-gray-700/50">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 h-16">
            <button 
              className="md:hidden p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
            <div className="flex-1">
              <input 
                placeholder="Search..." 
                className="w-full sm:max-w-md bg-gray-800/50 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all" 
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden sm:flex btn-primary text-sm">✨ Share</button>
              <button className="p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all hidden sm:block">🔔</button>
              <button className="p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all">⚙️</button>
            </div>
          </div>
        </header>
        <div className="p-3 sm:p-4 md:p-6">
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
