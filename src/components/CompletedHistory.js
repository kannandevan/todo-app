import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import './CompletedHistory.css';
import Tasks from './Tasks';

const CompletedHistory = ({ tasks, statusHandle, deleteHandle }) => {
    const location = useLocation();

    // Filter only completed tasks
    const allCompletedTasks = tasks.filter(task => task.isCompleted);

    // Separate tasks into Recent (Today/Yesterday) and History (Older)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const olderCompletedTasks = allCompletedTasks.filter(task => {
        const completedDate = new Date(task.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate < yesterday;
    });

    return (
        <div className="history-page">
            <header className="history-header">
                <Link to="/" className="back-link">
                    ← Back
                </Link>
                <h1>Completed History</h1>
            </header>

            {olderCompletedTasks.length > 0 ? (
                <Tasks
                    tasks={olderCompletedTasks}
                    statusHandle={statusHandle}
                    deleteHandle={deleteHandle}
                    isCompletedList={true}
                />
            ) : (
                <div className="empty-history">
                    No older completed tasks found.
                </div>
            )}
        </div>
    );
};

export default CompletedHistory;
