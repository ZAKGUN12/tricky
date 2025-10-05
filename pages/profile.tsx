import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trick, UserStats, Achievement } from '../lib/types';
import { mockTricks } from '../lib/mockData';
import AnimatedCounter from '../components/AnimatedCounter';

function ProfileContent() {
  // Mock user for now
  const user = { 
    username: 'demo@example.com',
    userId: 'demo-user-123',
    signInDetails: { loginId: 'demo@example.com' }
  };
  const signOut = () => console.log('Sign out clicked');

  const [userStats, setUserStats] = useState<UserStats>({
    tricksShared: 0,
    totalKudos: 0,
    kudosGiven: 0,
    favoritesCount: 0,
    commentsCount: 0,
    followersCount: 0,
    followingCount: 0
  });
  const [userTricks, setUserTricks] = useState<Trick[]>([]);
  const [favoriteTricks, setFavoriteTricks] = useState<Trick[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tricks' | 'favorites' | 'achievements'>('tricks');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Mock user tricks (first 3 tricks as user's)
      const userTricksData = mockTricks.slice(0, 3);
      setUserTricks(userTricksData);
      
      // Mock favorite tricks (random selection)
      const favoriteData = mockTricks.slice(3, 8);
      setFavoriteTricks(favoriteData);
      
      // Calculate user stats
      const totalKudosReceived = userTricksData.reduce((sum, trick) => sum + trick.kudos, 0);
      const stats: UserStats = {
        tricksShared: userTricksData.length,
        totalKudos: totalKudosReceived,
        kudosGiven: 156,
        favoritesCount: favoriteData.length,
        commentsCount: 23,
        followersCount: 45,
        followingCount: 32
      };
      setUserStats(stats);
      
      // Mock achievements
      const userAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Trick',
          description: 'Shared your first trick',
          icon: '🎯',
          category: 'contributor',
          requirement: 1,
          unlockedAt: '2024-09-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Popular Creator',
          description: 'Received 1000+ kudos',
          icon: '⭐',
          category: 'social',
          requirement: 1000,
          unlockedAt: '2024-10-01T15:30:00Z'
        },
        {
          id: '3',
          name: 'Global Explorer',
          description: 'Favorited tricks from 5+ countries',
          icon: '🌍',
          category: 'explorer',
          requirement: 5,
          unlockedAt: '2024-09-28T12:15:00Z'
        },
        {
          id: '4',
          name: 'Coffee Expert',
          description: 'Master of coffee tricks',
          icon: '☕',
          category: 'expert',
          requirement: 1,
          unlockedAt: '2024-10-01T08:00:00Z'
        }
      ];
      setAchievements(userAchievements);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.signInDetails?.loginId?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {user.signInDetails?.loginId?.split('@')[0] || 'User'}
          </h1>
          <p className="profile-email">{user.signInDetails?.loginId}</p>
          <p className="profile-joined">
            Member since September 2024
          </p>
        </div>
        <div className="profile-actions">
          <button className="profile-btn secondary">✏️ Edit Profile</button>
          <button className="profile-btn" onClick={signOut}>🚪 Sign Out</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={userStats.tricksShared} duration={800} />
          </div>
          <div className="stat-label">Tricks Shared</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={userStats.totalKudos} duration={1000} />
          </div>
          <div className="stat-label">Kudos Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={userStats.kudosGiven} duration={1200} />
          </div>
          <div className="stat-label">Kudos Given</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={userStats.favoritesCount} duration={900} />
          </div>
          <div className="stat-label">Favorites</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={userStats.commentsCount} duration={700} />
          </div>
          <div className="stat-label">Comments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <AnimatedCounter value={userStats.followersCount} duration={1100} />
          </div>
          <div className="stat-label">Followers</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'tricks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tricks')}
        >
          📝 My Tricks ({userTricks.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ⭐ Favorites ({favoriteTricks.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements ({achievements.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'tricks' && (
          <div className="tricks-grid">
            {userTricks.length === 0 ? (
              <div className="empty-state">
                <h3>No tricks shared yet</h3>
                <p>Share your first trick to get started!</p>
                <Link href="/submit" className="reset-btn">
                  ➕ Share a Trick
                </Link>
              </div>
            ) : (
              userTricks.map((trick, index) => (
                <Link 
                  key={trick.id} 
                  href={`/trick/${trick.id}`}
                  className="trick-card-link"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="trick-title">{trick.title}</div>
                  <div className="trick-description">{trick.description}</div>
                  <div className="trick-stats">
                    <span>👍 {trick.kudos}</span>
                    <span>⭐ {trick.favorites}</span>
                    <span>💬 {trick.comments}</span>
                    <span>👁️ {trick.views}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="tricks-grid">
            {favoriteTricks.length === 0 ? (
              <div className="empty-state">
                <h3>No favorites yet</h3>
                <p>Start exploring and favorite tricks you love!</p>
                <Link href="/" className="reset-btn">
                  🌍 Explore Tricks
                </Link>
              </div>
            ) : (
              favoriteTricks.map((trick, index) => (
                <Link 
                  key={trick.id} 
                  href={`/trick/${trick.id}`}
                  className="trick-card-link"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="trick-title">{trick.title}</div>
                  <div className="trick-description">{trick.description}</div>
                  <div className="trick-author">by {trick.authorName}</div>
                  <div className="trick-stats">
                    <span>👍 {trick.kudos}</span>
                    <span>⭐ {trick.favorites}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div 
                key={achievement.id} 
                className="achievement-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3 className="achievement-name">{achievement.name}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="achievement-meta">
                    <span className="achievement-category">{achievement.category}</span>
                    <span className="achievement-date">
                      {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav-btn">🏠 Home</Link>
        <Link href="/submit" className="nav-btn">➕ Submit</Link>
        <Link href="/profile" className="nav-btn active">👤 Profile</Link>
      </nav>
    </div>
  );
}

export default function Profile() {
  return <ProfileContent />;
}
