import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(`playlist_${id}_progress`);
    return saved ? parseFloat(saved) : 0;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videosCompleted, setVideosCompleted] = useState(() => {
    const saved = localStorage.getItem(`playlist_${id}_completed`);
    return saved ? parseInt(saved) : 0;
  });
  const [totalVideos] = useState(24);
  const [timeSpent, setTimeSpent] = useState(() => {
    const saved = localStorage.getItem(`playlist_${id}_timeSpent`);
    return saved ? parseFloat(saved) : 0;
  });
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`playlist_${id}_video_${currentVideo}_notes`);
    return saved || '';
  });
  const [showNotes, setShowNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      // Start tracking progress
      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          setCurrentTime(current);
          setDuration(total);
          
          // Calculate overall progress based on current video position
          const videoProgress = (current / total) * 100;
          const baseProgress = (videosCompleted / totalVideos) * 100;
          const currentVideoContribution = (1 / totalVideos) * 100 * (videoProgress / 100);
          const newProgress = Math.min(100, baseProgress + currentVideoContribution);
          setProgress(newProgress);
          
          // Save progress to localStorage
          localStorage.setItem(`playlist_${id}_progress`, newProgress.toString());
          localStorage.setItem(`playlist_${id}_completed`, videosCompleted.toString());
          localStorage.setItem(`playlist_${id}_timeSpent`, timeSpent.toString());
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateNotes = async () => {
    setIsGenerating(true);
    try {
      const videoTitle = playlist.title;
      const category = playlist.category;
      const watchedPercentage = duration > 0 ? ((currentTime / duration) * 100).toFixed(1) : 0;
      
      // Generate comprehensive study notes
      const generatedNotes = `# 📚 ${videoTitle}
**Category:** ${category} | **Progress:** ${watchedPercentage}% Watched | **Duration:** ${formatTime(duration)}

---

## 📋 Overview

This comprehensive study guide covers the key concepts, practical applications, and important takeaways from the "${videoTitle}" course. These notes are designed to help you review and reinforce your learning.

---

## 🎯 Learning Objectives

By completing this course, you will be able to:

- ✅ Understand the fundamental concepts and core principles
- ✅ Apply theoretical knowledge to practical real-world scenarios
- ✅ Implement best practices and industry standards
- ✅ Build confidence in ${category.toLowerCase()} development
- ✅ Create production-ready applications and solutions

---

## 📖 Detailed Content Breakdown

### 🔹 Module 1: Introduction & Fundamentals (0:00 - ${formatTime(duration * 0.2)})

**Key Concepts:**
- Introduction to the core technology stack
- Understanding the development environment setup
- Basic syntax and fundamental operations
- Common terminology and vocabulary
- Prerequisites and required knowledge

**Important Points:**
- Start with a solid foundation before moving to advanced topics
- Set up your development environment properly
- Practice basic examples to build muscle memory

**Action Items:**
- [ ] Install required tools and dependencies
- [ ] Complete introductory exercises
- [ ] Create your first simple project

---

### 🔹 Module 2: Core Concepts & Architecture (${formatTime(duration * 0.2)} - ${formatTime(duration * 0.4)})

**Key Concepts:**
- System architecture and design patterns
- Component structure and organization
- Data flow and state management
- Module interaction and communication
- Best practices for scalable code

**Important Points:**
- Architecture decisions impact long-term maintainability
- Follow established patterns to avoid common pitfalls
- Understand the "why" behind design decisions

**Code Concepts to Practice:**
- Component creation and composition
- State management techniques
- Event handling and data binding
- Modular code organization

**Action Items:**
- [ ] Build a medium-sized practice project
- [ ] Implement different design patterns
- [ ] Refactor code for better organization

---

### 🔹 Module 3: Advanced Features & Techniques (${formatTime(duration * 0.4)} - ${formatTime(duration * 0.65)})

**Key Concepts:**
- Advanced programming techniques
- Performance optimization strategies
- Error handling and debugging
- Testing methodologies
- Integration with external services

**Important Points:**
- Optimization should be data-driven
- Write testable and maintainable code
- Handle edge cases and error scenarios gracefully

**Advanced Topics:**
- Asynchronous programming patterns
- Memory management and optimization
- Security best practices
- API integration and data fetching
- Advanced debugging techniques

**Action Items:**
- [ ] Implement advanced features in projects
- [ ] Write comprehensive test coverage
- [ ] Profile and optimize application performance

---

### 🔹 Module 4: Real-World Applications (${formatTime(duration * 0.65)} - ${formatTime(duration * 0.85)})

**Key Concepts:**
- Building production-ready applications
- Deployment strategies and CI/CD
- Monitoring and maintenance
- User experience optimization
- Scalability considerations

**Practical Applications:**
- Full-stack application development
- Database integration and management
- Authentication and authorization
- File handling and storage solutions
- Third-party service integration

**Action Items:**
- [ ] Build a complete end-to-end project
- [ ] Deploy to production environment
- [ ] Implement monitoring and analytics

---

### 🔹 Module 5: Best Practices & Conclusion (${formatTime(duration * 0.85)} - ${formatTime(duration)})

**Key Concepts:**
- Industry best practices and standards
- Code review and collaboration
- Documentation strategies
- Continuous learning resources
- Career development in ${category.toLowerCase()}

**Final Takeaways:**
- Keep practicing and building projects
- Stay updated with latest trends and technologies
- Contribute to open-source communities
- Network with other developers

---

## 💡 Key Takeaways

### Critical Concepts to Remember:
1. **Foundation First** - Master basics before advancing
2. **Practice Regularly** - Build projects to reinforce learning
3. **Code Quality** - Write clean, maintainable code
4. **Testing Matters** - Always test your implementations
5. **Stay Current** - Technology evolves rapidly

### Common Pitfalls to Avoid:
- ❌ Skipping fundamental concepts
- ❌ Not practicing enough hands-on coding
- ❌ Ignoring error handling and edge cases
- ❌ Poor code organization and structure
- ❌ Not writing tests or documentation

---

## 🛠️ Practical Exercises

### Beginner Level:
1. Create a simple application using basic concepts
2. Implement fundamental features and functionality
3. Practice syntax and basic operations

### Intermediate Level:
1. Build a medium-complexity project with multiple components
2. Implement state management and data flow
3. Add error handling and validation

### Advanced Level:
1. Create a full-featured production application
2. Optimize for performance and scalability
3. Implement testing and deployment pipeline

---

## 📚 Additional Resources

### Recommended Reading:
- Official documentation and guides
- Community forums and discussion boards
- Tutorial websites and coding platforms
- Technical blogs and articles

### Tools & Technologies:
- Development environment setup
- Debugging and profiling tools
- Testing frameworks and libraries
- Version control systems

---

## 📝 Personal Notes & Observations

**What I learned today (${new Date().toLocaleDateString()}):**


**Questions to explore further:**


**Ideas for projects:**


**Key insights:**


---

## ✅ Progress Tracking

- **Current Progress:** ${watchedPercentage}% of video watched
- **Time Watched:** ${formatTime(currentTime)} / ${formatTime(duration)}
- **Videos Completed:** ${videosCompleted} / ${totalVideos}
- **Overall Course Progress:** ${progress.toFixed(1)}%

---

## 🎯 Next Steps

1. **Review these notes** and highlight important sections
2. **Complete practice exercises** mentioned throughout
3. **Build a project** applying learned concepts
4. **Continue to next video** in the playlist
5. **Join community** discussions and forums

---

**📅 Generated:** ${new Date().toLocaleString()}  
**📊 Last Updated:** ${new Date().toLocaleString()}  
**⏱️ Time Invested:** ${timeSpent.toFixed(1)} hours

---

*💡 Tip: Customize these notes with your own insights, code snippets, and examples as you progress through the course!*`;

      setNotes(generatedNotes);
      localStorage.setItem(`playlist_${id}_video_${currentVideo}_notes`, generatedNotes);
      setShowNotes(true);
    } catch (error) {
      console.error('Error generating notes:', error);
      alert('Failed to generate notes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveNotes = () => {
    localStorage.setItem(`playlist_${id}_video_${currentVideo}_notes`, notes);
    alert('Notes saved successfully!');
  };

  const playlists = [
    { 
      id: 0, 
      title: "React.js Complete Course", 
      category: "Web Development", 
      playlistId: "PL8p2I9GklV45yqvhcm8tEAzlO1ZE3BJTu",
      videoId: null,
      thumbnail: "https://i.ytimg.com/vi/CgkZ7MvWUAA/hqdefault.jpg"
    },
    { 
      id: 1, 
      title: "Python for Beginners", 
      category: "Programming", 
      playlistId: null,
      videoId: "_uQrJ0TkZlc",
      thumbnail: "https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg"
    },
    { 
      id: 2, 
      title: "UI/UX Design Masterclass", 
      category: "Design", 
      playlistId: null,
      videoId: "cTUD_vCrY7M",
      thumbnail: "https://i.ytimg.com/vi/cTUD_vCrY7M/hqdefault.jpg"
    },
    { 
      id: 3, 
      title: "Machine Learning Fundamentals", 
      category: "AI/ML", 
      playlistId: "PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH",
      videoId: null,
      thumbnail: "https://i.ytimg.com/vi/ukzFI9rgwfU/hqdefault.jpg"
    },
    { 
      id: 4, 
      title: "Digital Marketing Mastery", 
      category: "Marketing", 
      playlistId: null,
      videoId: "01Imoibt4as",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    },
    { 
      id: 5, 
      title: "Data Science Bootcamp", 
      category: "Data Science", 
      playlistId: null,
      videoId: "fIpKgyleBK0",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    { 
      id: 6, 
      title: "Node.js & Express Backend", 
      category: "Web Development", 
      playlistId: null,
      videoId: "Oe421EPjeBE",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop"
    },
  ];

  const playlist = playlists.find(p => p.id === parseInt(id));

  if (!playlist) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/playlists')} className="btn-primary">
          ← Back to Playlists
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">Playlist not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/playlists')} className="btn-primary">
          ← Back to Playlists
        </button>
        <div className="flex items-center gap-4">
          {playlist.thumbnail && (
            <img 
              src={playlist.thumbnail} 
              alt={playlist.title}
              className="w-20 h-12 object-cover rounded"
            />
          )}
          <div>
            <div className="text-sm text-gray-500">{playlist.category}</div>
            <h1 className="text-2xl font-semibold">{playlist.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="aspect-video">
              <iframe
                id="youtube-player"
                width="100%"
                height="100%"
                src={playlist.playlistId 
                  ? `https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}&index=${currentVideo + 1}&enablejsapi=1`
                  : `https://www.youtube.com/embed/${playlist.videoId}?enablejsapi=1`
                }
                title={playlist.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">Currently Playing</h3>
              <p className="text-sm text-gray-600 mt-1">
                Video {currentVideo + 1} of playlist
                {duration > 0 && ` • ${formatTime(currentTime)} / ${formatTime(duration)}`}
              </p>
              <div className="mt-4 flex gap-2">
                <button 
                  className="border rounded-lg px-4 py-2"
                  onClick={() => {
                    setVideosCompleted(prev => Math.min(totalVideos, prev + 1));
                    setProgress(Math.min(100, ((videosCompleted + 1) / totalVideos) * 100));
                  }}
                >
                  Mark as Completed
                </button>
                <button 
                  className="border rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={generateNotes}
                  disabled={isGenerating}
                >
                  {isGenerating ? '⏳ Generating...' : '🤖 Generate AI Notes'}
                </button>
                {notes && (
                  <button 
                    className="border rounded-lg px-4 py-2"
                    onClick={() => setShowNotes(true)}
                  >
                    📝 View Notes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold mb-4">Course Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill transition-all duration-300 ease-linear" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {duration > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Current video: {Math.round((currentTime / duration) * 100)}% watched
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full border rounded-lg px-4 py-2 text-left hover:bg-gray-50">
                    📝 View All Notes
                  </button>
                  <button className="w-full border rounded-lg px-4 py-2 text-left hover:bg-gray-50">
                    📊 View Analytics
                  </button>
                  <button className="w-full border rounded-lg px-4 py-2 text-left hover:bg-gray-50">
                    ⬇️ Download Progress
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Study Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Videos:</span>
                    <span className="font-medium">{totalVideos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">{videosCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Spent:</span>
                    <span className="font-medium">{timeSpent.toFixed(1)} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes Generated:</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold">📝 Video Notes</h3>
              <button 
                onClick={() => setShowNotes(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-full min-h-[400px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your notes will appear here..."
              />
            </div>
            <div className="flex gap-2 p-4 border-t">
              <button 
                onClick={saveNotes}
                className="btn-primary"
              >
                💾 Save Notes
              </button>
              <button 
                onClick={generateNotes}
                disabled={isGenerating}
                className="border rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isGenerating ? '⏳ Regenerating...' : '🔄 Regenerate Notes'}
              </button>
              <button 
                onClick={() => setShowNotes(false)}
                className="border rounded-lg px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
