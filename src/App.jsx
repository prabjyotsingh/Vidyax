import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New AI notes generated", message: "React Components notes are ready", time: "2 min ago", unread: true },
    { id: 2, title: "Playlist completed!", message: "You finished Python for Beginners", time: "1 hour ago", unread: true },
    { id: 3, title: "Study reminder", message: "Keep your 12-day streak going!", time: "3 hours ago", unread: false },
  ]);
  
  // Settings state with localStorage persistence
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      autoMarkCompleted: true,
      notifyStudyReminders: true,
      notifyAiNotes: true
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleShare = async () => {
    const stats = {
      playlists: localStorage.length,
      progress: 0
    };
    
    // Calculate average progress
    let totalProgress = 0;
    let count = 0;
    for (let i = 0; i < 18; i++) {
      const progress = localStorage.getItem(`playlist_${i}_progress`);
      if (progress) {
        totalProgress += parseFloat(progress);
        count++;
      }
    }
    const avgProgress = count > 0 ? (totalProgress / count).toFixed(1) : 0;
    
    const shareText = `🎓 My VidyaX AI Progress:\n📚 ${count} playlists in progress\n📊 ${avgProgress}% average completion\n\nTrack your YouTube learning journey with AI!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Learning Progress',
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Progress copied to clipboard!');
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
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
          🎓 VidyaX AI
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
              <button 
                onClick={handleShare}
                className="hidden sm:flex btn-primary text-sm items-center gap-2"
              >
                ✨ Share
              </button>
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowSettings(false);
                  }}
                  className="relative p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all hidden sm:block"
                >
                  🔔
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          Mark all read
                        </button>
                        <button 
                          onClick={clearNotifications}
                          className="text-xs text-gray-400 hover:text-gray-300"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div 
                            key={notif.id}
                            className={`p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${notif.unread ? 'bg-indigo-500/5' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              {notif.unread && (
                                <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></span>
                              )}
                              <div className="flex-1">
                                <div className="font-medium text-white text-sm">{notif.title}</div>
                                <div className="text-xs text-gray-400 mt-1">{notif.message}</div>
                                <div className="text-xs text-gray-500 mt-2">{notif.time}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowNotifications(false);
                  }}
                  className="p-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                >
                  ⚙️
                </button>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="font-semibold text-white">Settings</h3>
                    </div>
                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                      <div>
                        <label className="text-sm text-gray-300 font-medium mb-3 block">Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'dark', label: 'Dark', emoji: '🌙', colors: ['#1a1a2e', '#6366f1'] },
                            { value: 'light', label: 'Light', emoji: '☀️', colors: ['#ffffff', '#4f46e5'] },
                            { value: 'ocean', label: 'Ocean', emoji: '🌊', colors: ['#0f172a', '#0ea5e9'] },
                            { value: 'sunset', label: 'Sunset', emoji: '🌅', colors: ['#291812', '#fb923c'] },
                            { value: 'forest', label: 'Forest', emoji: '🌲', colors: ['#142114', '#22c55e'] },
                          ].map((theme) => (
                            <button
                              key={theme.value}
                              onClick={() => updateSetting('theme', theme.value)}
                              className={`relative p-3 rounded-lg border-2 transition-all ${
                                settings.theme === theme.value
                                  ? 'border-indigo-500 bg-indigo-500/10'
                                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{theme.emoji}</span>
                                <span className="text-sm font-medium text-white">{theme.label}</span>
                              </div>
                              <div className="flex gap-1">
                                {theme.colors.map((color, i) => (
                                  <div
                                    key={i}
                                    className="h-4 flex-1 rounded"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              {settings.theme === theme.value && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 font-medium">Auto-mark completed</label>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">Mark videos as completed at 90%</span>
                          <input 
                            type="checkbox" 
                            checked={settings.autoMarkCompleted}
                            onChange={(e) => updateSetting('autoMarkCompleted', e.target.checked)}
                            className="w-4 h-4 accent-indigo-500 cursor-pointer" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 font-medium">Notifications</label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Study reminders</span>
                            <input 
                              type="checkbox" 
                              checked={settings.notifyStudyReminders}
                              onChange={(e) => updateSetting('notifyStudyReminders', e.target.checked)}
                              className="w-4 h-4 accent-indigo-500 cursor-pointer" 
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">AI notes completed</span>
                            <input 
                              type="checkbox" 
                              checked={settings.notifyAiNotes}
                              onChange={(e) => updateSetting('notifyAiNotes', e.target.checked)}
                              className="w-4 h-4 accent-indigo-500 cursor-pointer" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-700">
                        <button 
                          onClick={() => {
                            if (confirm('⚠️ This will delete all your learning progress, notes, and settings. This action cannot be undone.\n\nAre you sure you want to continue?')) {
                              // Clear all localStorage except settings temporarily
                              const currentSettings = localStorage.getItem('app_settings');
                              localStorage.clear();
                              // Show success message
                              alert('✓ All learning data has been cleared successfully!');
                              // Restore default settings
                              setSettings({
                                theme: 'dark',
                                autoMarkCompleted: true,
                                notifyStudyReminders: true,
                                notifyAiNotes: true
                              });
                              setShowSettings(false);
                              // Reload to reset state
                              setTimeout(() => window.location.reload(), 500);
                            }
                          }}
                          className="w-full px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-all font-medium"
                        >
                          Clear All Data
                        </button>
                      </div>
                      <div>
                        <button 
                          onClick={() => {
                            const data = {};
                            for (let i = 0; i < localStorage.length; i++) {
                              const key = localStorage.key(i);
                              data[key] = localStorage.getItem(key);
                            }
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            const timestamp = new Date().toISOString().split('T')[0];
                            a.download = `yt-study-backup-${timestamp}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                            // Show success notification
                            alert('✓ Data exported successfully!');
                          }}
                          className="w-full px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-lg text-sm hover:bg-indigo-500/20 transition-all font-medium"
                        >
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
