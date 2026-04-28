import Logo from "../assets/nmcn.jpeg";

const Loading = () => {
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
          <div className="progress-bar"></div>
        </div>

        {/* Loading Message */}
        <p className="loading-message">Preparing your experience...</p>

        {/* Percentage */}
        <div className="percentage">85%</div>
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
          border: 3px solid #78a372;
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
          width: 85%;
          height: 100%;
          background: linear-gradient(90deg, #78a372 0%, #32803e 100%);
          border-radius: 10px;
          animation: loading 2s ease-in-out infinite;
        }

        .loading-message {
          color: #78a372;
          font-size: 0.9rem;
          margin: 1rem 0;
        }

        .percentage {
          color: #32803e;
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

        @keyframes loading {
          0% {
            width: 0%;
            opacity: 0.7;
          }
          50% {
            width: 85%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
