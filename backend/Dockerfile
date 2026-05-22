# Build stage
FROM gradle:8.5-jdk17 AS build
USER root
WORKDIR /app
COPY . .
RUN gradle build --no-daemon -x test

# Package stage
FROM eclipse-temurin:17-jre
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/build/libs/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
