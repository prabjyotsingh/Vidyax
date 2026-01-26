import { useState, useEffect } from 'react';
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalVideosWatched: 0,
    totalTimeSpent: 0,
    averageProgress: 0,
    completionRate: 0,
    categoryBreakdown: {},
    dailyActivity: [],
    topPlaylists: [],
    recentActivity: []
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

  const calculateAnalytics = () => {
    // Load all progress data
    const progressData = {};
    const timeData = {};
    const completedVideos = {};
    
    for (let i = 0; i < playlists.length; i++) {
      const progress = localStorage.getItem(`playlist_${i}_progress`);
      const timeSpent = localStorage.getItem(`playlist_${i}_time`);
      const videos = localStorage.getItem(`playlist_${i}_videos_completed`);
      
      progressData[i] = progress ? parseFloat(progress) : 0;
      timeData[i] = timeSpent ? parseFloat(timeSpent) : 0;
      completedVideos[i] = videos ? parseInt(videos) : 0;
    }

    // Calculate total videos watched
    const totalVideos = Object.values(completedVideos).reduce((sum, val) => sum + val, 0);
    
    // Calculate total time spent (in hours)
    const totalTime = Object.values(timeData).reduce((sum, val) => sum + val, 0);
    
    // Calculate average progress
    const totalProgress = Object.values(progressData).reduce((sum, val) => sum + val, 0);
    const avgProgress = totalProgress / playlists.length;
    
    // Calculate completion rate
    const completedCount = Object.values(progressData).filter(p => p >= 100).length;
    const completionRate = (completedCount / playlists.length) * 100;
    
    // Category breakdown
    const categoryStats = {};
    playlists.forEach((playlist) => {
      const prog = progressData[playlist.id] || 0;
      const time = timeData[playlist.id] || 0;
      
      if (!categoryStats[playlist.category]) {
        categoryStats[playlist.category] = {
          progress: 0,
          time: 0,
          count: 0,
          completed: 0
        };
      }
      
      categoryStats[playlist.category].progress += prog;
      categoryStats[playlist.category].time += time;
      categoryStats[playlist.category].count += 1;
      if (prog >= 100) categoryStats[playlist.category].completed += 1;
    });
    
    // Calculate averages for categories
    Object.keys(categoryStats).forEach(cat => {
      categoryStats[cat].avgProgress = categoryStats[cat].progress / categoryStats[cat].count;
    });
    
    // Top playlists by progress
    const topPlaylists = playlists
      .map(p => ({
        ...p,
        progress: progressData[p.id] || 0,
        time: timeData[p.id] || 0
      }))
      .filter(p => p.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
    
    // Mock daily activity for the last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dailyActivity.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: totalTime > 0 ? (Math.random() * 2 + 0.5).toFixed(1) : 0
      });
    }
    
    setAnalytics({
      totalVideosWatched: totalVideos,
      totalTimeSpent: totalTime,
      averageProgress: avgProgress,
      completionRate: completionRate,
      categoryBreakdown: categoryStats,
      dailyActivity: dailyActivity,
      topPlaylists: topPlaylists,
      recentActivity: []
    });
  };

  useEffect(() => {
    // Calculate analytics initially
    calculateAnalytics();
    
    // Update analytics in real-time every second
    const interval = setInterval(calculateAnalytics, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Analytics</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Detailed insights into your learning journey
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </span>
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">Videos Watched</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {analytics.totalVideosWatched}
          </div>
        </Card>
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">Study Time</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400">
            {analytics.totalTimeSpent.toFixed(1)}h
          </div>
        </Card>
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">Avg Progress</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-amber-400">
            {analytics.averageProgress.toFixed(1)}%
          </div>
        </Card>
        <Card className="p-4 hover:scale-105 transition-transform">
          <div className="text-xs text-gray-400 font-medium">Completion Rate</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {analytics.completionRate.toFixed(1)}%
          </div>
        </Card>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">📊 Daily Activity (Last 7 Days)</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.dailyActivity.map((day, i) => {
              const maxHours = Math.max(...analytics.dailyActivity.map(d => parseFloat(d.hours)), 1);
              const height = (parseFloat(day.hours) / maxHours) * 100;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative flex-1 w-full flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-500 hover:to-indigo-300"
                      style={{ height: `${height}%` }}
                    >
                      {parseFloat(day.hours) > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-indigo-400">
                          {day.hours}h
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">{day.day}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">📈 Category Performance</h2>
          <div className="space-y-4">
            {Object.keys(analytics.categoryBreakdown).length > 0 ? (
              Object.entries(analytics.categoryBreakdown)
                .sort((a, b) => b[1].avgProgress - a[1].avgProgress)
                .map(([category, stats], i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-300">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{stats.completed}/{stats.count}</span>
                        <span className="text-indigo-400 font-semibold">{stats.avgProgress.toFixed(1)}%</span>
                      </div>
                    </div>
                    <ProgressBar value={stats.avgProgress} />
                  </div>
                ))
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                No data available yet
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Top Playlists */}
      <Card className="p-4 sm:p-6">
        <h2 className="font-semibold text-base sm:text-lg text-white mb-4">🏆 Top Performing Playlists</h2>
        <div className="space-y-3">
          {analytics.topPlaylists.length > 0 ? (
            analytics.topPlaylists.map((playlist, i) => (
              <div key={i} className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📚'}</span>
                      <div>
                        <div className="font-medium text-white text-sm sm:text-base">{playlist.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{playlist.category} • {playlist.time.toFixed(1)}h spent</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold ml-4">
                    {playlist.progress >= 100 ? (
                      <span className="text-emerald-400">✓ 100%</span>
                    ) : (
                      <span className="text-indigo-400">{playlist.progress.toFixed(0)}%</span>
                    )}
                  </div>
                </div>
                <ProgressBar value={playlist.progress} />
              </div>
            ))
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
              Start learning to see your top playlists
            </div>
          )}
        </div>
      </Card>

      {/* Study Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">💡 Study Insights</h2>
          <div className="space-y-4">
            {analytics.totalTimeSpent > 0 ? (
              <>
                <div className="flex items-start gap-3 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-medium text-white text-sm">Most Active Category</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Object.entries(analytics.categoryBreakdown).sort((a, b) => b[1].time - a[1].time)[0]?.[0] || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-medium text-white text-sm">Average Daily Learning</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {(analytics.totalTimeSpent / 7).toFixed(1)} hours per day
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-medium text-white text-sm">Learning Momentum</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {analytics.averageProgress > 50 ? 'Strong momentum!' : analytics.averageProgress > 20 ? 'Building momentum' : 'Just getting started'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                Complete some lessons to see insights
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">📋 Quick Stats</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <div className="text-xs text-gray-400">Total Categories</div>
              <div className="mt-2 text-xl sm:text-2xl font-bold text-indigo-400">
                {Object.keys(analytics.categoryBreakdown).length}
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <div className="text-xs text-gray-400">Completed</div>
              <div className="mt-2 text-xl sm:text-2xl font-bold text-emerald-400">
                {Object.values(analytics.categoryBreakdown).reduce((sum, cat) => sum + cat.completed, 0)}
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <div className="text-xs text-gray-400">In Progress</div>
              <div className="mt-2 text-xl sm:text-2xl font-bold text-amber-400">
                {analytics.topPlaylists.filter(p => p.progress > 0 && p.progress < 100).length}
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border border-gray-700/50">
              <div className="text-xs text-gray-400">Avg Time/Playlist</div>
              <div className="mt-2 text-xl sm:text-2xl font-bold text-purple-400">
                {analytics.topPlaylists.length > 0 
                  ? (analytics.totalTimeSpent / analytics.topPlaylists.length).toFixed(1) 
                  : '0'}h
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
