import React from "react";
import './Tasks.css'
const Tasks = (props) => {
  const { tasks, statusHandle } = props;

  return (


    <ul className="tasks">
      {tasks.map((task, index) => {
        const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
        const completedDateObj = task.isCompleted && task.completedAt ? new Date(task.completedAt) : null;

        const formatDate = (date) => {
          if (!date) return '';
          return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
          <li
            key={task.id}
            className={`task ${task.isCompleted ? 'completed' : ''}`}
            onClick={() => statusHandle(task.id)}
          >
            <div className="task-index">{index + 1}</div>
            <div className="task-content">
              <div className="task-header">
                <div className="task-text">{task.name}</div>
                {dueDateObj && !task.isCompleted && (
                  <div className="task-due-date">
                    Due: {formatDate(dueDateObj)}
                  </div>
                )}
              </div>
              {task.description && (
                <div className="task-description">{task.description}</div>
              )}
              {task.isCompleted && completedDateObj && (
                <div className="task-completed-date">
                  Completed: {formatDate(completedDateObj)}
                </div>
              )}
            </div>
            <div className="task-checkbox-container">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={!!task.isCompleted}
                readOnly
              />
            </div>
          </li>
        );
      })}
    </ul>


  )
}

export default Tasks;