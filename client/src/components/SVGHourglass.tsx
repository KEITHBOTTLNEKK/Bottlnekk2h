const BOTTLNEKK_GREEN = "#00C97B";

export function SVGHourglass() {
  return (
    <div className="hourglass-container">
      <svg
        width="120"
        height="180"
        viewBox="0 0 120 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hourglass-svg"
        role="img"
        aria-label="Analyzing your call data"
      >
        <defs>
          {/* Sand gradient */}
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={BOTTLNEKK_GREEN} stopOpacity="0.9" />
            <stop offset="100%" stopColor={BOTTLNEKK_GREEN} stopOpacity="1" />
          </linearGradient>

          {/* Pattern for vertical stripes in sand */}
          <pattern id="sandStripes" patternUnits="userSpaceOnUse" width="10" height="100">
            <rect x="0" y="0" width="5" height="100" fill={BOTTLNEKK_GREEN} />
            <rect x="5" y="0" width="5" height="100" fill="#000" />
          </pattern>
        </defs>

        {/* Top stand with decorative notches */}
        <g className="top-stand">
          <rect x="2" y="2" width="116" height="8" rx="4" fill="#1a1a1a" stroke="white" strokeWidth="2" />
          <rect x="8" y="10" width="12" height="4" rx="2" fill="#1a1a1a" stroke="white" strokeWidth="1.5" />
          <rect x="100" y="10" width="12" height="4" rx="2" fill="#1a1a1a" stroke="white" strokeWidth="1.5" />
        </g>

        {/* Top bulb outline */}
        <path
          d="M 20 18 L 20 55 Q 20 72 35 82 L 52 90 L 68 82 Q 83 72 83 55 L 83 18 Z"
          fill="white"
          fillOpacity="0.05"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top sand with vertical stripes */}
        <g className="top-sand-group">
          <clipPath id="topSandClip">
            <rect x="23" y="20" width="57" height="50" className="top-sand-level" />
          </clipPath>
          
          {/* Sand background with stripe pattern */}
          <path
            d="M 23 25 L 23 55 Q 23 68 36 77 L 51.5 85 L 67 77 Q 80 68 80 55 L 80 25 Z"
            fill="url(#sandStripes)"
            clipPath="url(#topSandClip)"
          />
          
          {/* Diagonal bars creating the triangle pattern */}
          <g clipPath="url(#topSandClip)">
            <rect x="35" y="68" width="4" height="20" fill={BOTTLNEKK_GREEN} transform="rotate(-70 37 78)" />
            <rect x="42" y="68" width="4" height="24" fill={BOTTLNEKK_GREEN} transform="rotate(-70 44 80)" />
            <rect x="49" y="68" width="4" height="28" fill={BOTTLNEKK_GREEN} transform="rotate(-70 51 82)" />
            <rect x="56" y="68" width="4" height="24" fill={BOTTLNEKK_GREEN} transform="rotate(-70 58 80)" />
            <rect x="63" y="68" width="4" height="20" fill={BOTTLNEKK_GREEN} transform="rotate(-70 65 78)" />
          </g>
        </g>

        {/* Neck - widens during animation */}
        <g className="neck-group">
          <line x1="51.5" y1="90" x2="51.5" y2="98" stroke="white" strokeWidth="2" opacity="0.3" />
          <path
            d="M 50 90 L 48 98 L 55 98 L 53 90 Z"
            fill={BOTTLNEKK_GREEN}
            opacity="0.9"
          />
        </g>

        {/* Crack - zigzag pattern at neck */}
        <g className="crack-group">
          <path
            d="M 49 98 L 47 101 L 49 104 L 47 107"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="crack-outline"
            fill="none"
          />
          
          {/* Flow through crack */}
          <line
            x1="48"
            y1="98"
            x2="48"
            y2="110"
            stroke={BOTTLNEKK_GREEN}
            strokeWidth="1.5"
            strokeLinecap="round"
            className="crack-flow"
          />
        </g>

        {/* Bottom bulb outline */}
        <path
          d="M 20 162 L 20 125 Q 20 108 35 98 L 52 90 L 68 98 Q 83 108 83 125 L 83 162 Z"
          fill="white"
          fillOpacity="0.05"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wavy notch on left side of bottom bulb */}
        <path
          d="M 20 135 Q 15 137 15 140 Q 15 143 20 145"
          fill="white"
          fillOpacity="0.1"
          stroke="white"
          strokeWidth="2"
        />

        {/* Bottom sand with vertical stripes */}
        <g className="bottom-sand-group">
          <clipPath id="bottomSandClip">
            <rect x="23" y="110" width="57" height="0" className="bottom-sand-level" />
          </clipPath>
          
          {/* Sand background with stripe pattern */}
          <path
            d="M 23 155 L 23 125 Q 23 112 36 103 L 51.5 95 L 67 103 Q 80 112 80 125 L 80 155 Z"
            fill="url(#sandStripes)"
            clipPath="url(#bottomSandClip)"
          />
          
          {/* Diagonal bars creating triangle pattern */}
          <g clipPath="url(#bottomSandClip)">
            <rect x="35" y="102" width="4" height="20" fill={BOTTLNEKK_GREEN} transform="rotate(70 37 102)" />
            <rect x="42" y="100" width="4" height="24" fill={BOTTLNEKK_GREEN} transform="rotate(70 44 100)" />
            <rect x="49" y="98" width="4" height="28" fill={BOTTLNEKK_GREEN} transform="rotate(70 51 98)" />
            <rect x="56" y="100" width="4" height="24" fill={BOTTLNEKK_GREEN} transform="rotate(70 58 100)" />
            <rect x="63" y="102" width="4" height="20" fill={BOTTLNEKK_GREEN} transform="rotate(70 65 102)" />
          </g>
        </g>

        {/* Bottom stand with decorative notches */}
        <g className="bottom-stand">
          <rect x="8" y="166" width="12" height="4" rx="2" fill="#1a1a1a" stroke="white" strokeWidth="1.5" />
          <rect x="100" y="166" width="12" height="4" rx="2" fill="#1a1a1a" stroke="white" strokeWidth="1.5" />
          <rect x="2" y="170" width="116" height="8" rx="4" fill="#1a1a1a" stroke="white" strokeWidth="2" />
        </g>

        {/* Falling particles */}
        <circle cx="51.5" cy="92" r="1.5" fill={BOTTLNEKK_GREEN} className="particle-1" opacity="0" />
        <circle cx="49" cy="95" r="1.2" fill={BOTTLNEKK_GREEN} className="particle-2" opacity="0" />
        <circle cx="54" cy="97" r="1.3" fill={BOTTLNEKK_GREEN} className="particle-3" opacity="0" />
      </svg>

      <p 
        className="status-text"
        aria-live="polite"
      >
        Turning leaks into flow
      </p>

      <style>{`
        .hourglass-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .hourglass-svg {
          filter: drop-shadow(0 0 24px rgba(0, 201, 123, 0.4));
        }

        .status-text {
          color: white;
          font-size: 1.125rem;
          font-weight: 300;
          letter-spacing: 0.02em;
          opacity: 0.7;
          margin: 0;
        }

        /* Animation: 6s transformation from leak to controlled flow */

        /* Top sand level decreases */
        .top-sand-level {
          animation: emptySand 6s ease-in-out forwards;
        }

        @keyframes emptySand {
          0% {
            height: 50px;
            y: 20;
          }
          50%, 100% {
            height: 20px;
            y: 50;
          }
        }

        /* Bottom sand level increases */
        .bottom-sand-level {
          animation: fillSand 6s ease-in-out forwards;
        }

        @keyframes fillSand {
          0% {
            height: 0px;
            y: 110;
          }
          50%, 100% {
            height: 45px;
            y: 65;
          }
        }

        /* Neck widens */
        .neck-group {
          transform-origin: center;
          animation: widenNeck 6s ease-in-out forwards;
        }

        @keyframes widenNeck {
          0%, 25% {
            transform: scaleX(1);
          }
          35%, 100% {
            transform: scaleX(2.8);
          }
        }

        /* Crack flow transforms */
        .crack-flow {
          animation: transformFlow 6s ease-in-out forwards;
        }

        @keyframes transformFlow {
          0%, 25% {
            stroke-width: 1.5;
            opacity: 0.4;
            stroke-dasharray: 2, 3;
          }
          30% {
            stroke-width: 3.5;
            opacity: 0.7;
            stroke-dasharray: 4, 1;
          }
          40%, 100% {
            stroke-width: 6;
            opacity: 1;
            stroke-dasharray: 0, 0;
          }
        }

        /* Crack outline glows green */
        .crack-outline {
          animation: pulseCrack 6s ease-in-out forwards;
        }

        @keyframes pulseCrack {
          0%, 25% {
            stroke: white;
            opacity: 0.6;
          }
          40%, 100% {
            stroke: ${BOTTLNEKK_GREEN};
            opacity: 1;
            filter: drop-shadow(0 0 8px ${BOTTLNEKK_GREEN});
          }
        }

        /* Gentle glow after transformation */
        .hourglass-svg {
          animation: gentleGlow 3s ease-in-out 6s infinite;
        }

        @keyframes gentleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 24px rgba(0, 201, 123, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 32px rgba(0, 201, 123, 0.6));
          }
        }

        /* Falling particles */
        .particle-1 {
          animation: fallParticle1 2s ease-in infinite;
        }

        .particle-2 {
          animation: fallParticle2 2.2s ease-in infinite;
        }

        .particle-3 {
          animation: fallParticle3 2.1s ease-in infinite;
        }

        @keyframes fallParticle1 {
          0% {
            cy: 92;
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          85% {
            cy: 140;
            opacity: 0.6;
          }
          100% {
            cy: 145;
            opacity: 0;
          }
        }

        @keyframes fallParticle2 {
          0% {
            cy: 95;
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            cy: 140;
            opacity: 0.5;
          }
          100% {
            cy: 145;
            opacity: 0;
          }
        }

        @keyframes fallParticle3 {
          0% {
            cy: 97;
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            cy: 140;
            opacity: 0.5;
          }
          100% {
            cy: 145;
            opacity: 0;
          }
        }

        /* Accessibility: Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hourglass-svg,
          .top-sand-level,
          .bottom-sand-level,
          .neck-group,
          .crack-flow,
          .crack-outline,
          .particle-1,
          .particle-2,
          .particle-3 {
            animation: none !important;
          }

          /* Show controlled flow state */
          .neck-group {
            transform: scaleX(2.8);
          }

          .crack-flow {
            stroke-width: 6;
            opacity: 1;
          }

          .crack-outline {
            stroke: ${BOTTLNEKK_GREEN};
            opacity: 1;
          }

          .top-sand-level {
            height: 20px;
            y: 50;
          }

          .bottom-sand-level {
            height: 45px;
            y: 65;
          }

          .hourglass-svg {
            filter: drop-shadow(0 0 24px rgba(0, 201, 123, 0.4));
          }
        }
      `}</style>
    </div>
  );
}
