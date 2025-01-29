import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './altimeter.css';

function Altimeter({ progress, onComplete }) {
  const needleRef = useRef(null);

  useEffect(() => {
    // Correct counterclockwise rotation starting from the top
    const angle = -((progress / 100) * 360); // Negative for counterclockwise rotation

    if (needleRef.current) {
      needleRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className="container">
      <div id="gauge-container">
        <img
          src="https://vwr-web1.s3.us-west-1.amazonaws.com/jon/vwr_dev_with_loading/gauge/Gauge_v4_BODY.png"
          alt="altimeter body"
          className="altimeter-bg"
        />
        <div className="needle-container">
          <img
            ref={needleRef}
            src="https://vwr-web1.s3.us-west-1.amazonaws.com/jon/vwr_dev_with_loading/gauge/Gauge_v4_NEEDLE.png"
            alt="altimeter needle"
            className="needle"
            style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }} // Start at top (0°)
          />
        </div>
        <div className="text-container top-right">
          <div className="loading-text">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}

Altimeter.propTypes = {
  progress: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default Altimeter;