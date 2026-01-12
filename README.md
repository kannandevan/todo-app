# Todo App

A modern, feature-rich Todo application built with React, designed to help you organize your daily tasks efficiently.

## Features

*   **Task Management**
    *   Create tasks with a title, optional description, due date, and time.
    *   **Smart Sorting**: Pending tasks are automatically sorted by due date.
    *   **Completion Tracking**: Mark tasks as complete/incomplete. Completed tasks move to a separate section.
    *   **Task History**: View a comprehensive history of all completed tasks in a dedicated view.

*   **Date & Time Control**
    *   **Custom Time Picker**: An intuitive, analog-clock style time picker for setting specific due times.
    *   **Date Validation**: Prevents mistakenly scheduling tasks for past dates.

*   **User Experience**
    *   **Dark/Light Mode**: Toggle between themes to suit your preference.
    *   **Responsive Design**: Optimized for both desktop and mobile devices.
    *   **Confirmation Modals**: Safety checks when deleting tasks to prevent accidental data loss.
    *   **Offline Persistence**: All data (tasks and theme settings) is saved locally in your browser, so you never lose your progress even if you close the tab.

## Technologies Used

*   **Frontend Library**: React 19
*   **Routing**: React Router DOM 7
*   **Styling**: Pure CSS with CSS Variables for theming
*   **State Management**: React Hooks (`useState`, `useEffect`) + Context-free simple state
*   **Storage**: Browser `localStorage`

## Installation

To get this project running locally on your machine:

1.  **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed (version 14 or higher recommended).

2.  **Clone the repository** (if applicable) or navigate to the project root.

3.  **Install Dependencies**:
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

## Usage

### Development Mode
To run the app in development mode:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

### Production Build
To build the app for production:
```bash
npm run build
```
This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Project Structure

*   `src/components`: Contains individual UI components like `Tasks`, `TimePicker`, `ConfirmationModal`, etc.
*   `src/App.js`: Main application logic, state management, and routing.
*   `src/index.css`: Global styles and theme variable definitions.
