import { useState, useEffect } from "react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard() {
  const [stats, setStats] = useState({
    playlists: 0,
    videosWatched: 0,
    studyHours: 0,
    aiNotes: 0,
    weeklyChange: { playlists: 0, videos: 0, hours: 0, notes: 0 }
  });

  const [streak, setStreak] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time stats updater
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        // Simulate real-time updates with small incremental changes
        const shouldUpdate = Math.random() > 0.7; // 30% chance of update each interval
        
        if (shouldUpdate) {
          const updateType = Math.floor(Math.random() * 4);
          const newStats = { ...prev };
          
          switch(updateType) {
            case 0: // Video watched
              newStats.videosWatched += 1;
              newStats.weeklyChange.videos += 1;
              break;
            case 1: // Study hours
              const minutesAdded = Math.random() * 0.5;
              newStats.studyHours = parseFloat((newStats.studyHours + minutesAdded).toFixed(1));
              newStats.weeklyChange.hours = parseFloat((newStats.weeklyChange.hours + minutesAdded).toFixed(1));
              break;
            case 2: // AI Notes
              newStats.aiNotes += 1;
              newStats.weeklyChange.notes += 1;
              break;
            case 3: // Playlist added (rare)
              if (Math.random() > 0.95) {
                newStats.playlists += 1;
                newStats.weeklyChange.playlists += 1;
              }
              break;
          }
          
          setLastUpdate(new Date());
          return newStats;
        }
        return prev;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Streak updater
  useEffect(() => {
    const streakInterval = setInterval(() => {
      if (Math.random() > 0.98) {
        setStreak(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(streakInterval);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Track your learning progress
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary text-sm w-full sm:w-auto">📊 Export Data</button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          ["📚 Total Playlists", stats.playlists, `+${stats.weeklyChange.playlists} this week`],
          ["🎥 Videos Watched", stats.videosWatched, `+${stats.weeklyChange.videos} today`],
          ["⏰ Study Hours", stats.studyHours, `+${stats.weeklyChange.hours} this week`],
          ["🤖 AI Notes Generated", stats.aiNotes, `+${stats.weeklyChange.notes} today`],
        ].map(([label, value, delta], i) => (
          <Card key={i} className="p-4 sm:p-5 hover:scale-105 transition-transform">
            <div className="text-xs sm:text-sm text-gray-400 font-medium">{label}</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{value}</div>
            <div className="text-xs text-emerald-400 mt-1 font-medium">{delta}</div>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base sm:text-lg text-white">📈 Weekly Progress</h2>
            <div className="text-xs sm:text-sm text-gray-400">Hours</div>
          </div>
          <div className="mt-4 h-48 sm:h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50 flex items-center justify-center text-gray-500 text-sm">
            No data available
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">🎯 Completion Status</h2>
          <div className="mt-4 h-48 sm:h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50 flex items-center justify-center text-gray-500 text-sm">
            No playlists yet
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base sm:text-lg text-white">🔥 Learning Streaks</h2>
            <div className="text-emerald-400 text-2xl sm:text-3xl font-bold">{streak}</div>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {"MTWTFSS".split("").map((day,i)=>(
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-xs text-gray-500 font-medium">{day}</div>
                <div className="w-full h-8 sm:h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 transition-all" />
              </div>
            ))}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-4 text-center">🏆 Best Streak: <span className="text-emerald-400 font-semibold">0 days</span></div>
        </Card>
        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">📊 Study Time Distribution</h2>
          <div className="mt-4 h-48 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50 flex items-center justify-center text-gray-500 text-sm">
            No study data yet
          </div>
        </Card>
      </div>
    </div>
  );
}
