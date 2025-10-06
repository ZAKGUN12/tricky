import { useState, useEffect, useCallback } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

interface CommentsSectionProps {
  trickId: string;
  onAuthRequired: () => void;
}

export default function CommentsSection({ trickId, onAuthRequired }: CommentsSectionProps) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/tricks/${trickId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [trickId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tricks/${trickId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newComment,
          authorName: user.signInDetails?.loginId || 'Anonymous'
        })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [...prev, comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Add a comment..." : "Sign in to comment"}
          disabled={!user}
          rows={3}
        />
        <button type="submit" disabled={!user || !newComment.trim() || submitting}>
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.authorName}</strong>
                <span className="comment-date">
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
          margin-top: var(--space-xl);
          padding: var(--space-lg);
          background: var(--glass-bg);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(20px);
        }

        .comment-form {
          margin-bottom: var(--space-lg);
        }

        .comment-form textarea {
          width: 100%;
          padding: var(--space-md);
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          resize: vertical;
          font-family: inherit;
        }

        .comment-form button {
          margin-top: var(--space-sm);
          background: var(--primary-gradient);
          color: white;
          border: none;
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
        }

        .comment-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .comment {
          padding: var(--space-md);
          border-bottom: 1px solid #e2e8f0;
        }

        .comment:last-child {
          border-bottom: none;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-sm);
        }

        .comment-date {
          color: #666;
          font-size: var(--text-sm);
        }

        .comment-text {
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
