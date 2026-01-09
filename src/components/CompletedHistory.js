import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import './CompletedHistory.css';
import Tasks from './Tasks';

const CompletedHistory = ({ tasks, statusHandle, deleteHandle }) => {
    const location = useLocation();

    // Filter only completed tasks
    const allCompletedTasks = tasks.filter(task => task.isCompleted);

    // Sort completed tasks by date (newest first)
    const sortedCompletedTasks = allCompletedTasks.sort((a, b) => {
        if (a.completedAt && b.completedAt) {
            return new Date(b.completedAt) - new Date(a.completedAt);
        }
        return 0;
    });

    return (
        <div className="history-page">
            <header className="history-header">
                <Link to="/" className="back-link">
                    ← Back
                </Link>
                <h1>Completed History</h1>
            </header>

            {sortedCompletedTasks.length > 0 ? (
                <Tasks
                    tasks={sortedCompletedTasks}
                    statusHandle={statusHandle}
                    deleteHandle={deleteHandle}
                    isCompletedList={true}
                />
            ) : (
                <div className="empty-history">
                    No completed tasks found.
                </div>
            )}
        </div>
    );
};

export default CompletedHistory;
