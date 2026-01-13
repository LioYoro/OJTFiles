'use client';
import { Task } from '../types';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;   // Called when task is clicked to toggle complete
  onDelete: () => void;   // Called when delete button is clicked
  onUpdate?: (id: number, patch: Partial<Task>) => void; // update task fields (notes, title, etc.)
}

export default function TaskCard({ task, onToggle, onDelete, onUpdate }: TaskCardProps) {
  const [openNotes, setOpenNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes || '');

  const saveNotes = () => {
    onUpdate?.(task.id, { notes });
    setOpenNotes(false);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={task.completed} onChange={onToggle} className="w-4 h-4 text-primary-600" />
          <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}>{task.title}</span>
        </label>

        <div className="flex items-center space-x-2">
<<<<<<< HEAD
          <button onClick={() => setOpenNotes(prev => !prev)} className="text-sm text-primary-600">Notes</button>
          <button onClick={onToggle} className="text-sm text-primary-600">{task.completed ? 'Undo' : 'Done'}</button>
          <button onClick={onDelete} className="text-red-500 font-bold">✖</button>
=======
          <button onClick={() => setOpenNotes(prev => !prev)} className="btn-text text-sm">Notes</button>
          <button onClick={onToggle} className="btn-text text-sm">{task.completed ? 'Undo' : 'Done'}</button>
          <button onClick={onDelete} className="btn-danger font-bold">✖</button>
>>>>>>> e2d8ea7 (chore: update my-next-dashboard — dark-mode and weather improvements)
        </div>
      </div>

      {openNotes && (
        <div className="mt-3">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Add notes for this task..."
          />
          <div className="mt-2 flex items-center gap-2">
            <button onClick={saveNotes} className="btn-primary">Save</button>
            <button onClick={() => { setNotes(task.notes || ''); setOpenNotes(false); }} className="px-3 py-1 rounded border">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
