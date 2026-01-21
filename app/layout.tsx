import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O/U - Overrated or Underrated?",
  description: "Swipe to vote: Is it overrated or underrated? See what the world thinks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
