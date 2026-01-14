"use client";
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

export default function Navbar() {
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem('tasks');
        if (stored) {
          const arr = JSON.parse(stored) as Array<{ completed?: boolean }>;
          setCompletedCount(arr.filter(t => t.completed).length);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as any[];
        if (Array.isArray(detail)) setCompletedCount(detail.filter(t => t.completed).length);
        else load();
      } catch (err) {
        load();
      }
    };
    window.addEventListener('tasksUpdated', handler as EventListener);
    return () => window.removeEventListener('tasksUpdated', handler as EventListener);
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-indigo-600 via-primary-600 to-indigo-500 text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20 font-bold">16</div>
        <div>
          <div className="font-extrabold text-lg">Lio Dashboard</div>
          <div className="text-xs text-white/80">Mai Come mi fai Sogniare</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/" className="px-2 py-1 rounded-md hover:bg-white/10">Home</Link>
        <Link href="/tasks" className="px-2 py-1 rounded-md hover:bg-white/10">Tasks</Link>
        <Link href="/stats" className="px-2 py-1 rounded-md hover:bg-white/10">Stats</Link>
        <Link href="/music" className="px-2 py-1 rounded-md hover:bg-white/10">Music</Link>
        <div className="text-sm bg-white/20 px-3 py-1 rounded-md">Done: {completedCount}</div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
