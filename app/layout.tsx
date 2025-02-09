import "./globals.css";
import type React from "react";
import Script from "next/script";

export const metadata = {
  title: "Ghost - Surveillance-Free Route Planning",
  description: "Find paths in the city with minimal surveillance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-hacker-bg text-hacker-text">
        {children}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
