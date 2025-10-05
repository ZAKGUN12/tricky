import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Trick, Comment } from '../../lib/types';

function TrickDetailContent() {
  const router = useRouter();
  const { id } = router.query;
  // Mock user for now
  const user = { 
    username: 'demo@example.com',
    userId: 'demo-user-123',
    signInDetails: { loginId: 'demo@example.com' }
  };
  
  const [trick, setTrick] = useState<Trick | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTrick();
      fetchComments();
    }
  }, [id]);

  const fetchTrick = async () => {
    const response = await fetch(`/api/tricks/${id}`);
    const data = await response.json();
    setTrick(data.trick);
    setLoading(false);
  };

  const fetchComments = async () => {
    const response = await fetch(`/api/tricks/${id}/comments`);
    const data = await response.json();
    setComments(data.comments || []);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const response = await fetch(`/api/tricks/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: newComment,
        authorId: user.userId,
        authorName: user.signInDetails?.loginId?.split('@')[0]
      })
    });

    if (response.ok) {
      setNewComment('');
      fetchComments();
      fetchTrick(); // Update comment count
    }
  };

  const giveKudos = async () => {
    if (!user || !trick) return;
    
    const response = await fetch(`/api/tricks/${trick.id}/kudos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId })
    });

    if (response.ok) {
      fetchTrick();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading trick...
        </div>
      </div>
    );
  }

  if (!trick) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Trick not found</h3>
          <button onClick={() => router.push('/')} className="submit-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        onClick={() => router.back()} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#667eea', 
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '14px'
        }}
      >
        ← Back
      </button>

      <div className="trick-detail">
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#2d3748' }}>
            {trick.title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '20px' }}>
            {trick.description}
          </p>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ 
              background: getDifficultyColor(trick.difficulty), 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '15px', 
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {trick.difficulty.toUpperCase()}
            </span>
            <span style={{ color: '#64748b', fontSize: '14px' }}>
              ⏱️ {trick.timeEstimate}
            </span>
            <span style={{ color: '#64748b', fontSize: '14px' }}>
              By {trick.authorName || 'Anonymous'}
            </span>
            <span style={{ color: '#64748b', fontSize: '14px' }}>
              👁️ {trick.views} views
            </span>
          </div>
        </header>

        <div className="trick-steps" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>Steps</h3>
          <ol className="trick-steps">
            {trick.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {trick.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          <button className="action-btn" onClick={giveKudos}>
            👍 {trick.kudos}
          </button>
          <span className="action-btn" style={{ cursor: 'default' }}>
            💬 {trick.comments}
          </span>
          <span className="action-btn" style={{ cursor: 'default' }}>
            ❤️ {trick.favorites}
          </span>
        </div>

        <div className="comments-section">
          <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>
            Comments ({comments.length})
          </h3>

          {user && (
            <form onSubmit={submitComment} style={{ marginBottom: '30px' }}>
              <textarea
                className="form-textarea"
                placeholder="Share your thoughts or experience with this trick..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <button type="submit" className="submit-btn" disabled={!newComment.trim()}>
                Post Comment
              </button>
            </form>
          )}

          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} style={{
                background: '#f8fafc',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '15px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ color: '#2d3748' }}>
                    {comment.authorName || 'Anonymous'}
                  </strong>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#4a5568', marginBottom: '10px' }}>
                  {comment.text}
                </p>
                <button 
                  className="action-btn"
                  style={{ fontSize: '12px' }}
                  onClick={() => {
                    // Add comment kudos functionality
                  }}
                >
                  👍 {comment.kudos}
                </button>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                No comments yet. Be the first to share your experience!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrickDetail() {
  return <TrickDetailContent />;
}
