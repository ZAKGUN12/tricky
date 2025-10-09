import { useState, useEffect } from 'react';

interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  trend?: number;
}

export default function Statistics() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate realistic statistics
    const generateStats = () => {
      const baseStats = [
        { label: 'Total Tricks', value: 1247, icon: '✨', color: '#00d4aa', trend: 12 },
        { label: 'Total Views', value: 45623, icon: '👁️', color: '#3498db', trend: 8 },
        { label: 'Total Kudos', value: 8934, icon: '👍', color: '#e74c3c', trend: 15 },
        { label: 'Active Users', value: 2156, icon: '👥', color: '#f39c12', trend: 5 },
        { label: 'Countries', value: 23, icon: '🌍', color: '#9b59b6', trend: 2 },
        { label: 'Comments', value: 3421, icon: '💬', color: '#1abc9c', trend: 18 }
      ];

      // Add some randomness to make it feel live
      const liveStats = baseStats.map(stat => ({
        ...stat,
        value: stat.value + Math.floor(Math.random() * 50)
      }));

      setStats(liveStats);
      setLoading(false);
    };

    generateStats();
    
    // Update stats every 30 seconds
    const interval = setInterval(generateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="stats-container">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="stat-card loading">
            <div className="stat-skeleton"></div>
          </div>
        ))}
        <style jsx>{`
          .stats-container {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
            gap: 16px !important;
            margin: 20px 0 !important;
          }
          .stat-card.loading {
            background: #111 !important;
            border: 1px solid #333 !important;
            border-radius: 12px !important;
            padding: 20px !important;
            height: 100px !important;
          }
          .stat-skeleton {
            background: #333 !important;
            height: 60px !important;
            border-radius: 8px !important;
            animation: pulse 1.5s ease-in-out infinite !important;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="stats-container">
      {stats.map((stat, index) => (
        <div key={stat.label} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="stat-header">
            <span className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </span>
            {stat.trend && (
              <span className="stat-trend">
                +{stat.trend}%
              </span>
            )}
          </div>
          <div className="stat-value" style={{ color: stat.color }}>
            {formatNumber(stat.value)}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}

      <style jsx>{`
        .stats-container {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
          gap: 16px !important;
          margin: 20px 0 !important;
          padding: 0 !important;
        }

        .stat-card {
          background: linear-gradient(135deg, #111 0%, #1a1a1a 100%) !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          padding: 20px !important;
          transition: all 0.3s ease !important;
          animation: slideUp 0.6s ease forwards !important;
          opacity: 0 !important;
          transform: translateY(20px) !important;
          position: relative !important;
          overflow: hidden !important;
          margin: 0 !important;
        }

        .stat-card::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: -100% !important;
          width: 100% !important;
          height: 2px !important;
          background: linear-gradient(90deg, transparent, #00d4aa, transparent) !important;
          animation: shimmer 2s infinite !important;
        }

        .stat-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
          border-color: #555 !important;
        }

        .stat-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 12px !important;
        }

        .stat-icon {
          font-size: 24px !important;
          margin: 0 !important;
        }

        .stat-trend {
          background: rgba(0, 212, 170, 0.1) !important;
          color: #00d4aa !important;
          padding: 4px 8px !important;
          border-radius: 12px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          margin: 0 !important;
        }

        .stat-value {
          font-size: 32px !important;
          font-weight: 800 !important;
          margin-bottom: 8px !important;
          text-shadow: 0 0 10px currentColor !important;
        }

        .stat-label {
          color: #888 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          margin: 0 !important;
        }

        @keyframes slideUp {
          to {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @media (max-width: 768px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          
          .stat-card {
            padding: 16px !important;
          }
          
          .stat-value {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
