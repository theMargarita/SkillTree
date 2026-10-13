# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

````js
  # SkillTree

  SkillTree is a learning-progress tracker built around visual skill trees. A board represents a learning path, with skills arranged on a canvas and connected to show prerequisites or progression. Selecting a skill opens its detail panel, where users can work through subskills and record evidence of their progress.

  This repository contains the React frontend. The companion backend is an ASP.NET Core Web API that stores boards, skills, subskills, connections, users, and progress entries in SQL Server.

  ## Features

  - Render a skill board with positioned nodes and SVG connections.
  - Display skill status and board completion progress.
  - Open a skill to view its subskills and descriptions.
  - Mark subskills complete or incomplete.
  - Add and view text-based progress entries for each subskill.
  - Show loading and API error states in the relevant views.
  - Access the backend API through Swagger during development.

  ## Technology

  - React 19 with TypeScript
  - Vite 8
  - ASP.NET Core 9 Web API
  - Entity Framework Core with SQL Server
  - ESLint and TypeScript project checks

  ## Project Structure

  ```text
  frontend/
    src/
      api/       API-backed React components and hooks
      features/  Skill, subskill, and progress-entry UI
      types/     TypeScript representations of backend DTOs
      css/       Feature-specific styles

  backend/
    skilltree/   ASP.NET Core API host
    Domain/      Domain models
    Infrastructure/ Database and persistence code
    Services/    Application services
````

## Prerequisites

- Node.js and npm
- .NET 9 SDK
- SQL Server running locally
- A database named `SkillTreeDB`, or a connection string configured for the backend

## Configuration

The frontend reads the API base URL from `VITE_API_BASE`. Create or update `frontend/.env`:

```env
VITE_API_BASE=http://localhost:5001
```

The backend's default connection string is in `backend/skilltree/appsettings.json`. Its HTTP development profile listens on `http://localhost:5001`; the HTTPS profile listens on `https://localhost:7282`.

## Running Locally

Start the backend from `backend/skilltree`:

```bash
dotnet run --launch-profile http
```

In a second terminal, install frontend dependencies and start Vite from `frontend`:

```bash
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`. The API's Swagger UI is available at `http://localhost:5001/swagger` while the backend is running in Development mode.

## Available Frontend Commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Current Development Notes

- The main screen currently loads a fixed board ID from `src/App.tsx`.
- User list support exists in the API layer but is not currently rendered by the main app.
- The frontend expects the backend API and SQL Server database to be available; it does not provide an offline data mode.
