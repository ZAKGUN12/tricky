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
        <span className="kudos-count">{kudosCount}</span>
        <span className="kudos-text">{hasUserKudos ? 'Unlike' : 'Like'}</span>
      </button>
    </div>
  );
};

export default KudosButton;
