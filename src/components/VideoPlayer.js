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

    useEffect(() => {
        const updateSrc = () => {
            const isMobile = window.innerWidth <= 768;
            setCurrentSrc(isMobile && mobileSrc ? mobileSrc : src);
        };

        updateSrc();
        window.addEventListener("resize", updateSrc);
        return () => window.removeEventListener("resize", updateSrc);
    }, [src, mobileSrc]);

    useEffect(() => {
        if (!playOnScroll) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && videoRef.current) {
                        videoRef.current.play().catch(() => { });
                    } else if (videoRef.current) {
                        videoRef.current.pause();
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

    return (
        <video
            ref={videoRef}
            key={currentSrc}
            className={className}
            src={currentSrc}
            poster={poster}
            autoPlay={autoPlay && !playOnScroll}
            muted={muted}
            loop={loop}
            playsInline
        />
    );
};

export default VideoPlayer;
