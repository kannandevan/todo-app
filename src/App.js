import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Tasks from './components/Tasks';
import ConfirmationModal from './components/ConfirmationModal';
import AlertModal from './components/AlertModal';
import TimePicker from './components/TimePicker';
import CompletedHistory from './components/CompletedHistory';

function App() {
  /* Initialize tasks from localStorage */
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  /* Initialize lastId based on existing tasks */
  const [lastId, setLastId] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      return parsedTasks.length > 0 ? Math.max(...parsedTasks.map(t => t.id)) : 0;
    } catch {
      return 0;
    }
  });

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Alert State
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  /* Apply theme to document */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  /* Persist tasks to localStorage whenever they change */
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleStatusChange = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return {
          ...task,
          isCompleted: !task.isCompleted,
          completedAt: !task.isCompleted ? new Date().toISOString() : null
        }
      }
      return task
    })
    setTasks(updatedTasks);
  }

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  }

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskToDelete);
      setTasks(updatedTasks);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  }

  const cancelDeleteTask = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  }

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInput(inputValue);
  }

  const handleAddTask = () => {
    if (input.trim()) {
      const newId = lastId + 1;

      // Default to today if date is not provided
      let finalDate = date;

      const now = new Date();
      const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

      if (date && date < todayStr) {
        setAlertMessage("You cannot create a task for a previous date. Please choose a valid date.");
        setIsAlertOpen(true);
        return;
      }

      if (!finalDate) {
        finalDate = todayStr;
      }

      const hasTime = !!time;
      const finalDateTime = hasTime ? `${finalDate}T${time}` : `${finalDate}T00:00`;

      const newData = {
        name: input,
        description: description,
        dueDate: finalDateTime,
        hasTime: hasTime,
        id: newId,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newData]);
      setLastId(newId);
      setInput('');
      setDescription('');
      setDate('');
      setTime('');
    }
  }

  const pendingTasks = tasks
    .filter((task) => !task.isCompleted)
    .sort((a, b) => {
      // Sort by dueDate if available
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0; // Keep original order for those without date
    });

  const completedTasks = tasks
    .filter((task) => task.isCompleted)
    .sort((a, b) => {
      // Sort by completedAt descending
      if (a.completedAt && b.completedAt) {
        return new Date(b.completedAt) - new Date(a.completedAt);
      }
      return 0;
    });

  /* Navigation Helper */
  const navigate = useNavigate();

  const handleShowHistory = () => {
    navigate('/completed-history');
  }

  /* Filtering helper for main view */
  const recentCompletedTasks = completedTasks.filter(task => {
    const completedDate = new Date(task.completedAt);
    completedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return completedDate.getTime() === today.getTime() || completedDate.getTime() === yesterday.getTime();
  });



  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={
          <>
            <header className="app-header">
              <div className="header-content">
                <h1 className="app-title">Todo App</h1>
                <p className="app-subtitle">Focus on your day</p>
              </div>
              <div className="header-actions">
                <button
                  className="icon-btn"
                  onClick={toggleTheme}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  )}
                </button>
                <button
                  className="icon-btn"
                  onClick={handleShowHistory}
                  title="View History"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
                  </svg>
                </button>
              </div>
            </header>

            <div className="input-area">
              <div className="input-group">
                <input
                  type="text"
                  value={input}
                  placeholder='Add a new task...'
                  className='add-input'
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <input
                  type="text"
                  value={description}
                  placeholder='Description (optional)'
                  className='add-input description-input'
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="date-time-inputs">
                  <input
                    type="date"
                    value={date}
                    min={(() => {
                      const now = new Date();
                      return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
                    })()}
                    className='add-input date-input'
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <TimePicker
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className='time-input'
                    placeholder="Time"
                  />
                </div>
              </div>
              <button className="add-btn" onClick={handleAddTask}>
                +
              </button>
            </div>

            <div className='task-group'>
              <div className="task-heading">Pending ({pendingTasks.length})</div>
              {pendingTasks.length > 0 ? (
                <Tasks
                  tasks={pendingTasks}
                  statusHandle={handleStatusChange}
                  deleteHandle={handleDeleteClick}
                />
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                  No pending tasks
                </div>
              )}
            </div>

            {recentCompletedTasks.length > 0 && (
              <div className='task-group'>
                <div className="task-heading">Completed ({recentCompletedTasks.length})</div>
                <Tasks
                  tasks={recentCompletedTasks}
                  statusHandle={handleStatusChange}
                  deleteHandle={handleDeleteClick}
                  isCompletedList={true}
                />
              </div>
            )}



            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={cancelDeleteTask}
              onConfirm={confirmDeleteTask}
              title="Delete Task"
              message="Are you sure you want to delete this task? This action cannot be undone."
            />

            <AlertModal
              isOpen={isAlertOpen}
              onClose={() => setIsAlertOpen(false)}
              title="Invalid Date"
              message={alertMessage}
            />
          </>
        } />

        <Route path="/completed-history" element={
          <CompletedHistory
            tasks={tasks}
            statusHandle={handleStatusChange}
            deleteHandle={handleDeleteClick}
          />
        } />
      </Routes>
    </div>
  );
}

export default App;
