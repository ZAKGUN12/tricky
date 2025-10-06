export default function Banner() {
  return (
    <div className="banner">
      <div className="banner-content">
        <div className="banner-text">
          <span className="banner-icon">✨</span>
          <span className="banner-message">Discover life-changing tricks from around the world</span>
        </div>
        <div className="banner-stats">
          <span className="stat">🌍 23 Countries</span>
          <span className="stat">💡 Life Hacks</span>
        </div>
      </div>
      
      <style jsx>{`
        .banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 20px;
          margin-bottom: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25);
          position: relative;
          overflow: hidden;
        }
        
        .banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        
        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .banner-text {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .banner-icon {
          font-size: 1.2rem;
          animation: pulse 2s infinite;
        }
        
        .banner-message {
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        
        .banner-stats {
          display: flex;
          gap: 12px;
        }
        
        .stat {
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          border-radius: 8px;
          font-weight: 500;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @media (max-width: 768px) {
          .banner {
            padding: 10px 16px;
          }
          
          .banner-content {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          
          .banner-message {
            font-size: 0.85rem;
          }
          
          .stat {
            font-size: 0.75rem;
            padding: 3px 6px;
          }
        }
      `}</style>
    </div>
  );
}
