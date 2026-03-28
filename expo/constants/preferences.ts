export interface UserPreferences {
  diet: string;
  allergies: string[];
  goal: string;
}

export const DIET_OPTIONS = [
  { value: 'balanced', label: 'Balanced', description: 'A mix of all nutrients' },
  { value: 'high-protein', label: 'High Protein', description: 'Focus on protein-rich meals' },
  { value: 'low-carb', label: 'Low Carb', description: 'Minimize carbohydrate intake' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { value: 'vegan', label: 'Vegan', description: 'No animal products' },
  { value: 'keto', label: 'Keto', description: 'Very low carb, high fat' },
  { value: 'paleo', label: 'Paleo', description: 'Whole foods, no processed items' },
];

export const GOAL_OPTIONS = [
  { value: 'balanced', label: 'Balanced', description: 'Maintain current health' },
  { value: 'weight-loss', label: 'Weight Loss', description: 'Calorie-conscious meals' },
  { value: 'muscle-gain', label: 'Muscle Gain', description: 'High protein for building' },
  { value: 'energy', label: 'Energy Boost', description: 'Sustained energy throughout day' },
];

export const COMMON_ALLERGIES = [
  'Nuts',
  'Dairy',
  'Eggs',
  'Soy',
  'Gluten',
  'Shellfish',
  'Fish',
  'Wheat',
];
