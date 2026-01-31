"use client";
import React, { useEffect, useState } from "react";

const LetterByLetterText = ({ text, delay = 20, startDelay = 0, className = "" }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        if (!text) return;

        const timer = setTimeout(() => {
            setIsStarted(true);
        }, startDelay);

        return () => clearTimeout(timer);
    }, [text, startDelay]);

    useEffect(() => {
        if (!isStarted || !text) return;

        if (displayedText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [isStarted, displayedText, text, delay]);

    return (
        <span className={className}>
            {displayedText}
            {displayedText.length < text.length && isStarted && (
                <span className="animate-pulse">|</span>
            )}
        </span>
    );
};

export default LetterByLetterText;
