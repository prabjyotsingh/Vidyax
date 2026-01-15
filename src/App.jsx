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
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <Link
          to="/"
          className="mx-3 mt-5 mb-2 px-4 py-3 text-xl font-semibold text-left rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Study Tracker
        </Link>
        <nav className="px-3 space-y-3">
          <Link 
            to="/" 
            className={`block px-3 py-2 text-lg rounded-lg ${isActive('/') ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/playlists" 
            className={`block px-3 py-2 text-lg rounded-lg ${isActive('/playlists') ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Playlists
          </Link>
          <Link 
            to="/progress" 
            className={`block px-3 py-2 text-lg rounded-lg ${isActive('/progress') ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Progress
          </Link>
          <Link 
            to="/notes" 
            className={`block px-3 py-2 text-lg rounded-lg ${isActive('/notes') ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            AI Notes
          </Link>
          <Link 
            to="/analytics" 
            className={`block px-3 py-2 text-lg rounded-lg ${isActive('/analytics') ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Analytics
          </Link>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="sticky top-0 z-20 bg-white border-b">
          <div className="flex items-center gap-3 px-6 h-16">
            <button className="md:hidden p-2 rounded-lg border">Menu</button>
            <div className="flex-1">
              <input placeholder="Search playlists..." className="w-full max-w-md border rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-primary">Share</button>
              <button className="p-2 rounded-lg border">🔔</button>
              <button className="p-2 rounded-lg border">⚙️</button>
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
