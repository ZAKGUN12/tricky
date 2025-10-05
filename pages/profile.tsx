import Link from 'next/link';
import { mockTricks } from '../lib/mockData';

export default function Profile() {
  // Mock user data
  const user = {
    name: 'Demo User',
    email: 'demo@example.com',
    joinedDate: '2024-01-15',
    tricksSubmitted: 3,
    totalKudos: 45,
    favoriteCount: 12
  };

  const userTricks = mockTricks.slice(0, 3); // Show first 3 as user's tricks

  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-btn">← Back</Link>
        <h1>Profile</h1>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="avatar">👤</div>
          <h2>{user.name}</h2>
          <p className="email">{user.email}</p>
          <p className="joined">Joined {new Date(user.joinedDate).toLocaleDateString()}</p>
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
                <h4>{trick.title}</h4>
                <p>{trick.description}</p>
                <div className="trick-stats">
                  <span>👍 {trick.kudos}</span>
                  <span>👁️ {trick.views}</span>
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
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .back-btn {
          color: #666;
          text-decoration: none;
          font-size: 1.1rem;
        }
        
        .profile-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        
        .avatar {
          font-size: 4rem;
          margin-bottom: 15px;
        }
        
        .profile-card h2 {
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .email {
          color: #666;
          margin-bottom: 10px;
        }
        
        .joined {
          color: #999;
          font-size: 0.9rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #3498db;
          margin-bottom: 5px;
        }
        
        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }
        
        .user-tricks {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .user-tricks h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        
        .tricks-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .trick-item {
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 8px;
          transition: background 0.2s;
        }
        
        .trick-item:hover {
          background: #f8f9fa;
        }
        
        .trick-item h4 {
          color: #2c3e50;
          margin-bottom: 8px;
        }
        
        .trick-item p {
          color: #666;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        
        .trick-stats {
          display: flex;
          gap: 15px;
          font-size: 0.9rem;
          color: #999;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-card, .user-tricks {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
