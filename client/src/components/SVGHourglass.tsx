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
          {/* Vertical stripe pattern for sand */}
          <pattern id="verticalStripes" patternUnits="userSpaceOnUse" width="16" height="100">
            <rect x="0" y="0" width="8" height="100" fill="#000" />
            <rect x="8" y="0" width="8" height="100" fill={BOTTLNEKK_GREEN} />
          </pattern>
        </defs>

        {/* Top stand - thick rounded rectangle */}
        <g className="top-stand">
          <rect x="5" y="5" width="130" height="12" rx="6" fill="#1a1a1a" stroke="white" strokeWidth="3" />
          {/* Small decorative notches */}
          <rect x="10" y="17" width="15" height="6" rx="3" fill="#1a1a1a" stroke="white" strokeWidth="2" />
          <rect x="115" y="17" width="15" height="6" rx="3" fill="#1a1a1a" stroke="white" strokeWidth="2" />
        </g>

        {/* Top bulb container */}
        <path
          d="M 25 25 L 25 70 Q 25 85 40 95 L 65 105 L 75 105 L 100 95 Q 115 85 115 70 L 115 25 Z"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top sand area with vertical stripes */}
        <g className="top-sand">
          <clipPath id="topSandClip">
            <rect x="28" y="28" width="84" height="60" className="top-sand-level" />
          </clipPath>
          
          {/* Main sand with vertical stripe pattern */}
          <path
            d="M 28 35 L 28 70 Q 28 82 42 91 L 68 103 L 72 103 L 98 91 Q 112 82 112 70 L 112 35 Z"
            fill="url(#verticalStripes)"
            clipPath="url(#topSandClip)"
          />
          
          {/* Diagonal bars creating triangle pattern - these are KEY to your logo */}
          <g clipPath="url(#topSandClip)">
            {/* Left to right diagonal bars */}
            <rect x="38" y="75" width="6" height="30" fill={BOTTLNEKK_GREEN} transform="rotate(-65 41 90)" />
            <rect x="48" y="75" width="6" height="34" fill={BOTTLNEKK_GREEN} transform="rotate(-65 51 92)" />
            <rect x="58" y="75" width="6" height="38" fill={BOTTLNEKK_GREEN} transform="rotate(-65 61 94)" />
            <rect x="68" y="75" width="6" height="34" fill={BOTTLNEKK_GREEN} transform="rotate(-65 71 92)" />
            <rect x="78" y="75" width="6" height="30" fill={BOTTLNEKK_GREEN} transform="rotate(-65 81 90)" />
            <rect x="88" y="75" width="6" height="26" fill={BOTTLNEKK_GREEN} transform="rotate(-65 91 88)" />
          </g>
        </g>

        {/* Narrow neck */}
        <g className="neck-group">
          <rect x="67" y="105" width="6" height="18" fill="white" fillOpacity="0.3" />
          <rect x="68" y="105" width="4" height="18" fill={BOTTLNEKK_GREEN} opacity="0.8" />
        </g>

        {/* Zigzag crack at narrow point */}
        <g className="crack-group">
          <path
            d="M 68 123 L 65 127 L 68 131 L 65 135 L 68 139"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="crack-outline"
          />
          
          {/* Flow through crack */}
          <line
            x1="67"
            y1="123"
            x2="67"
            y2="143"
            stroke={BOTTLNEKK_GREEN}
            strokeWidth="2"
            strokeLinecap="round"
            className="crack-flow"
            opacity="0.6"
          />
        </g>

        {/* Bottom bulb container */}
        <path
          d="M 25 175 L 25 130 Q 25 115 40 105 L 65 95 L 75 95 L 100 105 Q 115 115 115 130 L 115 175 Z"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Wavy notch on left side - distinctive feature of your logo */}
        <path
          d="M 25 145 Q 18 147 18 151 Q 18 155 25 157"
          fill="#1a1a1a"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Bottom sand area with vertical stripes */}
        <g className="bottom-sand">
          <clipPath id="bottomSandClip">
            <rect x="28" y="112" width="84" height="0" className="bottom-sand-level" />
          </clipPath>
          
          {/* Main sand with vertical stripe pattern */}
          <path
            d="M 28 165 L 28 130 Q 28 118 42 109 L 68 97 L 72 97 L 98 109 Q 112 118 112 130 L 112 165 Z"
            fill="url(#verticalStripes)"
            clipPath="url(#bottomSandClip)"
          />
          
          {/* Diagonal bars creating triangle pattern */}
          <g clipPath="url(#bottomSandClip)">
            {/* Right to left diagonal bars (mirrored from top) */}
            <rect x="38" y="105" width="6" height="26" fill={BOTTLNEKK_GREEN} transform="rotate(65 41 110)" />
            <rect x="48" y="105" width="6" height="30" fill={BOTTLNEKK_GREEN} transform="rotate(65 51 108)" />
            <rect x="58" y="105" width="6" height="38" fill={BOTTLNEKK_GREEN} transform="rotate(65 61 106)" />
            <rect x="68" y="105" width="6" height="34" fill={BOTTLNEKK_GREEN} transform="rotate(65 71 108)" />
            <rect x="78" y="105" width="6" height="30" fill={BOTTLNEKK_GREEN} transform="rotate(65 81 110)" />
            <rect x="88" y="105" width="6" height="26" fill={BOTTLNEKK_GREEN} transform="rotate(65 91 112)" />
          </g>
        </g>

        {/* Bottom stand - thick rounded rectangle */}
        <g className="bottom-stand">
          {/* Small decorative notches */}
          <rect x="10" y="177" width="15" height="6" rx="3" fill="#1a1a1a" stroke="white" strokeWidth="2" />
          <rect x="115" y="177" width="15" height="6" rx="3" fill="#1a1a1a" stroke="white" strokeWidth="2" />
          <rect x="5" y="183" width="130" height="12" rx="6" fill="#1a1a1a" stroke="white" strokeWidth="3" />
        </g>

        {/* Animated particles */}
        <circle cx="70" cy="108" r="2" fill={BOTTLNEKK_GREEN} className="particle-1" opacity="0" />
        <circle cx="68" cy="112" r="1.5" fill={BOTTLNEKK_GREEN} className="particle-2" opacity="0" />
        <circle cx="72" cy="115" r="1.8" fill={BOTTLNEKK_GREEN} className="particle-3" opacity="0" />
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

        /* Phase 1 (0-30%): Initial leak state */
        /* Phase 2 (30-50%): Bottleneck opens */
        /* Phase 3 (50-100%): Controlled flow achieved */

        /* Top sand empties */
        .top-sand-level {
          animation: emptySand 6s ease-in-out forwards;
        }

        @keyframes emptySand {
          0% {
            height: 60px;
            y: 28;
          }
          60%, 100% {
            height: 25px;
            y: 63;
          }
        }

        /* Bottom sand fills */
        .bottom-sand-level {
          animation: fillSand 6s ease-in-out forwards;
        }

        @keyframes fillSand {
          0% {
            height: 0px;
            y: 112;
          }
          60%, 100% {
            height: 55px;
            y: 57;
          }
        }

        /* Neck widens dramatically */
        .neck-group {
          transform-origin: center;
          animation: widenNeck 6s ease-in-out forwards;
        }

        @keyframes widenNeck {
          0%, 30% {
            transform: scaleX(1);
          }
          50%, 100% {
            transform: scaleX(3.5);
          }
        }

        /* Crack transforms into flow channel */
        .crack-flow {
          animation: transformCrackFlow 6s ease-in-out forwards;
        }

        @keyframes transformCrackFlow {
          0%, 30% {
            stroke-width: 2;
            opacity: 0.4;
            stroke-dasharray: 3, 4;
          }
          40% {
            stroke-width: 4;
            opacity: 0.7;
            stroke-dasharray: 2, 2;
          }
          50%, 100% {
            stroke-width: 8;
            opacity: 1;
            stroke-dasharray: 0, 0;
          }
        }

        /* Crack outline glows green */
        .crack-outline {
          animation: crackGlow 6s ease-in-out forwards;
        }

        @keyframes crackGlow {
          0%, 30% {
            stroke: white;
            opacity: 0.7;
          }
          50%, 100% {
            stroke: ${BOTTLNEKK_GREEN};
            opacity: 1;
            filter: drop-shadow(0 0 10px ${BOTTLNEKK_GREEN});
          }
        }

        /* Gentle pulsing glow after transformation */
        .hourglass-svg {
          animation: pulseGlow 3s ease-in-out 6s infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 24px rgba(0, 201, 123, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 36px rgba(0, 201, 123, 0.7));
          }
        }

        /* Falling particles */
        .particle-1 {
          animation: fall1 2.5s ease-in 0.2s infinite;
        }

        .particle-2 {
          animation: fall2 2.3s ease-in 0.5s infinite;
        }

        .particle-3 {
          animation: fall3 2.6s ease-in 0.8s infinite;
        }

        @keyframes fall1 {
          0% {
            cy: 108;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            cy: 160;
            opacity: 0.7;
          }
          100% {
            cy: 165;
            opacity: 0;
          }
        }

        @keyframes fall2 {
          0% {
            cy: 112;
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            cy: 160;
            opacity: 0.6;
          }
          100% {
            cy: 165;
            opacity: 0;
          }
        }

        @keyframes fall3 {
          0% {
            cy: 115;
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          80% {
            cy: 160;
            opacity: 0.65;
          }
          100% {
            cy: 165;
            opacity: 0;
          }
        }

        /* Accessibility: Reduced motion shows final controlled state */
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

          .neck-group {
            transform: scaleX(3.5);
          }

          .crack-flow {
            stroke-width: 8;
            opacity: 1;
          }

          .crack-outline {
            stroke: ${BOTTLNEKK_GREEN};
            opacity: 1;
          }

          .top-sand-level {
            height: 25px;
            y: 63;
          }

          .bottom-sand-level {
            height: 55px;
            y: 57;
          }

          .hourglass-svg {
            filter: drop-shadow(0 0 24px rgba(0, 201, 123, 0.4));
          }
        }
      `}</style>
    </div>
  );
}
