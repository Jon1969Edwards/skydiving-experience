import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './altimeter.css';

function Altimeter({ altitude, loadingPercentage }) {
  const needleRef = useRef(null);

  useEffect(() => {
    // Calculate the needle rotation based on the altitude
    const angle = (altitude / 10000) * -360; // Adjust range based on max altitude
    if (needleRef.current) {
      needleRef.current.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    }
  }, [altitude]);

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

Altimeter.propTypes = {
  altitude: PropTypes.number.isRequired,
  loadingPercentage: PropTypes.number.isRequired,
};

export default Altimeter;
