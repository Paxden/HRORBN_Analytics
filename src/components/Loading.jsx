import { useState, useEffect } from "react";
import Logo from "../assets/hr.jpeg";
// #7e796c #6c757d


const Loading = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds total
    const interval = 20; // update every 20ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newPercentage = Math.min(
        Math.floor((currentStep / steps) * 100),
        100,
      );
      setPercentage(newPercentage);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modern-loading">
      <div className="loading-card">
        {/* Animated Logo Brand */}
        <div className="logo-wrapper">
          <div className="logo-ring">
            <img src={Logo} alt="Brand" className="brand-logo" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Loading Message */}
        <p className="loading-message">Preparing your experience...</p>

        {/* Percentage */}
        <div className="percentage">{percentage}%</div>
      </div>

      <style jsx>{`
        .modern-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #ffffff;
        }

        .loading-card {
          text-align: center;
          padding: 3rem;
          border-radius: 20px;
          background: white;
          box-shadow: 0 20px 40px rgba(50, 128, 62, 0.1);
          min-width: 320px;
        }

        .logo-wrapper {
          margin-bottom: 2rem;
        }

        .logo-ring {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          border: 3px solid #;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s ease-in-out infinite;
        }

        .brand-logo {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .progress-container {
          width: 100%;
          height: 6px;
          background: #e0e8e0;
          border-radius: 10px;
          overflow: hidden;
          margin: 2rem 0 1rem;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #7e796c 0%, #6c757d 100%);
          border-radius: 10px;
          transition: width 0.1s linear;
        }

        .loading-message {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 1rem 0;
        }

        .percentage {
          color: #6c757d;
          font-size: 1.5rem;
          font-weight: bold;
          font-family: monospace;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(50, 128, 62, 0.2);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(50, 128, 62, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
