'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '../types';

export default function TasksChart() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as Task[];
        if (Array.isArray(detail)) setTasks(detail);
        // eslint-disable-next-line no-console
        console.debug('TasksChart received tasksUpdated', detail.length);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('tasksUpdated', handler as EventListener);
    return () => window.removeEventListener('tasksUpdated', handler as EventListener);
  }, []);

  // Prepare chart data: show completed vs pending
  const data = [
    { name: 'Completed', count: tasks.filter(t => t.completed).length },
    { name: 'Pending', count: tasks.filter(t => !t.completed).length },
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="font-bold mb-2">Task Completion</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
