# Build stage: compile and package with the Maven wrapper
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw -q dependency:go-offline
COPY src src
RUN ./mvnw -q package -DskipTests

# Run stage: small JRE image with just the jar
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/student-api-0.1.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
