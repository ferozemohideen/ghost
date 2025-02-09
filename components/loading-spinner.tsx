export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-hacker-text text-2xl font-mono animate-pulse">
        Calculating route...
      </div>
    </div>
  );
}
