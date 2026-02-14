# 🚀 WebSocket-Powered Kanban Board

A real-time Kanban board built with **React**, **Node.js**, **Socket.IO**. Includes testing with **Vitest** and **Playwright**.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Features Overview](#features-overview)
- [WebSocket Events](#websocket-events)

---

## ✨ Features

✅ **Real-time Collaboration** - Multiple users can work simultaneously with instant updates  
✅ **Drag & Drop** - Move tasks between columns (To Do, In Progress, Done)  
✅ **Task Management** - Create, edit, delete tasks with rich information  
✅ **Priority Levels** - Low, Medium, High priority assignment  
✅ **Categories** - Bug, Feature, Enhancement classification  
✅ **File Attachments** - Upload images, PDFs, documents (max 5MB)  
✅ **Progress Visualization** - Real-time charts showing task distribution and completion  
✅ **Testing Suite** - Unit, Integration, and E2E tests

---

## 🛠 Tech Stack

### Backend

- **Node.js** + **Express** - Server framework
- **Socket.IO** - WebSocket implementation
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Beautiful DnD** - Drag and drop functionality
- **Recharts** - Data visualization
- **Socket.IO Client** - WebSocket client
- **Axios** - HTTP requests

### Testing

- **Vitest** - Unit & Integration testing
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **jsdom** - DOM simulation

---

## 📂 Project Structure

```
Websocket_based_kanban_board/
│
├── backend/
│   ├── server.js              # Express + Socket.IO server
│   ├── package.json
│   └── uploads/               # File storage directory
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── KanbanBoard.jsx      # Main board component
│   │   │   ├── TaskCard.jsx         # Individual task display
│   │   │   ├── TaskForm.jsx         # Create/Edit task form
│   │   │   └── TaskChart.jsx        # Progress visualization
│   │   ├── services/
│   │   │   └── socketService.js     # WebSocket service
│   │   ├── tests/
│   │   │   ├── unit/                # Unit tests
│   │   │   ├── integration/         # Integration tests
│   │   │   └── e2e/                 # Playwright E2E tests
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── playwright.config.js
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Step 1: Clone/Navigate to Project

```bash
cd "d:\web dev\Projects\Websocket_based_kanban_board"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

Server runs on **http://localhost:5000**

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend runs on **http://localhost:3000**

### Access the Application

Open your browser and navigate to: **http://localhost:3000**

---

## 🧪 Testing

### Run Unit Tests (Vitest)

```bash
cd frontend
npm test
```

### Run Unit Tests with UI

```bash
npm run test:ui
```

### Run E2E Tests (Playwright)

```bash
cd frontend
npm run build          # Build the app first
npm run test:e2e       # Run Playwright tests
```

### Test Coverage

- **Unit Tests**: 15+ tests covering components and services
- **Integration Tests**: 10+ tests for component interactions
- **E2E Tests**: 30+ tests covering complete user workflows

---

## 📊 Features Overview

### 1. Real-time Task Management

- **Create**: Add new tasks with title, description, priority, category
- **Update**: Edit existing task details
- **Delete**: Remove tasks with confirmation
- **Move**: Drag tasks between columns or change status in edit form

### 2. Priority System

- **Low** (Gray badge)
- **Medium** (Orange badge) - Default
- **High** (Red badge)

### 3. Category System

- 🐛 **Bug** - Bug fixes and issues
- ✨ **Feature** - New feature development (Default)
- 🔧 **Enhancement** - Improvements to existing features

### 4. File Attachments

- **Supported formats**: JPEG, PNG, GIF, PDF, DOC, DOCX
- **Size limit**: 5MB per file
- **Storage**: Local server storage in `backend/uploads/`
- **Validation**: Client-side and server-side file type checking

### 5. Progress Visualization

- **Total Tasks** count
- **Completion Percentage** (Done / Total)
- **Bar Chart**: Task distribution across columns
- **Pie Chart**: Status breakdown visualization

### 6. Real-time Collaboration

- WebSocket connections for instant updates
- Multiple users can work simultaneously
- Connection status indicator (Connected/Disconnected)
- Auto-sync on new client connection

---

## 🔌 WebSocket Events

### Client → Server

| Event         | Payload                                                           | Description                   |
| ------------- | ----------------------------------------------------------------- | ----------------------------- |
| `task:create` | `{ title, description, status, priority, category, attachments }` | Create new task               |
| `task:update` | `{ id, ...updatedFields }`                                        | Update existing task          |
| `task:move`   | `{ taskId, newStatus }`                                           | Move task to different column |
| `task:delete` | `taskId`                                                          | Delete task                   |

### Server → Client

| Event          | Payload                 | Description                              |
| -------------- | ----------------------- | ---------------------------------------- |
| `sync:tasks`   | `[tasks]`               | Send all tasks to newly connected client |
| `task:created` | `task`                  | Broadcast newly created task             |
| `task:updated` | `task`                  | Broadcast updated task                   |
| `task:moved`   | `{ taskId, newStatus }` | Broadcast task movement                  |
| `task:deleted` | `taskId`                | Broadcast task deletion                  |
| `error`        | `{ message }`           | Error notification                       |

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Modern Gradient Theme**: Purple gradient background
- **Smooth Animations**: Hover effects and transitions
- **Loading Indicators**: During file uploads and server sync
- **Visual Feedback**: Color-coded badges, status indicators
- **Intuitive Controls**: Clear buttons and form inputs

---

## 📝 Code Quality

- **Clean Code**: Well-organized, readable, and maintainable
- **Comments**: Minimal but effective comments where needed
- **Error Handling**: Proper error handling for most cases
- **Validation**: Input validation on both client and server
- **Best Practices**: Following React and Node.js best practices

---

## 🔍 Testing Details

### Unit Tests (`src/tests/unit/`)

- ✅ TaskCard component rendering and interactions
- ✅ TaskForm validation and submission
- ✅ TaskChart calculations and display
- ✅ SocketService methods and event handling

### Integration Tests (`src/tests/integration/`)

- ✅ KanbanBoard component with WebSocket integration
- ✅ Drag and drop functionality
- ✅ Complete task lifecycle (create, edit, delete)
- ✅ Form and card interaction flow

### E2E Tests (`src/tests/e2e/`)

- ✅ Kanban board basic operations
- ✅ Priority and category dropdown selection
- ✅ File upload with validation
- ✅ Progress chart updates
- ✅ Drag and drop task movement
- ✅ Real-time synchronization

---

## 📊 Technical Architecture

| Component                     | Coverage | Implementation                                             |
| ----------------------------- | -------- | ---------------------------------------------------------- |
| **WebSocket Implementation**  | Core     | ✅ Socket.IO with 6 events, real-time sync, error handling |
| **React Component Structure** | Frontend | ✅ Modular components, proper separation, reusable design  |
| **Testing**                   | Quality  | ✅ 55+ tests (Unit + Integration + E2E)                    |
| **Code Quality**              | Overall  | ✅ Clean code, minimal comments, best practices            |
| **UI & UX**                   | Design   | ✅ Modern design, responsive, intuitive interface          |

---

## 🎯 How to Use

1. **Start the servers** (Backend + Frontend)
2. **Create a task** using "Add New Task" button
3. **Drag tasks** between columns to change status
4. **Edit tasks** by clicking the Edit button
5. **Upload files** when creating/editing tasks
6. **Monitor progress** in the chart at the top
7. **Open multiple browsers** to test real-time collaboration

---

## 🤝 Project Highlights

This project demonstrates:

- ✅ Full-stack development skills (MERN stack knowledge applied)
- ✅ WebSocket real-time communication
- ✅ Modern testing methodology
- ✅ Modern UI/UX implementation
- ✅ File upload handling
- ✅ Data visualization
- ✅ Clean, production-ready code

---

## 📞 Support

For any issues or questions:

1. Check console logs for errors
2. Ensure both backend and frontend servers are running
3. Verify WebSocket connection status in the UI
4. Check network tab for API/WebSocket requests

---

## ⚡ Performance Tips

- Backend uses in-memory storage (tasks reset on server restart)
- For production, integrate MongoDB or PostgreSQL
- File uploads stored locally in `backend/uploads/`
- WebSocket connections auto-reconnect on disconnect

---

**Built with ❤️ By Tushar Gupta using modern web technologies**
