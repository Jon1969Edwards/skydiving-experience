import React, { useEffect, useState } from 'react';
import './App.css';
import Altimeter from './components/Altimeter';
import ThreeDModel from './components/ThreeDModel';

function App() {
  const [altitude, setAltitude] = useState(10000);

  useEffect(() => {
    const fadeOverlay = document.getElementById('fade-overlay');
    const welcomeText = document.getElementById('welcome-text');

    setTimeout(() => {
      fadeOverlay.classList.add('fade-in');
      setTimeout(() => {
        welcomeText.classList.add('text-visible');
      }, 3000);
    }, 12000); 

    // Simulate altitude decrease (example logic)
    const totalDuration = 60000; 
    const updateInterval = 100;
    let progress = 0;

    const interval = setInterval(() => {
      progress += updateInterval;
      const altitudeValue = Math.round(10000 - (progress / totalDuration) * 10000);
      setAltitude(altitudeValue);

      if (progress >= totalDuration) {
        clearInterval(interval);
      }
    }, updateInterval);

    return () => clearInterval(interval);
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
