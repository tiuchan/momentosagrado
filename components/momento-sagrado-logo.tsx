export function MomentoSagradoLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Momento Sagrado Logo"
    >
      {/* Outer circle - represents wholeness and eternity */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="text-primary/30" />

      {/* Inner sacred geometry - represents spiritual connection */}
      <path
        d="M50 15 L65 40 L90 40 L70 55 L80 80 L50 65 L20 80 L30 55 L10 40 L35 40 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-primary"
      />

      {/* Center dot - represents the divine presence */}
      <circle cx="50" cy="50" r="4" fill="currentColor" className="text-primary" />

      {/* Subtle rays emanating from center */}
      <line x1="50" y1="30" x2="50" y2="35" stroke="currentColor" strokeWidth="1.5" className="text-primary/50" />
      <line x1="50" y1="65" x2="50" y2="70" stroke="currentColor" strokeWidth="1.5" className="text-primary/50" />
      <line x1="30" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-primary/50" />
      <line x1="65" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-primary/50" />
    </svg>
  )
}
