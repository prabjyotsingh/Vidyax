import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Playlists() {
  const navigate = useNavigate();
  const [playlistProgress, setPlaylistProgress] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    const saved = localStorage.getItem('custom_playlists');
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    url: '',
    thumbnail: ''
  });
  
  const loadProgress = () => {
    const progress = {};
    const totalPlaylists = defaultPlaylists.length + customPlaylists.length;
    for (let i = 0; i < totalPlaylists; i++) {
      const saved = localStorage.getItem(`playlist_${i}_progress`);
      progress[i] = saved ? parseFloat(saved) : 0;
    }
    setPlaylistProgress(progress);
  };
  
  useEffect(() => {
    // Load progress initially
    loadProgress();
    
    // Poll localStorage every second to sync with YouTube player
    const interval = setInterval(loadProgress, 1000);
    
    return () => clearInterval(interval);
  }, [customPlaylists]);

  const handleAddPlaylist = (e) => {
    e.preventDefault();
    const newPlaylist = {
      id: defaultPlaylists.length + customPlaylists.length,
      title: formData.title,
      category: formData.category,
      url: formData.url,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'
    };
    
    const updated = [...customPlaylists, newPlaylist];
    setCustomPlaylists(updated);
    localStorage.setItem('custom_playlists', JSON.stringify(updated));
    
    setFormData({ title: '', category: '', url: '', thumbnail: '' });
    setShowAddModal(false);
  };
  
  const defaultPlaylists = [
    { id: 0, title: "React.js Complete Course", category: "Web Development", url: "https://www.youtube.com/playlist?list=PL8p2I9GklV45yqvhcm8tEAzlO1ZE3BJTu", thumbnail: "https://i.ytimg.com/vi/CgkZ7MvWUAA/hqdefault.jpg" },
    { id: 1, title: "Python for Beginners", category: "Programming", url: "https://youtu.be/_uQrJ0TkZlc?si=5z1goNinfGDW1ypo", thumbnail: "https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg" },
    { id: 2, title: "UI/UX Design Masterclass", category: "Design", url: "https://youtu.be/cTUD_vCrY7M?si=vO85LnxHVuiNKMuI", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop" },
    { id: 3, title: "Machine Learning Fundamentals", category: "AI/ML", url: "https://www.youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH", thumbnail: "https://i.ytimg.com/vi/ukzFI9rgwfU/hqdefault.jpg" },
    { id: 4, title: "Digital Marketing Mastery", category: "Marketing", url: "https://youtu.be/01Imoibt4as?si=4HfRBYiUi4-hW5nm", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" },
    { id: 5, title: "Data Science Bootcamp", category: "Data Science", url: "https://youtu.be/fIpKgyleBK0?si=gF9dTA4cmhBODKOp", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" },
    { id: 6, title: "Node.js & Express Backend", category: "Web Development", url: "https://youtu.be/Oe421EPjeBE?si=4Yh35w4QclkM2r1_", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop" },
    { id: 7, title: "Deep Learning with TensorFlow", category: "AI/ML", url: "https://youtu.be/tpCFfeUEGs8?si=Gy6jvqadlZTIkv-T", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop" },
    { id: 8, title: "Full Stack Web Development", category: "Web Development", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop" },
    { id: 9, title: "JavaScript ES6+ Mastery", category: "Programming", url: "https://www.youtube.com/watch?v=tULW49jkKnA&list=PLjVLYmrlmjGe3fUTOCarulICb3R8iAh4t", thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop" },
    { id: 10, title: "Python Data Analysis", category: "Data Science", url: "https://youtu.be/wUSDVGivd-8?si=oaYhf3EOfknyWEzD", thumbnail: "https://i.ytimg.com/vi/wUSDVGivd-8/hqdefault.jpg" },
    { id: 11, title: "Neural Networks from Scratch", category: "AI/ML", url: "https://www.youtube.com/watch?v=zrKpz9-AZ_E&list=PLPTV0NXA_ZSj6tNyn_UadmUeU3Q3oR-hu", thumbnail: "https://i.ytimg.com/vi/zrKpz9-AZ_E/hqdefault.jpg" },
    { id: 12, title: "MongoDB Database Design", category: "Databases", url: "https://www.youtube.com/watch?v=4EjKroJCpFA&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1", thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop" },
    { id: 13, title: "Docker & Kubernetes", category: "DevOps", url: "https://youtu.be/kTp5xUtcalw?si=15gJ_iybhZseZLbb", thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop" },
    { id: 14, title: "TypeScript Complete Guide", category: "Programming", url: "https://youtu.be/30LWjhZzg50?si=Nro_cnS6BSvMh54S", thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop" },
    { id: 15, title: "React Native Mobile Apps", category: "Mobile Development", url: "https://www.youtube.com/watch?v=kmy_YNhl0mw&list=PL6QREj8te1P54rZQx5AWWtFyf1hlznFjL", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop" },
    { id: 16, title: "AWS Cloud Practitioner", category: "Cloud Computing", url: "https://youtu.be/3hLmDS179YE?si=LS4RYyxPARJLTqTy", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop" },
    { id: 17, title: "Computer Vision with OpenCV", category: "AI/ML", url: "https://www.youtube.com/watch?v=l_Mhv0rxbQk&list=PLaHodugB5x-Ddy_H951h0VHjOjfzZNCBh", thumbnail: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=300&fit=crop" },
  ];

  const allPlaylists = [...defaultPlaylists, ...customPlaylists];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Playlists</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Continue your learning journey</p>
        </div>
        <button 
          className="btn-primary text-sm sm:text-base w-full sm:w-auto"
          onClick={() => setShowAddModal(true)}
        >
          + Add Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {allPlaylists.map((p, i) => (
          <div key={i} className="card overflow-hidden group">
            <div className="h-36 sm:h-40 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
              {p.thumbnail && (
                <img 
                  src={p.thumbnail} 
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                <span className="text-xs text-white font-medium">{p.category}</span>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="font-semibold text-white text-base sm:text-lg line-clamp-2 group-hover:text-indigo-400 transition-colors">{p.title}</h3>
              <div className="mt-3 sm:mt-4 relative">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${playlistProgress[p.id] || 0}%` }} />
                </div>
                <div className="absolute -top-5 right-0 text-xs sm:text-sm font-semibold text-indigo-400">
                  {(playlistProgress[p.id] || 0).toFixed(0)}%
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex gap-2">
                <button 
                  className="btn-primary flex-1 text-xs sm:text-sm py-2"
                  onClick={() => p.url ? navigate(`/playlist/${p.id}`) : null}
                  disabled={!p.url}
                >
                  {playlistProgress[p.id] > 0 ? '▶️ Continue' : '🚀 Start'}
                </button>
                <button className="border border-gray-700 rounded-lg px-3 sm:px-4 text-gray-300 hover:bg-gray-800 transition-all text-xs sm:text-sm">📝</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Playlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Playlist</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddPlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Playlist Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="e.g., Advanced React Patterns"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="e.g., Web Development"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="https://youtube.com/playlist?list=..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail URL (optional)</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="https://... (leave empty for default)"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ title: '', category: '', url: '', thumbnail: '' });
                    setShowAddModal(false);
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg transition-all border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2.5 font-medium"
                >
                  Add Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
