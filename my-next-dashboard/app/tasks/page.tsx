'use client';

import { useState, useEffect } from 'react';
import { Task } from '../../types';
import TaskCard from '../../components/TaskCard';

const defaultTasks: Task[] = [
  { id: 1, title: 'Finish report', completed: false },
  { id: 2, title: 'Review dashboard', completed: true },
  { id: 3, title: 'Send email updates', completed: false },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [newTask, setNewTask] = useState('');

  // ✅ Load from localStorage (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tasks');
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        localStorage.setItem('tasks', JSON.stringify(defaultTasks));
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    }
  }, []);

  // ✅ Save to localStorage when tasks change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      window.dispatchEvent(
        new CustomEvent('tasksUpdated', { detail: tasks })
      );
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newT: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };
    setTasks(prev => [...prev, newT]);
    setNewTask('');
  };

  const toggleComplete = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <main className="py-8">
      <div className="site-container">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>

        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Add new task"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section>
            <h2 className="font-semibold mb-2">Pending</h2>
            <div className="space-y-2">
              {tasks.filter(t => !t.completed).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onUpdate={(id, patch) =>
                    setTasks(prev =>
                      prev.map(t =>
                        t.id === id ? { ...t, ...patch } : t
                      )
                    )
                  }
                />
              ))}
              {tasks.filter(t => !t.completed).length === 0 && (
                <div className="card">No pending tasks</div>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-semibold mb-2">Completed</h2>
            <div className="space-y-2">
              {tasks.filter(t => t.completed).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onUpdate={(id, patch) =>
                    setTasks(prev =>
                      prev.map(t =>
                        t.id === id ? { ...t, ...patch } : t
                      )
                    )
                  }
                />
              ))}
              {tasks.filter(t => t.completed).length === 0 && (
                <div className="card">No completed tasks yet</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
