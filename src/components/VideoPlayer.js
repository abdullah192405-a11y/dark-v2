"use client";
import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = ({
    src,
    mobileSrc,
    poster,
    autoPlay = true,
    muted = true,
    loop = true,
    className = "",
    playOnScroll = false
}) => {
    const videoRef = useRef(null);
    const [currentSrc, setCurrentSrc] = useState(src);

    // Handle Responsive Source
    useEffect(() => {
        const updateSrc = () => {
            const isMobile = window.innerWidth <= 768;
            const newSrc = isMobile && mobileSrc ? mobileSrc : src;
            if (newSrc !== currentSrc) {
                setCurrentSrc(newSrc);
            }
        };

        updateSrc();
        window.addEventListener("resize", updateSrc);
        return () => window.removeEventListener("resize", updateSrc);
    }, [src, mobileSrc, currentSrc]);

    // Handle Play on Scroll (Intersection Observer)
    useEffect(() => {
        if (!playOnScroll) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = videoRef.current;
                    if (!video) return;

                    if (entry.isIntersecting) {
                        video.muted = true;
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (videoRef.current && videoRef.current.parentElement) {
            observer.observe(videoRef.current.parentElement);
        }

        return () => observer.disconnect();
    }, [playOnScroll]);

    // Handle Manual Autoplay on Mount/Source change (for Hero)
    useEffect(() => {
        const video = videoRef.current;
        if (!video || playOnScroll || !autoPlay) return;

        // Force muted state for autoplay compliance
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", ""); // Ensure attribute is in DOM

        const attemptPlay = async () => {
            try {
                // If src changed, we might need a manual load
                if (video.src !== currentSrc) {
                   video.load();
                }
                await video.play();
            } catch (error) {
                console.log("Autoplay failed, retrying...", error);
                // Retry once after a delay
                setTimeout(() => {
                    if (video && video.paused) {
                        video.muted = true;
                        video.play().catch(() => {});
                    }
                }, 1000);
            }
        };

        if (video.readyState >= 2) {
            attemptPlay();
        } else {
            video.addEventListener("canplay", attemptPlay, { once: true });
        }

        return () => video.removeEventListener("canplay", attemptPlay);
    }, [currentSrc, autoPlay, playOnScroll]);

    return (
        <video
            ref={videoRef}
            className={className}
            src={currentSrc}
            poster={poster}
            autoPlay={autoPlay && !playOnScroll}
            muted={true}
            loop={loop}
            playsInline
            preload="auto"
            style={{ pointerEvents: "none" }}
        />
    );
};

export default VideoPlayer;
