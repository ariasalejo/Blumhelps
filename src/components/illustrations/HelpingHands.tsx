import React from 'react';

export function HelpingHands({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="skin1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4c7a1"/>
          <stop offset="100%" stopColor="#e6b58a"/>
        </linearGradient>
        <linearGradient id="skin2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5d0b0"/>
          <stop offset="100%" stopColor="#e7b890"/>
        </linearGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9fcf6e"/>
          <stop offset="100%" stopColor="#6fa84a"/>
        </linearGradient>
      </defs>
      
      {/* Background glow */}
      <ellipse cx="200" cy="320" rx="140" ry="30" fill="#6fa84a" opacity="0.08"/>
      
      {/* Left person */}
      <circle cx="140" cy="150" r="28" fill="url(#skin1)"/>
      <path d="M 120 175 Q 140 210 160 175 L 158 230 Q 140 245 122 230 Z" fill="#4a5d3a"/>
      <path d="M 135 178 Q 140 195 145 178" stroke="#d4a574" strokeWidth="2" fill="none"/>
      
      {/* Right person */}
      <circle cx="260" cy="145" r="28" fill="url(#skin2)"/>
      <path d="M 240 170 Q 260 205 280 170 L 278 225 Q 260 240 242 225 Z" fill="#3d5a3a"/>
      <path d="M 255 173 Q 260 190 265 173" stroke="#d4a574" strokeWidth="2" fill="none"/>
      
      {/* Helping hands */}
      <path d="M 150 200 Q 180 185 210 200 Q 230 210 210 225 Q 190 235 170 225 Q 150 215 150 200 Z" fill="url(#skin1)" opacity="0.9"/>
      <path d="M 190 195 Q 210 180 230 195 Q 245 205 230 220 Q 210 230 195 220 Q 180 210 190 195 Z" fill="url(#skin2)" opacity="0.9"/>
      
      {/* Heart */}
      <path d="M 200 165 C 195 155, 185 155, 185 165 C 185 175, 200 185, 200 185 C 200 185, 215 175, 215 165 C 215 155, 205 155, 200 165 Z" fill="#e85d3f" opacity="0.8">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
      </path>
      
      {/* Leaves of hope */}
      <path d="M 90 280 Q 85 250 95 230 Q 105 250 100 280 Z" fill="url(#leaf)"/>
      <path d="M 110 285 Q 108 255 120 235 Q 128 255 120 285 Z" fill="url(#leaf)"/>
      <path d="M 290 275 Q 285 245 295 225 Q 305 245 300 275 Z" fill="url(#leaf)"/>
      <path d="M 310 280 Q 308 250 320 230 Q 328 250 320 280 Z" fill="url(#leaf)"/>
      
      {/* Text elements */}
      <text x="200" y="340" fontSize="14" fill="#3d5a3a" textAnchor="middle" fontWeight="600">Acompañarnos para salir adelante</text>
    </svg>
  );
}
