import { GoogleGenAI, Type } from '@google/genai';
import { UserPreferences, WeeklyPlanResponse, SupermarketId } from '@/types/whipp';
import { SUPERMARKETS } from '@/data/supermarkets';
import { MOCK_WEEKLY_PLAN } from '@/data/mockPlan';

// Schema for Gemini Structured Outputs matching WeeklyPlanResponse strictly
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        totalEstimatedCost: {
          type: Type.NUMBER,
          description: 'Coste total estimado en euros de la compra semanal',
        },
        costPerServingAvg: {
          type: Type.NUMBER,
          description: 'Coste medio estimado por ración individual',
        },
        zeroWasteScore: {
          type: Type.NUMBER,
          description: 'Puntuación porcentual de aprovechamiento de envases (ej. 95-100)',
        },
        savingsTip: {
          type: Type.STRING,
          description: 'Consejo detallado de batch cooking y ahorro cruzado de envases',
        },
      },
      required: ['totalEstimatedCost', 'costPerServingAvg', 'zeroWasteScore', 'savingsTip'],
    },
    meals: {
      type: Type.ARRAY,
      description: 'Lista completa de comidas y cenas para los 7 días de la semana',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          day: {
            type: Type.STRING,
            description: 'Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo',
          },
          type: {
            type: Type.STRING,
            description: 'Comida o Cena',
          },
          title: { type: Type.STRING },
          prepTimeMinutes: { type: Type.NUMBER },
          calories: { type: Type.NUMBER },
          proteinGrams: { type: Type.NUMBER },
          costPerServing: { type: Type.NUMBER },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
                shoppingItemId: { type: Type.STRING },
              },
              required: ['name', 'quantity', 'shoppingItemId'],
            },
          },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'id',
          'day',
          'type',
          'title',
          'prepTimeMinutes',
          'calories',
          'proteinGrams',
          'costPerServing',
          'tags',
          'ingredients',
          'steps',
        ],
      },
    },
    shoppingList: {
      type: Type.ARRAY,
      description: 'Lista de la compra consolidada por producto y supermercado',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          genericName: { type: Type.STRING },
          supermarketProduct: {
            type: Type.STRING,
            description: 'Nombre del producto con marca blanca (ej. Pechuga Pollo Hacendado, Feta GutBio)',
          },
          recommendedStore: {
            type: Type.STRING,
            description: 'mercadona, aldi, lidl, carrefour, dia, consum',
          },
          aisle: {
            type: Type.STRING,
            description:
              'Fruta y Verdura, Carnicería y Pescadería, Lácteos y Huevos, Despensa, Panadería, Congelados',
          },
          packSize: {
            type: Type.STRING,
            description: 'Formato real en España (ej. Bandeja 600g, Bolsa 300g, Pack 3x80g)',
          },
          unitsToBuy: { type: Type.NUMBER },
          estimatedPrice: { type: Type.NUMBER },
          usedInMeals: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          usagePercentage: {
            type: Type.NUMBER,
            description: '100 si se consume por completo entre los platos de la semana',
          },
        },
        required: [
          'id',
          'genericName',
          'supermarketProduct',
          'recommendedStore',
          'aisle',
          'packSize',
          'unitsToBuy',
          'estimatedPrice',
          'usedInMeals',
          'usagePercentage',
        ],
      },
    },
  },
  required: ['summary', 'meals', 'shoppingList'],
};

