import React from "react";

export default function GlobeLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Gradient for Globe */}
      <defs>
        <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" /> {/* blue-800 */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* blue-500 */}
          <stop offset="100%" stopColor="#0ea5e9" /> {/* sky-500 */}
        </linearGradient>
      </defs>

      {/* Sphere base with gradient */}
      <circle cx="50" cy="50" r="46" fill="url(#globeGrad)" />

      {/* Grid Lines (Longitude/Latitude curves to form a majestic globe) */}
      
      {/* Equator */}
      <line 
        x1="4" 
        y1="50" 
        x2="96" 
        y2="50" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeOpacity="0.85" 
      />

      {/* Prime Meridian (Vertical) */}
      <line 
        x1="50" 
        y1="4" 
        x2="50" 
        y2="96" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeOpacity="0.85" 
      />

      {/* Longitude Ellipse 1 */}
      <ellipse 
        cx="50" 
        cy="50" 
        rx="26" 
        ry="46" 
        stroke="white" 
        strokeWidth="2.2" 
        strokeOpacity="0.65" 
      />

      {/* Longitude Ellipse 2 */}
      <ellipse 
        cx="50" 
        cy="50" 
        rx="12" 
        ry="46" 
        stroke="white" 
        strokeWidth="1.8" 
        strokeOpacity="0.45" 
      />

      {/* Latitude Line North */}
      <path 
        d="M13 28 C 30 38, 70 38, 87 28" 
        stroke="white" 
        strokeWidth="2" 
        strokeOpacity="0.6" 
      />

      {/* Latitude Line South */}
      <path 
        d="M13 72 C 30 62, 70 62, 87 72" 
        stroke="white" 
        strokeWidth="2" 
        strokeOpacity="0.6" 
      />

      {/* Rising News/Global Orbit Accent (to signify dynamic broadcasting) */}
      <path
        d="M 12 18 A 46 46 0 0 1 88 18"
        stroke="#f43f5e" /* Rose/Coral dynamic accent */
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.9"
        fill="none"
      />
      
      {/* Decorative center transmission/satellite dot */}
      <circle cx="50" cy="50" r="4.5" fill="white" />
      <circle cx="50" cy="50" r="8" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}
