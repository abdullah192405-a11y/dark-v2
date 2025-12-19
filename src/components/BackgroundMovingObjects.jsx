"use client";

import React from "react";

const BackgroundMovingObjects = () => {
  return (
    <>
      {/* Container is positioned absolutely in the parent section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Golden glowing animated shapes */}
        <div
          className="w-20 h-20 bg-yellow-400 rounded-full opacity-30 shadow-lg animate-floating-slow"
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            animationDelay: "0s",
            filter: "blur(6px)",
          }}
        ></div>
        <div
          className="w-14 h-14 bg-amber-500 rounded-full opacity-25 shadow-md animate-floating-slower"
          style={{
            position: "absolute",
            top: "65%",
            left: "30%",
            animationDelay: "2s",
            filter: "blur(4px)",
          }}
        ></div>
        <div
          className="w-24 h-24 bg-yellow-500 rounded-full opacity-35 shadow-lg animate-floating"
          style={{
            position: "absolute",
            top: "40%",
            left: "75%",
            animationDelay: "1s",
            filter: "blur(8px)",
          }}
        ></div>
        <div
          className="w-12 h-12 bg-amber-400 rounded-full opacity-20 shadow-md animate-floating-slower"
          style={{
            position: "absolute",
            top: "80%",
            left: "60%",
            animationDelay: "3s",
            filter: "blur(5px)",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes floating {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(15px, -15px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        @keyframes floatingSlow {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, -10px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        @keyframes floatingSlower {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(5px, -5px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        .animate-floating {
          animation-name: floating;
          animation-duration: 6s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .animate-floating-slow {
          animation-name: floatingSlow;
          animation-duration: 8s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .animate-floating-slower {
          animation-name: floatingSlower;
          animation-duration: 10s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </>
  );
};

export default BackgroundMovingObjects;
