# JobTrack

JobTrack is a job and internship application management system that helps users organize their job search in one place.

Users can create an account, manage companies, track applications, record interviews, and keep notes related to their applications. The project includes a React frontend, FastAPI backend, and PostgreSQL database.

The application is deployed as a single service, with the React production build served by FastAPI.

## Live Demo

[JobTrack](https://jobtrackapi-production.up.railway.app/)

## Features

* User registration and login
* JWT-based authentication
* User-specific data access
* Company management
* Job and internship application tracking
* Application status tracking
* Interview management
* Notes management
* Dashboard
* REST API
* PostgreSQL database
* Database migrations with Alembic
* React frontend
* Docker-based deployment
* Single public URL for frontend and backend

## Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router
* Tailwind CSS
* Lucide React

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* PostgreSQL
* Alembic
* JWT Authentication

### Deployment

* Docker
* Railway

## Project Structure

```text
JOBTRACK-API/
│
├── app/
│   ├── core/
│   ├── routers/
│   ├── models/
│   ├── services/
│   └── main.py
│
├── alembic/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Dockerfile
├── alembic.ini
├── pyproject.toml
└── poetry.lock
```

## How It Works

JobTrack follows a frontend-backend architecture.

The React frontend provides the user interface and communicates with the FastAPI backend through REST API endpoints.

The FastAPI backend handles:

* Authentication
* Request validation
* Business logic
* Database operations
* Protected API routes

PostgreSQL stores users, companies, applications, interviews, notes, and related data.

SQLAlchemy is used for database interaction, while Alembic manages database schema migrations.

In production, the React application is built during the Docker image build process. The generated `dist` files are included in the FastAPI container and served by FastAPI, allowing the complete application to run from one public URL.

## Authentication

JobTrack uses JWT-based authentication.

After registration and login, the application receives an access token. The frontend sends this token with authenticated API requests.

Protected backend routes verify the token before allowing access to user-specific resources.

This ensures that users can work with their own companies, applications, interviews, and notes without directly accessing another user's data.

## API

The FastAPI backend provides endpoints for:

```text
/auth
/companies
/applications
/interviews
/notes
/dashboard
```

FastAPI's interactive API documentation is available at:

```text
/docs
```

For the deployed application:

```text
https://jobtrackapi-production.up.railway.app/docs
```

## Running Locally

### Backend

Clone the repository:

```bash
git clone <repository-url>
cd JOBTRACK-API
```

Install the Python dependencies:

```bash
poetry install
```

Create a `.env` file in the project root:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173
```

Run database migrations:

```bash
poetry run alembic upgrade head
```

Start the FastAPI server:

```bash
poetry run uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Docker

The project uses a multi-stage Dockerfile.

### Stage 1

The React application is built using Node.js:

```text
React source
    ↓
npm run build
    ↓
frontend/dist
```

### Stage 2

The FastAPI application is prepared using Python, and the React production build is copied into the final image.

Build the Docker image:

```bash
docker build -t jobtrack .
```

Run the container:

```bash
docker run -p 8000:8000 jobtrack
```

## Deployment

JobTrack is deployed on Railway using Docker.

The production deployment contains:

```text
React Frontend
      ↓
FastAPI Backend
      ↓
PostgreSQL
```

The React application is built during the Docker build process and served by FastAPI. This allows users to access the complete application through a single public URL.

## Testing

The deployed application was manually verified for the main user flow.

The following were checked:

* React production build completed successfully
* Docker image built successfully
* FastAPI container started successfully
* Frontend loaded from the public Railway URL
* User login worked
* Application data could be created
* Data remained available after refreshing the page
* Frontend and backend worked together through the deployed application

This project does not claim full automated test coverage; the deployment verification above represents the main manual functional checks performed for the current version.

## What I Built

This project was built to practice developing and deploying a complete full-stack application.

Through JobTrack, I worked with:

* REST API development
* FastAPI application structure
* JWT authentication
* User-specific authorization
* SQLAlchemy
* PostgreSQL
* Alembic migrations
* React frontend integration
* Axios API communication
* Docker multi-stage builds
* Production deployment
* Frontend and backend integration

## License

This project is for learning and portfolio purposes.
