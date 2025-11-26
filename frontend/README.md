# NASA APOD React Frontend

A React application for viewing NASA's Astronomy Picture of the Day (APOD) built with TanStack Query and React Router.

## Features

- View today's APOD or search by specific date
- Search by date range (up to 6 months)
- Responsive design matching the Qute template
- Real-time form validation
- Image and video media support
- Error handling and loading states

## Tech Stack

- React 18+ with TypeScript
- Vite for build tooling
- TanStack Query for data fetching and caching
- TanStack Router for routing (ready for future implementation)

## Prerequisites

- Node.js 16+ and npm
- Running backend API on http://localhost:8080

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure the API base URL:
```bash
cp .env.example .env
```
Edit `.env` to change the API URL if needed (default: http://localhost:8080)

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── apod.ts           # API service functions
│   ├── components/
│   │   ├── ApodCard.tsx      # Individual APOD display
│   │   ├── ApodList.tsx      # List of APOD entries
│   │   └── SearchForm.tsx    # Search form with validation
│   ├── types/
│   │   └── apod.ts           # TypeScript interfaces
│   ├── App.tsx               # Main application component
│   ├── App.css               # Application styles
│   ├── main.tsx              # Entry point with Query provider
│   └── index.css             # Global styles
└── README.md
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8080)

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Notes

- The backend must be running and CORS must be configured for the frontend origin
- Valid date range: June 16, 1995 to today
- Date range searches are limited to 6 months maximum
