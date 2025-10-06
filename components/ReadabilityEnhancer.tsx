import { useState } from 'react';

interface ReadabilityEnhancerProps {
  children: React.ReactNode;
}

export default function ReadabilityEnhancer({ children }: ReadabilityEnhancerProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={`readability-wrapper ${highContrast ? 'high-contrast' : ''}`}>
      {/* Accessibility Toolbar */}
      <div className="accessibility-toolbar">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="accessibility-toggle"
          aria-label="Toggle accessibility settings"
        >
          ⚙️
        </button>
        
        {showSettings && (
          <div className="accessibility-panel">
            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
                High Contrast
              </label>
            </div>
          </div>
        )}
      </div>

      {children}

      <style jsx>{`
        .accessibility-toolbar {
          position: fixed;
          top: 100px;
          right: 20px;
          z-index: 1000;
        }

        .accessibility-toggle {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          width: 48px;
          height: 48px;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          transition: var(--transition);
        }

        .accessibility-toggle:hover {
          transform: scale(1.1);
        }

        .accessibility-panel {
          position: absolute;
          right: 0;
          top: 60px;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          box-shadow: var(--shadow-xl);
          min-width: 180px;
        }

        .setting-group label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 600;
          color: var(--gray-700);
          cursor: pointer;
        }

        .high-contrast {
          filter: contrast(1.5) brightness(1.2);
        }

        .high-contrast .trick-card {
          border: 2px solid var(--gray-800);
        }

        .high-contrast .trick-title {
          color: var(--gray-900);
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .accessibility-toolbar {
            top: 80px;
            right: 10px;
          }
          
          .accessibility-toggle {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
