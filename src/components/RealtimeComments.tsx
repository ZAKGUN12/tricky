import { useState, useEffect } from 'react';
import { useRealtime } from '../hooks/useRealtime';

interface Comment {
  id: string;
  content: string;
  userName: string;
  timestamp: string;
}

export default function RealtimeComments({ trickId }: { trickId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { subscribeToComments } = useRealtime();

  useEffect(() => {
    const subscription = subscribeToComments(trickId, (comment) => {
      setComments(prev => [...prev, comment]);
    });

    return () => subscription.unsubscribe();
  }, [trickId]);

  const addComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trickId, content: newComment })
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-4">
      <div className="space-y-2 mb-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded">
            <div className="font-medium text-sm">{comment.userName}</div>
            <div className="text-gray-700">{comment.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(comment.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 border rounded"
          onKeyPress={(e) => e.key === 'Enter' && addComment()}
        />
        <button
          onClick={addComment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
}
