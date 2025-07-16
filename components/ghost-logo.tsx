export function GhostLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <pre className="text-hacker-text font-bold inline-block text-left">
        {`
   ▄██████▄     ▄█    █▄     ▄██████▄     ▄████████     ███     
  ███    ███   ███    ███   ███    ███   ███    ███ ▀█████████▄ 
  ███    █▀    ███    ███   ███    ███   ███    █▀     ▀███▀▀██ 
 ▄███         ▄███▄▄▄▄███▄▄ ███    ███   ███            ███   ▀ 
▀▀███ ████▄  ▀▀███▀▀▀▀███▀  ███    ███ ▀███████████     ███     
  ███    ███   ███    ███   ███    ███          ███     ███     
  ███    ███   ███    ███   ███    ███    ▄█    ███     ███     
  ████████▀    ███    █▀     ▀██████▀   ▄████████▀     ▄████▀   
`}
      </pre>
      <p className="text-sm text-hacker-accent">
        Surveillance-Free Route Planning in NYC
      </p>
    </div>
  );
}
