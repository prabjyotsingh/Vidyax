export default function Playlists() {
  const playlists = [
    { title: "React.js Complete Course", category: "Web Development", percent: 67, url: "https://www.youtube.com/playlist?list=PL8p2I9GklV45yqvhcm8tEAzlO1ZE3BJTu" },
    { title: "Python for Beginners", category: "Programming", percent: 45, url: "" },
    { title: "UI/UX Design Masterclass", category: "Design", percent: 80, url: "" },
    { title: "Machine Learning Fundamentals", category: "AI/ML", percent: 23, url: "" },
    { title: "Digital Marketing Mastery", category: "Marketing", percent: 92, url: "" },
    { title: "Data Science Bootcamp", category: "Data Science", percent: 0, url: "" },
    { title: "Node.js & Express Backend", category: "Web Development", percent: 55, url: "" },
    { title: "Deep Learning with TensorFlow", category: "AI/ML", percent: 38, url: "" },
    { title: "Full Stack Web Development", category: "Web Development", percent: 72, url: "" },
    { title: "JavaScript ES6+ Mastery", category: "Programming", percent: 88, url: "" },
    { title: "Python Data Analysis", category: "Data Science", percent: 61, url: "" },
    { title: "Neural Networks from Scratch", category: "AI/ML", percent: 15, url: "" },
    { title: "MongoDB Database Design", category: "Databases", percent: 44, url: "" },
    { title: "Docker & Kubernetes", category: "DevOps", percent: 29, url: "" },
    { title: "TypeScript Complete Guide", category: "Programming", percent: 76, url: "" },
    { title: "React Native Mobile Apps", category: "Mobile Development", percent: 33, url: "" },
    { title: "AWS Cloud Practitioner", category: "Cloud Computing", percent: 50, url: "" },
    { title: "Computer Vision with OpenCV", category: "AI/ML", percent: 20, url: "" },
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
            <div className="h-36 bg-gray-100" />
            <div className="p-4">
              <div className="text-xs text-indigo-600">{p.category}</div>
              <div className="mt-1 font-medium">{p.title}</div>
              <div className="mt-3">
                <div className="progress-track"><div className="progress-fill" style={{ width: `${p.percent}%` }} /></div>
                <div className="mt-1 text-sm text-gray-500">{p.percent}% complete</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  className="btn-primary flex-1"
                  onClick={() => p.url && window.open(p.url, '_blank')}
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
