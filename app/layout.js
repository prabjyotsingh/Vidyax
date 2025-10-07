import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StudyTracker",
  description: "Track learning playlists and progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div className="flex min-h-screen">
          <aside className="hidden md:flex w-64 flex-col border-r bg-white">
            <Link
              href="/"
              className="mx-3 mt-5 mb-2 px-4 py-3 text-xl font-semibold text-left rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Study Tracker
            </Link>
            <nav className="px-3 space-y-3">
              <a href="/" className="block px-3 py-2 text-lg rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Dashboard</a>
              <a href="/playlists" className="block px-3 py-2 text-lg rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Playlists</a>
              <a href="/progress" className="block px-3 py-2 text-lg rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Progress</a>
              <a href="/notes" className="block px-3 py-2 text-lg rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">AI Notes</a>
              <a href="/analytics" className="block px-3 py-2 text-lg rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Analytics</a>
            </nav>
          </aside>
          <main className="flex-1">
            <header className="sticky top-0 z-20 bg-white border-b">
              <div className="flex items-center gap-3 px-6 h-16">
                <button className="md:hidden p-2 rounded-lg border">Menu</button>
                <div className="flex-1">
                  <input placeholder="Search playlists..." className="w-full max-w-md border rounded-lg px-3 py-2" />
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn-primary">Share</button>
                </div>
              </div>
            </header>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
