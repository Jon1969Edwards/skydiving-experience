import React, { useEffect, useState, useRef } from 'react';
import './altimeter.css';

function Altimeter() {
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const needleRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      const images = document.images; // Get all images on the page
      const totalImages = images.length;
      let loadedImages = 0;
      let progress = 0; // Track progress incrementally

      console.log(`Total Images Found: ${totalImages}`);

      if (totalImages === 0) {
        const interval = setInterval(() => {
          if (progress < 100) {
            progress += 1;
            setLoadingPercentage(progress);
          } else {
            clearInterval(interval);
          }
        }, 50); // Slow increment every 50ms
        return;
      }

      const imageLoadHandler = () => {
        loadedImages++;
        console.log(`Image loaded: ${loadedImages}/${totalImages}`);
        const targetPercentage = Math.round((loadedImages / totalImages) * 100);

        const interval = setInterval(() => {
          if (progress < targetPercentage) {
            progress += 1; // Gradually increment progress
            setLoadingPercentage(progress);
          } else {
            clearInterval(interval);
          }
        }, 50); // Slow increment every 50ms
      };

      for (let img of images) {
        if (img.complete) {
          imageLoadHandler();
        } else {
          img.addEventListener('load', imageLoadHandler);
          img.addEventListener('error', imageLoadHandler);
        }
      }

      window.addEventListener('load', () => {
        console.log('Page fully loaded!');
        const interval = setInterval(() => {
          if (progress < 100) {
            progress += 1;
            setLoadingPercentage(progress);
          } else {
            clearInterval(interval);
          }
        }, 50); // Slow increment every 50ms
      });
    };

    updateProgress();

    return () => {
      console.log('Cleaning up listeners...');
      for (let img of document.images) {
        img.removeEventListener('load', updateProgress);
        img.removeEventListener('error', updateProgress);
      }
    };
  }, []);

  useEffect(() => {
    const angle = (loadingPercentage / 100) * 360; // Map 0-100% to 0°-360°
    console.log(`Needle Update - Percentage: ${loadingPercentage}, Angle: ${angle}`);

    if (needleRef.current) {
      needleRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }
  }, [loadingPercentage]);

  return (
    <div className="container">
      <div id="gauge-container">
        <img
          src="https://vwr-web1.s3.us-west-1.amazonaws.com/jon/vwr_dev_with_loading/gauge/Gauge_v4_BODY.png"
          alt="altimeter body"
          className="altimeter-bg"
        />
        <div className="needle-container" id="needle-container">
          <img
            id="needle"
            ref={needleRef}
            src="https://vwr-web1.s3.us-west-1.amazonaws.com/jon/vwr_dev_with_loading/gauge/Gauge_v4_NEEDLE.png"
            alt="needle"
            className="needle"
          />
        </div>
        <div className="text-container" id="text-container">
          <div className="loading-text" id="loading-text">
            {loadingPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default Altimeter;
