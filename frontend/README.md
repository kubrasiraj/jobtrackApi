# JobTrack Frontend

React + Vite client for the JobTrack FastAPI backend. It only uses endpoints that exist in the backend; the backend is not modified.

## Run

```bash
cd frontend
cp .env.example .env        # then set VITE_API_BASE_URL (e.g. http://localhost:8000)
npm install
npm run dev                 # http://localhost:5173
npm run build               # production build in dist/
```

The backend must be running and its `CORS_ORIGINS` must include the frontend origin
(the backend default is `http://localhost:5173`).

## Structure

- `src/services/` - Axios client (`api.js`) and one service per backend resource
- `src/context/` - auth session and toast notifications
- `src/components/ui/` - design-system primitives (Button, Field, Modal, Badge, ...)
- `src/components/<feature>/` - applications, companies, interviews, notes, dashboard
- `src/pages/` - route-level screens
- `src/utils/` - formatting, error normalisation, pagination helpers, constants
