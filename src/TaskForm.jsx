import { useState } from 'react';
import { useTask } from './TaskProvider';

export default function TaskForm() {
  const { addTask } = useTask();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Low');
  const [deadline, setDeadline] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() && deadline) {
      // Check if the task is already overdue when adding
      const isOverdue = new Date(deadline) < new Date();

      // Add the task with the overdue status
      addTask({
        title,
        priority,
        deadline,
        isOverdue,
      });

      // Reset form fields
      setTitle('');
      setPriority('Low');
      setDeadline('');
    }
  }

  return (
    <form action='' className='task-form' onSubmit={handleSubmit}>
      <input
        type='text'
        value={title}
        placeholder='Task title'
        required
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value='Low'>Low</option>
        <option value='Medium'>Medium</option>
        <option value='High'>High</option>
      </select>
      <input
        type='datetime-local'
        required
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type='submit'>Add task</button>
    </form>
  );
}
