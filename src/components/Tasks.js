import React from "react";
import './Tasks.css'
const Tasks = (props) => {
    const { tasks,statusHandle } = props;

    return (


    <ul className="tasks">
      {tasks.map((task, index) => (
        <li
          key={task.id}
          className={`task ${task.isCompleted ? 'completed' : ''}`}
          onClick={() => statusHandle(task.id)}
        >
          <div className="task-index">{index + 1}</div>
          <div className="task-text">{task.name}</div>
          <div className="task-checkbox-container">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={!!task.isCompleted}
              readOnly
            />
          </div>
        </li>
      ))}
    </ul>


    )
}

export default Tasks;