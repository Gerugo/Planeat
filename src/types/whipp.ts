export type SupermarketId = 'mercadona' | 'aldi' | 'lidl' | 'carrefour' | 'dia' | 'consum';

export interface Supermarket {
  id: SupermarketId;
  name: string;
  brandName: string;
  color: string;
  badgeColor: string;
  strengths: string[];
}

export interface UserPreferences {
  supermarkets: SupermarketId[];
  diners: number;
  weeklyBudget: number;
  mealsPerDay: ('lunch' | 'dinner')[];
  dietTags: string[];
  pantryItems: string[];
  excludedIngredients?: string[];
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  shoppingItemId: string;
}

export interface Meal {
  id: string;
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  type: 'Comida' | 'Cena';
  title: string;
  prepTimeMinutes: number;
  calories: number;
  proteinGrams: number;
  costPerServing: number;
  tags: string[];
  ingredients: RecipeIngredient[];
  steps: string[];
}

export interface ShoppingItem {
  id: string;
  genericName: string;
  supermarketProduct: string;
  recommendedStore: SupermarketId;
  aisle: 'Fruta y Verdura' | 'Carnicería y Pescadería' | 'Lácteos y Huevos' | 'Despensa' | 'Panadería' | 'Congelados';
  packSize: string;
  unitsToBuy: number;
  estimatedPrice: number;
  usedInMeals: string[];
  usagePercentage: number;
  checked?: boolean;
}

export interface WeeklyPlanResponse {
  summary: {
    totalEstimatedCost: number;
    costPerServingAvg: number;
    zeroWasteScore: number;
    savingsTip: string;
  };
  meals: Meal[];
  shoppingList: ShoppingItem[];
}
