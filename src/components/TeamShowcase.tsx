import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Member {
  name: string;
  role: string;
  image: string;
  github: string;
  linkedin: string;
  email: string;
}

const MEMBERS: Member[] = [
  {
    name: 'Karthik Rajan',
    role: 'President',
    image: '/team/karthik-rajan.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Nithya Srinivasan',
    role: 'Vice President',
    image: '/team/nithya-srinivasan.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Aditya Kumar',
    role: 'Technical Lead',
    image: '/team/aditya-kumar.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Deepika Menon',
    role: 'Design Lead',
    image: '/team/deepika-menon.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Rahul Anand',
    role: 'AI / ML Lead',
    image: '/team/rahul-anand.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
  {
    name: 'Sneha Patel',
    role: 'PR & Outreach Lead',
    image: '/team/sneha-patel.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:dsc.srmrmp@gmail.com',
  },
];

export default function TeamShowcase() {
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Parallax card tilt on mouse move
    const cards = cardsRefs.current;
    
    cards.forEach((card) => {
      if (!card) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x coordinate within the element
        const y = e.clientY - rect.top;  // y coordinate within the element

        const xc = rect.width / 2;
        const yc = rect.height / 2;

        const tiltX = (yc - y) / 14;
        const tiltY = (x - xc) / 14;

        gsap.to(card, {
          rotateX: tiltX,
          rotateY: tiltY,
          scale: 1.02,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <div className="team-showcase-grid">
      {MEMBERS.map((m, idx) => (
        <div
          key={m.name}
          ref={(el) => { cardsRefs.current[idx] = el; }}
          className="team-card-wrapper"
        >
          {/* Card Body */}
          <div className="team-member-card">
            {/* Image Container with organic cutout mask and grayscale filter */}
            <div className="team-image-container">
              <img src={m.image} alt={m.name} className="team-member-image" />
              <div className="team-image-overlay" />
              
              {/* Overlay Social Icons Row */}
              <div className="team-social-overlay-row">
                <a href={m.github} target="_blank" rel="noopener noreferrer" className="team-social-circle-btn" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="team-social-circle-btn" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href={m.email} className="team-social-circle-btn" aria-label="Email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Info Section */}
            <div className="team-member-info">
              <h3>{m.name}</h3>
              <p className="team-member-role">{m.role}</p>
            </div>
          </div>
        </div>
      ))}
      
      <style>{`
        .team-showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          width: 100%;
          perspective: 1000px;
          margin-top: 40px;
        }

        @media (max-width: 1024px) {
          .team-showcase-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }

        @media (max-width: 640px) {
          .team-showcase-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .team-card-wrapper {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .team-member-card {
          background-image: 
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E"),
            linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%);
          background-color: var(--card-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          transform-style: preserve-3d;
        }

        .team-member-card:hover {
          border-color: rgba(29, 209, 161, 0.35);
          box-shadow: 0 12px 40px rgba(29, 209, 161, 0.1);
        }

        .team-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.15;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          transform: translateZ(20px);
          background-color: #0b110f;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .team-member-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) brightness(0.7) contrast(1.15);
          transition: filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center center;
          
          /* Soft gradient mask for cutout look */
          mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12%);
          -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12%);
        }

        .team-member-card:hover .team-member-image {
          filter: grayscale(0%) brightness(0.85) contrast(1.05);
          transform: scale(1.04);
        }

        .team-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 13, 11, 0.8) 0%, rgba(8, 13, 11, 0) 40%);
          pointer-events: none;
          z-index: 1;
        }

        .team-social-overlay-row {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(12px);
          opacity: 0;
          display: flex;
          gap: 12px;
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-member-card:hover .team-social-overlay-row {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .team-social-circle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(17, 23, 20, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8ede9;
          transition: border-color 0.25s, color 0.25s, background-color 0.25s, transform 0.2s;
        }

        .team-social-circle-btn:hover {
          border-color: #1dd1a1;
          color: #1dd1a1;
          background-color: rgba(29, 209, 161, 0.12);
          transform: scale(1.1);
        }

        .team-member-info {
          transform: translateZ(10px);
          text-align: left;
          padding: 0 4px;
        }

        .team-member-info h3 {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 1.15rem;
          color: var(--text-color);
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .team-member-role {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 0.85rem;
          color: #1dd1a1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
