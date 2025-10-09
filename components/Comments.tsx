import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { apiClient } from '../lib/api-client';

interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

interface CommentsProps {
  trickId: string;
  onCommentCountChange?: (count: number) => void;
}

export default function Comments({ trickId, onCommentCountChange }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [trickId]);

  useEffect(() => {
    onCommentCountChange?.(comments.length);
  }, [comments.length, onCommentCountChange]);

  const loadComments = async () => {
    const response = await apiClient.getComments(trickId);
    if (response.data) {
      setComments(response.data as Comment[]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const response = await apiClient.addComment(trickId, {
      text: newComment.trim(),
      authorName: user.username || 'Anonymous',
      authorEmail: user.signInDetails?.loginId || '',
    });

    if (response.data) {
      setComments(prev => [...prev, response.data as Comment]);
      setNewComment('');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="comments-section">
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        💬 Comments ({comments.length})
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="comment-input"
            rows={3}
            maxLength={500}
          />
          <div className="form-footer">
            <span className="char-count">{newComment.length}/500</span>
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="submit-btn"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-state">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="author">{comment.authorName}</span>
                <span className="date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .comments-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .comments-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .comment-form {
          margin-bottom: 2rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .comment-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .comment-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
        }

        .char-count {
          font-size: 12px;
          color: #6b7280;
        }

        .submit-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .comments-list {
          space-y: 1rem;
        }

        .comment {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .author {
          font-weight: 600;
          color: #1e293b;
        }

        .date {
          font-size: 12px;
          color: #6b7280;
        }

        .comment-text {
          margin: 0;
          line-height: 1.5;
          color: #374151;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
