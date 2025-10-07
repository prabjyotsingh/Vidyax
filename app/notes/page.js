export default function NotesPage() {
  const notes = [
    { title: "React Components", words: 1247, pages: 3, ago: "2 hours ago" },
    { title: "Python Basics", words: 892, pages: 2, ago: "5 hours ago" },
    { title: "Design Principles", words: 1523, pages: 4, ago: "1 day ago" },
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



