import { useState, useEffect } from 'react';
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";

export default function Progress() {
  const [playlistProgress, setPlaylistProgress] = useState({});
  const [categoryStats, setCategoryStats] = useState({});
  const [totalStats, setTotalStats] = useState({
    totalPlaylists: 0,
    completedPlaylists: 0,
    inProgressPlaylists: 0,
    notStartedPlaylists: 0,
    overallProgress: 0
  });
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    bestStreak: 0,
    weeklyActivity: [false, false, false, false, false, false, false]
  });

  const playlists = [
    { id: 0, title: "React.js Complete Course", category: "Web Development" },
    { id: 1, title: "Python for Beginners", category: "Programming" },
    { id: 2, title: "UI/UX Design Masterclass", category: "Design" },
    { id: 3, title: "Machine Learning Fundamentals", category: "AI/ML" },
    { id: 4, title: "Digital Marketing Mastery", category: "Marketing" },
    { id: 5, title: "Data Science Bootcamp", category: "Data Science" },
    { id: 6, title: "Node.js & Express Backend", category: "Web Development" },
    { id: 7, title: "Deep Learning with TensorFlow", category: "AI/ML" },
    { id: 8, title: "Full Stack Web Development", category: "Web Development" },
    { id: 9, title: "JavaScript ES6+ Mastery", category: "Programming" },
    { id: 10, title: "Python Data Analysis", category: "Data Science" },
    { id: 11, title: "Neural Networks from Scratch", category: "AI/ML" },
    { id: 12, title: "MongoDB Database Design", category: "Databases" },
    { id: 13, title: "Docker & Kubernetes", category: "DevOps" },
    { id: 14, title: "TypeScript Complete Guide", category: "Programming" },
    { id: 15, title: "React Native Mobile Apps", category: "Mobile Development" },
    { id: 16, title: "AWS Cloud Practitioner", category: "Cloud Computing" },
    { id: 17, title: "Computer Vision with OpenCV", category: "AI/ML" },
  ];

  const calculateStats = () => {
    // Load progress from localStorage
    const progress = {};
    for (let i = 0; i < playlists.length; i++) {
      const saved = localStorage.getItem(`playlist_${i}_progress`);
      progress[i] = saved ? parseFloat(saved) : 0;
    }
    setPlaylistProgress(progress);

    // Calculate category-wise stats
    const categories = {};
    playlists.forEach((playlist) => {
      const prog = progress[playlist.id] || 0;
      if (!categories[playlist.category]) {
        categories[playlist.category] = { total: 0, count: 0, progress: 0 };
      }
      categories[playlist.category].total += prog;
      categories[playlist.category].count += 1;
      categories[playlist.category].progress = categories[playlist.category].total / categories[playlist.category].count;
    });
    setCategoryStats(categories);

    // Calculate overall stats
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let totalProgress = 0;

    Object.values(progress).forEach((prog) => {
      if (prog >= 100) completed++;
      else if (prog > 0) inProgress++;
      else notStarted++;
      totalProgress += prog;
    });

    setTotalStats({
      totalPlaylists: playlists.length,
      completedPlaylists: completed,
      inProgressPlaylists: inProgress,
      notStartedPlaylists: notStarted,
      overallProgress: (totalProgress / playlists.length).toFixed(1)
    });

    // Calculate streak data from localStorage
    const lastActivity = localStorage.getItem('last_activity_date');
    const storedStreak = localStorage.getItem('current_streak');
    const storedBestStreak = localStorage.getItem('best_streak');
    const today = new Date().toDateString();
    
    if (lastActivity === today) {
      const currentStreak = storedStreak ? parseInt(storedStreak) : 1;
      const bestStreak = storedBestStreak ? parseInt(storedBestStreak) : currentStreak;
      setStreakData(prev => ({
        ...prev,
        currentStreak,
        bestStreak: Math.max(currentStreak, bestStreak),
        weeklyActivity: [true, true, true, true, true, false, false] // Mock data for weekly view
      }));
    } else {
      setStreakData(prev => ({
        ...prev,
        currentStreak: 0,
        bestStreak: storedBestStreak ? parseInt(storedBestStreak) : 0,
        weeklyActivity: [false, false, false, false, false, false, false]
      }));
    }
  };

  useEffect(() => {
    // Calculate stats initially
    calculateStats();
    
    // Update stats in real-time every second
    const interval = setInterval(calculateStats, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Progress</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Track your learning achievements
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </span>
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">Total Playlists</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {totalStats.totalPlaylists}
          </div>
        </Card>
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">Completed</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400">
            {totalStats.completedPlaylists}
          </div>
        </Card>
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">In Progress</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-amber-400">
            {totalStats.inProgressPlaylists}
          </div>
        </Card>
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">Overall Progress</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {totalStats.overallProgress}%
          </div>
        </Card>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">🔥 Learning Streaks</h2>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {"MTWTFSS".split("").map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-xs text-gray-500 font-medium">{day}</div>
                <div 
                  className={`w-full h-8 sm:h-10 rounded-lg transition-all ${
                    streakData.weeklyActivity[i]
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 hover:scale-110' 
                      : 'bg-gray-800/50 border border-gray-700/50'
                  }`} 
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Current: <span className="text-emerald-400 font-semibold">{streakData.currentStreak} days</span>
            </div>
            <div className="text-sm text-gray-400">
              Best: <span className="text-emerald-400 font-semibold">{streakData.bestStreak} days</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">📊 Study Time by Category</h2>
          <div className="space-y-3 sm:space-y-4">
            {Object.keys(categoryStats).length > 0 ? (
              Object.entries(categoryStats)
                .sort((a, b) => b[1].progress - a[1].progress)
                .slice(0, 5)
                .map(([category, stats], i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{category}</span>
                      <span className="text-indigo-400 font-semibold">{stats.progress.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={stats.progress} />
                  </div>
                ))
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
                No progress data yet
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Playlist Progress Details */}
      <Card className="p-4 sm:p-6">
        <h2 className="font-semibold text-base sm:text-lg text-white mb-4">📚 Playlist Progress Details</h2>
        <div className="space-y-3">
          {playlists.map((playlist) => {
            const progress = playlistProgress[playlist.id] || 0;
            if (progress === 0) return null; // Only show playlists with progress
            
            return (
              <div key={playlist.id} className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm sm:text-base">{playlist.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{playlist.category}</div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold ml-4">
                    {progress >= 100 ? (
                      <span className="text-emerald-400">✓ {progress.toFixed(0)}%</span>
                    ) : (
                      <span className="text-indigo-400">{progress.toFixed(0)}%</span>
                    )}
                  </div>
                </div>
                <ProgressBar value={progress} />
              </div>
            );
          })}
          {Object.values(playlistProgress).every(p => p === 0) && (
            <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
              Start learning to see your progress here
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
