# Etapa 1: Build
FROM maven:3.9.4-eclipse-temurin-17 as builder
WORKDIR /app
COPY turma-do-gatil-back/. .
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/turma-do-gatil-back-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]