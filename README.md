# scrob-ui

Web interface for the scrob music scrobbling server.

## Features

- Login with username/password authentication
- View recent scrobbles
- Browse top artists and tracks
- Token-based session management with localStorage persistence
- Responsive layout with clean purple gradient theme

## Prerequisites

- Node.js 22 (via Nix shell)
- Running scrob server (see [../scrob](../scrob))

## Development Setup

### With Nix (Recommended)

```bash
# Enter development environment
nix-shell

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Without Nix

Ensure you have Node.js 22+ installed:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The UI will be available at `http://localhost:5173`.

## Configuration

The UI connects to the scrob server at `http://localhost:3000` by default. To
use a different API URL, create a `.env` file:

```bash
VITE_API_URL=http://your-server:3000
```

## Usage

1. Start the scrob server (see server README)
2. Start the UI dev server with `npm run dev`
3. Visit `http://localhost:5173`
4. Login with your credentials
5. Browse your scrobbles and stats

## Production Build

```bash
npm run build
```

Built files will be in the `dist/` directory. Serve them with any static file
server.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions including:
- Docker deployment (recommended)
- Combined full-stack docker-compose
- Static file deployment to nginx/Apache
- Production setup with HTTPS

Quick Docker start:
```bash
docker-compose up -d
```

## Tech Stack

- Svelte 5
- Vite 7
- Vanilla CSS (no frameworks)

## Project Structure

```
src/
├── App.svelte           - Main app component with auth routing
├── lib/
│   ├── Login.svelte     - Login form component
│   ├── RecentScrobbles.svelte  - Recent listens view
│   ├── TopStats.svelte  - Top artists/tracks view
│   ├── auth.js          - Authentication store
│   ├── api.js           - API client
│   └── utils.js         - Utility functions
└── main.js              - App entry point
```

## License

MIT OR Apache-2.0
