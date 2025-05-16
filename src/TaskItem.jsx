import { useTask } from './TaskProvider';

export default function TaskItem({ task }) {
  const { deleteTask, completeTask, isOverdue } = useTask();
  const { title, priority, deadline, id, completed } = task;

  // Format the deadline for display
  const formatDeadline = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Determine the CSS class for the task item
  const getTaskClass = () => {
    if (completed) return 'task-item completed';
    if (isOverdue(deadline))
      return `task-item ${priority.toLowerCase()} overdue`;
    return `task-item ${priority.toLowerCase()}`;
  };

  return (
    <li className={getTaskClass()}>
      <div className='task-info'>
        <div>
          {title} <strong>{priority}</strong>
        </div>
        <div className='task-deadline'>
          {completed ? 'Completed' : `Due: ${formatDeadline(deadline)}`}
        </div>
      </div>
      <div className='task-buttons'>
        {!completed && (
          <button className='complete-button' onClick={() => completeTask(id)}>
            Complete
          </button>
        )}
        <button className='delete-button' onClick={() => deleteTask(id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
