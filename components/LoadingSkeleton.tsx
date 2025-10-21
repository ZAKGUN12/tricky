export default function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-votes">
            <div className="skeleton-vote-btn"></div>
            <div className="skeleton-count"></div>
            <div className="skeleton-vote-btn"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-meta"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>
            <div className="skeleton-tags">
              <div className="skeleton-tag"></div>
              <div className="skeleton-tag"></div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .skeleton-card {
          display: flex;
          background: rgba(15, 15, 35, 0.6);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(120, 119, 198, 0.2);
        }
        
        .skeleton-votes {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-right: 1rem;
        }
        
        .skeleton-vote-btn {
          width: 24px;
          height: 24px;
          background: rgba(120, 119, 198, 0.3);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-count {
          width: 20px;
          height: 16px;
          background: rgba(120, 119, 198, 0.3);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .skeleton-meta {
          width: 60%;
          height: 16px;
          background: rgba(120, 119, 198, 0.3);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-title {
          width: 80%;
          height: 20px;
          background: rgba(120, 119, 198, 0.4);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-description {
          width: 100%;
          height: 40px;
          background: rgba(120, 119, 198, 0.3);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-tags {
          display: flex;
          gap: 0.5rem;
        }
        
        .skeleton-tag {
          width: 60px;
          height: 20px;
          background: rgba(120, 119, 198, 0.3);
          border-radius: 12px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
