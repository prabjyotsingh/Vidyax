import { useState, useEffect } from "react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard() {
  const [stats, setStats] = useState({
    playlists: 18,
    videosWatched: 247,
    studyHours: 142.5,
    aiNotes: 89,
    weeklyChange: { playlists: 3, videos: 12, hours: 8.2, notes: 5 }
  });

  const [streak, setStreak] = useState(12);
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
            Chart placeholder
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">🎯 Completion Status</h2>
          <div className="space-y-4 sm:space-y-5">
            {[
              ["✅ Completed","28","5 / 18"],
              ["⏳ In Progress","60","8 / 18"],
              ["⭕ Not Started","10","5 / 18"],
            ].map(([label,val,count],i)=> (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">{label}</span><span className="text-indigo-400 font-medium">{count}</span></div>
                <div><ProgressBar value={parseInt(val)} /></div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-4 sm:p-6 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-700/30">
        <div className="font-semibold text-base sm:text-lg text-amber-300 mb-3">🤖 Notes Generation Queue</div>
        <div className="space-y-2">
          {[
            ["Neural Networks & Deep Learning","Processing..."],
            ["React Hooks & State Management","Queued"],
            ["Docker Containerization Basics","Queued"],
          ].map(([title,status],i)=> (
            <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg border border-gray-700/50 px-3 sm:px-4 py-2 sm:py-3 hover:border-amber-500/50 transition-colors">
              <div className="text-xs sm:text-sm text-gray-300 truncate pr-2">{title}</div>
              <div className={`text-xs font-medium whitespace-nowrap ${status==='Processing...'?'text-amber-400 animate-pulse':'text-gray-500'}`}>{status}</div>
            </div>
          ))}
        </div>
      </Card>

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
                <div className={`w-full h-8 sm:h-10 rounded-lg ${i<6? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-emerald-400/30'} transition-all hover:scale-110`} />
              </div>
            ))}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-4 text-center">🏆 Best Streak: <span className="text-emerald-400 font-semibold">28 days</span></div>
        </Card>
        <Card className="p-4 sm:p-6">
          <h2 className="font-semibold text-base sm:text-lg text-white mb-4">📊 Study Time Distribution</h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              ["💻 Web Development",42],
              ["🤖 AI/ML",35],
              ["📊 Data Science",28],
              ["☁️ DevOps & Cloud",18],
            ].map(([label,val],i)=> (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">{label}</span><span className="text-indigo-400 font-semibold">{val}h</span></div>
                <div><ProgressBar value={val} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="font-medium mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {[
            ['Completed "React Components Deep Dive"','+45 min','2 hours ago'],
            ['Generated AI notes for "Python Variables"','Notes','5 hours ago'],
            ['Added new playlist "Data Science Bootcamp"','New','1 day ago'],
            ['Reached 60% progress in "UI/UX Design"','Milestone','2 days ago'],
          ].map(([title,badge,time],i)=> (
            <div key={i} className="flex items-center justify-between border rounded-lg px-3 py-2">
              <div className="text-sm">{title}</div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">{time}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">{badge}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Learning Goals</h2>
            <button className="border rounded-lg px-3 py-1.5">+ Add Goal</button>
          </div>
          <div className="mt-3 space-y-4">
            {[
              ["Complete React Course","16/24 videos",67],
              ["Study 100 Hours This Month","78/100 hours",78],
            ].map(([title,sub,percent],i)=> (
              <div key={i}>
                <div className="flex justify-between"><div className="font-medium">{title}</div><div className="text-sm text-gray-500">Due: Nov 30</div></div>
                <div className="text-sm text-gray-500">{sub}</div>
                <div className="mt-2"><ProgressBar value={percent} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {[
              ["First Playlist Completed!","Earned 2 days ago"],
              ["Week Streak Master","Maintained 7-day learning streak"],
              ["Century Club","Studied for 100+ hours total"],
            ].map(([title,sub],i)=> (
              <div key={i} className="border rounded-lg p-3 bg-yellow-50">
                <div className="font-medium">{title}</div>
                <div className="text-sm text-gray-600">{sub}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="font-medium mb-3">Settings & Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-2">Progress Tracking</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span>Auto-mark at 60% watched</span><input type="checkbox" defaultChecked className="size-5"/></div>
              <div className="flex items-center justify-between"><span>Manual progress override</span><input type="checkbox" defaultChecked className="size-5"/></div>
              <div className="flex items-center justify-between"><span>Track watch time</span><input type="checkbox" className="size-5"/></div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">AI Notes Generation</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span>Auto-generate notes</span><input type="checkbox" className="size-5"/></div>
              <div className="flex items-center justify-between"><span>Notes detail level</span><select className="border rounded-lg px-2 py-1"><option>Comprehensive</option><option>Brief</option></select></div>
              <div className="flex items-center justify-between"><span>Export format</span><select className="border rounded-lg px-2 py-1"><option>PDF</option><option>Markdown</option></select></div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">AI Generated Notes</div>
            <div className="text-xs text-gray-500">Key Concepts:</div>
          </div>
          <button className="btn-primary">Download Full Notes</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            ["React Components","3 pages • 1,247 words","2 hours ago"],
            ["Python Basics","2 pages • 892 words","5 hours ago"],
            ["Design Principles","4 pages • 1,523 words","1 day ago"],
          ].map(([title,meta,ago],i)=> (
            <div key={i} className="border rounded-lg p-3">
              <div className="font-medium">{title}</div>
              <div className="text-sm text-gray-500">{meta}</div>
              <div className="text-xs text-gray-400">{ago}</div>
              <div className="mt-2 flex gap-2">
                <button className="border rounded-lg px-3 py-1.5">Preview</button>
                <button className="btn-primary">Download</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <h2 className="font-medium">Add New Playlist</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_220px_140px] gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="https://www.youtube.com/playlist?list=..." />
          <input className="border rounded-lg px-3 py-2" placeholder="Playlist Name (Optional)" />
          <button className="btn-primary">Add Playlist</button>
        </div>
      </Card>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Your Playlists</h2>
          <div className="flex items-center gap-2">
            <button className="border rounded-lg px-3 py-1.5">Grid</button>
            <button className="border rounded-lg px-3 py-1.5">List</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { title: "React.js Complete Course", category: "Web Development", percent: 67 },
            { title: "Node.js & Express Backend", category: "Web Development", percent: 55 },
            { title: "Deep Learning with TensorFlow", category: "AI/ML", percent: 38 },
            { title: "Python Data Analysis", category: "Data Science", percent: 61 },
            { title: "Full Stack Web Development", category: "Web Development", percent: 72 },
            { title: "Docker & Kubernetes", category: "DevOps", percent: 29 },
          ].map((item, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-36 bg-gray-100" />
              <div className="p-4">
                <div className="text-xs text-indigo-600">{item.category}</div>
                <div className="mt-1 font-medium">{item.title}</div>
                <div className="mt-3">
                  <ProgressBar value={item.percent} />
                  <div className="mt-1 text-sm text-gray-500">{item.percent}% complete</div>
                </div>
                <button className="btn-primary mt-3 w-full">Continue Learning</button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
