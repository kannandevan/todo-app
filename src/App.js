import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import Tasks from './components/Tasks'
function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [lastId, setLastId] = useState(0);
  useEffect(() => {
    axios.get('./data.json')
      .then((res) => {
        const allTasks = res.data;
        const idLast = allTasks.at(-1).id;
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
        return { ...task, isCompleted: !task.isCompleted }
      }
      return task
    })
    setTasks(updatedTasks);
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
        id: newId,
        isCompleted: false
      };
      setTasks([...tasks, newData]);
      setLastId(newId);
      setInput('');
    }
  }
  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);
  return (
    <div className='app'>
      <header className="app-header">
        <h1 className="app-title">Todo App</h1>
        <p className="app-subtitle">Focus on your day</p>
      </header>

      <div className='task-group'>
        <div className="task-heading">Pending ({pendingTasks.length})</div>
        {pendingTasks.length > 0 ? (
          <Tasks tasks={pendingTasks} statusHandle={handleStatusChange} />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
            No pending tasks
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className='task-group'>
          <div className="task-heading">Completed ({completedTasks.length})</div>
          <Tasks tasks={completedTasks} statusHandle={handleStatusChange} />
        </div>
      )}

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder='Add a new task...'
          className='add-input'
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button className="add-btn" onClick={handleAddTask}>
          +
        </button>
      </div>
    </div>
  );
}

export default App;
