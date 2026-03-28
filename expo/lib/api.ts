const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs?: string;
  fat?: string;
}

export interface Meal {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  nutrition: NutritionInfo;
  prep_time?: string;
  difficulty?: string;
}

export interface GenerateMealsRequest {
  ingredients: string[];
  diet?: string;
  allergies?: string[];
  goal?: string;
  count?: number;
}

export interface GenerateMealsResponse {
  meals: Meal[];
}

export async function generateMeals(
  request: GenerateMealsRequest
): Promise<GenerateMealsResponse> {
  const response = await fetch(`${API_URL}/api/generate-meals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to generate meals');
  }

  return response.json();
}

export async function healthCheck(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${API_URL}/api/health`);
  
  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}
