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
  const [optimisticKudos, setOptimisticKudos] = useState(kudosCount);
  const [optimisticHasKudos, setOptimisticHasKudos] = useState(hasUserKudos);

  // Sync with props when they change
  useEffect(() => {
    setOptimisticKudos(kudosCount);
    setOptimisticHasKudos(hasUserKudos);
  }, [kudosCount, hasUserKudos]);

  const handleClick = async () => {
    if (isLoading || disabled) return;
    
    // Optimistic update
    const newHasKudos = !optimisticHasKudos;
    const newKudosCount = newHasKudos ? optimisticKudos + 1 : Math.max(0, optimisticKudos - 1);
    
    setOptimisticHasKudos(newHasKudos);
    setOptimisticKudos(newKudosCount);
    setIsLoading(true);
    
    try {
      await onKudosToggle(trickId);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticHasKudos(hasUserKudos);
      setOptimisticKudos(kudosCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kudos-button-container">
      <button
        onClick={handleClick}
        className={`kudos-btn ${optimisticHasKudos ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
        disabled={disabled || isLoading}
        aria-label={optimisticHasKudos ? `Remove like (${optimisticKudos})` : `Give like (${optimisticKudos})`}
      >
        <div className="kudos-icon">
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <span className={`heart ${optimisticHasKudos ? 'filled' : ''}`}>
              {optimisticHasKudos ? '❤️' : '🤍'}
            </span>
          )}
        </div>
        <span className="kudos-count">{optimisticKudos}</span>
        <span className="kudos-text">{optimisticHasKudos ? 'Unlike' : 'Like'}</span>
      </button>
    </div>
  );
};

export default KudosButton;
