'use client';

import React, { useState } from 'react';
import {
  SupermarketId,
  UserPreferences,
} from '@/types/whipp';
import { SUPERMARKETS, COMMON_PANTRY_ITEMS } from '@/data/supermarkets';
import {
  Sparkles,
  Users,
  Euro,
  Utensils,
  Leaf,
  Plus,
  X,
  Key,
  Check,
  Zap,
  Ban,
} from 'lucide-react';

interface OnboardingWizardProps {
  initialPreferences: UserPreferences;
  onGeneratePlan: (prefs: UserPreferences, customApiKey?: string) => void;
  isLoading: boolean;
  onUseDemo: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialPreferences,
  onGeneratePlan,
  isLoading,
  onUseDemo,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...initialPreferences,
    excludedIngredients: initialPreferences.excludedIngredients || [],
  });
  const [newPantryItem, setNewPantryItem] = useState('');
  const [newExcludedItem, setNewExcludedItem] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const toggleSupermarket = (id: SupermarketId) => {
    setPreferences((prev) => {
      const exists = prev.supermarkets.includes(id);
      if (exists && prev.supermarkets.length === 1) return prev;
      return {
        ...prev,
        supermarkets: exists
          ? prev.supermarkets.filter((s) => s !== id)
          : [...prev.supermarkets, id],
      };
    });
  };

  const toggleDietTag = (tag: string) => {
    setPreferences((prev) => {
      const exists = prev.dietTags.includes(tag);
      return {
        ...prev,
        dietTags: exists
          ? prev.dietTags.filter((t) => t !== tag)
          : [...prev.dietTags, tag],
      };
    });
  };

  const toggleMealType = (type: 'lunch' | 'dinner') => {
    setPreferences((prev) => {
      const exists = prev.mealsPerDay.includes(type);
      if (exists && prev.mealsPerDay.length === 1) return prev;
      return {
        ...prev,
        mealsPerDay: exists
          ? prev.mealsPerDay.filter((m) => m !== type)
          : [...prev.mealsPerDay, type],
      };
    });
  };

  const togglePantry = (item: string) => {
    setPreferences((prev) => {
      const exists = prev.pantryItems.includes(item);
      return {
        ...prev,
        pantryItems: exists
          ? prev.pantryItems.filter((i) => i !== item)
          : [...prev.pantryItems, item],
      };
    });
  };

  const addCustomPantry = () => {
    if (!newPantryItem.trim()) return;
    const item = newPantryItem.trim();
    if (!preferences.pantryItems.includes(item)) {
      setPreferences((prev) => ({
        ...prev,
        pantryItems: [...prev.pantryItems, item],
      }));
    }
    setNewPantryItem('');
  };

  const toggleExcluded = (item: string) => {
    setPreferences((prev) => {
      const current = prev.excludedIngredients || [];
      const exists = current.includes(item);
      return {
        ...prev,
        excludedIngredients: exists
          ? current.filter((i) => i !== item)
          : [...current, item],
      };
    });
  };

  const addCustomExcluded = () => {
    if (!newExcludedItem.trim()) return;
    const item = newExcludedItem.trim();
    const current = preferences.excludedIngredients || [];
    if (!current.includes(item)) {
      setPreferences((prev) => ({
        ...prev,
        excludedIngredients: [...current, item],
      }));
    }
    setNewExcludedItem('');
  };

  const DIET_OPTIONS = [
    { id: 'Alta Proteína', label: 'Alta Proteína', desc: '>30g proteína/ración' },
    { id: 'Rápido <25 min', label: 'Rápido <25 min', desc: 'Cocina exprés y fácil' },
    { id: 'Económico', label: 'Económico', desc: 'Ahorro máximo por ración' },
    { id: 'Vegetariano', label: 'Vegetariano', desc: 'Sin carne ni pescado' },
    { id: 'Mediterráneo', label: 'Mediterráneo', desc: 'AOVE, legumbres y frescos' },
    { id: 'Sin Gluten', label: 'Sin Gluten', desc: 'Apto para celíacos' },
  ];

  const COMMON_EXCLUDED_SUGGESTIONS = [
    'Cerdo',
    'Pescado / Marisco',
    'Lácteos / Queso',
    'Cilantro',
    'Champiñones / Setas',
    'Picante / Guindilla',
    'Cebolla cruda',
    'Frutos secos',
    'Huevo',
    'Gluten',
    'Berenjena',
    'Apio',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-5 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Configurador Inteligente WhippES
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Diseña tu menú semanal sin desperdicio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Optimizado para formatos de supermercados españoles con cross-cooking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowApiKeyModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              apiKeyInput
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKeyInput ? 'API Key configurada' : 'Configurar API Key'}</span>
          </button>

          <button
            type="button"
            onClick={onUseDemo}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Cargar Menú Demo</span>
          </button>
        </div>
      </div>

      {/* 1. Supermarkets */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          Supermercados donde compras habitualmente
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(Object.keys(SUPERMARKETS) as SupermarketId[]).map((superId) => {
            const conf = SUPERMARKETS[superId];
            const isSelected = preferences.supermarkets.includes(superId);

            return (
              <button
                key={superId}
                type="button"
                onClick={() => toggleSupermarket(superId)}
                className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm"
                    style={{ backgroundColor: conf.color }}
                  >
                    {conf.name.charAt(0)}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {conf.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium truncate block">
                    {conf.brandName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Diners, Budget & Scope */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Comensales */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Nº de Comensales
          </label>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPreferences((p) => ({ ...p, diners: num }))}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  preferences.diners === num
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Presupuesto */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Euro className="w-4 h-4 text-emerald-600" />
              Presupuesto semanal máx.
            </label>
            <span className="text-sm font-extrabold text-emerald-600">
              {preferences.weeklyBudget} €
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={180}
            step={5}
            value={preferences.weeklyBudget}
            onChange={(e) =>
              setPreferences((p) => ({ ...p, weeklyBudget: Number(e.target.value) }))
            }
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>25 €</span>
            <span>100 €</span>
            <span>180 €</span>
          </div>
        </div>

        {/* Meals per day */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-600" />
            Comidas por día
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => toggleMealType('lunch')}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                preferences.mealsPerDay.includes('lunch')
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              {preferences.mealsPerDay.includes('lunch') && <Check className="w-3.5 h-3.5" />}
              <span>Comidas</span>
            </button>
            <button
              type="button"
              onClick={() => toggleMealType('dinner')}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                preferences.mealsPerDay.includes('dinner')
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              {preferences.mealsPerDay.includes('dinner') && <Check className="w-3.5 h-3.5" />}
              <span>Cenas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Diet tags */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600" />
          Preferencias nutricionales
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DIET_OPTIONS.map((opt) => {
            const isSelected = preferences.dietTags.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleDietTag(opt.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Pantry items */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            4
          </span>
          Ingredientes que ya tienes en casa (no se compran)
        </label>

        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          {COMMON_PANTRY_ITEMS.map((item) => {
            const isChecked = preferences.pantryItems.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => togglePantry(item)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                {isChecked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                <span>{item}</span>
              </button>
            );
          })}

          {preferences.pantryItems
            .filter((p) => !COMMON_PANTRY_ITEMS.includes(p))
            .map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-700 text-white flex items-center gap-1.5"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => togglePantry(item)}
                  className="hover:opacity-75"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Añadir otro ingrediente que tengas..."
            value={newPantryItem}
            onChange={(e) => setNewPantryItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomPantry();
              }
            }}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={addCustomPantry}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-semibold"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* 5. Excluded Ingredients / Allergens */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
              5
            </span>
            <Ban className="w-4 h-4 text-rose-500" />
            Ingredientes que NO quieres en tus platos (Exclusiones / Alérgenos)
          </label>
          <span className="text-xs text-slate-400">
            {(preferences.excludedIngredients || []).length} excluidos
          </span>
        </div>

        <p className="text-xs text-slate-500">
          La IA excluirá de forma estricta estos ingredientes de todas las recetas y de la lista de la compra.
        </p>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 p-2 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40">
          {COMMON_EXCLUDED_SUGGESTIONS.map((item) => {
            const isExcluded = (preferences.excludedIngredients || []).includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleExcluded(item)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isExcluded
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-300'
                }`}
              >
                {isExcluded ? <Ban className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                <span>{item}</span>
              </button>
            );
          })}

          {/* Custom added excluded items */}
          {(preferences.excludedIngredients || [])
            .filter((p) => !COMMON_EXCLUDED_SUGGESTIONS.includes(p))
            .map((item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-xs font-medium bg-rose-700 text-white flex items-center gap-1.5"
              >
                <Ban className="w-3 h-3" />
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => toggleExcluded(item)}
                  className="hover:opacity-75"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>

        {/* Add custom exclusion input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Añadir otro ingrediente a prohibir (ej. berenjena, ajo, mostaza...)"
            value={newExcludedItem}
            onChange={(e) => setNewExcludedItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomExcluded();
              }
            }}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="button"
            onClick={addCustomExcluded}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onGeneratePlan(preferences, apiKeyInput)}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Optimizando menús y envases con IA...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generar Plan Semanal Desperdicio Cero</span>
            </>
          )}
        </button>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                Clave de Gemini API
              </h3>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Introduce tu clave gratuita de Google AI Studio para generar planes personalizados en tiempo real.
            </p>

            <div>
              <label className="text-xs font-semibold">GEMINI_API_KEY</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs mt-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
