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
          position: absolute;
          left: var(--space-4);
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, var(--gray-800), var(--gray-700));
          color: var(--primary);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--primary);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
          font-family: var(--font-sans);
        }
        
        .time-display {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1;
          text-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
        }
        
        .date-display {
          font-size: 0.625rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 1px;
        }
        
        @media (max-width: 768px) {
          .timer {
            position: static;
            transform: none;
            margin-bottom: var(--space-2);
            min-width: 50px;
            padding: var(--space-1) var(--space-2);
          }
          
          .time-display {
            font-size: 0.875rem;
          }
          
          .date-display {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
