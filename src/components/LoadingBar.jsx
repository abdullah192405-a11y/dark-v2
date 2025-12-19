import React from 'react';

const LoadingBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader"></div>
    </div>
  );
};

export default LoadingBar;
