'use client';

import React, { useState } from 'react';
import { ShoppingItem, SupermarketId, AisleType } from '@/types/whipp';
import { SUPERMARKETS, AISLE_LABELS } from '@/data/supermarkets';
import {
  ShoppingBag,
  CheckCircle2,
  Circle,
  Share2,
  Plus,
  Trash2,
  DollarSign,
  Store,
  Layers,
  Sparkles,
  Check,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SmartShoppingListProps {
  items: ShoppingItem[];
  maxBudget: number;
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<ShoppingItem, 'id'>) => void;
  onDeleteItem?: (id: string) => void;
}

export const SmartShoppingList: React.FC<SmartShoppingListProps> = ({
  items,
  maxBudget,
  onToggleItem,
  onAddItem,
  onDeleteItem,
}) => {
  const [selectedSuper, setSelectedSuper] = useState<SupermarketId | 'all'>('all');
  const [selectedAisle, setSelectedAisle] = useState<AisleType | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // New item form state
  const [newName, setNewName] = useState('');
  const [newSuper, setNewSuper] = useState<SupermarketId>('mercadona');
  const [newAisle, setNewAisle] = useState<AisleType>('fruta-verdura');
  const [newPrice, setNewPrice] = useState('2.00');
  const [newFormat, setNewFormat] = useState('1 unidad');

  // Calculations
  const totalCost = items.reduce(
    (acc, item) => acc + item.estimatedPrice * (item.quantityNeeded || 1),
    0
  );
  const checkedItemsCount = items.filter((i) => i.isChecked).length;
  const progressPercent = Math.min(100, Math.round((totalCost / maxBudget) * 100));
  const isOverBudget = totalCost > maxBudget;
  const savings = Math.max(0, maxBudget - totalCost);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedSuper !== 'all' && item.supermarket !== selectedSuper) return false;
    if (selectedAisle !== 'all' && item.aisle !== selectedAisle) return false;
    return true;
  });

  // Unique supermarkets present in the list
  const presentSupermarkets = Array.from(new Set(items.map((i) => i.supermarket)));

  const handleToggle = (id: string) => {
    onToggleItem(id);
    const item = items.find((i) => i.id === id);
    if (item && !item.isChecked && checkedItemsCount + 1 === items.length) {
      // All items completed celebration!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCopyWhatsApp = () => {
    let text = `🛒 *LISTA DE LA COMPRA - WhippES*\n`;
    text += `💰 Estimado: ${totalCost.toFixed(2)}€ / Máx: ${maxBudget}€\n\n`;

    presentSupermarkets.forEach((supId) => {
      const supConfig = SUPERMARKETS[supId];
      const supItems = items.filter((i) => i.supermarket === supId);
      if (supItems.length === 0) return;

      text += `📍 *${supConfig.name} (${supConfig.brand})*\n`;
      supItems.forEach((it) => {
        const check = it.isChecked ? '✅' : '⬜';
        text += `${check} ${it.name} (${it.packageFormat}) - ${it.estimatedPrice.toFixed(2)}€\n`;
      });
      text += `\n`;
    });

    text += `🌱 Menú optimizado con Desperdicio Cero en WhippES.`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddItem({
      name: newName.trim(),
      supermarket: newSuper,
      brandName: SUPERMARKETS[newSuper].brand,
      aisle: newAisle,
      packageFormat: newFormat.trim() || '1 unidad',
      estimatedPrice: parseFloat(newPrice) || 0,
      quantityNeeded: 1,
      usedInRecipes: [{ recipeTitle: 'Añadido manual', day: 'Semana', mealType: 'Comida', amountUsed: '1 ud' }],
      isChecked: false,
      isCustom: true,
    });

    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Budget & Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Lista de la Compra Inteligente
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {checkedItemsCount} de {items.length} productos comprados ({Math.round((checkedItemsCount / Math.max(1, items.length)) * 100)}%)
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition-all flex items-center gap-1.5"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copiar para WhatsApp</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Producto</span>
            </button>
          </div>
        </div>

        {/* Budget Progress Meter */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Coste Estimado vs Presupuesto Semanal
            </span>
            <div className="text-right">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {totalCost.toFixed(2)} €
              </span>
              <span className="text-slate-400"> / {maxBudget} €</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : progressPercent > 85
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {isOverBudget ? (
                <span className="text-rose-600 font-bold">
                  Sobrepasas tu presupuesto por {(totalCost - maxBudget).toFixed(2)} €
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Te sobran {savings.toFixed(2)} € de tu presupuesto semanal
                </span>
              )}
            </span>
            <span>{progressPercent}% del presupuesto</span>
          </div>
        </div>

        {/* Filters: Supermarket & Aisle */}
        <div className="space-y-2 pt-2">
          {/* Supermarket Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedSuper('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                selectedSuper === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Todos los Supermercados ({items.length})</span>
            </button>

            {presentSupermarkets.map((supId) => {
              const config = SUPERMARKETS[supId];
              const isSelected = selectedSuper === supId;
              const count = items.filter((i) => i.supermarket === supId).length;

              return (
                <button
                  key={supId}
                  type="button"
                  onClick={() => setSelectedSuper(supId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 border ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: config.accentColor }}
                  />
                  <span>
                    {config.name} ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Aisle Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              type="button"
              onClick={() => setSelectedAisle('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${
                selectedAisle === 'all'
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todos los pasillos
            </button>
            {(Object.keys(AISLE_LABELS) as AisleType[]).map((aisleKey) => {
              const label = AISLE_LABELS[aisleKey].label;
              const isSelected = selectedAisle === aisleKey;
              return (
                <button
                  key={aisleKey}
                  type="button"
                  onClick={() => setSelectedAisle(aisleKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
            <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No hay productos con este filtro
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Prueba a seleccionar &quot;Todos&quot; para ver la lista completa.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const superConfig = SUPERMARKETS[item.supermarket];
            const aisleInfo = AISLE_LABELS[item.aisle];

            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  item.isChecked
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 shadow-sm'
                }`}
              >
                {/* Left: Checkbox + Name + Brand + Recipes */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex-shrink-0 text-emerald-600">
                    {item.isChecked ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug ${
                          item.isChecked ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        · {item.packageFormat}
                      </span>
                    </div>

                    {/* Supermarket brand tag + Aisle tag */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${superConfig.badgeColor}`}
                      >
                        {superConfig.name} ({item.brandName})
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {aisleInfo?.label || 'Pasillo'}
                      </span>
                    </div>

                    {/* Used in recipes indicator */}
                    {item.usedInRecipes && item.usedInRecipes.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                        <span className="font-semibold text-slate-400">Usado en:</span>
                        {item.usedInRecipes.map((u, i) => (
                          <span
                            key={i}
                            className="bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px] border border-emerald-200/60 dark:border-emerald-800"
                          >
                            {u.recipeTitle} ({u.day})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Price & Delete (for custom) */}
                <div className="flex flex-col items-end flex-shrink-0 pl-2">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {(item.estimatedPrice * (item.quantityNeeded || 1)).toFixed(2)} €
                  </span>
                  {item.quantityNeeded > 1 && (
                    <span className="text-[10px] text-slate-400">
                      {item.quantityNeeded} uds x {item.estimatedPrice.toFixed(2)} €
                    </span>
                  )}

                  {item.isCustom && onDeleteItem && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="mt-2 text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCustomItem}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Añadir Producto a la Compra
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Papel de cocina, Café molido..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Supermercado</label>
                  <select
                    value={newSuper}
                    onChange={(e) => setNewSuper(e.target.value as SupermarketId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {(Object.keys(SUPERMARKETS) as SupermarketId[]).map((s) => (
                      <option key={s} value={s}>
                        {SUPERMARKETS[s].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Pasillo</label>
                  <select
                    value={newAisle}
                    onChange={(e) => setNewAisle(e.target.value as AisleType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {(Object.keys(AISLE_LABELS) as AisleType[]).map((a) => (
                      <option key={a} value={a}>
                        {AISLE_LABELS[a].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Formato de envase</label>
                  <input
                    type="text"
                    placeholder="ej. Pack 2x, Bote 500g"
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Precio estimado (€)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Añadir a la lista
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
