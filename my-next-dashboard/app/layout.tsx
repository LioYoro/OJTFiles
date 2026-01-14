import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import MiniPlayer from "../components/MiniPlayer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body
        style={{
          fontFamily:
            "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
        }}
        className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"
      >
        <Navbar />

        {/* ❗ KEEP YOUR DESIGN */}
        <main className="max-w-6xl mx-auto p-6">{children}</main>

        {/* ✅ MINI PLAYER ADDED */}
        <MiniPlayer />
      </body>
    </html>
  );
}
