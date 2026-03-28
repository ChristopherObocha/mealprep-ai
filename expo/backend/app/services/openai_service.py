from openai import OpenAI
from typing import List
import json
from app.config import settings
from app.schemas.meal import Meal, GenerateMealsRequest


client = OpenAI(api_key=settings.openai_api_key)


def generate_meals(request: GenerateMealsRequest) -> List[Meal]:
    """
    Generate meal recommendations using OpenAI based on user preferences.
    """
    
    ingredients_list = ", ".join(request.ingredients)
    allergies_text = f"Avoid: {', '.join(request.allergies)}" if request.allergies else "No allergies specified"
    
    prompt = f"""You are a professional chef and nutritionist. Generate {request.count} creative, delicious meal recipes based on the following requirements:

Available Ingredients: {ingredients_list}
Dietary Preference: {request.diet}
Allergies: {allergies_text}
Nutritional Goal: {request.goal}

Requirements:
1. Use primarily the available ingredients listed above
2. Suggest reasonable additional ingredients if needed (pantry staples are okay)
3. Make recipes practical and achievable for home cooking
4. Include accurate nutritional estimates
5. Each recipe should be unique and interesting

Return ONLY a valid JSON array with {request.count} meal objects. Each meal must have this exact structure:
{{
  "title": "Meal name",
  "description": "Brief appetizing description (1-2 sentences)",
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity", ...],
  "steps": ["Step 1", "Step 2", ...],
  "nutrition": {{
    "calories": "approximate kcal",
    "protein": "approximate grams",
    "carbs": "approximate grams",
    "fat": "approximate grams"
  }},
  "prep_time": "total time estimate",
  "difficulty": "Easy|Medium|Hard"
}}

Return ONLY the JSON array, no markdown, no explanations."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional chef who responds only with valid JSON arrays of meal recipes."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.8,
            max_tokens=2500
        )
        
        content = response.choices[0].message.content.strip()
        
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        meals_data = json.loads(content)
        
        meals = [Meal(**meal) for meal in meals_data]
        
        return meals
        
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print(f"Response content: {content}")
        raise ValueError(f"Failed to parse OpenAI response as JSON: {str(e)}")
    except Exception as e:
        print(f"OpenAI API error: {e}")
        raise ValueError(f"Error generating meals: {str(e)}")
