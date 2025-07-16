"use client";

interface CoffeeButtonProps {
  className?: string;
}

export function CoffeeButton({ className = "" }: CoffeeButtonProps) {
  return (
    <a
      href="https://buymeacoffee.com/ferozem?new=1"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center w-12 h-12 
        bg-gradient-to-b from-purple-800 to-purple-600 
        border-2 border-orange-400 hover:border-orange-300
        transition-all duration-200 rounded-2xl
        ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-orange-50"
      >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    </a>
  );
}