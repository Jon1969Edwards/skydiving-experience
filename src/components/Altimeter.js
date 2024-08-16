import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import altimeterImage from '../assets/newest-alt1.png'; // Adjust path as needed

function Altimeter({ altitude }) {
  const needleRef = useRef(null);

  useEffect(() => {
    const angle = (altitude / 10000) * -360;
    if (needleRef.current) {
      needleRef.current.style.transform = `rotate(${angle}deg)`;
    }
  }, [altitude]);

  return (
    <div className="container generic-container">
      <div className="loader circle-loader">
        <div className="inner-circle">
          <img src={altimeterImage} alt="altimeter" className="altimeter-bg" />
          <svg className="needle" ref={needleRef} id="needle" viewBox="0 0 100 100">
            <polygon points="50,10 47,50 53,50" style={{ fill: 'black' }} />
          </svg>
          <div className="altimeter-text">Altimeter</div>
          <div className="altitude">Altitude: {altitude} m</div>
        </div>

        <div className="segment-display">
          <div className="small-text">Loading...</div>
          <div id="altitude-value">{altitude}</div>
        </div>
      </div>
    </div>
  );
}

Altimeter.propTypes = {
  altitude: PropTypes.number.isRequired,
};

export default Altimeter;
