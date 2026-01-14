import HomeOverview from '../components/HomeOverview';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="py-8">
      <div className="site-container">
        <h1 className="text-4xl font-bold mb-4">Welcome to Smart Dashboard</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Track your tasks, stats, and productivity here!
        </p>

        <HomeOverview />

        <section className="card mt-6">
          <h2 className="font-bold text-xl">Project List</h2>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
            <li>
              <Link href="/weather" className="text-blue-600 hover:underline">
                Weather API — Open Interface
              </Link>
            </li>
            <li>
            <Link href="/music" className="text-blue-600 hover:underline">
              Music Player — Local Songs & Lyrics
            </Link>
          </li>
            <li>
              <Link href="/tasks" className="text-blue-600 hover:underline">
                Tasks
              </Link>
            </li>
            <li>
              <Link href="/stats" className="text-blue-600 hover:underline">
                Stats
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
