@echo off
start cmd /k "title Backend (Spring Boot) && call mvnw spring-boot:run"

start cmd /k "title Frontend (Next.js) && cd front && npm install && npm run dev"