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
        {time.toLocaleTimeString()}
      </div>
      <div className="date-display">
        {time.toLocaleDateString()}
      </div>
      
      <style jsx>{`
        .timer {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          font-family: 'Courier New', monospace;
          z-index: 1000;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .time-display {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
        
        .date-display {
          font-size: 12px;
          text-align: center;
          opacity: 0.8;
          margin-top: 4px;
        }
        
        @media (max-width: 768px) {
          .timer {
            top: 10px;
            left: 10px;
            padding: 8px 12px;
          }
          
          .time-display {
            font-size: 14px;
          }
          
          .date-display {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
