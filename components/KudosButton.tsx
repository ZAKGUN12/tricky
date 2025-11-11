import React, { useState } from 'react';

interface KudosButtonProps {
  trickId: string;
  kudosCount: number;
  hasUserKudos: boolean;
  onKudosToggle: (trickId: string) => Promise<void>;
  disabled?: boolean;
}

const KudosButton: React.FC<KudosButtonProps> = ({
  trickId,
  kudosCount,
  hasUserKudos,
  onKudosToggle,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    
    try {
      await onKudosToggle(trickId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kudos-button-container">
      <button
        onClick={handleClick}
        className={`kudos-btn ${hasUserKudos ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
        disabled={disabled || isLoading}
        aria-label={hasUserKudos ? `Remove like (${kudosCount})` : `Give like (${kudosCount})`}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: hasUserKudos ? 'linear-gradient(135deg, #ff77c6, #7877c6)' : 'rgba(255, 119, 198, 0.1)',
          border: `1px solid ${hasUserKudos ? '#ff77c6' : 'rgba(255, 119, 198, 0.3)'}`,
          borderRadius: '1.5rem',
          color: hasUserKudos ? 'white' : '#ff77c6',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      >
        <div className="kudos-icon">
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <span className={`heart ${hasUserKudos ? 'filled' : ''}`}>
              {hasUserKudos ? '❤️' : '🤍'}
            </span>
          )}
        </div>
        <span className="kudos-count" data-count={kudosCount}>{kudosCount}</span>
        <span className="kudos-text">{hasUserKudos ? 'Unlike' : 'Like'}</span>
      </button>
    </div>
  );
};

export default KudosButton;
