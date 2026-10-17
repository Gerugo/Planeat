'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Recipe } from '@/types/whipp';
import { SUPERMARKETS } from '@/data/supermarkets';
import {
  X,
  Clock,
  Flame,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Circle,
  ShoppingBag,
  Home,
  ChefHat,
} from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  dayName: string;
  mealType: string;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  dayName,
  mealType,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (recipe) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setCompletedSteps([]);
      setCheckedIngredients([]);
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [recipe]);

  // Fallback for browsers that do not support native <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Check if browser does not support closedby natively
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (!isDialogContent) {
          onClose();
        }
      };

      dialog.addEventListener('click', handleBackdropClick);
      return () => dialog.removeEventListener('click', handleBackdropClick);
    }
  }, [onClose]);

  if (!recipe) return null;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="recipeModalTitle"
      onClose={onClose}
      className="m-auto rounded-3xl p-0 w-[95vw] max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 backdrop:bg-slate-950/60 overflow-hidden focus:outline-none"
    >
      <div className="flex flex-col max-h-[90vh]">
        {/* Header / Media */}
        <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950 dark:to-slate-900">
              <ChefHat className="w-16 h-16 text-emerald-600 dark:text-emerald-400 opacity-60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar receta"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all focus:ring-2 focus:ring-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Badges */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md">
                {dayName} · {mealType}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                {recipe.servings} raciones
              </span>
            </div>
            <h2
              id="recipeModalTitle"
              className="text-lg sm:text-2xl font-bold text-white drop-shadow-sm leading-tight"
            >
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Tiempo</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Calorías</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {recipe.caloriesPerServing} kcal
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                <span>Proteína</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {recipe.proteinGrams}g
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Carb/Grasa</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {recipe.carbsGrams}g / {recipe.fatGrams}g
              </span>
            </div>
          </div>

          {/* Zero Waste Banner */}
          {recipe.zeroWasteTip && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Estrategia Desperdicio Cero & Batch
                </h4>
                <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 mt-0.5 leading-relaxed">
                  {recipe.zeroWasteTip}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {recipe.description}
          </p>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Ingredientes ({recipe.ingredients.length})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Toca para marcar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.includes(ing.name);
                const superConfig = ing.supermarket
                  ? SUPERMARKETS[ing.supermarket]
                  : null;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleIngredient(ing.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 opacity-60 line-through'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-medium truncate text-slate-800 dark:text-slate-200">
                        {ing.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {ing.amount}
                      </span>
                      {ing.isFromPantry ? (
                        <span
                          title="En despensa"
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1"
                        >
                          <Home className="w-2.5 h-2.5" />
                          Despensa
                        </span>
                      ) : superConfig ? (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${superConfig.badgeColor}`}
                        >
                          {superConfig.name}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <ChefHat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Paso a Paso Interactivo
            </h3>

            <div className="space-y-2.5">
              {recipe.instructions.map((step, idx) => {
                const isStepDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isStepDone
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-slate-500 dark:text-slate-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-colors ${
                        isStepDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isStepDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isStepDone ? 'line-through' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {completedSteps.length} de {recipe.instructions.length} pasos completados
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            Listo, cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
};
