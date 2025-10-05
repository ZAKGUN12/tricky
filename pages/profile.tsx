import { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Trick, UserStats } from '../lib/types';

function ProfileContent() {
  const { signOut, user } = useAuthenticator();
  const [userStats, setUserStats] = useState<UserStats>({
    tricksShared: 0,
    totalKudos: 0,
    kudosGiven: 0,
    favoritesCount: 0
  });
  const [userTricks, setUserTricks] = useState<Trick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user/${user?.userId}/data`);
      const data = await response.json();
      setUserStats(data.stats);
      setUserTricks(data.tricks || []);
    } catch (error) {
      console.log('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Your Profile</h1>
        <p>Manage your TrickShare account</p>
      </header>

      <div className="form">
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>Account Information</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong>Email:</strong> {user?.signInDetails?.loginId}
            </div>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong>Username:</strong> {user?.signInDetails?.loginId?.split('@')[0]}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>Your Stats</h3>
          {loading ? (
            <div className="loading">Loading stats...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{userStats.tricksShared}</div>
                <div className="stat-label">Tricks Shared</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userStats.totalKudos}</div>
                <div className="stat-label">Total Kudos</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userStats.kudosGiven}</div>
                <div className="stat-label">Kudos Given</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userStats.favoritesCount}</div>
                <div className="stat-label">Favorites</div>
              </div>
            </div>
          )}
        </div>

        {userTricks.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>Your Tricks</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {userTricks.map(trick => (
                <div key={trick.id} style={{ 
                  background: '#f8fafc', 
                  padding: '20px', 
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>{trick.title}</h4>
                  <p style={{ margin: '8px 0', color: '#64748b', fontSize: '14px' }}>
                    {trick.description}
                  </p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                    <span>👍 {trick.kudos} kudos</span>
                    <span>👁️ {trick.views} views</span>
                    <span>❤️ {trick.favorites} favorites</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={signOut}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            width: '100%'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#dc2626';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#ef4444';
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Authenticator>
      <ProfileContent />
    </Authenticator>
  );
}
