# SkillTree

SkillTree is a learning-progress tracker that represents learning paths as visual skill trees. It helps users break larger goals into skills and subskills, connect prerequisite relationships, and record evidence of progress.

This directory contains the React frontend. The application uses the ASP.NET Core API in [`../backend/`](../backend/) for persistence and business operations.

## Why use SkillTree?

SkillTree is useful when a learning goal is easier to understand as a progression than as a checklist. A visual board can help you:

- Organize skills into a clear learning path.
- Show relationships and prerequisites between skills.
- Break skills into smaller, actionable subskills.
- Track completed and incomplete subskills.
- Add text, image, or combined text-and-image progress entries.
- See board and skill completion status.
- Update the learning path as your goals change.

## Features

- Visual board canvas with positioned skill nodes.
- Connections between skills to represent progression or prerequisites.
- Skill creation, editing, movement, and removal.
- Subskill creation, editing, completion, and removal.
- Skill and subskill detail views.
- Progress entries with text and optional image URLs.
- Board creation, editing, and deletion through the API layer.
- Loading and API error states in the relevant views.
- Swagger UI for exploring the backend API during development.

## Project architecture

The project is split into a frontend and backend:

```text
SkillTree/
├── frontend/                 # React, TypeScript, and Vite application
│   ├── public/               # Static assets
│   └── src/
│       ├── features/         # Board, skill, subskill, and progress features
│       ├── pages/            # Dashboard and board pages
│       └── shared/           # API helpers, configuration, types, and styles
└── backend/
    ├── SkillTree/            # ASP.NET Core API host and controllers
    ├── Domain/               # Domain entities
    ├── Infrastructure/       # EF Core context, DTOs, and migrations
    └── Services/             # Application service interfaces and implementations
```

The frontend communicates with the backend over HTTP. The backend stores application data in SQL Server using Entity Framework Core.

## Technology

### Frontend

- React `19.2.8`
- React DOM `19.2.8`
- React Router DOM `7.18.4`
- TypeScript `6.0.2`
- Vite `8.3.0`
- ESLint `10.10.0`

### Backend

- .NET `9`
- ASP.NET Core Web API
- Entity Framework Core `9.0.17`
- Microsoft SQL Server
- Swashbuckle ASP.NET Core `9.0.6`

## Prerequisites

Install the following before running the project:

- Node.js and npm
- .NET 9 SDK
- SQL Server
- Git

The backend expects a SQL Server database named `SkillTreeDB` by default. You can change the connection string in [`../backend/SkillTree/appsettings.json`](../backend/SkillTree/appsettings.json).

## Installation

Clone the repository and move into the frontend directory:

```bash
git clone <repository-url>
cd SkillTree/frontend
```

Install frontend dependencies:

```bash
npm install
```

Configure the frontend API URL by creating `frontend/.env`:

```env
VITE_API_BASE=http://localhost:5001
```

The `.env` file is local configuration and should not contain secrets committed to source control.

## Running locally

### 1. Start SQL Server

Start a local SQL Server instance and ensure the `SkillTreeDB` database is available, or update the backend connection string to point to an existing database.

### 2. Start the backend

Open a terminal in `backend/SkillTree` and run:

```bash
dotnet run --launch-profile http
```

The backend HTTP profile runs at `http://localhost:5001`. Swagger UI is available at:

```text
http://localhost:5001/swagger
```

An HTTPS development profile is also configured at `https://localhost:7282`.

### 3. Start the frontend

Open a second terminal in `frontend` and run:

```bash
npm run dev
```

Vite starts the frontend at `http://localhost:5173`.

The backend allows requests from this development origin through its configured CORS policy.

## Frontend commands

Run these commands from `frontend/`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## Configuration

The frontend reads its API base URL from `VITE_API_BASE` in [`src/shared/config/index.ts`](src/shared/config/index.ts).

Example:

```env
VITE_API_BASE=http://localhost:5001
```

The backend connection string and logging settings are defined in [`../backend/SkillTree/appsettings.json`](../backend/SkillTree/appsettings.json). Local launch URLs and the Development environment are defined in [`../backend/SkillTree/Properties/launchSettings.json`](../backend/SkillTree/Properties/launchSettings.json).

## Main frontend areas

- [`src/features/board/`](src/features/board/): board canvas, board API functions, and board styles.
- [`src/features/skill/`](src/features/skill/): skill modals, cards, API functions, and drag interactions.
- [`src/features/subskill/`](src/features/subskill/): subskill management and detail views.
- [`src/features/progress/`](src/features/progress/): progress-entry form and data access.
- [`src/features/skill-detail/`](src/features/skill-detail/): skill and subskill detail presentation.
- [`src/features/skillConnecton/`](src/features/skillConnecton/): skill-connection creation and geometry helpers.
- [`src/pages/`](src/pages/): page-level board and dashboard components.
- [`src/shared/api/`](src/shared/api/): shared HTTP and error-handling helpers.
- [`src/shared/types/`](src/shared/types/): TypeScript types matching backend DTOs.

## Data model overview

The application works with the following main concepts:

- **User**: owns or accesses boards.
- **Skill board**: a learning path containing skills.
- **Skill**: a major learning objective positioned on a board.
- **Subskill**: a smaller objective belonging to a skill.
- **Skill connection**: a relationship between two skills.
- **Progress entry**: evidence or notes for a subskill. Entries can be text-only, image-only, or contain both.

## Current development notes

- The main application currently renders a fixed board ID from [`src/App.tsx`](src/App.tsx).
- Dashboard and route components exist, but route registration is currently commented out in `App.tsx`.
- User-list support exists in the API and frontend components but is not currently rendered by the main application.
- The frontend requires the backend and SQL Server; there is no offline data mode.
- The API base URL must be configured before the frontend can load board data.

## License and contribution

MIT License
