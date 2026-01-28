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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Notes Library</h1>
          <p className="text-sm text-gray-400 mt-1">{notes.length} note{notes.length !== 1 ? 's' : ''} generated</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportAllNotes}
            className="px-4 py-2 rounded-lg border transition-all"
            style={{ 
              borderColor: 'rgb(var(--border))',
              color: 'rgb(var(--text))',
              backgroundColor: 'rgb(var(--background-secondary))'
            }}
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
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(var(--text))' }}>No notes yet</h3>
          <p className="text-gray-400 mb-4">Start watching videos and generate AI notes to see them here</p>
          <button onClick={() => navigate('/playlists')} className="btn-primary">
            Browse Playlists
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notes.map((n, i) => (
            <div key={i} className="card p-4 hover:shadow-lg transition-shadow">
              <div className="font-medium line-clamp-2" style={{ color: 'rgb(var(--text))' }}>{n.title}</div>
              <div className="text-sm text-gray-400">Playlist {n.playlistId} • Video {n.videoId}</div>
              <div className="mt-2 text-sm text-gray-400">{n.pageCount} page{n.pageCount > 1 ? 's' : ''} • {n.wordCount.toLocaleString()} words</div>
              <div className="text-xs text-gray-500">{n.timeAgo}</div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => viewNote(n)}
                  className="rounded-lg px-4 py-2 flex-1 border transition-all"
                  style={{ 
                    borderColor: 'rgb(var(--border))',
                    color: 'rgb(var(--text))',
                    backgroundColor: 'rgb(var(--background-secondary))'
                  }}
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
          <div 
            className="rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl bg-black border border-gray-800"
          >
            <div 
              className="flex items-center justify-between p-4 border-b border-gray-800"
            >
              <div>
                <h3 className="text-xl font-semibold line-clamp-1 text-white">{selectedNote.title}</h3>
                <p className="text-sm text-gray-400">Playlist {selectedNote.playlistId} • Video {selectedNote.videoId}</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-2xl transition-colors text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-black">
              <div 
                className="whitespace-pre-wrap font-sans text-sm leading-relaxed prose prose-sm max-w-none text-white"
                dangerouslySetInnerHTML={{
                  __html: selectedNote.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                    .replace(/^#{1,6}\s+(.+)$/gm, (match, text) => `<h3 class="font-bold text-lg mt-4 mb-2 text-white">${text}</h3>`)
                    .replace(/\n/g, '<br/>')
                }}
              />
            </div>
            <div 
              className="flex gap-2 p-4 border-t border-gray-800 bg-black"
            >
              <button 
                onClick={() => downloadNote(selectedNote)}
                className="btn-primary"
              >
                📥 Download
              </button>
              <button 
                onClick={() => navigate(`/playlist/${selectedNote.playlistId}`)}
                className="rounded-lg px-4 py-2 border border-gray-700 bg-gray-900 text-white transition-all hover:bg-gray-800"
              >
                🎥 Go to Video
              </button>
              <button 
                onClick={() => deleteNote(selectedNote.id)}
                className="rounded-lg px-4 py-2 border border-red-500/30 text-red-400 transition-all hover:bg-red-500/10"
              >
                🗑️ Delete
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-lg px-4 py-2 ml-auto border border-gray-700 bg-gray-900 text-white transition-all hover:bg-gray-800"
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
