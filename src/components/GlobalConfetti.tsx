import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export const GlobalConfetti = () => {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleTrigger = (e: CustomEvent) => {
      setIsActive(true);
      // Automatically turn it off after 6-10 seconds so it doesn't block UI forever
      setTimeout(() => setIsActive(false), e.detail?.duration || 7000);
    };

    window.addEventListener("fire-confetti", handleTrigger as EventListener);
    return () => window.removeEventListener("fire-confetti", handleTrigger as EventListener);
  }, []);

  if (!isActive) return null;

  return (
    <Confetti 
      width={width} 
      height={height} 
      recycle={false} 
      numberOfPieces={600} 
      gravity={0.15} 
      style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0 }} 
    />
  );
};
