'use client';

import React, { useState } from 'react';
import { WeeklyPlan, DayOfWeek, Recipe, DayPlan } from '@/types/whipp';
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
} from 'lucide-react';

interface WeeklyMealPlanProps {
  plan: WeeklyPlan;
  onOpenRecipe: (recipe: Recipe, dayName: string, mealType: string) => void;
  onSwapRecipe: (day: DayOfWeek, mealType: 'lunch' | 'dinner') => void;
  isSwapping?: boolean;
}

export const WeeklyMealPlan: React.FC<WeeklyMealPlanProps> = ({
  plan,
  onOpenRecipe,
  onSwapRecipe,
  isSwapping = false,
}) => {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('lunes');
  const [swappingMeal, setSwappingMeal] = useState<string | null>(null);

  const handleSwap = (day: DayOfWeek, mealType: 'lunch' | 'dinner') => {
    setSwappingMeal(`${day}-${mealType}`);
    onSwapRecipe(day, mealType);
    setTimeout(() => setSwappingMeal(null), 800);
  };

  const currentDayPlan = plan.days.find((d) => d.day === activeDay) || plan.days[0];

  return (
    <div className="space-y-6">
      {/* Top Bar / Day Selector (Mobile Pills + Desktop Bar) */}
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
          {plan.days.map((dayObj) => {
            const isSelected = activeDay === dayObj.day;
            const shortName = dayObj.dayName.slice(0, 3);

            return (
              <button
                key={dayObj.day}
                type="button"
                onClick={() => setActiveDay(dayObj.day)}
                className={`flex-1 min-w-[70px] sm:min-w-[85px] py-2 px-2 rounded-2xl text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                }`}
              >
                <span className="block text-xs uppercase tracking-wider opacity-80 sm:hidden">
                  {shortName}
                </span>
                <span className="hidden sm:block text-xs uppercase tracking-wider opacity-80">
                  {dayObj.dayName}
                </span>
                <span className="block text-[11px] font-semibold mt-0.5 opacity-90">
                  {dayObj.lunch && dayObj.dinner ? '2 platos' : '1 plato'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail Cards (Mobile & Tablet Spotlight) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lunch Card */}
        {currentDayPlan.lunch && (
          <MealCard
            mealType="Comida"
            icon={<SunMedium className="w-4 h-4 text-amber-500" />}
            recipe={currentDayPlan.lunch}
            dayName={currentDayPlan.dayName}
            isSwapping={swappingMeal === `${currentDayPlan.day}-lunch`}
            onOpen={() =>
              onOpenRecipe(currentDayPlan.lunch!, currentDayPlan.dayName, 'Comida')
            }
            onSwap={() => handleSwap(currentDayPlan.day, 'lunch')}
          />
        )}

        {/* Dinner Card */}
        {currentDayPlan.dinner && (
          <MealCard
            mealType="Cena"
            icon={<Moon className="w-4 h-4 text-indigo-400" />}
            recipe={currentDayPlan.dinner}
            dayName={currentDayPlan.dayName}
            isSwapping={swappingMeal === `${currentDayPlan.day}-dinner`}
            onOpen={() =>
              onOpenRecipe(currentDayPlan.dinner!, currentDayPlan.dayName, 'Cena')
            }
            onSwap={() => handleSwap(currentDayPlan.day, 'dinner')}
          />
        )}
      </div>

      {/* Week Overview Grid (Compact list of all 7 days) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Vista Panorámica de la Semana
        </h3>

        <div className="space-y-3">
          {plan.days.map((dayObj) => (
            <div
              key={dayObj.day}
              className={`p-3.5 rounded-2xl border transition-all ${
                activeDay === dayObj.day
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {dayObj.dayName}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDay(dayObj.day)}
                  className="text-xs text-slate-500 hover:text-emerald-600 font-medium flex items-center gap-1"
                >
                  <span>Ver detalle</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {dayObj.lunch && (
                  <div
                    onClick={() => onOpenRecipe(dayObj.lunch!, dayObj.dayName, 'Comida')}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
                        <SunMedium className="w-3 h-3 text-amber-500" />
                        Comida
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {dayObj.lunch.title}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      {dayObj.lunch.prepTimeMinutes + dayObj.lunch.cookTimeMinutes} min
                    </span>
                  </div>
                )}

                {dayObj.dinner && (
                  <div
                    onClick={() => onOpenRecipe(dayObj.dinner!, dayObj.dayName, 'Cena')}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase">
                        <Moon className="w-3 h-3 text-indigo-400" />
                        Cena
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                        {dayObj.dinner.title}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      {dayObj.dinner.prepTimeMinutes + dayObj.dinner.cookTimeMinutes} min
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MealCardProps {
  mealType: 'Comida' | 'Cena';
  icon: React.ReactNode;
  recipe: Recipe;
  dayName: string;
  isSwapping: boolean;
  onOpen: () => void;
  onSwap: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  mealType,
  icon,
  recipe,
  dayName,
  isSwapping,
  onOpen,
  onSwap,
}) => {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col justify-between transition-all group ${
        isSwapping ? 'opacity-50 scale-[0.98]' : 'hover:shadow-card'
      }`}
    >
      <div>
        {/* Card Image / Header */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-slate-900">
              <Utensils className="w-12 h-12 text-emerald-600 opacity-40" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top badging */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-md text-xs font-semibold">
            {icon}
            <span>{mealType}</span>
          </div>

          {/* Swap Button on top-right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSwap();
            }}
            title="Cambiar esta receta"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md transition-all active:rotate-180"
          >
            <RefreshCw className={`w-4 h-4 ${isSwapping ? 'animate-spin' : ''}`} />
          </button>

          {/* Bottom Title & Time in Image */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm line-clamp-1 leading-snug">
              {recipe.title}
            </h3>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* Macro & Time Badges */}
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {totalMinutes} min
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-amber-800">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {recipe.caloriesPerServing} kcal
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200/60 dark:border-blue-800">
              <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
              {recipe.proteinGrams}g pro
            </span>
          </div>

          {/* Zero Waste Tag if present */}
          {recipe.zeroWasteTip && (
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-1.5 leading-snug line-clamp-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{recipe.zeroWasteTip}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
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
