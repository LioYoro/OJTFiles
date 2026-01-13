'use client';

import { useState, useEffect } from 'react';
import { Task } from '../../types';
import TaskCard from '../../components/TaskCard';

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: 'Finish report', completed: false },
  { id: 2, title: 'Review dashboard', completed: true },
  { id: 3, title: 'Send email updates', completed: false },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // ✅ Load tasks ONCE from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tasks');

      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks(DEFAULT_TASKS);
        localStorage.setItem('tasks', JSON.stringify(DEFAULT_TASKS));
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    }
  }, []);

  // ✅ Save tasks whenever they change
  useEffect(() => {
    if (tasks.length === 0) return;

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

    const newTaskObj: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };

    setTasks(prev => [...prev, newTaskObj]);
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

  const updateTask = (id: number, patch: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...patch } : task
      )
    );
  };

  return (
    <main className="py-8">
      <div className="site-container">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>

        {/* Add task */}
        <div className="flex mb-6 gap-2">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Add new task"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending */}
          <section>
            <h2 className="font-semibold mb-2">Pending</h2>
            <div className="space-y-2">
              {tasks.filter(t => !t.completed).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onUpdate={updateTask}
                />
              ))}

              {tasks.filter(t => !t.completed).length === 0 && (
                <div className="card">No pending tasks</div>
              )}
            </div>
          </section>

          {/* Completed */}
          <section>
            <h2 className="font-semibold mb-2">Completed</h2>
            <div className="space-y-2">
              {tasks.filter(t => t.completed).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onUpdate={updateTask}
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
