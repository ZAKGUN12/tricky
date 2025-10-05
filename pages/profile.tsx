import Link from 'next/link';
import { mockTricks, countries } from '../lib/mockData';

export default function Profile() {
  // Mock user data
  const user = {
    name: 'Demo User',
    email: 'demo@example.com',
    countryCode: 'US',
    joinedDate: '2024-01-15',
    tricksSubmitted: 3,
    totalKudos: 45,
    favoriteCount: 12
  };

  const userTricks = mockTricks.slice(0, 3);
  const country = countries.find(c => c.code === user.countryCode);

  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-btn">← Back</Link>
        <h1>Profile</h1>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-section">
              <div className="avatar">👤</div>
              <span className="country-flag">{country?.flag}</span>
            </div>
            <div className="user-info">
              <h2>{user.name}</h2>
              <p className="email">{user.email}</p>
              <p className="joined">Joined {new Date(user.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{user.tricksSubmitted}</div>
            <div className="stat-label">Tricks Shared</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{user.totalKudos}</div>
            <div className="stat-label">Total Kudos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{user.favoriteCount}</div>
            <div className="stat-label">Favorites</div>
          </div>
        </div>

        <div className="user-tricks">
          <h3>Your Tricks</h3>
          <div className="tricks-list">
            {userTricks.map(trick => (
              <div key={trick.id} className="trick-item">
                <div className="trick-header">
                  <h4>{trick.title}</h4>
                  <span className={`difficulty-badge ${trick.difficulty}`}>
                    {trick.difficulty === 'easy' ? '🟢' : 
                     trick.difficulty === 'medium' ? '🟡' : '🔴'}
                  </span>
                </div>
                <p>{trick.description}</p>
                <div className="trick-stats">
                  <span>👍 {trick.kudos}</span>
                  <span>👁️ {trick.views}</span>
                  <span>💬 {trick.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
          background: var(--glass-bg);
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
        }
        
        .back-btn {
          color: #667eea;
          text-decoration: none;
          font-size: var(--text-lg);
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .back-btn:hover {
          color: #764ba2;
          transform: translateX(-3px);
        }
        
        .profile-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-card {
          background: var(--glass-bg);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
          margin-bottom: var(--space-xl);
          backdrop-filter: blur(20px);
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
        }
        
        .avatar-section {
          position: relative;
        }
        
        .avatar {
          font-size: 4rem;
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .country-flag {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 1.5rem;
          background: white;
          border-radius: 50%;
          padding: var(--space-xs);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .user-info h2 {
          color: var(--text-primary);
          margin-bottom: var(--space-xs);
          font-size: var(--text-xl);
        }
        
        .email {
          color: var(--text-secondary);
          margin-bottom: var(--space-xs);
          font-size: var(--text-sm);
        }
        
        .joined {
          color: var(--text-muted);
          font-size: var(--text-xs);
          margin: 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }
        
        .stat-card {
          background: var(--glass-bg);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          text-align: center;
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
        }
        
        .stat-number {
          font-size: var(--text-2xl);
          font-weight: bold;
          color: #667eea;
          margin-bottom: var(--space-xs);
        }
        
        .stat-label {
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }
        
        .user-tricks {
          background: var(--glass-bg);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
        }
        
        .user-tricks h3 {
          color: var(--text-primary);
          margin-bottom: var(--space-lg);
          font-size: var(--text-lg);
        }
        
        .tricks-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        
        .trick-item {
          padding: var(--space-md);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.5);
        }
        
        .trick-item:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
        }
        
        .trick-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-sm);
        }
        
        .trick-item h4 {
          color: var(--text-primary);
          margin: 0;
          font-size: var(--text-base);
        }
        
        .difficulty-badge {
          font-size: var(--text-xs);
          padding: 2px 8px;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        
        .difficulty-badge.easy {
          background: rgba(67, 233, 123, 0.2);
          color: #2d8f47;
        }
        
        .difficulty-badge.medium {
          background: rgba(254, 202, 87, 0.2);
          color: #b8860b;
        }
        
        .difficulty-badge.hard {
          background: rgba(250, 112, 154, 0.2);
          color: #c53030;
        }
        
        .trick-item p {
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
          line-height: 1.4;
          font-size: var(--text-sm);
        }
        
        .trick-stats {
          display: flex;
          gap: var(--space-md);
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-card, .user-tricks {
            padding: var(--space-lg);
          }
          
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
