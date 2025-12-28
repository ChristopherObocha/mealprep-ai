from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.meals import router as meals_router
from app.config import settings


app = FastAPI(
    title="MealPrep AI Backend",
    description="AI-powered meal planning and recipe generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meals_router)


@app.get("/")
async def root():
    return {
        "message": "MealPrep AI Backend",
        "environment": settings.environment,
        "docs": "/docs"
    }
