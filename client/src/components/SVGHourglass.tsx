const BOTTLNEKK_GREEN = "#00C97B";

export function SVGHourglass() {
  return (
    <div className="hourglass-container">
      <svg
        width="140"
        height="200"
        viewBox="0 0 140 200"
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

          {/* Clip paths for sand levels */}
          <clipPath id="topSandClip">
            <rect x="20" y="20" width="100" height="60" className="top-sand-clip" />
          </clipPath>

          <clipPath id="bottomSandClip">
            <rect x="20" y="140" width="100" height="0" className="bottom-sand-clip" />
          </clipPath>
        </defs>

        {/* Top stand */}
        <rect x="5" y="5" width="130" height="12" rx="6" fill="#1a1a1a" stroke="white" strokeWidth="1.5" opacity="0.9" />

        {/* Top bulb outline */}
        <path
          d="M 20 22 L 20 60 Q 20 80 40 92 L 60 100 L 80 92 Q 100 80 100 60 L 100 22 Z"
          fill="white"
          fillOpacity="0.05"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Top sand with horizontal stripes */}
        <g clipPath="url(#topSandClip)" className="top-sand-group">
          {/* Sand background */}
          <path
            d="M 25 28 L 25 60 Q 25 78 43 88 L 60 95 L 77 88 Q 95 78 95 60 L 95 28 Z"
            fill="url(#sandGradient)"
          />
          
          {/* Horizontal stripes in top sand */}
          <g opacity="0.4">
            <line x1="30" y1="35" x2="90" y2="35" stroke="#000" strokeWidth="2" />
            <line x1="32" y1="45" x2="88" y2="45" stroke="#000" strokeWidth="2" />
            <line x1="35" y1="55" x2="85" y2="55" stroke="#000" strokeWidth="2" />
            <line x1="38" y1="65" x2="82" y2="65" stroke="#000" strokeWidth="2" />
            <line x1="42" y1="75" x2="78" y2="75" stroke="#000" strokeWidth="2" />
            <line x1="48" y1="82" x2="72" y2="82" stroke="#000" strokeWidth="2" />
          </g>
        </g>

        {/* Neck - widens during animation */}
        <g className="neck-group">
          <path
            d="M 58 100 L 50 110 L 70 110 L 62 100 Z"
            fill="url(#sandGradient)"
            opacity="0.95"
          />
        </g>

        {/* Crack at bottom of top bulb - ALWAYS VISIBLE */}
        <g className="crack-group">
          {/* Crack outline */}
          <path
            d="M 58 98 L 56 102 M 58 98 L 60 101 M 60 101 L 62 103"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            className="crack-outline"
            opacity="0.6"
          />
          
          {/* Flow through crack */}
          <line
            x1="60"
            y1="98"
            x2="60"
            y2="110"
            stroke={BOTTLNEKK_GREEN}
            strokeWidth="1"
            strokeLinecap="round"
            className="crack-flow"
            opacity="0.7"
          />
        </g>

        {/* Bottom bulb outline */}
        <path
          d="M 20 178 L 20 140 Q 20 120 40 108 L 60 100 L 80 108 Q 100 120 100 140 L 100 178 Z"
          fill="white"
          fillOpacity="0.05"
          stroke="white"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Bottom sand with horizontal stripes */}
        <g clipPath="url(#bottomSandClip)" className="bottom-sand-group">
          {/* Sand background */}
          <path
            d="M 25 172 L 25 140 Q 25 122 43 112 L 60 105 L 77 112 Q 95 122 95 140 L 95 172 Z"
            fill="url(#sandGradient)"
          />
          
          {/* Horizontal stripes in bottom sand */}
          <g opacity="0.4">
            <line x1="48" y1="118" x2="72" y2="118" stroke="#000" strokeWidth="2" />
            <line x1="42" y1="125" x2="78" y2="125" stroke="#000" strokeWidth="2" />
            <line x1="38" y1="135" x2="82" y2="135" stroke="#000" strokeWidth="2" />
            <line x1="35" y1="145" x2="85" y2="145" stroke="#000" strokeWidth="2" />
            <line x1="32" y1="155" x2="88" y2="155" stroke="#000" strokeWidth="2" />
            <line x1="30" y1="165" x2="90" y2="165" stroke="#000" strokeWidth="2" />
          </g>
        </g>

        {/* Bottom stand */}
        <rect x="5" y="183" width="130" height="12" rx="6" fill="#1a1a1a" stroke="white" strokeWidth="1.5" opacity="0.9" />

        {/* Falling particles */}
        <circle cx="60" cy="102" r="1.5" fill={BOTTLNEKK_GREEN} className="particle-1" opacity="0" />
        <circle cx="58" cy="105" r="1.2" fill={BOTTLNEKK_GREEN} className="particle-2" opacity="0" />
        <circle cx="62" cy="107" r="1.3" fill={BOTTLNEKK_GREEN} className="particle-3" opacity="0" />
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

        /* Animation Phases:
           0-30%: Initial leak (narrow neck, dripping)
           30-50%: Neck widens (bottleneck opening)
           50-100%: Controlled flow (crack becomes channel, steady stream)
        */

        /* Top sand empties */
        .top-sand-clip {
          animation: emptySand 6s ease-in-out forwards;
        }

        @keyframes emptySand {
          0% {
            height: 60px;
            y: 20;
          }
          50%, 100% {
            height: 25px;
            y: 55;
          }
        }

        /* Bottom sand fills */
        .bottom-sand-clip {
          animation: fillSand 6s ease-in-out forwards;
        }

        @keyframes fillSand {
          0% {
            height: 0px;
            y: 140;
          }
          50%, 100% {
            height: 35px;
            y: 105;
          }
        }

        /* Neck widens and stays wide */
        .neck-group {
          transform-origin: center;
          animation: widenNeck 6s ease-in-out forwards;
        }

        @keyframes widenNeck {
          0%, 25% {
            transform: scaleX(1);
          }
          35%, 100% {
            transform: scaleX(2.5);
          }
        }

        /* Crack flow: drip → stream → steady controlled flow */
        .crack-flow {
          animation: transformFlow 6s ease-in-out forwards;
        }

        @keyframes transformFlow {
          /* Phase 1: Leak (dripping) */
          0%, 25% {
            stroke-width: 1;
            opacity: 0.4;
            stroke-dasharray: 2, 3;
          }
          /* Phase 2: Opening (stream forming) */
          30% {
            stroke-width: 3;
            opacity: 0.7;
            stroke-dasharray: 4, 1;
          }
          /* Phase 3: Controlled flow (stays steady) */
          40%, 100% {
            stroke-width: 5;
            opacity: 1;
            stroke-dasharray: 0, 0;
          }
        }

        /* Crack outline glows */
        .crack-outline {
          animation: pulseCrack 6s ease-in-out forwards;
        }

        @keyframes pulseCrack {
          0%, 25% {
            opacity: 0.6;
            stroke: white;
          }
          40%, 100% {
            opacity: 1;
            stroke: ${BOTTLNEKK_GREEN};
            filter: drop-shadow(0 0 8px ${BOTTLNEKK_GREEN});
          }
        }

        /* Gentle pulsing glow after transformation */
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

        /* Particles fall */
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
            cy: 102;
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            cy: 145;
            opacity: 0.6;
          }
          100% {
            cy: 148;
            opacity: 0;
          }
        }

        @keyframes fallParticle2 {
          0% {
            cy: 105;
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            cy: 145;
            opacity: 0.5;
          }
          100% {
            cy: 148;
            opacity: 0;
          }
        }

        @keyframes fallParticle3 {
          0% {
            cy: 107;
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            cy: 145;
            opacity: 0.5;
          }
          100% {
            cy: 148;
            opacity: 0;
          }
        }

        /* Accessibility: Reduced motion - show controlled flow state */
        @media (prefers-reduced-motion: reduce) {
          .hourglass-svg,
          .top-sand-clip,
          .bottom-sand-clip,
          .neck-group,
          .crack-flow,
          .crack-outline,
          .particle-1,
          .particle-2,
          .particle-3 {
            animation: none !important;
          }

          /* Static state: controlled flow achieved */
          .neck-group {
            transform: scaleX(2.5);
          }

          .crack-flow {
            stroke-width: 5;
            opacity: 1;
            stroke-dasharray: 0, 0;
          }

          .crack-outline {
            opacity: 1;
            stroke: ${BOTTLNEKK_GREEN};
          }

          .top-sand-clip {
            height: 25px;
            y: 55;
          }

          .bottom-sand-clip {
            height: 35px;
            y: 105;
          }

          .hourglass-svg {
            filter: drop-shadow(0 0 24px rgba(0, 201, 123, 0.4));
          }
        }
      `}</style>
    </div>
  );
}
