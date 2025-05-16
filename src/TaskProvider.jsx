import { createContext, useContext, useEffect, useState } from 'react';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [sortType, setSortType] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openSection, setOpenSection] = useState({
    taskList: false,
    tasks: true,
    completedTasks: true,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateOverdueTasks();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Function to check if a task is overdue
  function isOverdue(deadline) {
    return new Date(deadline) < new Date();
  }

  // Function to check and update overdue tasks
  function updateOverdueTasks() {
    const now = new Date();
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        isOverdue: !task.completed && isOverdue(task.deadline),
      })),
    );
  }

  function toggleSection(section) {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  function addTask(task) {
    const now = new Date();
    setTasks([
      ...tasks,
      {
        ...task,
        completed: false,
        id: Date.now(),
        isOverdue: new Date(task.deadline) < now,
      },
    ]);
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function completeTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true, isOverdue: false } : task,
      ),
    );
  }

  function sortTask(tasks) {
    return tasks.slice().sort((a, b) => {
      if (sortType === 'priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return sortOrder === 'asc'
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
      }
    });
  }

  function toggleSortOrder(type) {
    if (sortType === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  }

  const activeTasks = sortTask(tasks.filter((task) => !task.completed));
  const completedTasks = sortTask(tasks.filter((task) => task.completed));

  return (
    <TaskContext.Provider
      value={{
        sortType,
        sortOrder,
        openSection,
        currentTime,
        toggleSection,
        addTask,
        deleteTask,
        completeTask,
        sortTask,
        toggleSortOrder,
        updateOverdueTasks,
        activeTasks,
        completedTasks,
        isOverdue,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
export function useTask() {
  const context = useContext(TaskContext);
  return context;
}
