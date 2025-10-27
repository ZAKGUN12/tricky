import React, { useState } from 'react';

interface KudosButtonProps {
  trickId: string;
  kudosCount: number;
  hasUserKudos: boolean;
  onKudosGive: (trickId: string) => Promise<void>;
  onKudosRemove: (trickId: string) => Promise<void>;
  disabled?: boolean;
}

const KudosButton: React.FC<KudosButtonProps> = ({
  trickId,
  kudosCount,
  hasUserKudos,
  onKudosGive,
  onKudosRemove,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleKudosAction = async () => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      if (hasUserKudos) {
        await onKudosRemove(trickId);
      } else {
        await onKudosGive(trickId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kudos-button-container">
      <button
        onClick={handleKudosAction}
        className={`kudos-btn ${hasUserKudos ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
        disabled={disabled || isLoading}
        aria-label={hasUserKudos ? `Remove kudos (${kudosCount})` : `Give kudos (${kudosCount})`}
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
        <span className="kudos-text">{hasUserKudos ? 'Liked' : 'Like'}</span>
      </button>
    </div>
  );
};

export default KudosButton;
