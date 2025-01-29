import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


function FadeOverlay({ active }) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (active) {
      // Show text after fade completes
      setTimeout(() => setShowText(true), 2000);
    }
  }, [active]);

  return (
    <div className={`fade-to-black ${active ? 'fade-in' : ''}`}>
      {showText && (
        <div className="welcome-text text-visible">
          Welcome to VWR...
        </div>
      )}
    </div>
  );
}

FadeOverlay.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default FadeOverlay;