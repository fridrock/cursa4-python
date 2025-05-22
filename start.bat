@echo off
start cmd /k "cd frontend && npm run dev"
start cmd /k "uvicorn app.main:app --reload" 