import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAllNotes();
  }, []);

  const loadAllNotes = () => {
    const allNotes = [];
    // Check all possible playlist and video combinations
    for (let playlistId = 0; playlistId < 18; playlistId++) {
      for (let videoId = 0; videoId < 50; videoId++) {
        const noteKey = `playlist_${playlistId}_video_${videoId}_notes`;
        const noteContent = localStorage.getItem(noteKey);
        if (noteContent) {
          // Extract title from notes (first line after # marker)
          const titleMatch = noteContent.match(/^#\s*📚\s*(.+)/m);
          const title = titleMatch ? titleMatch[1].trim() : `Playlist ${playlistId} - Video ${videoId}`;
          
          // Calculate word count
          const wordCount = noteContent.split(/\s+/).length;
          const pageCount = Math.ceil(wordCount / 400);
          
          // Get timestamp info
          const dateMatch = noteContent.match(/\*\*📅 Generated:\*\*\s*(.+)/);
          const generatedDate = dateMatch ? new Date(dateMatch[1]) : new Date();
          const hoursAgo = Math.floor((Date.now() - generatedDate.getTime()) / (1000 * 60 * 60));
          const timeAgo = hoursAgo < 1 ? 'Just now' : 
                         hoursAgo < 24 ? `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago` :
                         `${Math.floor(hoursAgo / 24)} day${Math.floor(hoursAgo / 24) > 1 ? 's' : ''} ago`;

          allNotes.push({
            id: noteKey,
            playlistId,
            videoId,
            title,
            content: noteContent,
            wordCount,
            pageCount,
            timeAgo,
            generatedDate
          });
        }
      }
    }
    // Sort by most recent
    allNotes.sort((a, b) => b.generatedDate - a.generatedDate);
    setNotes(allNotes);
  };

  const viewNote = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const downloadNote = (note) => {
    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteNote = (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      localStorage.removeItem(noteId);
      loadAllNotes();
      setShowModal(false);
    }
  };

  const exportAllNotes = () => {
    const allContent = notes.map(n => `${n.content}\n\n${'='.repeat(80)}\n\n`).join('');
    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All_Course_Notes_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Notes Library</h1>
          <p className="text-sm text-gray-500 mt-1">{notes.length} note{notes.length !== 1 ? 's' : ''} generated</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportAllNotes}
            className="border rounded-lg px-4 py-2 hover:bg-gray-50"
            disabled={notes.length === 0}
          >
            📥 Export All
          </button>
          <button 
            onClick={() => navigate('/playlists')}
            className="btn-primary"
          >
            ➕ Generate New Notes
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p className="text-gray-500 mb-4">Start watching videos and generate AI notes to see them here</p>
          <button onClick={() => navigate('/playlists')} className="btn-primary">
            Browse Playlists
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notes.map((n, i) => (
            <div key={i} className="card p-4 hover:shadow-lg transition-shadow">
              <div className="font-medium line-clamp-2">{n.title}</div>
              <div className="text-sm text-gray-500">Playlist {n.playlistId} • Video {n.videoId}</div>
              <div className="mt-2 text-sm text-gray-500">{n.pageCount} page{n.pageCount > 1 ? 's' : ''} • {n.wordCount.toLocaleString()} words</div>
              <div className="text-xs text-gray-400">{n.timeAgo}</div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => viewNote(n)}
                  className="border rounded-lg px-4 py-2 flex-1 hover:bg-gray-50"
                >
                  👁️ View
                </button>
                <button 
                  onClick={() => downloadNote(n)}
                  className="btn-primary flex-1"
                >
                  📥 Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Preview Modal */}
      {showModal && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-xl font-semibold line-clamp-1">{selectedNote.title}</h3>
                <p className="text-sm text-gray-500">Playlist {selectedNote.playlistId} • Video {selectedNote.videoId}</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{selectedNote.content}</pre>
            </div>
            <div className="flex gap-2 p-4 border-t">
              <button 
                onClick={() => downloadNote(selectedNote)}
                className="btn-primary"
              >
                📥 Download
              </button>
              <button 
                onClick={() => navigate(`/playlist/${selectedNote.playlistId}`)}
                className="border rounded-lg px-4 py-2"
              >
                🎥 Go to Video
              </button>
              <button 
                onClick={() => deleteNote(selectedNote.id)}
                className="border rounded-lg px-4 py-2 text-red-600 hover:bg-red-50"
              >
                🗑️ Delete
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="border rounded-lg px-4 py-2 ml-auto"
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
