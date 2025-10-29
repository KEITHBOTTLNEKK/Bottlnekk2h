const BOTTLNEKK_GREEN = "#00C97B";

export function SVGHourglass() {
  return (
    <div className="hourglass-container">
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hourglass-svg"
        role="img"
        aria-label="Analyzing your call data"
      >
        <defs>
          {/* Gradient for sand */}
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={BOTTLNEKK_GREEN} stopOpacity="0.8" />
            <stop offset="100%" stopColor={BOTTLNEKK_GREEN} stopOpacity="1" />
          </linearGradient>

          {/* Gradient for controlled flow */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={BOTTLNEKK_GREEN} stopOpacity="0.6" />
            <stop offset="100%" stopColor={BOTTLNEKK_GREEN} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Base stand */}
        <rect x="20" y="5" width="80" height="4" fill="white" opacity="0.3" />
        <rect x="20" y="151" width="80" height="4" fill="white" opacity="0.3" />

        {/* Top bulb outline */}
        <path
          d="M 30 10 L 30 50 Q 30 65 40 70 L 60 80 L 80 70 Q 90 65 90 50 L 90 10 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />

        {/* Top sand fill - animated via transform */}
        <g className="top-sand-group">
          <path
            d="M 30 20 L 30 50 Q 30 63 38 68 L 55 76 L 82 68 Q 90 63 90 50 L 90 20 Z"
            fill="url(#sandGradient)"
          />
        </g>

        {/* Neck - widens over time */}
        <g className="neck-group">
          <path
            d="M 58 80 L 54 90 L 66 90 L 62 80 Z"
            fill="url(#sandGradient)"
            opacity="0.9"
          />
        </g>

        {/* Bottom bulb outline */}
        <path
          d="M 30 150 L 30 110 Q 30 95 40 90 L 60 80 L 80 90 Q 90 95 90 110 L 90 150 Z"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />

        {/* Bottom sand fill - animated via transform */}
        <g className="bottom-sand-group">
          <path
            d="M 30 120 L 30 110 Q 30 97 38 92 L 55 84 L 82 92 Q 90 97 90 110 L 90 120 Z"
            fill="url(#sandGradient)"
          />
        </g>

        {/* Crack at bottom - ALWAYS VISIBLE */}
        <g className="crack-group">
          <path
            d="M 58 148 L 56 153 M 58 148 L 60 152 M 60 152 L 62 154"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.6"
            strokeLinecap="round"
            className="crack-outline"
          />
          
          {/* Flow through crack - transforms from drip to steady stream */}
          <line
            x1="60"
            y1="148"
            x2="60"
            y2="155"
            stroke={BOTTLNEKK_GREEN}
            strokeWidth="1"
            opacity="0.6"
            strokeLinecap="round"
            className="crack-flow"
          />
        </g>

        {/* Falling particles */}
        <circle cx="60" cy="85" r="1.5" fill={BOTTLNEKK_GREEN} opacity="0.8" className="particle-1" />
        <circle cx="58" cy="88" r="1" fill={BOTTLNEKK_GREEN} opacity="0.6" className="particle-2" />
        <circle cx="62" cy="90" r="1.2" fill={BOTTLNEKK_GREEN} opacity="0.7" className="particle-3" />
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
          filter: drop-shadow(0 0 20px rgba(0, 201, 123, 0.3));
        }

        .status-text {
          color: white;
          font-size: 1.125rem;
          font-weight: 300;
          letter-spacing: 0.02em;
          opacity: 0.7;
          margin: 0;
        }

        /* Animation: One-time transformation from leak to controlled flow
           0-30%: Initial leak (narrow neck, dripping)
           30-50%: Neck widens (bottleneck opening)
           50-100%: Controlled flow maintained (crack becomes stable channel)
        */

        /* Top sand decreases and stays reduced */
        .top-sand-group {
          transform-origin: center;
          animation: emptySand 6s ease-in-out forwards;
        }

        @keyframes emptySand {
          0% {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
          50%, 100% {
            transform: translateY(8px) scaleY(0.6);
            opacity: 0.9;
          }
        }

        /* Bottom sand increases and stays filled */
        .bottom-sand-group {
          transform-origin: center;
          animation: fillSand 6s ease-in-out forwards;
        }

        @keyframes fillSand {
          0% {
            transform: translateY(0) scaleY(0.2);
            opacity: 0.6;
          }
          50%, 100% {
            transform: translateY(-6px) scaleY(1);
            opacity: 1;
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
            transform: scaleX(2.2);
          }
        }

        /* Crack flow: drip → stream → steady controlled flow (stays steady) */
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
            stroke-width: 2.5;
            opacity: 0.7;
            stroke-dasharray: 4, 1;
          }
          /* Phase 3: Controlled flow (stays steady) */
          40%, 100% {
            stroke-width: 4;
            opacity: 1;
            stroke-dasharray: 0, 0;
          }
        }

        /* Crack outline glows and stays glowing */
        .crack-outline {
          animation: pulseCrack 6s ease-in-out forwards;
        }

        @keyframes pulseCrack {
          0%, 25% {
            opacity: 0.6;
            stroke: white;
          }
          40%, 100% {
            opacity: 0.9;
            stroke: ${BOTTLNEKK_GREEN};
            filter: drop-shadow(0 0 6px ${BOTTLNEKK_GREEN});
          }
        }

        /* Gentle pulsing glow after transformation complete */
        .hourglass-svg {
          animation: gentleGlow 3s ease-in-out 6s infinite;
        }

        @keyframes gentleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(0, 201, 123, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(0, 201, 123, 0.5));
          }
        }

        /* Particles fall continuously */
        .particle-1 {
          animation: fallParticle1 2s ease-in infinite;
        }

        .particle-2 {
          animation: fallParticle2 2.3s ease-in infinite;
        }

        .particle-3 {
          animation: fallParticle3 2.1s ease-in infinite;
        }

        @keyframes fallParticle1 {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            transform: translateY(60px);
            opacity: 0.4;
          }
          100% {
            transform: translateY(63px);
            opacity: 0;
          }
        }

        @keyframes fallParticle2 {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            transform: translateY(60px);
            opacity: 0.3;
          }
          100% {
            transform: translateY(63px);
            opacity: 0;
          }
        }

        @keyframes fallParticle3 {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          80% {
            transform: translateY(60px);
            opacity: 0.4;
          }
          100% {
            transform: translateY(63px);
            opacity: 0;
          }
        }

        /* Accessibility: Reduced motion - show final controlled state */
        @media (prefers-reduced-motion: reduce) {
          .hourglass-svg,
          .top-sand-group,
          .bottom-sand-group,
          .neck-group,
          .crack-flow,
          .crack-outline,
          .particle-1,
          .particle-2,
          .particle-3,
          .status-text {
            animation: none !important;
          }

          /* Static state: controlled flow achieved */
          .neck-group {
            transform: scaleX(2.2);
          }

          .crack-flow {
            stroke-width: 4;
            opacity: 1;
            stroke-dasharray: 0, 0;
          }

          .crack-outline {
            opacity: 0.9;
            stroke: ${BOTTLNEKK_GREEN};
          }

          .top-sand-group {
            transform: translateY(8px) scaleY(0.6);
          }

          .bottom-sand-group {
            transform: translateY(-6px) scaleY(1);
          }

          .particle-1,
          .particle-2,
          .particle-3 {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
