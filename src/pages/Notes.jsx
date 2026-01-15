export default function Notes() {
  const notes = [
    { title: "React Hooks & State Management", words: 1847, pages: 5, ago: "2 hours ago" },
    { title: "Neural Networks Fundamentals", words: 2134, pages: 6, ago: "5 hours ago" },
    { title: "Python Data Analysis with Pandas", words: 1623, pages: 4, ago: "1 day ago" },
    { title: "Docker & Containerization", words: 1289, pages: 3, ago: "1 day ago" },
    { title: "Node.js API Development", words: 1756, pages: 5, ago: "2 days ago" },
    { title: "Machine Learning Algorithms", words: 2401, pages: 7, ago: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Notes Library</h1>
        <div className="flex gap-2">
          <button className="btn-primary">Bulk Generate</button>
          <button className="border rounded-lg px-4">Export All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((n, i) => (
          <div key={i} className="card p-4">
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-500">Generated from playlist</div>
            <div className="mt-2 text-sm text-gray-500">{n.pages} pages • {n.words} words</div>
            <div className="text-xs text-gray-400">{n.ago}</div>
            <div className="mt-3 flex gap-2">
              <button className="border rounded-lg px-4">Preview</button>
              <button className="btn-primary">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