export async function generateWeeklyPlan(
  preferences: UserPreferences,
  customApiKey?: string
): Promise<{ plan: WeeklyPlanResponse; source: 'gemini' | 'mock' | 'fallback'; message?: string }> {
  const apiKey =
    customApiKey ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('No Gemini API key provided. Using adaptive demo mock plan.');
    return {
      plan: adaptMockPlan(preferences),
      source: 'mock',
      message: 'Plan de demostración WhippES cargado al instante.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const superNames = (preferences.supermarkets || ['mercadona', 'aldi'])
      .map((s) => `${SUPERMARKETS[s]?.name || s} (${SUPERMARKETS[s]?.brandName || ''})`)
      .join(', ');

    const prompt = `Actúa como el jefe de cocina y experto en economía doméstica de WhippES, la app española de planificación semanal estilo Whipp (whipp.app) con enfoque Desperdicio Cero (Zero-Waste) y Batch-Cooking.

Genera un plan semanal completo para los 7 días de la semana (Lunes a Domingo) adaptado estrictamente a los siguientes parámetros:
- Supermercados en España: ${superNames}
- Comensales: ${preferences.diners} persona(s)
- Presupuesto semanal máximo: ${preferences.weeklyBudget} €
- Comidas por día: ${
      preferences.mealsPerDay.includes('lunch') && preferences.mealsPerDay.includes('dinner')
        ? 'Comida y Cena cada día'
        : preferences.mealsPerDay.includes('lunch')
        ? 'Solo Comidas'
        : 'Solo Cenas'
    }
- Preferencias / Etiquetas dietéticas: ${preferences.dietTags?.join(', ') || 'Equilibrado'}
- Despensa existente (NO incluir en la lista de la compra): ${preferences.pantryItems?.join(', ') || 'Básicos de cocina'}

REGLAS DE ORO DE DESPERDICIO CERO:
1. Reutilización cruzada: Si se compra un envase de carne, pescado o verdura (ej. bandeja 600g de pollo en Mercadona o bolsa de 300g de espinacas en Aldi), repártelo en 2 o 3 platos de la semana para que el usagePercentage del producto sea del 100% y no sobre nada en la nevera.
2. Formatos comerciales reales españoles: Usa tamaños de envase reales en España ('Bandeja 600g', 'Bolsa 300g', 'Brik 1L', 'Malla 3 uds', etc.).
3. Marcas blancas españolas: Hacendado (Mercadona), GutBio/Milsani (Aldi), Milbona (Lidl), Carrefour Classic/BIO (Carrefour), Dia/Al Punto (Dia), Consum (Consum).
4. La suma total de estimatedPrice de la shoppingList no debe sobrepasar ${preferences.weeklyBudget} €.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.25,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Respuesta vacía de Gemini');

    const parsedPlan: WeeklyPlanResponse = JSON.parse(text);
    return {
      plan: parsedPlan,
      source: 'gemini',
      message: 'Plan generado con éxito por Gemini AI.',
    };
  } catch (error: any) {
    console.error('Error generating with Gemini in client:', error);
    return {
      plan: adaptMockPlan(preferences),
      source: 'fallback',
      message:
        'Se ha cargado un plan de demostración adaptado debido a un error con Gemini: ' +
        (error?.message || 'Error desconocido'),
    };
  }
}

export function adaptMockPlan(prefs?: UserPreferences): WeeklyPlanResponse {
  if (!prefs) return MOCK_WEEKLY_PLAN;

  const ratio = (prefs.diners || 2) / 2;
  const filteredMeals = MOCK_WEEKLY_PLAN.meals.filter((m) => {
    if (m.type === 'Comida' && !prefs.mealsPerDay.includes('lunch')) return false;
    if (m.type === 'Cena' && !prefs.mealsPerDay.includes('dinner')) return false;
    return true;
  });

  const chosenSupers =
    prefs.supermarkets && prefs.supermarkets.length > 0
      ? prefs.supermarkets
      : (['mercadona'] as SupermarketId[]);

  const adaptedShopping = MOCK_WEEKLY_PLAN.shoppingList.map((item, idx) => {
    const assignedSuper = chosenSupers[idx % chosenSupers.length];
    const conf = SUPERMARKETS[assignedSuper];
    return {
      ...item,
      recommendedStore: assignedSuper,
      supermarketProduct: item.supermarketProduct.replace(
        /(Hacendado|GutBio|Milbona|Carrefour|Dia|Consum)/g,
        conf?.brandName.split('/')[0].trim() || 'Marca Propia'
      ),
      estimatedPrice: Math.round(item.estimatedPrice * ratio * 100) / 100,
      checked: false,
    };
  });

  const totalCost = adaptedShopping.reduce((acc, i) => acc + i.estimatedPrice * i.unitsToBuy, 0);

  return {
    summary: {
      ...MOCK_WEEKLY_PLAN.summary,
      totalEstimatedCost: Math.round(totalCost * 100) / 100,
      costPerServingAvg:
        filteredMeals.length > 0
          ? Math.round((totalCost / (filteredMeals.length * prefs.diners)) * 100) / 100
          : 2.0,
    },
    meals: filteredMeals,
    shoppingList: adaptedShopping,
  };
}
