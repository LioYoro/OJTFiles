'use client';
import { useEffect, useState } from 'react';
import ChartCard from './ChartCard';

export default function StatsSummary() {
  const [completed, setCompleted] = useState(0);

  const load = () => {
    try {
      const stored = localStorage.getItem('tasks');
      if (stored) {
        const arr = JSON.parse(stored) as Array<{ completed?: boolean }>;
        setCompleted(arr.filter(t => t.completed).length);
        return;
      }
    } catch (e) {
      // ignore
    }
    setCompleted(0);
  };

  useEffect(() => {
    load();
    const onUpdate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as any[];
        if (Array.isArray(detail)) {
          setCompleted(detail.filter(t => t.completed).length);
          return;
        }
      } catch (err) {
        // ignore
      }
      load();
    };
    window.addEventListener('tasksUpdated', onUpdate as EventListener);
    // also listen to storage for cross-tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tasks') load();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('tasksUpdated', onUpdate as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <>
      <ChartCard title="Tasks Completed" value={String(completed)} />
      <ChartCard title="Longest Streak" value="5 days" />
    </>
  );
}
