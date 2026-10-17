'use client';

import React from 'react';
import { WeeklyPlanResponse, ShoppingItem } from '@/types/whipp';
import { SUPERMARKETS } from '@/data/supermarkets';
import {
  Recycle,
  CheckCircle2,
  PackageCheck,
  ChefHat,
  Info,
  Sparkles,
} from 'lucide-react';

interface ZeroWasteTrackerProps {
  summary: WeeklyPlanResponse['summary'];
  shoppingList: ShoppingItem[];
}

export const ZeroWasteTracker: React.FC<ZeroWasteTrackerProps> = ({
  summary,
  shoppingList,
}) => {
  // Cross-cooked items: items used in more than 1 meal
  const crossCookedItems = shoppingList.filter(
    (item) => item.usedInMeals && item.usedInMeals.length > 1
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Metric */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Recycle className="w-3.5 h-3.5" />
              Filosofía WhippES: Desperdicio Cero
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Aprovechamiento del {summary.zeroWasteScore}% de tus compras
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Cada bandeja, brik o bolsa de los supermercados españoles se reutiliza estratégicamente en 2 o 3 platos de la semana para no dejar envases a medias en la nevera.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex-shrink-0">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-200 block font-semibold">
                Coste por Ración
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                ~{summary.costPerServingAvg.toFixed(2)} €
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-200 block font-semibold">
                Envases Cruzados
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {crossCookedItems.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Cooked Items Details */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Envases Compartidos Entre Múltiples Recetas
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            100% Consumidos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crossCookedItems.map((item) => {
            const conf = SUPERMARKETS[item.recommendedStore];

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {item.supermarketProduct}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Formato: {item.packSize} · {item.estimatedPrice.toFixed(2)} €
                    </p>
                  </div>
                  {conf && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex-shrink-0 ${conf.badgeColor}`}
                    >
                      {conf.name}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">
                      Aprovechamiento:
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.usagePercentage}% aprovechado
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${item.usagePercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Distribuido en:
                  </span>
                  {item.usedInMeals.map((mealName, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {mealName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings Tip Callout */}
      {summary.savingsTip && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-5 sm:p-6 flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
              Estrategia Semanal de Batch-Cooking y Ahorro
            </h4>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed">
              {summary.savingsTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
