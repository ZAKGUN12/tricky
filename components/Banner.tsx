import Link from 'next/link';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Banner() {
  const { user } = useAuthenticator((context) => [context.user]);

  if (!user) {
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
            background: linear-gradient(135deg, #1d9bf0 0%, #1a8cd8 100%);
            color: white;
            padding: 12px 16px;
            margin-bottom: 0;
            border-bottom: 1px solid #38444d;
          }
          
          .banner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .banner-text {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .banner-message {
            font-size: 0.9rem;
            font-weight: 600;
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
          }
        `}</style>
      </div>
    );
  }

  return (
    <Link href="/submit" className="banner-button">
      <div className="banner-content">
        <div className="banner-text">
          <span className="banner-icon">✨</span>
          <span className="banner-message">Share Your Trick</span>
        </div>
        <div className="banner-action">
          <span className="action-text">Click to Share →</span>
        </div>
      </div>
      
      <style jsx>{`
        .banner-button {
          display: block;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 16px 20px;
          margin-bottom: 0;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .banner-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
        
        .banner-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
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
          gap: 12px;
        }
        
        .banner-icon {
          font-size: 1.5rem;
          animation: bounce 2s infinite;
        }
        
        .banner-message {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .banner-action {
          display: flex;
          align-items: center;
        }
        
        .action-text {
          font-size: 0.9rem;
          font-weight: 600;
          opacity: 0.9;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @media (max-width: 768px) {
          .banner-button {
            padding: 14px 16px;
          }
          
          .banner-content {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          
          .banner-message {
            font-size: 1rem;
          }
          
          .action-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </Link>
  );
}
