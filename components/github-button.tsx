"use client";

interface GitHubButtonProps {
  className?: string;
}

export function GitHubButton({ className = "" }: GitHubButtonProps) {
  return (
    <a
      href="https://github.com/ferozemohideen/ghost"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center w-12 h-12 
        bg-gradient-to-b from-gray-800 to-gray-600 
        border-2 border-blue-400 hover:border-blue-300
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
        className="text-blue-50"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    </a>
  );
}