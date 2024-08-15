import React from 'react';
import PropTypes from 'prop-types';

function FadeOverlay({ showWelcomeText }) {
  return (
    <div className="fade-to-black">
      {showWelcomeText && <div className="welcome-text">Welcome to VWR...</div>}
    </div>
  );
}

FadeOverlay.propTypes = {
  showWelcomeText: PropTypes.bool.isRequired,
};

export default FadeOverlay;
