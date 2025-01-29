import React, { useState, useEffect } from 'react';
import './App.css';
import Altimeter from './components/Altimeter';
import ThreeDModel from './components/ThreeDModel';
import FadeOverlay from './components/FadeOverlay';
import Avatar from './components/Avatar';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [altitude, setAltitude] = useState(10000);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Unified loading/altitude simulation
    const totalDuration = 60000; // 60 seconds total
    const startTime = Date.now();
    const endTime = startTime + totalDuration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = ((totalDuration - remaining) / totalDuration) * 100;
      
      setProgress(Math.min(newProgress, 100));
      setAltitude(10000 - (newProgress * 100));

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      } else {
        setLoadingComplete(true);
      }
    };

    requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(updateProgress);
  }, []);

  return (
    <div className="App">
      <div 
        id="background-image" 
        style={{ 
          transform: `scale(${1 + progress / 50})`,
          filter: `blur(${15 - progress / 6}px)`
        }}
      ></div>

      <div id="container">
        <Avatar />
        <div id="model-container">
          <ThreeDModel altitude={altitude} />
        </div>
      </div>
      
      <Altimeter 
        progress={progress} 
        onComplete={() => setLoadingComplete(true)} 
      />
      
      <FadeOverlay active={loadingComplete} />
    </div>
  );
}

export default App;