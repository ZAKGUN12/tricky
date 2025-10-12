import { useState, useEffect } from 'react';

export default function Timer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="timer">
      <div className="time-display">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="date-display">
        {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
      </div>
      
      <style jsx>{`
        .timer {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          padding: 0.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .time-display {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1;
        }
        
        .date-display {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
        
        @media (max-width: 768px) {
          .timer {
            min-width: 70px;
            padding: 0.4rem 0.8rem;
          }
          
          .time-display {
            font-size: 0.8rem;
          }
          
          .date-display {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
}
