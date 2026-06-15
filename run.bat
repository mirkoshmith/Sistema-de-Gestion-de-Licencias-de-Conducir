@echo off
start cmd /k "mvn spring-boot:run"

start cmd /k "cd front && npm install && npm run dev"
