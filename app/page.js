import Card from "./components/Card";
import ProgressBar from "./components/ProgressBar";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2"><button className="btn-primary">Export Data</button></div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Total Playlists","18","+3 this week"],
          ["Videos Watched","247","+12 today"],
          ["Study Hours","142.5","+8.2 this week"],
          ["AI Notes Generated","89","+5 today"],
        ].map(([label,value,delta],i)=> (
          <Card key={i} className="p-4">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-2 text-3xl font-bold">{value}</div>
            <div className="text-xs text-green-600 mt-1">{delta}</div>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Weekly Progress</h2>
            <div className="text-sm text-gray-500">Hours</div>
          </div>
          <div className="mt-4 h-64 bg-gray-50 rounded-lg border flex items-center justify-center text-gray-400">
            Chart placeholder
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium">Completion Status</h2>
          <div className="mt-4 space-y-4">
            {[
              ["Completed Playlists",28],
              ["In Progress",60],
              ["Not Started",10],
            ].map(([label,val],i)=> (
              <div key={i}>
                <div className="flex justify-between text-sm"><span>{label}</span><span>{val === 28 ? '5 / 18' : val === 60 ? '8 / 18' : '5 / 18'}</span></div>
                <div className="mt-2"><ProgressBar value={val} /></div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="font-medium">Notes Generation Queue</div>
        <div className="mt-3 space-y-2">
          {[
            ["State Management in React","Processing..."],
            ["Python Functions & Modules","Queued"],
            ["Design Systems Introduction","Queued"],
          ].map(([title,status],i)=> (
            <div key={i} className="flex items-center justify-between bg-white rounded-lg border px-3 py-2">
              <div className="text-sm">{title}</div>
              <div className={`text-xs ${status==='Processing...'?'text-indigo-600':'text-gray-500'}`}>{status}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Learning Streaks</h2>
            <div className="text-emerald-600 text-2xl font-bold">12</div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {"MTWTFSS".split("").map((_,i)=>(
              <div key={i} className={`h-8 rounded ${i<6? 'bg-emerald-500' : 'bg-emerald-300'}`} />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-2">Best Streak 28</div>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium">Study Time Distribution</h2>
          <div className="mt-3 space-y-3">
            {[
              ["Programming",45],
              ["Design",28],
              ["Marketing",18],
              ["Data Science",12],
            ].map(([label,val],i)=> (
              <div key={i}>
                <div className="flex justify-between text-sm"><span>{label}</span><span>{val}h</span></div>
                <div className="mt-2"><ProgressBar value={val} /></div>
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
          {["React.js Complete Course","Python for Beginners","UI/UX Design Masterclass","Machine Learning Fundamentals","Digital Marketing Mastery","Data Science Bootcamp"].map((title, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-36 bg-gray-100" />
              <div className="p-4">
                <div className="text-xs text-indigo-600">{["Programming","Design","AI/ML","Marketing","Data Science"][i%5] || "Programming"}</div>
                <div className="mt-1 font-medium">{title}</div>
                <div className="mt-3">
                  <ProgressBar value={[67,45,80,23,92,0][i]} />
                  <div className="mt-1 text-sm text-gray-500">{[67,45,80,23,92,0][i]}% complete</div>
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
