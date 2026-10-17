'use client';

import React from 'react';
import { ZeroWasteSummary } from '@/types/whipp';
import { SUPERMARKETS } from '@/data/supermarkets';
import {
  Sparkles,
  Recycle,
  CheckCircle2,
  PackageCheck,
  TrendingDown,
  ChefHat,
  Info,
  Calendar,
} from 'lucide-react';

interface ZeroWasteTrackerProps {
  summary: ZeroWasteSummary;
}

export const ZeroWasteTracker: React.FC<ZeroWasteTrackerProps> = ({ summary }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Metric */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Recycle className="w-3.5 h-3.5" />
              Filosofía WhippES: Desperdicio Cero
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Aprovechamiento del {summary.overallUtilizationScore}% de tus compras
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Cada bandeja, brik o bolsa comprada en el súper tiene un propósito doble o triple. Adiós a tirar medias bolsas de espinacas o pechugas olvidadas en la nevera.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex-shrink-0">
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-200 block font-semibold">
                Ahorro Semanal Est.
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                ~{summary.estimatedSavingsEuros.toFixed(2)} €
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider text-emerald-200 block font-semibold">
                Envases Cruzados
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {summary.zeroWasteItems.length}
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
          {summary.zeroWasteItems.map((item, idx) => {
            const superConfig = SUPERMARKETS[item.supermarket];

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {item.ingredientName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.packageDescription}
                    </p>
                  </div>
                  {superConfig && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex-shrink-0 ${superConfig.badgeColor}`}
                    >
                      {superConfig.name}
                    </span>
                  )}
                </div>

                {/* Progress bar of usage */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">
                      Uso total: {item.totalPackageSize}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.utilizationPercent}% aprovechado
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full flex overflow-hidden">
                    {item.usages.map((u, uIdx) => (
                      <div
                        key={uIdx}
                        className={`h-full ${
                          uIdx === 0
                            ? 'bg-emerald-500'
                            : uIdx === 1
                            ? 'bg-teal-500'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${u.percent}%` }}
                        title={`${u.day}: ${u.amount} (${u.percent}%)`}
                      />
                    ))}
                  </div>
                </div>

                {/* Usages breakdown */}
                <div className="space-y-1.5 pt-1">
                  {item.usages.map((u, uIdx) => (
                    <div
                      key={uIdx}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {u.recipeTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                        <span>{u.day}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {u.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preservation / Storage Tip */}
                {item.storageTip && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                    <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      <strong>Conservación:</strong> {item.storageTip}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Batch Cooking Strategy */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Plan de Batch Cooking para el Domingo / Inicio de Semana
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Dedica 45 minutos a preparar estas bases y ahorrarás más de 3 horas de cocinado entre semana:
        </p>

        <div className="space-y-2.5">
          {summary.batchCookingTips.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
