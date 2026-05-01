# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies to cache them
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

VOLUME /tmp

# No fijes el puerto con EXPOSE 8080, Render lo ignora pero el proceso debe escuchar en $PORT
ENTRYPOINT ["sh", "-c", "java -Xmx512m -Dserver.port=${PORT} -jar /app/app.jar"]

# Run the application
#ENTRYPOINT ["java", "-jar", "app.jar"]


#FROM eclipse-temurin:21-jdk-alpine
#VOLUME /tmp
#COPY target/*.jar app.jar

