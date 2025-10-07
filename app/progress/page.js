export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="font-medium">Learning Streaks</h2>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {"MTWTFSS".split("").map((d, i) => (
              <div key={i} className={`h-8 rounded ${i<5?"bg-green-500":"bg-green-300"}`} />
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-500">Current streak: 12 • Best: 28</div>
        </div>
        <div className="card p-4">
          <h2 className="font-medium">Study Time Distribution</h2>
          <div className="mt-4 space-y-4">
            {[
              ["Programming",45],
              ["Design",28],
              ["Marketing",18],
              ["Data Science",12],
            ].map(([label,val],i)=> (
              <div key={i}>
                <div className="flex justify-between text-sm"><span>{label}</span><span>{val}h</span></div>
                <div className="progress-track mt-2"><div className="progress-fill" style={{width: `${val}%`}} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



