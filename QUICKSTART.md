# WebSocket Kanban Board - Quick Start Guide

## Prerequisites

- Node.js v16+ installed
- npm or yarn package manager

## Installation

### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 2. Install Frontend Dependencies

```powershell
cd ../frontend
npm install
```

## Running the Application

### Terminal 1 - Start Backend Server

```powershell
cd backend
npm start
```

✅ Backend running on http://localhost:5000

### Terminal 2 - Start Frontend Development Server

```powershell
cd frontend
npm run dev
```

✅ Frontend running on http://localhost:3000

## Testing

### Run Unit & Integration Tests

```powershell
cd frontend
npm test
```

### Run E2E Tests (Playwright)

```powershell
cd frontend
npm run build
npm run test:e2e
```

## Features Implemented

✅ Real-time WebSocket communication  
✅ Drag & Drop task management  
✅ File upload with validation  
✅ Priority & Category dropdowns  
✅ Progress visualization charts  
✅ Comprehensive testing suite (55+ tests)

## Project Structure

```
backend/     → Node.js + Socket.IO server
frontend/    → React + Vite application
  ├── src/components/   → UI components
  ├── src/services/     → WebSocket service
  └── src/tests/        → All test files
```

## Tech Stack

- Backend: Node.js, Express, Socket.IO, Multer
- Frontend: React, Vite, Socket.IO-client, React Beautiful DnD, Recharts
- Testing: Vitest, React Testing Library, Playwright

---

For detailed documentation, see the main [README.md](README.md)
