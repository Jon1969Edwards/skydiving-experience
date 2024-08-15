import React, { useEffect, useState } from 'react';
import './App.css';
import Altimeter from './components/Altimeter';
import FadeOverlay from './components/FadeOverlay';
import ThreeDModel from './components/ThreeDModel';

function App() {
  const [altitude, setAltitude] = useState(10000);
  const [showFade, setShowFade] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);

  useEffect(() => {
    const totalDuration = 60000; // Total duration for the altitude decrease and needle animation
    const fadeStartTime = 12000; // Start fading at 12 seconds
    const updateInterval = 100;
    let progress = 0;
    let interval;

    function updateProgress() {
      progress += updateInterval;
      const progressPercentage = Math.min(progress / totalDuration, 1) * 100;
      const altitudeValue = Math.round(10000 - (progressPercentage * 100));
      setAltitude(altitudeValue);

      if (progress >= fadeStartTime) {
        setShowFade(true);
        setTimeout(() => setShowWelcomeText(true), 3000); // Show welcome text after fade completes
        setTimeout(() => window.location.href = '/test', 30000); // Redirect after 30 seconds on black screen
      }

      if (progress < totalDuration) {
        interval = setTimeout(updateProgress, updateInterval);
      }
    }

    updateProgress();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div id="container">
        <div id="overlay">
          <div id="model-container"></div>
        </div>
      </div>
      
      <ThreeDModel />

      <Altimeter altitude={altitude} />
      {showFade && <FadeOverlay showWelcomeText={showWelcomeText} />}
    </div>
  );
}

export default App;
