"use client";
import React, { useEffect, useRef } from "react";

const ScrollAnimate = ({ children, className = "" }) => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in");
                    }
                });
            },
            {
                threshold: 0.05, // Trigger as soon as 5% is visible
                rootMargin: "0px 0px 50px 0px", // Trigger 50px BEFORE it enters viewport for a smoother feel
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={`scroll-animate ${className}`}>
            {children}
        </div>
    );
};

export default ScrollAnimate;
