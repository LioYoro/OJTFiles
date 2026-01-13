'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Task } from '../types';

export default function HomeOverview() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tasks');
      if (stored) setTasks(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as Task[];
        if (Array.isArray(detail)) setTasks(detail);
        // eslint-disable-next-line no-console
        console.debug('HomeOverview received tasksUpdated', detail.length);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('tasksUpdated', handler as EventListener);
    return () => window.removeEventListener('tasksUpdated', handler as EventListener);
  }, []);

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="card">
        <h3 className="font-bold text-lg">Quick Stats</h3>
        <p className="mt-2">Pending: <span className="text-primary-500 font-semibold">{pending}</span></p>
        <p>Completed: <span className="text-green-500 font-semibold">{completed}</span></p>
        <Link href="/tasks" className="mt-3 inline-block text-sm text-primary-500">Manage tasks</Link>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg">Recent Tasks</h3>
        <ul className="mt-2 space-y-1">
          {tasks.slice(-3).reverse().map(t => (
            <li key={t.id} className={t.completed ? 'text-gray-500 line-through' : ''}>{t.title}</li>
          ))}
          {tasks.length === 0 && <li className="text-gray-500">No tasks yet</li>}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-bold text-lg">Quick Actions</h3>
        <div className="mt-2 flex flex-col space-y-2">
          <Link href="/tasks" className="btn-primary text-center">Add Task</Link>
          <Link href="/stats" className="px-4 py-2 rounded bg-amber-400 text-white text-center hover:bg-amber-500">View Stats</Link>
        </div>
      </div>
    </div>
  );
}
