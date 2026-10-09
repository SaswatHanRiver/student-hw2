# Backend: Spring Boot API. Build with the Maven wrapper, run on a small JRE.

# ---- 1. Build ----
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
# Cap Maven's memory so the build fits a small server (with swap)
ENV MAVEN_OPTS="-Xmx512m"
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw && ./mvnw -q -B dependency:go-offline
COPY src src
RUN ./mvnw -q -B package -DskipTests

# ---- 2. Run ----
FROM eclipse-temurin:21-jre-alpine AS run
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/target/student-api-0.1.0.jar app.jar
USER app
EXPOSE 8080
# Low-memory JVM defaults; override with JAVA_OPTS in docker-compose.yml
#   SerialGC          smallest GC overhead (one CPU, small heap)
#   Xms32m / Xmx128m  heap starts small, max 128 MB
#   Xss256k           smaller stack per thread
#   TieredStopAtLevel=1 + ReservedCodeCacheSize  less JIT memory
ENV JAVA_OPTS="-XX:+UseSerialGC -Xms32m -Xmx128m -Xss256k -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=48m -XX:TieredStopAtLevel=1 -XX:MaxDirectMemorySize=16m"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
