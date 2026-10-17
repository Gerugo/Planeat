'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Meal } from '@/types/whipp';
import {
  X,
  Clock,
  Flame,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Circle,
  ShoppingBag,
  ChefHat,
  Euro,
} from 'lucide-react';

interface RecipeModalProps {
  meal: Meal | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ meal, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (meal) {
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
  }, [meal]);

  // Fallback for light-dismiss on browsers without native closedby support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

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

  if (!meal) return null;

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
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex-shrink-0">
          <button
            onClick={onClose}
            aria-label="Cerrar receta"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
              {meal.day} · {meal.type}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-100">
              {meal.costPerServing.toFixed(2)} €/ración
            </span>
          </div>

          <h2
            id="recipeModalTitle"
            className="text-xl sm:text-2xl font-black text-white drop-shadow-sm leading-tight"
          >
            {meal.title}
          </h2>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {meal.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tiempo</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {meal.prepTimeMinutes} min
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Calorías</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {meal.calories} kcal
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                <span>Proteína</span>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {meal.proteinGrams}g
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Euro className="w-3.5 h-3.5 text-emerald-500" />
                <span>Coste</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {meal.costPerServing.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Ingredients List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Ingredientes ({meal.ingredients.length})
              </h3>
              <span className="text-xs text-slate-400">Toca para tachar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.includes(ing.name);
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

                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex-shrink-0">
                      {ing.quantity}
                    </span>
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
              {meal.steps.map((step, idx) => {
                const isStepDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isStepDone
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-slate-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
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
                        isStepDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
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
          <div className="text-xs text-slate-500">
            {completedSteps.length} de {meal.steps.length} pasos completados
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm"
          >
            Listo, cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
};
