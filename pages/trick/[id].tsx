import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Trick, Comment } from '../../lib/types';
import { mockTricks, countries } from '../../lib/mockData';
import AnimatedCounter from '../../components/AnimatedCounter';

function TrickDetailContent() {
  const router = useRouter();
  const { id } = router.query;
  const [trick, setTrick] = useState<Trick | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [relatedTricks, setRelatedTricks] = useState<Trick[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number>(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Mock user for now
  const user = { 
    username: 'demo@example.com',
    userId: 'demo-user-123',
    signInDetails: { loginId: 'demo@example.com' }
  };

  useEffect(() => {
    if (id) {
      fetchTrick();
      fetchComments();
    }
  }, [id]);

  const fetchTrick = async () => {
    try {
      const foundTrick = mockTricks.find(t => t.id === id);
      if (foundTrick) {
        setTrick(foundTrick);
        // Find related tricks by tags or country
        const related = mockTricks
          .filter(t => t.id !== id && (
            t.countryCode === foundTrick.countryCode ||
            t.tags.some(tag => foundTrick.tags.includes(tag))
          ))
          .slice(0, 3);
        setRelatedTricks(related);
      }
    } catch (error) {
      console.error('Error fetching trick:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    // Mock comments
    const mockComments: Comment[] = [
      {
        id: '1',
        trickId: id as string,
        authorName: 'Sarah Chen',
        text: 'This trick actually works! Tried it this morning and saved so much time.',
        kudos: 12,
        createdAt: '2024-10-04T10:30:00Z'
      },
      {
        id: '2',
        trickId: id as string,
        authorName: 'Mike Rodriguez',
        text: 'Great explanation! The step-by-step approach makes it really easy to follow.',
        kudos: 8,
        createdAt: '2024-10-03T15:45:00Z'
      }
    ];
    setComments(mockComments);
  };

  const handleKudos = () => {
    if (trick) {
      setTrick({ ...trick, kudos: trick.kudos + 1 });
    }
  };

  const handleFavorite = () => {
    if (trick) {
      setTrick({ ...trick, favorites: trick.favorites + 1 });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      trickId: id as string,
      authorName: 'You',
      text: newComment,
      kudos: 0,
      createdAt: new Date().toISOString()
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleCommentKudos = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, kudos: comment.kudos + 1 }
        : comment
    ));
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // In a real app, this would save to backend
    console.log(`Rated trick ${id} with ${rating} stars`);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `Check out this amazing trick: ${trick?.title}`;
    const text = trick?.description || '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading trick details...</p>
      </div>
    );
  }

  if (!trick) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Trick not found</h3>
          <p>The trick you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="reset-btn">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const country = countries.find(c => c.code === trick.countryCode);

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">🏠 Home</Link>
        <span>›</span>
        <span>{country?.flag} {country?.name}</span>
        <span>›</span>
        <span>{trick.title}</span>
      </div>

      {/* Trick Header */}
      <div className="trick-detail-header">
        <div className="trick-badge">
          <span className="country-flag">{country?.flag}</span>
          <span className="difficulty-badge">
            {trick.difficulty === 'easy' ? '🟢 Easy' : 
             trick.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
          </span>
        </div>
        <h1 className="trick-detail-title">{trick.title}</h1>
        <p className="trick-detail-description">{trick.description}</p>
        
        <div className="trick-detail-meta">
          <div className="meta-item">
            <span className="meta-label">⏱️ Time:</span>
            <span>{trick.timeEstimate}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">👤 Author:</span>
            <span>{trick.authorName}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">📅 Added:</span>
            <span>{new Date(trick.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="trick-detail-actions">
          <button className="action-btn primary" onClick={handleKudos}>
            👍 <AnimatedCounter value={trick.kudos} duration={300} /> Kudos
          </button>
          <button className="action-btn" onClick={handleFavorite}>
            ⭐ <AnimatedCounter value={trick.favorites} duration={300} /> Favorites
          </button>
          <button className="action-btn">
            👁️ <AnimatedCounter value={trick.views} duration={300} /> Views
          </button>
          <button className="action-btn">
            💬 {comments.length} Comments
          </button>
          <div className="share-container">
            <button 
              className="action-btn"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              📤 Share
            </button>
            {showShareMenu && (
              <div className="share-menu">
                <button onClick={() => handleShare('twitter')}>🐦 Twitter</button>
                <button onClick={() => handleShare('facebook')}>📘 Facebook</button>
                <button onClick={() => handleShare('linkedin')}>💼 LinkedIn</button>
                <button onClick={() => handleShare('email')}>📧 Email</button>
                <button onClick={() => handleShare('copy')}>📋 Copy Link</button>
              </div>
            )}
          </div>
        </div>

        {/* Rating Section */}
        <div className="rating-section">
          <span className="rating-label">Rate this trick:</span>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`star ${star <= userRating ? 'active' : ''}`}
                onClick={() => handleRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <span className="rating-text">You rated this {userRating} star{userRating !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Trick Content */}
      <div className="trick-detail-content">
        {trick.steps.length > 0 ? (
          <div className="steps-section">
            <h2>📋 Step-by-Step Instructions</h2>
            <ol className="trick-detail-steps">
              {trick.steps.map((step, index) => (
                <li key={index} className="step-item">
                  <div className="step-content">{step}</div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="tip-section">
            <h2>💡 Quick Tip</h2>
            <div className="tip-content">
              <p>{trick.description}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="tags-section">
          <h3>🏷️ Tags</h3>
          <div className="tags-list">
            {trick.tags.map(tag => (
              <Link key={tag} href={`/?search=${tag}`} className="tag-link">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>💬 Comments ({comments.length})</h2>
        
        {/* Add Comment */}
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this trick..."
            className="comment-input"
            rows={3}
          />
          <button 
            onClick={handleAddComment}
            className="submit-btn"
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.authorName}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="comment-text">{comment.text}</div>
              <div className="comment-actions">
                <button 
                  className="comment-kudos"
                  onClick={() => handleCommentKudos(comment.id)}
                >
                  👍 {comment.kudos}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tricks */}
      {relatedTricks.length > 0 && (
        <div className="related-section">
          <h2>🔗 Related Tricks</h2>
          <div className="related-grid">
            {relatedTricks.map(relatedTrick => (
              <Link key={relatedTrick.id} href={`/trick/${relatedTrick.id}`} className="related-card">
                <div className="related-flag">
                  {countries.find(c => c.code === relatedTrick.countryCode)?.flag}
                </div>
                <h3>{relatedTrick.title}</h3>
                <p>{relatedTrick.description.substring(0, 100)}...</p>
                <div className="related-stats">
                  <span>👍 {relatedTrick.kudos}</span>
                  <span>⭐ {relatedTrick.favorites}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav-btn">🏠 Home</Link>
        <Link href="/submit" className="nav-btn">➕ Submit</Link>
        <Link href="/profile" className="nav-btn">👤 Profile</Link>
      </nav>
    </div>
  );
}

export default function TrickDetail() {
  return <TrickDetailContent />;
}
