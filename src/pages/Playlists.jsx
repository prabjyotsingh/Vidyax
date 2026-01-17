import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Playlists() {
  const navigate = useNavigate();
  const [playlistProgress, setPlaylistProgress] = useState({});
  
  const loadProgress = () => {
    const progress = {};
    for (let i = 0; i < 18; i++) {
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
  }, []);
  
  const playlists = [
    { id: 0, title: "React.js Complete Course", category: "Web Development", url: "https://www.youtube.com/playlist?list=PL8p2I9GklV45yqvhcm8tEAzlO1ZE3BJTu", thumbnail: "https://i.ytimg.com/vi/CgkZ7MvWUAA/hqdefault.jpg" },
    { id: 1, title: "Python for Beginners", category: "Programming", url: "https://youtu.be/_uQrJ0TkZlc?si=5z1goNinfGDW1ypo", thumbnail: "https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg" },
    { id: 2, title: "UI/UX Design Masterclass", category: "Design", url: "https://youtu.be/cTUD_vCrY7M?si=vO85LnxHVuiNKMuI", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop" },
    { id: 3, title: "Machine Learning Fundamentals", category: "AI/ML", url: "https://www.youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH", thumbnail: "https://i.ytimg.com/vi/ukzFI9rgwfU/hqdefault.jpg" },
    { id: 4, title: "Digital Marketing Mastery", category: "Marketing", url: "", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" },
    { id: 5, title: "Data Science Bootcamp", category: "Data Science", url: "", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" },
    { id: 6, title: "Node.js & Express Backend", category: "Web Development", url: "", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop" },
    { id: 7, title: "Deep Learning with TensorFlow", category: "AI/ML", url: "", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop" },
    { id: 8, title: "Full Stack Web Development", category: "Web Development", url: "", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop" },
    { id: 9, title: "JavaScript ES6+ Mastery", category: "Programming", url: "", thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop" },
    { id: 10, title: "Python Data Analysis", category: "Data Science", url: "", thumbnail: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=300&fit=crop" },
    { id: 11, title: "Neural Networks from Scratch", category: "AI/ML", url: "", thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop" },
    { id: 12, title: "MongoDB Database Design", category: "Databases", url: "", thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop" },
    { id: 13, title: "Docker & Kubernetes", category: "DevOps", url: "", thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop" },
    { id: 14, title: "TypeScript Complete Guide", category: "Programming", url: "", thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop" },
    { id: 15, title: "React Native Mobile Apps", category: "Mobile Development", url: "", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop" },
    { id: 16, title: "AWS Cloud Practitioner", category: "Cloud Computing", url: "", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop" },
    { id: 17, title: "Computer Vision with OpenCV", category: "AI/ML", url: "", thumbnail: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=300&fit=crop" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Playlists</h1>
        <button className="btn-primary">Add Playlist</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {playlists.map((p, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="h-36 bg-gray-100 relative overflow-hidden">
              {p.thumbnail && (
                <img 
                  src={p.thumbnail} 
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-indigo-600">{p.category}</div>
              <div className="mt-1 font-medium">{p.title}</div>
              <div className="mt-3 relative">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${playlistProgress[p.id] || 0}%` }} />
                </div>
                <div className="absolute bottom-0 right-0 text-xs text-gray-500 bg-white px-1">
                  {(playlistProgress[p.id] || 0).toFixed(1)}%
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  className="btn-primary flex-1"
                  onClick={() => p.url ? navigate(`/playlist/${p.id}`) : null}
                  disabled={!p.url}
                >
                  Continue Learning
                </button>
                <button className="border rounded-lg px-4">Notes</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
