import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import Tasks from './components/Tasks'
function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('./data.json')
      .then((res) => {
        const allTasks = res.data;

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
    </div>
  );
}

export default App;
