import React from 'react';
import PropTypes from 'prop-types';

function FadeOverlay({ showWelcomeText }) {
  useEffect(() => {
    console.log("FadeOverlay is rendering!");
    const fadeElement = document.querySelector(".fade-to-black");
    if (fadeElement) {
      fadeElement.classList.add("fade-in"); // Trigger fade-in animation
    }
  }, []);
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
