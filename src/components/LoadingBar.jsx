import React, { useRef, useEffect } from 'react';

const LoadingBar = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 4;
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[100] pointer-events-none animate-in fade-in zoom-in duration-150">
      {/* Top Progress Line */}
      <div className="fixed top-0 left-0 h-[4px] bg-yellow-500 shadow-[0_0_15px_#eab308] animate-progress-fast w-full origin-left transition-transform"></div>

      <div className="relative flex flex-col items-center gap-5">
        {/* Deep Glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-[100px] animate-pulse"></div>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="relative w-16 h-16 md:w-20 md:h-20 pointer-events-none brightness-110"
        >
          <source src="/loading.mp4" type="video/mp4" />
        </video>
        <span className="text-yellow-500 text-[10px] font-black tracking-[0.4em] uppercase animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">Loading</span>
      </div>
    </div>
  );
};

export default LoadingBar;
