"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ImageLightbox = ({ images, initialIndex = 0, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Sync with external initialIndex when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setSlideDirection(null);
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goToNext = useCallback(() => {
    if (!images || images.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("left");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 250);
  }, [images, isAnimating]);

  const goToPrev = useCallback(() => {
    if (!images || images.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setSlideDirection("right");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 250);
  }, [images, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToPrev(); // RTL: right goes to previous
      if (e.key === "ArrowLeft") goToNext(); // RTL: left goes to next
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrev]);

  // Touch / swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="إغلاق"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image counter */}
      <div className="lightbox-counter">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            className="lightbox-nav lightbox-nav-right"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="الصورة السابقة"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <button
            className="lightbox-nav lightbox-nav-left"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="الصورة التالية"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Main image */}
      <div
        className={`lightbox-image-container ${
          slideDirection === "left"
            ? "lightbox-slide-left"
            : slideDirection === "right"
            ? "lightbox-slide-right"
            : "lightbox-slide-center"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`صورة ${currentIndex + 1} من ${images.length}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="lightbox-thumbnails"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`lightbox-thumb ${
                idx === currentIndex ? "lightbox-thumb-active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              <Image
                src={img}
                alt={`صورة مصغرة ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      <style jsx global>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lightbox-fade-in 0.25s ease-out;
        }

        @keyframes lightbox-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .lightbox-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10001;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
        }

        .lightbox-counter {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10001;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          background: rgba(0, 0, 0, 0.5);
          padding: 6px 16px;
          border-radius: 20px;
          letter-spacing: 2px;
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10001;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 50%;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-50%) scale(1.1);
        }
        .lightbox-nav-left {
          left: 16px;
        }
        .lightbox-nav-right {
          right: 16px;
        }

        .lightbox-image-container {
          position: relative;
          width: 85vw;
          height: 75vh;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .lightbox-slide-center {
          transform: translateX(0);
          opacity: 1;
        }
        .lightbox-slide-left {
          transform: translateX(-60px);
          opacity: 0;
        }
        .lightbox-slide-right {
          transform: translateX(60px);
          opacity: 0;
        }

        .lightbox-thumbnails {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 12px;
          overflow-x: auto;
          max-width: 90vw;
          z-index: 10001;
        }
        .lightbox-thumbnails::-webkit-scrollbar {
          height: 4px;
        }
        .lightbox-thumbnails::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .lightbox-thumb {
          position: relative;
          width: 64px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid transparent;
          opacity: 0.5;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
          background: none;
        }
        .lightbox-thumb:hover {
          opacity: 0.8;
        }
        .lightbox-thumb-active {
          border-color: #ca8a04;
          opacity: 1;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .lightbox-image-container {
            width: 95vw;
            height: 60vh;
          }
          .lightbox-nav {
            width: 40px;
            height: 40px;
          }
          .lightbox-nav-left {
            left: 8px;
          }
          .lightbox-nav-right {
            right: 8px;
          }
          .lightbox-thumb {
            width: 48px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageLightbox;
