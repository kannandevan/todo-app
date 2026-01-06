import React from "react";
import './Tasks.css'
const Tasks = (props) => {


  const { tasks, statusHandle, deleteHandle, isCompletedList } = props;

  // Helper to normalize date to start of day
  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Grouping Logic
  const groups = {};
  const noDateTasks = [];

  tasks.forEach(task => {
    let dateKey = '';
    let sortValue = 0;
    let displayHeader = '';
    let isOverdue = false;

    if (isCompletedList) {
      if (!task.completedAt) return; // Should not happen for completed list
      const completedDate = startOfDay(task.completedAt);
      const timeDiff = today.getTime() - completedDate.getTime();

      if (timeDiff === 0) {
        dateKey = 'today_completed';
        sortValue = 3;
        displayHeader = "Today's completed";
      } else if (timeDiff === 86400000) { // 24 * 60 * 60 * 1000
        dateKey = 'yesterday_completed';
        sortValue = 2;
        displayHeader = "Yesterday's completed";
      } else {
        dateKey = 'previous_completed';
        sortValue = 1;
        displayHeader = "Previous days";
      }
    } else {
      if (!task.dueDate) {
        noDateTasks.push(task);
        return;
      }
      const dueDate = startOfDay(task.dueDate);

      if (dueDate.getTime() < today.getTime()) {
        isOverdue = true;
      }

      if (dueDate.getTime() === today.getTime()) {
        displayHeader = "Today";
        sortValue = dueDate.getTime();
      } else if (dueDate.getTime() === tomorrow.getTime()) {
        displayHeader = "Tomorrow";
        sortValue = dueDate.getTime();
      } else {
        displayHeader = dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        sortValue = dueDate.getTime();
      }
      dateKey = displayHeader; // Use header as key for pending to group by specific date
    }

    if (!groups[dateKey]) {
      groups[dateKey] = {
        title: displayHeader,
        tasks: [],
        sortValue: sortValue,
        isOverdueGroup: isOverdue // Mark group as potentially containing overdue items (though overdue items are grouped by date)
      };
    }
    groups[dateKey].tasks.push({ ...task, isOverdue });
  });

  // Helper to render a list of tasks
  const renderTaskList = (taskList) => (
    <ul className="tasks-list">
      {taskList.map((task, index) => {
        const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
        const completedDateObj = task.isCompleted && task.completedAt ? new Date(task.completedAt) : null;

        const formatDate = (date, hasTime) => {
          if (!date) return '';
          const dateStr = date.toLocaleDateString();
          if (hasTime === false) return dateStr;
          return dateStr + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
          <li
            key={task.id}
            className={`task ${task.isCompleted ? 'completed' : ''} ${task.isOverdue ? 'overdue' : ''}`}
            onClick={() => statusHandle(task.id)}
          >
            {/* <div className="task-index">{index + 1}</div>  -- Removing index as it restarts per group */}
            <div className="task-content">
              <div className="task-header">
                <div className="task-text">{task.name}</div>
                {task.isOverdue && !task.isCompleted && (
                  <div className="overdue-badge">Not completed on time</div>
                )}
              </div>

              <div className="task-meta-row">
                {dueDateObj && !task.isCompleted && (
                  <div className="task-due-date">
                    Due: {formatDate(dueDateObj, task.hasTime)}
                  </div>
                )}
                {task.isCompleted && completedDateObj && (
                  <div className="task-completed-date">
                    Completed: {formatDate(completedDateObj)}
                  </div>
                )}
              </div>

              {task.description && (
                <div className="task-description">{task.description}</div>
              )}
            </div>
            <div className="task-actions">
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHandle(task.id);
                }}
                title="Delete task"
              >
                ×
              </button>
              <div className="task-checkbox-container">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={!!task.isCompleted}
                  readOnly
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  // Sorting groups
  const sortedGroups = Object.values(groups).sort((a, b) => {
    if (isCompletedList) {
      // Completed: Today (3) > Yesterday (2) > Previous (1)
      return b.sortValue - a.sortValue;
    } else {
      // Pending: Sort by date ascending
      return a.sortValue - b.sortValue;
    }
  });

  return (
    <div className="tasks-container">
      {sortedGroups.map((group) => (
        <div key={group.title} className="task-group-section">
          <h3 className={`group-header ${isCompletedList ? 'completed-header' : ''}`}>{group.title}</h3>
          {renderTaskList(group.tasks)}
        </div>
      ))}

      {/* Render tasks with no due date at the end for pending list */}
      {!isCompletedList && noDateTasks.length > 0 && (
        <div className="task-group-section">
          <h3 className="group-header">No Date</h3>
          {renderTaskList(noDateTasks)}
        </div>
      )}
    </div>
  );
}

export default Tasks;