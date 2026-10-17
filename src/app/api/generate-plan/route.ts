import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { UserPreferences, WeeklyPlan, SupermarketId } from '@/types/whipp';
import { SUPERMARKETS } from '@/data/supermarkets';
import { MOCK_WEEKLY_PLAN } from '@/data/mockPlan';

export const runtime = 'nodejs';

// Schema for Gemini Structured Outputs
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    days: {
      type: Type.ARRAY,
      description: 'Los 7 días de la semana con sus recetas de comida y cena',
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.STRING,
            description: 'lunes, martes, miercoles, jueves, viernes, sabado, domingo',
          },
          dayName: {
            type: Type.STRING,
            description: 'Lunes, Martes, Miércoles, etc.',
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              prepTimeMinutes: { type: Type.NUMBER },
              cookTimeMinutes: { type: Type.NUMBER },
              servings: { type: Type.NUMBER },
              caloriesPerServing: { type: Type.NUMBER },
              proteinGrams: { type: Type.NUMBER },
              carbsGrams: { type: Type.NUMBER },
              fatGrams: { type: Type.NUMBER },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              zeroWasteTip: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    isFromPantry: { type: Type.BOOLEAN },
                    supermarket: { type: Type.STRING },
                  },
                  required: ['name', 'amount'],
                },
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'id',
              'title',
              'description',
              'prepTimeMinutes',
              'cookTimeMinutes',
              'servings',
              'caloriesPerServing',
              'proteinGrams',
              'carbsGrams',
              'fatGrams',
              'tags',
              'ingredients',
              'instructions',
            ],
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              prepTimeMinutes: { type: Type.NUMBER },
              cookTimeMinutes: { type: Type.NUMBER },
              servings: { type: Type.NUMBER },
              caloriesPerServing: { type: Type.NUMBER },
              proteinGrams: { type: Type.NUMBER },
              carbsGrams: { type: Type.NUMBER },
              fatGrams: { type: Type.NUMBER },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              zeroWasteTip: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    isFromPantry: { type: Type.BOOLEAN },
                    supermarket: { type: Type.STRING },
                  },
                  required: ['name', 'amount'],
                },
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'id',
              'title',
              'description',
              'prepTimeMinutes',
              'cookTimeMinutes',
              'servings',
              'caloriesPerServing',
              'proteinGrams',
              'carbsGrams',
              'fatGrams',
              'tags',
              'ingredients',
              'instructions',
            ],
          },
        },
        required: ['day', 'dayName'],
      },
    },
    shoppingList: {
      type: Type.ARRAY,
      description: 'Lista completa de compra agrupada por supermercado y pasillo',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          supermarket: {
            type: Type.STRING,
            description: 'mercadona, aldi, lidl, carrefour, consum, dia',
          },
          brandName: {
            type: Type.STRING,
            description: 'Hacendado, GutBio, Milbona, etc.',
          },
          aisle: {
            type: Type.STRING,
            description:
              'fruta-verdura, carniceria-pescaderia, lacteos-huevos, despensa, congelados, panaderia',
          },
          packageFormat: {
            type: Type.STRING,
            description: 'Bandeja 600g, Bolsa 300g, Bote 400g, etc.',
          },
          estimatedPrice: { type: Type.NUMBER },
          quantityNeeded: { type: Type.NUMBER },
          usedInRecipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                recipeTitle: { type: Type.STRING },
                day: { type: Type.STRING },
                mealType: { type: Type.STRING },
                amountUsed: { type: Type.STRING },
              },
              required: ['recipeTitle', 'day', 'mealType', 'amountUsed'],
            },
          },
        },
        required: [
          'id',
          'name',
          'supermarket',
          'brandName',
          'aisle',
          'packageFormat',
          'estimatedPrice',
          'quantityNeeded',
          'usedInRecipes',
        ],
      },
    },
    zeroWasteSummary: {
      type: Type.OBJECT,
      properties: {
        overallUtilizationScore: {
          type: Type.NUMBER,
          description: 'Porcentaje global de aprovechamiento (ej 95-100)',
        },
        estimatedSavingsEuros: { type: Type.NUMBER },
        batchCookingTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        zeroWasteItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ingredientName: { type: Type.STRING },
              packageDescription: { type: Type.STRING },
              supermarket: { type: Type.STRING },
              totalPackageSize: { type: Type.STRING },
              utilizationPercent: { type: Type.NUMBER },
              storageTip: { type: Type.STRING },
              usages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    recipeTitle: { type: Type.STRING },
                    day: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    percent: { type: Type.NUMBER },
                  },
                  required: ['recipeTitle', 'day', 'amount', 'percent'],
                },
              },
            },
            required: [
              'ingredientName',
              'packageDescription',
              'supermarket',
              'totalPackageSize',
              'utilizationPercent',
              'storageTip',
              'usages',
            ],
          },
        },
      },
      required: [
        'overallUtilizationScore',
        'estimatedSavingsEuros',
        'batchCookingTips',
        'zeroWasteItems',
      ],
    },
  },
  required: ['days', 'shoppingList', 'zeroWasteSummary'],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const preferences: UserPreferences = body.preferences;
    const clientApiKey = body.apiKey || preferences?.customApiKey;

    const apiKey =
      clientApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    // If no API Key is provided, fallback smoothly to the smart mock plan adapted to user preferences
    if (!apiKey) {
      console.log('No Gemini API key detected. Returning high-fidelity mock plan.');
      const adaptedMock = adaptMockPlanToPreferences(preferences);
      return NextResponse.json({
        plan: adaptedMock,
        source: 'mock',
        message: 'Plan generado con el motor de demostración WhippES.',
      });
    }

    // Initialize GoogleGenAI with the new official SDK
    const ai = new GoogleGenAI({ apiKey });

    const superNames = preferences.supermarkets
      .map((s) => `${SUPERMARKETS[s]?.name} (${SUPERMARKETS[s]?.brand})`)
      .join(', ');

    const prompt = `Actúa como el jefe de cocina y experto en economía doméstica de WhippES, la app española de planificación de comidas semanal estilo Whipp (whipp.app) con enfoque Desperdicio Cero (Zero-Waste) y Batch-Cooking.

Genera un Plan Semanal de 7 días (Lunes a Domingo) estrictamente estructurado según los siguientes parámetros del usuario:
- Supermercados seleccionados en España: ${superNames}
- Comensales: ${preferences.servings} persona(s)
- Presupuesto semanal máximo: ${preferences.maxBudget} €
- Alcance de comidas: ${
      preferences.mealScope === 'both'
        ? 'Tanto Comidas como Cenas para los 7 días'
        : preferences.mealScope === 'lunch'
        ? 'Solo Comidas principales para los 7 días'
        : 'Solo Cenas ligeras para los 7 días'
    }
- Preferencias dietéticas: ${preferences.dietaryPreferences.join(', ')}
- Ingredientes que YA TIENE en su despensa (NO comprarlos en la lista de la compra): ${preferences.pantryItems.join(
      ', '
    )}

REGLAS CRÍTICAS DE DESPERDICIO CERO (BATCH / CROSS-COOKING):
1. Los ingredientes frescos o envasados comprados en los supermercados españoles deben reutilizarse en 2 o 3 recetas de la semana para que NO quede ningún envase a medias ni se tire comida.
   Ejemplos reales españoles:
   - Bandeja 600g pechuga de pollo de Mercadona: 300g el lunes (salteado) + 300g el miércoles (fajitas).
   - Bolsa 300g espinacas frescas: 150g en potaje/salteado el martes + 150g en tortilla el jueves.
   - Bote garbanzos cocidos 400g: 200g salteados el martes + 200g ensalada el viernes.
   - Queso feta o mozzarella: repartido en 2 comidas de la semana.
2. Cada producto de la lista de la compra debe indicar:
   - Su marca blanca correspondiente (ej. Hacendado para Mercadona, GutBio/Milsani para Aldi, Milbona/Chef Select para Lidl, Carrefour Classic/BIO para Carrefour, Consum/Eco para Consum, Dia/Al Punto para Dia).
   - Formato de envase real comercial en España (ej: 'Bandeja 600g', 'Bolsa 300g', 'Pack 2x150g', 'Malla 3 Uds').
   - Precio real estimado en euros (la suma total debe respetar el presupuesto del usuario de ${preferences.maxBudget} €).
   - En qué recetas de la semana se usa cada producto ('usedInRecipes').
3. No incluyas en la lista de la compra ingredientes que el usuario ya tenga en su despensa.
4. Genera recetas deliciosas, fáciles, rápidas (<25 min o aptas para batch cooking) y ricas en nutrientes.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini devolvió una respuesta vacía');
    }

    const parsedData = JSON.parse(responseText);

    // Calculate total cost from items
    const totalEstimatedCost = parsedData.shoppingList.reduce(
      (acc: number, item: any) =>
        acc + (item.estimatedPrice || 0) * (item.quantityNeeded || 1),
      0
    );

    const generatedPlan: WeeklyPlan = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      servings: preferences.servings,
      mealScope: preferences.mealScope,
      selectedSupermarkets: preferences.supermarkets,
      dietaryPreferences: preferences.dietaryPreferences,
      maxBudget: preferences.maxBudget,
      totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
      days: parsedData.days,
      shoppingList: parsedData.shoppingList.map((item: any, idx: number) => ({
        ...item,
        id: item.id || `item-${idx + 1}`,
        isChecked: false,
      })),
      zeroWasteSummary: parsedData.zeroWasteSummary,
      pantryItems: preferences.pantryItems,
    };

    return NextResponse.json({
      plan: generatedPlan,
      source: 'gemini',
      message: 'Plan semanal generado con éxito por Gemini AI.',
    });
  } catch (error: any) {
    console.error('Error generating plan with Gemini:', error);
    // Graceful fallback to adapted mock plan on any API failure so user experience never breaks
    const adaptedMock = adaptMockPlanToPreferences(MOCK_WEEKLY_PLAN as any);
    return NextResponse.json({
      plan: adaptedMock,
      source: 'fallback',
      warning:
        'Se ha cargado un plan inteligente de muestra debido a un error de conexión con Gemini: ' +
        (error?.message || 'Error desconocido'),
    });
  }
}

// Helper to adapt mock plan to customized comensales/budget/supermarkets
function adaptMockPlanToPreferences(prefs?: UserPreferences): WeeklyPlan {
  if (!prefs) return MOCK_WEEKLY_PLAN;

  const ratio = (prefs.servings || 2) / 2;
  const targetBudget = prefs.maxBudget || 60;

  const adaptedDays = MOCK_WEEKLY_PLAN.days.map((day) => ({
    ...day,
    lunch:
      prefs.mealScope === 'dinner'
        ? undefined
        : day.lunch
        ? {
            ...day.lunch,
            servings: prefs.servings,
          }
        : undefined,
    dinner:
      prefs.mealScope === 'lunch'
        ? undefined
        : day.dinner
        ? {
            ...day.dinner,
            servings: prefs.servings,
          }
        : undefined,
  }));

  // Re-map supermarket brands if user only selected specific ones
  const chosenSupers =
    prefs.supermarkets && prefs.supermarkets.length > 0
      ? prefs.supermarkets
      : (['mercadona'] as SupermarketId[]);

  const adaptedShopping = MOCK_WEEKLY_PLAN.shoppingList.map((item, idx) => {
    const assignedSuper = chosenSupers[idx % chosenSupers.length];
    const supConfig = SUPERMARKETS[assignedSuper];
    return {
      ...item,
      supermarket: assignedSuper,
      brandName: supConfig?.brand || item.brandName,
      estimatedPrice: Math.round(item.estimatedPrice * ratio * 100) / 100,
      isChecked: false,
    };
  });

  const totalCost = adaptedShopping.reduce(
    (acc, i) => acc + i.estimatedPrice * (i.quantityNeeded || 1),
    0
  );

  return {
    ...MOCK_WEEKLY_PLAN,
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    servings: prefs.servings || 2,
    mealScope: prefs.mealScope || 'both',
    selectedSupermarkets: chosenSupers,
    dietaryPreferences: prefs.dietaryPreferences || ['alta-proteina', 'mediterraneo'],
    maxBudget: targetBudget,
    totalEstimatedCost: Math.round(totalCost * 100) / 100,
    days: adaptedDays,
    shoppingList: adaptedShopping,
    pantryItems: prefs.pantryItems || MOCK_WEEKLY_PLAN.pantryItems,
  };
}
