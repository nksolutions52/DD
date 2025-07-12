// Updated ToothLogo.tsx with new SVG
export function ToothLogo({ className = "h-12 w-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <path d="M32,4C19.2,4,8,15.2,8,28c0,7.6,2.7,14.6,7.2,19.8,2.7,3,6.2,4.2,9.8,4.2,2.7,0,5.3-1,7-2.7,1.7,1.7,4.3,2.7,7,2.7,3.6,0,7.1-1.2,9.8-4.2C53.3,42.6,56,35.6,56,28,56,15.2,44.8,4,32,4Z" fill="#fff" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round"/>
          <ellipse cx="32" cy="28" rx="12" ry="16" fill="#e0e7ff"/>
          <ellipse cx="32" cy="28" rx="7" ry="10" fill="#fff"/>
        </g>
      </g>
    </svg>
  );
}