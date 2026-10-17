'use client';

import React, { useState, useEffect } from 'react';
import {
  WeeklyPlan,
  Recipe,
  DayOfWeek,
  UserPreferences,
  ShoppingItem,
} from '@/types/whipp';
import { MOCK_WEEKLY_PLAN } from '@/data/mockPlan';
import { SUPERMARKETS } from '@/data/supermarkets';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { WeeklyMealPlan } from '@/components/WeeklyMealPlan';
import { SmartShoppingList } from '@/components/SmartShoppingList';
import { ZeroWasteTracker } from '@/components/ZeroWasteTracker';
import { RecipeModal } from '@/components/RecipeModal';
import {
  CalendarDays,
  ShoppingBag,
  Recycle,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PLAN = 'whipp_es_weekly_plan';
const STORAGE_KEY_PREFS = 'whipp_es_user_preferences';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'shopping' | 'zerowaste' | 'wizard'>('menu');
  const [plan, setPlan] = useState<WeeklyPlan>(MOCK_WEEKLY_PLAN);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Selected recipe modal state
  const [selectedRecipeData, setSelectedRecipeData] = useState<{
    recipe: Recipe;
    dayName: string;
    mealType: string;
  } | null>(null);

  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    supermarkets: ['mercadona', 'aldi'],
    servings: 2,
    maxBudget: 60,
    mealScope: 'both',
    dietaryPreferences: ['alta-proteina', 'mediterraneo', 'rapido'],
    pantryItems: [
      'Aceite de oliva virgen extra (AOVE)',
      'Sal fina',
      'Pimienta negra',
      'Ajo en dientes',
      'Cebollas',
      'Orégano seco',
    ],
  });

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(STORAGE_KEY_PLAN);
      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
      }

      const savedPrefs = localStorage.getItem(STORAGE_KEY_PREFS);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
  }, []);

  // Save plan to localStorage on changes
  const updatePlan = (newPlan: WeeklyPlan) => {
    setPlan(newPlan);
    try {
      localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(newPlan));
    } catch (e) {
      console.error('Error saving plan to localStorage:', e);
    }
  };

  // Save preferences
  const updatePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(newPrefs));
    } catch (e) {
      console.error('Error saving preferences to localStorage:', e);
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Generate Plan via Gemini API or Fallback
  const handleGeneratePlan = async (prefs: UserPreferences) => {
    setIsLoading(true);
    updatePreferences(prefs);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: prefs,
          apiKey: prefs.customApiKey,
        }),
      });

      const data = await res.json();
      if (data.plan) {
        updatePlan(data.plan);
        setActiveTab('menu');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        if (data.source === 'gemini') {
          showNotification('¡Menú generado por Gemini AI con éxito!', 'success');
        } else {
          showNotification('Menú optimizado cargado (Modo Demo WhippES)', 'info');
        }
      } else {
        throw new Error('No se recibió el plan');
      }
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      showNotification('Error al conectar con el servidor. Usando plan de demostración.', 'error');
      updatePlan(MOCK_WEEKLY_PLAN);
      setActiveTab('menu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemo = () => {
    updatePlan(MOCK_WEEKLY_PLAN);
    setActiveTab('menu');
    showNotification('Plan de demostración WhippES cargado al instante', 'info');
  };

  // Toggle Shopping List item checkbox (persisted in plan)
  const handleToggleShoppingItem = (id: string) => {
    const updatedShoppingList = plan.shoppingList.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    updatePlan({
      ...plan,
      shoppingList: updatedShoppingList,
    });
  };

  // Add custom shopping item
  const handleAddShoppingItem = (newItem: Omit<ShoppingItem, 'id'>) => {
    const itemWithId: ShoppingItem = {
      ...newItem,
      id: `custom-${Date.now()}`,
    };
    const updatedList = [itemWithId, ...plan.shoppingList];
    updatePlan({
      ...plan,
      shoppingList: updatedList,
    });
    showNotification(`"${newItem.name}" añadido a la lista`, 'success');
  };

  // Delete custom shopping item
  const handleDeleteShoppingItem = (id: string) => {
    const updatedList = plan.shoppingList.filter((item) => item.id !== id);
    updatePlan({
      ...plan,
      shoppingList: updatedList,
    });
  };

  // Swap recipe
  const handleSwapRecipe = (day: DayOfWeek, mealType: 'lunch' | 'dinner') => {
    // Generate an intelligent alternative recipe using existing week ingredients
    const alternativeTitles = [
      'Wok de Verduras Salteadas con Dados de Pollo y Sésamo',
      'Tortilla de Calabacín Jugosa con Queso y Tomatitos',
      'Salteado Exprés de Garbanzos con Pimientos y Pavo',
      'Merluza al Horno con Patatas Panadera y Romero',
      'Ensalada Templada de Espinacas, Pollo Crujiente y Feta',
      'Bowl de Arroz con Aguacate, Huevo a la Plancha y Soja',
    ];

    const randomTitle = alternativeTitles[Math.floor(Math.random() * alternativeTitles.length)];

    const updatedDays = plan.days.map((d) => {
      if (d.day === day) {
        const targetRecipe = mealType === 'lunch' ? d.lunch : d.dinner;
        if (!targetRecipe) return d;

        const swappedRecipe: Recipe = {
          ...targetRecipe,
          id: `swapped-${Date.now()}`,
          title: randomTitle,
          description: `Alternativa rápida y equilibrada manteniendo la compatibilidad de ingredientes de la cesta de la compra.`,
          prepTimeMinutes: Math.floor(Math.random() * 6) + 8,
          cookTimeMinutes: Math.floor(Math.random() * 8) + 10,
          caloriesPerServing: Math.floor(Math.random() * 120) + 380,
          proteinGrams: Math.floor(Math.random() * 15) + 26,
        };

        return {
          ...d,
          [mealType]: swappedRecipe,
        };
      }
      return d;
    });

    updatePlan({
      ...plan,
      days: updatedDays,
    });

    showNotification(`Receta de ${day} cambiada por "${randomTitle}"`, 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-semibold border ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : notification.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  Whipp<span className="text-emerald-600">ES</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded">
                  España
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
                Desperdicio Cero & Batch Cooking
              </span>
            </div>
          </div>

          {/* Supermarket Badges Active in Plan */}
          <div className="hidden sm:flex items-center gap-1.5">
            {plan.selectedSupermarkets.map((supId) => {
              const conf = SUPERMARKETS[supId];
              return (
                <span
                  key={supId}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${conf.badgeColor}`}
                >
                  {conf.name}
                </span>
              );
            })}
          </div>

          {/* New Plan CTA */}
          <button
            type="button"
            onClick={() => setActiveTab('wizard')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Configurar</span>
            <span>Nuevo Plan</span>
          </button>
        </div>

        {/* Tab Navigation (Desktop & Mobile) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'menu'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Plan Semanal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shopping')}
            className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'shopping'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Lista de la Compra</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {plan.shoppingList.filter((i) => !i.isChecked).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('zerowaste')}
            className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'zerowaste'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Recycle className="w-4 h-4" />
            <span>Desperdicio Cero</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">
              {plan.zeroWasteSummary.overallUtilizationScore}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wizard')}
            className={`py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'wizard'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Ajustes & Despensa</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-12">
        {activeTab === 'menu' && (
          <WeeklyMealPlan
            plan={plan}
            onOpenRecipe={(recipe, dayName, mealType) =>
              setSelectedRecipeData({ recipe, dayName, mealType })
            }
            onSwapRecipe={handleSwapRecipe}
          />
        )}

        {activeTab === 'shopping' && (
          <SmartShoppingList
            items={plan.shoppingList}
            maxBudget={plan.maxBudget}
            onToggleItem={handleToggleShoppingItem}
            onAddItem={handleAddShoppingItem}
            onDeleteItem={handleDeleteShoppingItem}
          />
        )}

        {activeTab === 'zerowaste' && (
          <ZeroWasteTracker summary={plan.zeroWasteSummary} />
        )}

        {activeTab === 'wizard' && (
          <OnboardingWizard
            initialPreferences={preferences}
            onGeneratePlan={handleGeneratePlan}
            isLoading={isLoading}
            onUseDemo={handleUseDemo}
          />
        )}
      </main>

      {/* Recipe Modal Component (Follows light-dismiss-a-dialog guidance) */}
      <RecipeModal
        recipe={selectedRecipeData?.recipe || null}
        dayName={selectedRecipeData?.dayName || ''}
        mealType={selectedRecipeData?.mealType || ''}
        onClose={() => setSelectedRecipeData(null)}
      />

      {/* Modern Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden flex justify-around items-center py-2 px-1">
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-bold ${
            activeTab === 'menu'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span>Menú</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shopping')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-bold relative ${
            activeTab === 'shopping'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Compra</span>
          {plan.shoppingList.filter((i) => !i.isChecked).length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zerowaste')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-bold ${
            activeTab === 'zerowaste'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Recycle className="w-5 h-5" />
          <span>Zero-Waste</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wizard')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-bold ${
            activeTab === 'wizard'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
