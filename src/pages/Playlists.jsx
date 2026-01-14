export default function Playlists() {
  const items = Array.from({ length: 9 }).map((_, i) => ({
    title: [
      "React.js Complete Course",
      "Python for Beginners",
      "UI/UX Design Masterclass",
      "Machine Learning Fundamentals",
      "Digital Marketing Mastery",
      "Data Science Bootcamp",
    ][i % 6],
    percent: [67, 45, 80, 23, 92, 0][i % 6],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Playlists</h1>
        <button className="btn-primary">Add Playlist</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((p, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="h-36 bg-gray-100" />
            <div className="p-4">
              <div className="text-xs text-indigo-600">Programming</div>
              <div className="mt-1 font-medium">{p.title}</div>
              <div className="mt-3">
                <div className="progress-track"><div className="progress-fill" style={{ width: `${p.percent}%` }} /></div>
                <div className="mt-1 text-sm text-gray-500">{p.percent}% complete</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn-primary flex-1">Continue Learning</button>
                <button className="border rounded-lg px-4">Notes</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
