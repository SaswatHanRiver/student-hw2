# Student API — Spring Boot (AI Frontend Training, Homework 2)

CRUD API for students used by ../frontend. Java 21 · Spring Boot 3.5 · JPA · Bean Validation · Flyway · PostgreSQL (local) / H2 (profile h2, demo server).

## Commands
./mvnw spring-boot:run                                   # needs PostgreSQL (docker compose up -d)
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2     # no database needed (in memory)
./mvnw test                                              # controller + service tests

## Folders
src/main/java/.../student/          entity, repository, filters (Specifications), service, controller
src/main/java/.../student/dto/      StudentRequest (validation rules + messages), StudentResponse
src/main/java/.../common/           ApiError shape, exception handler, CORS, PageResponse
src/main/resources/db/migration/    Flyway scripts (must run on PostgreSQL AND H2 PostgreSQL mode)

## Rules
- Schema changes only through a new Flyway file (V3__...). Never edit an applied one.
- Every error goes through GlobalExceptionHandler as {code, message, fieldErrors}.
- Validation messages in StudentRequest are copied word for word by
  ../frontend/src/features/students/student-form-rules.ts. Change both together.
- Page numbers are 1-based in the API.
