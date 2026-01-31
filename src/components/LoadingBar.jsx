import React, { useRef, useEffect } from 'react';

const LoadingBar = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
      <video ref={videoRef} autoPlay loop muted className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 pointer-events-none">
        <source src="/loading.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default LoadingBar;
