import React, { useState, useEffect } from 'react';

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

  // Calculate display values based on current props
  const displayKudos = kudosCount;
  const displayHasKudos = hasUserKudos;

  return (
    <div className="kudos-button-container">
      <button
        onClick={handleClick}
        className={`kudos-btn ${displayHasKudos ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
        disabled={disabled || isLoading}
        aria-label={displayHasKudos ? `Remove like (${displayKudos})` : `Give like (${displayKudos})`}
      >
        <div className="kudos-icon">
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <span className={`heart ${displayHasKudos ? 'filled' : ''}`}>
              {displayHasKudos ? '❤️' : '🤍'}
            </span>
          )}
        </div>
        <span className="kudos-count">{displayKudos}</span>
        <span className="kudos-text">{displayHasKudos ? 'Unlike' : 'Like'}</span>
      </button>
    </div>
  );
};

export default KudosButton;
