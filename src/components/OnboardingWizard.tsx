'use client';

import React, { useState } from 'react';
import {
  SupermarketId,
  DietaryPreference,
  MealScope,
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
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';

interface OnboardingWizardProps {
  initialPreferences: UserPreferences;
  onGeneratePlan: (prefs: UserPreferences) => void;
  isLoading: boolean;
  onUseDemo: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialPreferences,
  onGeneratePlan,
  isLoading,
  onUseDemo,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [newPantryItem, setNewPantryItem] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(preferences.customApiKey || '');

  const toggleSupermarket = (id: SupermarketId) => {
    setPreferences((prev) => {
      const exists = prev.supermarkets.includes(id);
      if (exists && prev.supermarkets.length === 1) {
        return prev; // keep at least 1
      }
      return {
        ...prev,
        supermarkets: exists
          ? prev.supermarkets.filter((s) => s !== id)
          : [...prev.supermarkets, id],
      };
    });
  };

  const toggleDietary = (pref: DietaryPreference) => {
    setPreferences((prev) => {
      const exists = prev.dietaryPreferences.includes(pref);
      return {
        ...prev,
        dietaryPreferences: exists
          ? prev.dietaryPreferences.filter((p) => p !== pref)
          : [...prev.dietaryPreferences, pref],
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

  const handleSaveApiKey = () => {
    setPreferences((prev) => ({
      ...prev,
      customApiKey: apiKeyInput.trim(),
    }));
    setShowApiKeyModal(false);
  };

  const DIETARY_OPTIONS: { id: DietaryPreference; label: string; desc: string }[] = [
    { id: 'alta-proteina', label: 'Alta Proteína', desc: '>30g proteína/plato' },
    { id: 'rapido', label: 'Rápido <25 min', desc: 'Recetas exprés sin complicaciones' },
    { id: 'economico', label: 'Económico', desc: 'Máximo ahorro por ración' },
    { id: 'vegetariano', label: 'Vegetariano', desc: 'Sin carne ni pescado' },
    { id: 'mediterraneo', label: 'Mediterráneo', desc: 'AOVE, legumbres y frescos' },
    { id: 'sin-gluten', label: 'Sin Gluten', desc: 'Ingredientes aptos para celíacos' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-5 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Configurador Inteligente WhippES
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Diseña tu menú semanal sin desperdicio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Reutilizamos estratégicamente cada envase entre tus recetas para ahorrar dinero y tiempo.
          </p>
        </div>

        {/* API Key / Quick Demo Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowApiKeyModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              preferences.customApiKey
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{preferences.customApiKey ? 'API Key activa' : 'Configurar API Key'}</span>
          </button>

          <button
            type="button"
            onClick={onUseDemo}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Cargar Menú Demo</span>
          </button>
        </div>
      </div>

      {/* 1. Supermarkets Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            ¿En qué supermercados compras habitualmente?
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {preferences.supermarkets.length} seleccionados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(Object.keys(SUPERMARKETS) as SupermarketId[]).map((superId) => {
            const config = SUPERMARKETS[superId];
            const isSelected = preferences.supermarkets.includes(superId);

            return (
              <button
                key={superId}
                type="button"
                onClick={() => toggleSupermarket(superId)}
                className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    {config.logoInitial}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    {config.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate block">
                    {config.brand}
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
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Nº de Comensales
          </label>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPreferences((p) => ({ ...p, servings: num }))}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  preferences.servings === num
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
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
              <Euro className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Presupuesto semanal máx.
            </label>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {preferences.maxBudget} €
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={180}
            step={5}
            value={preferences.maxBudget}
            onChange={(e) =>
              setPreferences((p) => ({ ...p, maxBudget: Number(e.target.value) }))
            }
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>25 € (Económico)</span>
            <span>100 €</span>
            <span>180 € (Familiar)</span>
          </div>
        </div>

        {/* Meal Scope */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Comidas a incluir
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
            {(
              [
                { id: 'both', label: 'Ambas' },
                { id: 'lunch', label: 'Comidas' },
                { id: 'dinner', label: 'Cenas' },
              ] as { id: MealScope; label: string }[]
            ).map((scope) => (
              <button
                key={scope.id}
                type="button"
                onClick={() => setPreferences((p) => ({ ...p, mealScope: scope.id }))}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  preferences.mealScope === scope.id
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Dietary Preferences */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Preferencias nutricionales y estilo de cocina
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DIETARY_OPTIONS.map((opt) => {
            const isSelected = preferences.dietaryPreferences.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleDietary(opt.id)}
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
                <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Pantry Items */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              4
            </span>
            ¿Qué tienes ya en tu despensa? (No se añadirá a la compra)
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {preferences.pantryItems.length} ingredientes en casa
          </span>
        </div>

        {/* Pre-populated and custom chips */}
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
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-slate-300'
                }`}
              >
                {isChecked ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                <span>{item}</span>
              </button>
            );
          })}

          {/* Any other custom added items */}
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

        {/* Add custom ingredient to pantry */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Añadir otro ingrediente que tengas (ej. salsa de soja, quinoa...)"
            value={newPantryItem}
            onChange={(e) => setNewPantryItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomPantry();
              }
            }}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={addCustomPantry}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onGeneratePlan(preferences)}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Clave de Gemini API
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Puedes introducir tu propia clave de Google AI Studio gratuita para generar planes en tiempo real ilimitados. Si no tienes una a mano, la app incluye un <strong>Modo Demo inteligente</strong> con planes pre-cargados al 100%.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                GEMINI_API_KEY
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:underline block pt-1"
              >
                → Conseguir API Key gratuita en Google AI Studio
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                Guardar Clave
              </button>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
