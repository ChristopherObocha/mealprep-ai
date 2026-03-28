from pydantic import BaseModel, Field
from typing import List, Optional


class NutritionInfo(BaseModel):
    calories: str = Field(..., description="Approximate calorie count (e.g., '450 kcal')")
    protein: str = Field(..., description="Approximate protein content (e.g., '35g')")
    carbs: Optional[str] = Field(None, description="Approximate carbs (e.g., '40g')")
    fat: Optional[str] = Field(None, description="Approximate fat (e.g., '15g')")


class Meal(BaseModel):
    title: str = Field(..., description="Name of the meal")
    description: str = Field(..., description="Brief description of the dish")
    ingredients: List[str] = Field(..., description="List of ingredients with quantities")
    steps: List[str] = Field(..., description="Cooking steps in order")
    nutrition: NutritionInfo = Field(..., description="Nutritional information")
    prep_time: Optional[str] = Field(None, description="Preparation time (e.g., '30 minutes')")
    difficulty: Optional[str] = Field("Medium", description="Difficulty level: Easy, Medium, Hard")


class GenerateMealsRequest(BaseModel):
    ingredients: List[str] = Field(..., description="Available ingredients", min_length=1)
    diet: Optional[str] = Field("balanced", description="Dietary preference")
    allergies: Optional[List[str]] = Field(default_factory=list, description="Allergies to avoid")
    goal: Optional[str] = Field("balanced", description="Nutritional goal")
    count: Optional[int] = Field(3, description="Number of meals to generate", ge=1, le=5)


class GenerateMealsResponse(BaseModel):
    meals: List[Meal]
