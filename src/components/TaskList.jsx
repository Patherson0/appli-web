import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, deleteTask, toggleTask }) => {
    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.map(task => (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        deleteTask={deleteTask} 
                        toggleTask={toggleTask} 
                    />
                ))}
            </ul>
        </div>
    );
};

export default TaskList;