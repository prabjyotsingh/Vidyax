import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [progress, setProgress] = useState(67);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videosCompleted, setVideosCompleted] = useState(16);
  const [totalVideos] = useState(24);
  const [timeSpent, setTimeSpent] = useState(12.5);
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
          setProgress(Math.min(100, baseProgress + currentVideoContribution));
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

  const playlists = [
    { 
      id: 0, 
      title: "React.js Complete Course", 
      category: "Web Development", 
      playlistId: "PL8p2I9GklV45yqvhcm8tEAzlO1ZE3BJTu"
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
        <div>
          <div className="text-sm text-gray-500">{playlist.category}</div>
          <h1 className="text-2xl font-semibold">{playlist.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}&index=${currentVideo + 1}`}
                title={playlist.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">Currently Playing</h3>
              <p className="text-sm text-gray-600 mt-1">Video {currentVideo + 1} of playlist</p>
              <div className="mt-4 flex gap-2">
                <button className="border rounded-lg px-4 py-2">Mark as Completed</button>
                <button className="border rounded-lg px-4 py-2">Generate Notes</button>
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
                  <span>67%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '67%' }}></div>
                </div>
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
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium">16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Spent:</span>
                    <span className="font-medium">12.5 hrs</span>
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
    </div>
  );
}
