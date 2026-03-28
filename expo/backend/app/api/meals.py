from fastapi import APIRouter, HTTPException
from app.schemas.meal import GenerateMealsRequest, GenerateMealsResponse
from app.services.openai_service import generate_meals


router = APIRouter(prefix="/api", tags=["meals"])


@router.post("/generate-meals", response_model=GenerateMealsResponse)
async def create_meals(request: GenerateMealsRequest):
    """
    Generate personalized meal recommendations based on ingredients and preferences.
    """
    try:
        if not request.ingredients:
            raise HTTPException(status_code=400, detail="At least one ingredient is required")
        
        meals = generate_meals(request)
        
        return GenerateMealsResponse(meals=meals)
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "service": "MealPrep AI"}
