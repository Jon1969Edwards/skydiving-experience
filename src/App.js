import React, { useEffect, useState } from 'react';
import './App.css';
import Altimeter from './components/Altimeter';
import ThreeDModel from './components/ThreeDModel';

function App() {
  const [altitude, setAltitude] = useState(10000);

  useEffect(() => {
    const fadeOverlay = document.getElementById('fade-overlay');
    const welcomeText = document.getElementById('welcome-text');

    // Start fade overlay animation after 12 seconds
    const fadeOverlayTimeout = setTimeout(() => {
      if (fadeOverlay) {
        fadeOverlay.classList.add('fade-in');
      }

      // Start welcome text animation 3 seconds after overlay fade
      const welcomeTextTimeout = setTimeout(() => {
        if (welcomeText) {
          welcomeText.classList.add('text-visible');
        }
      }, 3000);

      // Clear nested timeout on cleanup
      return () => clearTimeout(welcomeTextTimeout);
    }, 12000);

    // Simulate altitude decrease
    const totalDuration = 60000; // Total time for altitude to reach 0 (60 seconds)
    const updateInterval = 100; // Altitude updates every 100ms
    let progress = 0;

    const altitudeInterval = setInterval(() => {
      progress += updateInterval;
      const altitudeValue = Math.max(0, Math.round(10000 - (progress / totalDuration) * 10000));
      setAltitude(altitudeValue);

      if (progress >= totalDuration) {
        clearInterval(altitudeInterval);
      }
    }, updateInterval);

    // Cleanup timeouts and intervals on component unmount
    return () => {
      clearTimeout(fadeOverlayTimeout);
      clearInterval(altitudeInterval);
    };
  }, []);

  return (
    <div className="App">
      <div id="background-image"></div>
      <div id="container">
        <div id="model-container">
          <ThreeDModel />
        </div>
      </div>
      <Altimeter altitude={altitude} />
      <div id="fade-overlay" className="fade-to-black"></div>
      <div id="welcome-text" className="welcome-text">Welcome to VWR...</div>
    </div>
  );
}

export default App;
