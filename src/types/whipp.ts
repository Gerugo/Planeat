export type SupermarketId = 'mercadona' | 'aldi' | 'lidl' | 'carrefour' | 'consum' | 'dia';

export type DietaryPreference =
  | 'alta-proteina'
  | 'rapido'
  | 'economico'
  | 'vegetariano'
  | 'mediterraneo'
  | 'sin-gluten';

export type MealScope = 'both' | 'lunch' | 'dinner';

export type DayOfWeek =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export type AisleType =
  | 'fruta-verdura'
  | 'carniceria-pescaderia'
  | 'lacteos-huevos'
  | 'despensa'
  | 'congelados'
  | 'panaderia';

export interface SupermarketConfig {
  id: SupermarketId;
  name: string;
  brand: string;
  badgeColor: string;
  accentColor: string;
  logoInitial: string;
  description: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  isFromPantry?: boolean;
  supermarket?: SupermarketId;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  zeroWasteTip?: string;
  imageUrl?: string;
}

export interface DayPlan {
  day: DayOfWeek;
  dayName: string;
  lunch?: Recipe;
  dinner?: Recipe;
}

export interface RecipeUsage {
  recipeTitle: string;
  day: string;
  mealType: 'Comida' | 'Cena';
  amountUsed: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  supermarket: SupermarketId;
  brandName: string;
  aisle: AisleType;
  packageFormat: string;
  estimatedPrice: number;
  quantityNeeded: number;
  usedInRecipes: RecipeUsage[];
  isChecked?: boolean;
  isCustom?: boolean;
}

export interface ZeroWasteUsage {
  recipeTitle: string;
  day: string;
  amount: string;
  percent: number;
}

export interface ZeroWasteItem {
  ingredientName: string;
  packageDescription: string;
  supermarket: SupermarketId;
  totalPackageSize: string;
  usages: ZeroWasteUsage[];
  utilizationPercent: number;
  storageTip: string;
}

export interface ZeroWasteSummary {
  overallUtilizationScore: number; // e.g. 96 (%)
  zeroWasteItems: ZeroWasteItem[];
  batchCookingTips: string[];
  estimatedSavingsEuros: number;
}

export interface WeeklyPlan {
  id: string;
  createdAt: string;
  servings: number;
  mealScope: MealScope;
  selectedSupermarkets: SupermarketId[];
  dietaryPreferences: DietaryPreference[];
  maxBudget: number;
  totalEstimatedCost: number;
  days: DayPlan[];
  shoppingList: ShoppingItem[];
  zeroWasteSummary: ZeroWasteSummary;
  pantryItems: string[];
}

export interface UserPreferences {
  supermarkets: SupermarketId[];
  servings: number;
  maxBudget: number;
  mealScope: MealScope;
  dietaryPreferences: DietaryPreference[];
  pantryItems: string[];
  customApiKey?: string;
}

export interface GeneratePlanRequest {
  preferences: UserPreferences;
  apiKey?: string;
}

export interface SwapRecipeRequest {
  day: DayOfWeek;
  mealType: 'lunch' | 'dinner';
  currentRecipeId: string;
  plan: WeeklyPlan;
  apiKey?: string;
}
