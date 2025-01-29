import React, { useEffect, useState } from 'react';

function Avatar() {
  const [position, setPosition] = useState({ x: 50, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = document.body.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="avatar"
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transition: 'all 0.3s ease-out',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img 
        src="https://vwr-web1.s3.us-west-1.amazonaws.com/jon/skydiver_model/falling_revised.glb" 
        alt=""
        style={{ width: '50px', height: 'auto' }}
      />
    </div>
  );
}

export default Avatar;