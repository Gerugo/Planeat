'use client';

import React, { useState } from 'react';
import { Meal } from '@/types/whipp';
import {
  Clock,
  Flame,
  Dumbbell,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Eye,
  Calendar,
  Utensils,
  Moon,
  SunMedium,
  Euro,
} from 'lucide-react';

interface WeeklyMealPlanProps {
  meals: Meal[];
  onOpenMeal: (meal: Meal) => void;
  onSwapMeal: (mealId: string) => void;
}

const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
] as const;

export const WeeklyMealPlan: React.FC<WeeklyMealPlanProps> = ({
  meals,
  onOpenMeal,
  onSwapMeal,
}) => {
  const [activeDay, setActiveDay] = useState<string>('Lunes');
  const [swappingId, setSwappingId] = useState<string | null>(null);

  const handleSwap = (mealId: string) => {
    setSwappingId(mealId);
    onSwapMeal(mealId);
    setTimeout(() => setSwappingId(null), 600);
  };

  const currentMeals = meals.filter((m) => m.day === activeDay);
  const currentLunch = currentMeals.find((m) => m.type === 'Comida');
  const currentDinner = currentMeals.find((m) => m.type === 'Cena');

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100 dark:border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Menú Semanal (7 Días)
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Waste Optimizado</span>
          </div>
        </div>

        {/* Day selection tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = activeDay === day;
            const count = meals.filter((m) => m.day === day).length;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                className={`flex-1 min-w-[70px] sm:min-w-[85px] py-2 px-2 rounded-2xl text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-medium'
                }`}
              >
                <span className="block text-xs uppercase tracking-wider opacity-80 sm:hidden">
                  {day.slice(0, 3)}
                </span>
                <span className="hidden sm:block text-xs uppercase tracking-wider opacity-80">
                  {day}
                </span>
                <span className="block text-[11px] font-semibold mt-0.5 opacity-90">
                  {count} {count === 1 ? 'plato' : 'platos'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentLunch && (
          <MealCard
            meal={currentLunch}
            icon={<SunMedium className="w-4 h-4 text-amber-500" />}
            isSwapping={swappingId === currentLunch.id}
            onOpen={() => onOpenMeal(currentLunch)}
            onSwap={() => handleSwap(currentLunch.id)}
          />
        )}

        {currentDinner && (
          <MealCard
            meal={currentDinner}
            icon={<Moon className="w-4 h-4 text-indigo-400" />}
            isSwapping={swappingId === currentDinner.id}
            onOpen={() => onOpenMeal(currentDinner)}
            onSwap={() => handleSwap(currentDinner.id)}
          />
        )}
      </div>

      {/* Panorama Grid of the full week */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Vista Panorámica de los 7 Días
        </h3>

        <div className="space-y-3">
          {DAYS_OF_WEEK.map((day) => {
            const dayMeals = meals.filter((m) => m.day === day);
            const lunch = dayMeals.find((m) => m.type === 'Comida');
            const dinner = dayMeals.find((m) => m.type === 'Cena');

            return (
              <div
                key={day}
                className={`p-3.5 rounded-2xl border transition-all ${
                  activeDay === day
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {day}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveDay(day)}
                    className="text-xs text-slate-500 hover:text-emerald-600 font-medium flex items-center gap-1"
                  >
                    <span>Ver detalle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {lunch && (
                    <div
                      onClick={() => onOpenMeal(lunch)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
                          <SunMedium className="w-3 h-3 text-amber-500" />
                          Comida
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                          {lunch.title}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        {lunch.prepTimeMinutes} min
                      </span>
                    </div>
                  )}

                  {dinner && (
                    <div
                      onClick={() => onOpenMeal(dinner)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
                          <Moon className="w-3 h-3 text-indigo-400" />
                          Cena
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                          {dinner.title}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        {dinner.prepTimeMinutes} min
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface MealCardProps {
  meal: Meal;
  icon: React.ReactNode;
  isSwapping: boolean;
  onOpen: () => void;
  onSwap: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  icon,
  isSwapping,
  onOpen,
  onSwap,
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col justify-between transition-all group ${
        isSwapping ? 'opacity-50 scale-[0.98]' : 'hover:shadow-card'
      }`}
    >
      <div>
        {/* Header section with gradient */}
        <div className="relative p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 text-white backdrop-blur-md text-xs font-semibold">
              {icon}
              <span>{meal.type}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSwap();
              }}
              title="Cambiar esta receta"
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm line-clamp-1 leading-snug">
            {meal.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-emerald-100 font-medium">
            <span>{meal.costPerServing.toFixed(2)} €/ración</span>
            <span>·</span>
            <span>{meal.ingredients.length} ingredientes</span>
          </div>
        </div>

        {/* Badges */}
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {meal.prepTimeMinutes} min
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-amber-800">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {meal.calories} kcal
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800">
              <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
              {meal.proteinGrams}g pro
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {meal.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={onOpen}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white"
        >
          <Eye className="w-4 h-4" />
          <span>Ver Receta Paso a Paso</span>
        </button>
      </div>
    </div>
  );
};
