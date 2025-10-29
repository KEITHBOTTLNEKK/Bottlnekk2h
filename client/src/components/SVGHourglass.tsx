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
      >
        <defs>
          {/* Gradient for sand */}
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={BOTTLNEKK_GREEN} stopOpacity="0.8" />
            <stop offset="100%" stopColor={BOTTLNEKK_GREEN} stopOpacity="1" />
          </linearGradient>

          {/* Gradient for flow */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={BOTTLNEKK_GREEN} stopOpacity="0.3" />
            <stop offset="100%" stopColor={BOTTLNEKK_GREEN} stopOpacity="1" />
          </linearGradient>

          {/* Clip path for top sand */}
          <clipPath id="topSandClip">
            <rect x="30" y="20" width="60" height="40" className="top-sand-mask" />
          </clipPath>

          {/* Clip path for bottom sand */}
          <clipPath id="bottomSandClip">
            <rect x="30" y="120" width="60" height="0" className="bottom-sand-mask" />
          </clipPath>
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

        {/* Top sand fill */}
        <path
          d="M 30 20 L 30 50 Q 30 63 38 68 L 55 76 L 82 68 Q 90 63 90 50 L 90 20 Z"
          fill="url(#sandGradient)"
          clipPath="url(#topSandClip)"
          className="top-sand"
        />

        {/* Neck - this will widen */}
        <g className="neck-group">
          <path
            d="M 58 80 L 54 90 L 66 90 L 62 80 Z"
            fill="url(#sandGradient)"
            className="neck-sand"
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

        {/* Bottom sand fill */}
        <path
          d="M 30 140 L 30 110 Q 30 97 38 92 L 55 84 L 82 92 Q 90 97 90 110 L 90 140 Z"
          fill="url(#sandGradient)"
          clipPath="url(#bottomSandClip)"
          className="bottom-sand"
        />

        {/* Crack at bottom - ALWAYS VISIBLE */}
        <g className="crack-group">
          <path
            d="M 58 148 L 56 153 M 58 148 L 60 152 M 60 152 L 62 154"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.5"
            strokeLinecap="round"
            className="crack-outline"
          />
          
          {/* Flow through crack - starts as leak, becomes controlled */}
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

      <style>{`
        .hourglass-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 2rem 0;
        }

        .hourglass-svg {
          filter: drop-shadow(0 0 20px rgba(0, 201, 123, 0.3));
        }

        /* Phase 1: Initial leak (0-33%) */
        /* Phase 2: Neck widening (33-66%) */
        /* Phase 3: Controlled flow (66-100%) */

        /* Top sand empties */
        .top-sand-mask {
          animation: emptySand 8s ease-in-out infinite;
        }

        @keyframes emptySand {
          0%, 100% {
            height: 40px;
            y: 20;
          }
          50% {
            height: 15px;
            y: 45;
          }
        }

        /* Bottom sand fills */
        .bottom-sand-mask {
          animation: fillSand 8s ease-in-out infinite;
        }

        @keyframes fillSand {
          0%, 100% {
            height: 0px;
            y: 120;
          }
          50% {
            height: 25px;
            y: 95;
          }
        }

        /* Neck widens over time */
        .neck-group {
          transform-origin: center;
          animation: widenNeck 8s ease-in-out infinite;
        }

        @keyframes widenNeck {
          0%, 20% {
            transform: scaleX(1);
          }
          40%, 60% {
            transform: scaleX(1.8);
          }
          80%, 100% {
            transform: scaleX(1);
          }
        }

        /* Crack flow transforms from leak to controlled stream */
        .crack-flow {
          animation: transformFlow 8s ease-in-out infinite;
        }

        @keyframes transformFlow {
          0%, 20% {
            stroke-width: 1;
            opacity: 0.3;
            stroke-dasharray: 2, 2;
          }
          40%, 60% {
            stroke-width: 4;
            opacity: 0.9;
            stroke-dasharray: 0, 0;
          }
          80%, 100% {
            stroke-width: 1;
            opacity: 0.3;
            stroke-dasharray: 2, 2;
          }
        }

        /* Crack outline pulses */
        .crack-outline {
          animation: pulseCrack 8s ease-in-out infinite;
        }

        @keyframes pulseCrack {
          0%, 20% {
            opacity: 0.5;
          }
          40%, 60% {
            opacity: 0.9;
            stroke: ${BOTTLNEKK_GREEN};
            filter: drop-shadow(0 0 4px ${BOTTLNEKK_GREEN});
          }
          80%, 100% {
            opacity: 0.5;
          }
        }

        /* Particles fall and fade */
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
            cy: 85;
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            cy: 145;
            opacity: 0.8;
          }
          100% {
            cy: 148;
            opacity: 0;
          }
        }

        @keyframes fallParticle2 {
          0% {
            cy: 88;
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            cy: 145;
            opacity: 0.6;
          }
          100% {
            cy: 148;
            opacity: 0;
          }
        }

        @keyframes fallParticle3 {
          0% {
            cy: 90;
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          80% {
            cy: 145;
            opacity: 0.7;
          }
          100% {
            cy: 148;
            opacity: 0;
          }
        }

        /* Accessibility: Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .hourglass-svg,
          .top-sand-mask,
          .bottom-sand-mask,
          .neck-group,
          .crack-flow,
          .crack-outline,
          .particle-1,
          .particle-2,
          .particle-3 {
            animation: none !important;
          }

          /* Show static mid-animation state */
          .neck-group {
            transform: scaleX(1.4);
          }

          .crack-flow {
            stroke-width: 3;
            opacity: 0.8;
          }

          .top-sand-mask {
            height: 25px;
            y: 35;
          }

          .bottom-sand-mask {
            height: 15px;
            y: 105;
          }
        }
      `}</style>
    </div>
  );
}
