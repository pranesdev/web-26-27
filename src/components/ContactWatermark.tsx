import { useEffect, useState } from 'react';

export default function ContactWatermark() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1 based on viewport center
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate 3D transformation values (reduced intensity)
  const shiftX = mouse.x * 8;    // Max horizontal shift of 8px
  const shiftY = mouse.y * 4;    // Max vertical shift of 4px
  const rotateY = mouse.x * 3;   // Max rotation of 3 degrees around Y axis
  const rotateX = -mouse.y * 3;  // Max rotation of 3 degrees around X axis

  return (
    <>
      <div
        className="contact-watermark"
        style={{
          transform: `translateX(-50%) translate3d(${shiftX}px, ${shiftY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.1, 0.8, 0.2, 1)',
          transformStyle: 'preserve-3d',
          perspective: 800,
          willChange: 'transform',
          animation: 'watermarkDreamyGlow 8s ease-in-out infinite',
        }}
      >
        Contact
      </div>

      <style>{`
        @keyframes watermarkDreamyGlow {
          0% {
            filter: 
              drop-shadow(0 0 12px rgba(29, 209, 161, 0.12)) 
              drop-shadow(0 0 35px rgba(29, 209, 161, 0.07))
              drop-shadow(0 0 75px rgba(0, 242, 254, 0.04))
              drop-shadow(0 0 130px rgba(0, 242, 254, 0.02));
          }
          50% {
            filter: 
              drop-shadow(0 0 18px rgba(29, 209, 161, 0.20)) 
              drop-shadow(0 0 50px rgba(29, 209, 161, 0.11))
              drop-shadow(0 0 95px rgba(0, 242, 254, 0.07))
              drop-shadow(0 0 160px rgba(0, 242, 254, 0.03));
          }
          100% {
            filter: 
              drop-shadow(0 0 12px rgba(29, 209, 161, 0.12)) 
              drop-shadow(0 0 35px rgba(29, 209, 161, 0.07))
              drop-shadow(0 0 75px rgba(0, 242, 254, 0.04))
              drop-shadow(0 0 130px rgba(0, 242, 254, 0.02));
          }
        }
      `}</style>
    </>
  );
}
