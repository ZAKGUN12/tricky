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
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .skeleton-card {
          background: #111 !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          padding: 20px !important;
          animation: pulse 1.5s ease-in-out infinite !important;
          margin: 0 !important;
        }

        .skeleton-header {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 16px !important;
        }

        .skeleton-avatar {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background: #333 !important;
          margin: 0 !important;
        }

        .skeleton-text {
          background: #333 !important;
          border-radius: 4px !important;
          height: 16px !important;
          margin: 0 !important;
        }

        .skeleton-author {
          width: 120px !important;
          flex: 1 !important;
        }

        .skeleton-badge {
          width: 60px !important;
          height: 24px !important;
          border-radius: 12px !important;
          background: #333 !important;
          margin: 0 !important;
        }

        .skeleton-title {
          height: 20px !important;
          width: 80% !important;
          margin-bottom: 12px !important;
        }

        .skeleton-description {
          width: 100% !important;
          margin-bottom: 8px !important;
        }

        .skeleton-description.short {
          width: 60% !important;
          margin-bottom: 16px !important;
        }

        .skeleton-footer {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin: 0 !important;
        }

        .skeleton-tag {
          width: 60px !important;
          height: 20px !important;
          border-radius: 10px !important;
          background: #333 !important;
          margin-right: 8px !important;
        }

        .skeleton-actions {
          display: flex !important;
          gap: 16px !important;
          margin: 0 !important;
        }

        .skeleton-action {
          width: 40px !important;
          height: 16px !important;
          border-radius: 4px !important;
          background: #333 !important;
          margin: 0 !important;
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
