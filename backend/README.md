# Backend — Student API (Spring Boot)

```bash
docker compose up -d        # PostgreSQL on :5432 (db "students", user/pass postgres)
./mvnw spring-boot:run      # http://localhost:8080 , Swagger: /swagger-ui.html , health: /actuator/health
./mvnw test                 # 11 tests
```
Settings (environment variables): `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `APP_CORS_ALLOWED_ORIGINS`.
Validation rules: `src/main/java/.../student/dto/StudentRequest.java` (the frontend copies them).
