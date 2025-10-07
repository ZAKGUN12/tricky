export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text skeleton-author"></div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-description"></div>
          <div className="skeleton-text skeleton-description short"></div>
          <div className="skeleton-footer">
            <div className="skeleton-tag"></div>
            <div className="skeleton-tag"></div>
            <div className="skeleton-actions">
              <div className="skeleton-action"></div>
              <div className="skeleton-action"></div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-card {
          background: #111;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .skeleton-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #333;
        }

        .skeleton-text {
          background: #333;
          border-radius: 4px;
          height: 16px;
        }

        .skeleton-author {
          width: 120px;
          flex: 1;
        }

        .skeleton-badge {
          width: 60px;
          height: 24px;
          border-radius: 12px;
          background: #333;
        }

        .skeleton-title {
          height: 20px;
          width: 80%;
          margin-bottom: 12px;
        }

        .skeleton-description {
          width: 100%;
          margin-bottom: 8px;
        }

        .skeleton-description.short {
          width: 60%;
          margin-bottom: 16px;
        }

        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skeleton-tag {
          width: 60px;
          height: 20px;
          border-radius: 10px;
          background: #333;
          margin-right: 8px;
        }

        .skeleton-actions {
          display: flex;
          gap: 16px;
        }

        .skeleton-action {
          width: 40px;
          height: 16px;
          border-radius: 4px;
          background: #333;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
