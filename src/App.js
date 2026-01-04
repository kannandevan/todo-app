import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import Tasks from './components/Tasks'
function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [lastId, setLastId] = useState(0);

  useEffect(() => {
    axios.get('./data.json')
      .then((res) => {
        const allTasks = res.data;
        const idLast = allTasks.length > 0 ? allTasks.at(-1).id : 0;
        setLastId(idLast);
        setTasks(allTasks);

      })
      .catch((err) => {
        console.error('failed to Fetch Data ', err)
      })
  }, []);

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

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    }
  }

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInput(inputValue);
  }

  const handleAddTask = () => {
    if (input.trim()) {
      const newId = lastId + 1;
      const newData = {
        name: input,
        description: description,
        dueDate: date ? (time ? `${date}T${time}` : `${date}T00:00`) : null,
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

  return (
    <div className='app'>
      <header className="app-header">
        <h1 className="app-title">Todo App</h1>
        <p className="app-subtitle">Focus on your day</p>
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
              className='add-input date-input'
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              value={time}
              className='add-input time-input'
              onChange={(e) => setTime(e.target.value)}
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
            deleteHandle={handleDeleteTask}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
            No pending tasks
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className='task-group'>
          <div className="task-heading">Completed ({completedTasks.length})</div>
          <Tasks
            tasks={completedTasks}
            statusHandle={handleStatusChange}
            deleteHandle={handleDeleteTask}
          />
        </div>
      )}
    </div>
  );
}

export default App;
