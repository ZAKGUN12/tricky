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
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          border-radius: var(--radius-lg);
          padding: 0.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
          box-shadow: 0 4px 16px rgba(120, 119, 198, 0.2);
        }
        
        .time-display {
          font-size: 0.9rem;
          font-weight: 600;
          color: #7877c6;
          line-height: 1;
          text-shadow: 0 0 10px rgba(120, 119, 198, 0.5);
        }
        
        .date-display {
          font-size: 0.7rem;
          font-weight: 500;
          color: #78dbff;
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
