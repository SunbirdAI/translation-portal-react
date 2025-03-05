import { useState, useEffect } from "react";

const Typewriter = ({ text, delay, infinite, onUpdate }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (currentIndex <= text.length) {
      timeout = setTimeout(() => {
        const updatedText = currentText + text[currentIndex];
        setCurrentText(updatedText);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        onUpdate(updatedText); // Call the callback function to update the parent component
      }, delay);
    } else if (infinite) {
      setCurrentIndex(0);
      setCurrentText("");
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, infinite, text, currentText, onUpdate]);

  return null; // This component doesn't need to render anything
};

export default Typewriter;
