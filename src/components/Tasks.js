import React from "react";
import './Tasks.css'
const Tasks = (props) => {
    const { tasks,statusHandle } = props;

    return (


            <ul className="tasks">
                {tasks.map((task,index) => (<li key={task.id} className="task" onClick={() => statusHandle(task.id)}>
                    <div>{index+1}</div>
                    <div className={task.isCompleted ? 'task-completd':''}>{task.name}</div>
                    <div>
                        <input 
                        type="checkbox" 
                        name="" id="" 
                        checked={task.isCompleted}  
                        onChange={() => statusHandle(task.id)}
                        /></div>
                </li>))}

            </ul>


    )
}

export default Tasks;