# Students — AI Frontend Training, Homework 2

**Author:** Saswat Kumar Sahoo (Backend, Java)
A complete Students feature — **list, create, details, edit, delete** — on a real API I built.

| Part | Stack | Folder |
|---|---|---|
| Frontend | Next.js 15 · React 19 · TypeScript · TanStack Query 5 · axios · SCSS · Playwright | [`frontend/`](frontend) |
| Backend API | Spring Boot 3.5 · Java 21 · Spring Data JPA · Bean Validation · Flyway · springdoc | [`backend/`](backend) |
| Database | PostgreSQL 16 locally · H2 (in memory) on the demo server | `backend/docker-compose.yml` · `application-h2.yml` |

## Run it locally (about 5 minutes)

**Needs:** Java 21, Node 20+, and PostgreSQL 16 (Docker is the easiest way).

```bash
# 1. Database (Docker). Or use your own PostgreSQL with a database called "students".
cd backend
docker compose up -d

# 2. API on http://localhost:8080  (Flyway creates the table and 24 starting students)
./mvnw spring-boot:run            # Windows: mvnw.cmd spring-boot:run
#    No Docker? Use the in-memory H2 database instead (skip step 1):
#    ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
#    API docs: http://localhost:8080/swagger-ui.html
#    Tests:    ./mvnw test

# 3. Frontend on http://localhost:3000 (new terminal)
cd ../frontend
cp .env.example .env.local        # NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
npm install
npm run dev                       # open http://localhost:3000 -> /students/list
```

Database settings (defaults work with the docker-compose file): `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.
CORS: `APP_CORS_ALLOWED_ORIGINS` (default `http://localhost:3000`).

## Checks
```bash
cd backend  && ./mvnw test                 # 11 tests: validation messages, error shapes, business rules
cd frontend && npm run check               # tsc --noEmit + eslint
cd frontend && npm run build
cd frontend && npx playwright install chromium   # once
cd frontend && npm run test:e2e            # 17 read-only tests (API must be running)
cd frontend && npm run test:e2e:mutation   # 3 tests that create/edit/delete (cleans up after itself)
cd frontend && npm run qa:responsive       # 3 pages x 10 WM widths, writes frontend/screenshots/
```

## API
| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/students?search=&grade=&status=&sort=&page=1&size=10` | `sort`: STUDENT_ID, NAME, NEWEST, ATTENDANCE_LOW. Page is 1-based |
| GET | `/api/v1/students/{id}` | 404 if missing |
| POST | `/api/v1/students` | 201; 400 validation; 409 duplicate student ID / email |
| PUT | `/api/v1/students/{id}` | 200; same errors as POST |
| DELETE | `/api/v1/students/{id}` | 204 |

Every error has one shape: `{ "code": "...", "message": "...", "fieldErrors": [{ "field": "...", "message": "..." }] }`.

## Run with Docker (one server, both apps)
```bash
docker compose up -d --build      # api on 127.0.0.1:8101 (H2), web on 127.0.0.1:3101
```
Put nginx in front with `deploy/nginx/student-hw2.conf`. Step-by-step EC2 guide with memory settings: [`deploy/EC2-DEPLOY.md`](deploy/EC2-DEPLOY.md).

## Deploy (demo link), other options
- **API on Render (H2 in memory):** Dashboard, then New, then Blueprint, and pick this repo (`render.yaml`). CORS already allows `https://student-hw2*.vercel.app`. The free plan sleeps when idle, so the first request can take about a minute, and the data resets to the 24 seed students on restart.
- **Frontend on Vercel:** import this repo with **Root Directory = `frontend`**, set `NEXT_PUBLIC_API_BASE_URL` to the Render URL, then deploy.

## Docs
- [`docs/PLAN.md`](docs/PLAN.md): the plan written before the code
- [`docs/TEST-CASES.md`](docs/TEST-CASES.md): QA test cases (WM QA Template style)
- [`docs/BUILD-REPORT.md`](docs/BUILD-REPORT.md): QA hand-over report (10 parts)
- [`docs/CODE-WALKTHROUGH.md`](docs/CODE-WALKTHROUGH.md): how the code works, for the review
