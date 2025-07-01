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
      const newId = lastId +1;
      const newData = {
        name: input,
        id: newId,
        isCompleted: false
      };
      setTasks([...tasks,newData]);
      setLastId(newId);
  }
}
  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);
  return (
    <div className='app'>
      {
        pendingTasks.length != 0 ?
          <div className='task-group'><div className="task-heading">Pending Tasks</div><Tasks tasks={pendingTasks} statusHandle={handleStatusChange} /></div> : ''
      }
      {
        completedTasks.length != 0 ?
          <div className='task-group'><div className="task-heading">Completed Tasks</div><Tasks tasks={completedTasks} statusHandle={handleStatusChange} /></div> : ''
      }
      <div>
        <div className="task-group">
          <div className="task-heading">Add new task</div>
          <input type="text" name="" value={input} placeholder='Add task' className='add-input' onChange={handleInputChange} />
          <button onClick={handleAddTask}>Add task</button>
        </div>
      </div>
    </div>
  );
}

export default App;
