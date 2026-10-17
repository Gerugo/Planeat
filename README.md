# WhippES 🛒🌱
> **Planificador Semanal Inteligente con Desperdicio Cero adaptado a los Supermercados de España**  
> Inspirado en la estética limpia y minimalista de [whipp.app](https://whipp.app).

[![Next.js](https://img.shields.io/badge/Next.js-15_(App_Router)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Google GenAI SDK](https://img.shields.io/badge/@google/genai-Gemini_2.5_Flash-4285F4?style=flat&logo=google)](https://aistudio.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-16a34a?style=flat&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## 🌟 ¿Qué es WhippES?

**WhippES** es una WebApp Mobile-First diseñada específicamente para el consumidor español. Resuelve el gran dilema semanal: *"¿Qué como esta semana y cómo evito que se me pudran las sobras en la nevera?"*.

A diferencia de otros planificadores genéricos:
1. **Conoce los formatos reales de los supermercados españoles**: Bandejas de 600g de pechuga de pollo de Mercadona, bolsas de espinacas baby de 300g, tarros de garbanzos cocidos de 400g, mallas de aguacates de Aldi o quesos griegos de Lidl.
2. **Motor Desperdicio Cero (Cross & Batch-Cooking)**: Si compras un envase familiar, el motor de IA distribuye los ingredientes en 2 o 3 recetas de la semana (ej. la mitad del pollo para un salteado el lunes y la otra mitad marinada para fajitas el miércoles), alcanzando un **98% de aprovechamiento neto**.
3. **Lista de la compra interactiva y offline**: Dividida por supermercado y clasificada por pasillos (*Fruta y Verdura*, *Carnicería y Pescadería*, *Lácteos*, *Despensa*, *Panadería*), mostrando las marcas blancas correspondientes (**Hacendado**, **GutBio/Milsani**, **Milbona**, **Carrefour Classic/BIO**, **Consum**, **Dia**) y control de presupuesto en tiempo real.

---

## 🚀 Características Principales

- **Configurador personalizado (Onboarding Wizard)**:
  - Selección de supermercados favoritos (Mercadona, Aldi, Lidl, Carrefour, Consum, Dia).
  - Número de comensales (1 a 6+ raciones).
  - Presupuesto semanal máximo (€) con barra visual de ahorro.
  - Alcance de comidas (Comidas, Cenas o Ambas).
  - Preferencias nutricionales: *Alta Proteína*, *Rápido <25 min*, *Económico*, *Vegetariano*, *Mediterráneo*, *Sin Gluten*.
  - Despensa activa: marca los básicos que ya tienes en casa (AOVE, sal, especias, ajo, arroz) para no comprarlos repetidos.

- **Menú Semanal de 7 Días (Grid & Cards estilo Whipp)**:
  - Vista limpia por días con pestañas interactivas.
  - Badges de macronutrientes: Kcal, Proteínas (g), Carbos/Grasas (g) y tiempo total de preparación.
  - Botón **"Swap"**: cambia cualquier plato de forma instantánea por otra alternativa coherente.
  - **Modal de Receta Paso a Paso** interactivo con ingredientes marcables y guía paso a paso para cocinar sin despistarse.

- **Lista de la Compra Inteligente**:
  - Filtros por supermercado y por pasillo comercial.
  - Formato real de venta en España con precios estimados en euros.
  - Marcador *"Usado en"* para saber exactamente en qué recetas intervendrá cada producto.
  - Checkboxes persistentes en `localStorage` utilizables dentro del súper incluso sin cobertura.
  - Función de exportación de un clic con formato para compartir por **WhatsApp**.
  - Permite añadir artículos personalizados.

- **Visualizador Zero-Waste Tracker**:
  - Porcentaje global de aprovechamiento de la compra.
  - Barras de progreso de uso para cada envase compartido.
  - Consejos de conservación en nevera/congelador.
  - Guía de preparación dominical / Batch-Cooking (45 min para ahorrar 3 horas entre semana).

- **Modo Demo & Conexión con Gemini AI**:
  - Incluye un plan mock de alta fidelidad pre-cargado para probar la app desde el primer segundo sin necesidad de configurar claves.
  - Integra el nuevo SDK oficial `@google/genai` con **Structured Outputs (`responseSchema`)** para garantizar respuestas en JSON estricto sin fallos de parseo.
  - Permite introducir una `GEMINI_API_KEY` propia desde la interfaz o mediante `.env.local`.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, React 19) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) (tipado estricto) |
| **Estilos & UI** | [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (Iconos) |
| **Inteligencia Artificial** | [`@google/genai`](https://www.npmjs.com/package/@google/genai) (Google Gemini 2.5 Flash con Structured Outputs) |
| **Efectos & UX** | `canvas-confetti` + PWA Manifest + Backdrops modernos nativos (`<dialog closedby="any">`) |
| **Persistencia** | `localStorage` con sincronización reactiva |

---

## 📁 Estructura del Proyecto

```text
whipp-es/
├── public/
│   ├── icon.svg                     # Icono de la PWA
│   └── manifest.json                # Configuración Progressive Web App
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-plan/
│   │   │       └── route.ts         # Endpoint Gemini con Structured Outputs (responseSchema)
│   │   ├── globals.css              # Estilos globales y backdrops
│   │   ├── layout.tsx               # Metadatos, fuentes y viewport móvil
│   │   └── page.tsx                 # Dashboard principal y gestión de pestañas
│   ├── components/
│   │   ├── OnboardingWizard.tsx     # Selector de supermercados, dieta y presupuesto
│   │   ├── RecipeModal.tsx          # Modal paso a paso accesible con light-dismiss
│   │   ├── SmartShoppingList.tsx    # Lista filtrable con persistencia y WhatsApp
│   │   ├── WeeklyMealPlan.tsx       # Grid semanal interactivo con badges y botón swap
│   │   └── ZeroWasteTracker.tsx     # Visualizador de aprovechamiento y batch cooking
│   ├── data/
│   │   ├── mockPlan.ts              # Plan realista de 7 días adaptado a Mercadona/Aldi
│   │   └── supermarkets.ts          # Configuración y marcas blancas de súpers españoles
│   └── types/
│       └── whipp.ts                 # Interfaces TypeScript completas
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚦 Instalación y Uso Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Gerugo/Planeat.git
cd Planeat
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. (Opcional) Configurar API Key de Gemini
Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```
Y añade tu API Key gratuita de [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=tu_clave_de_gemini_aqui
```
> *Nota: Si no configuras la clave, la app arrancará igualmente en **Modo Demo inteligente** 100% interactivo.*

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador [http://localhost:3000](http://localhost:3000).

---

## 🧪 Comandos disponibles

- `npm run dev`: Inicia el servidor de desarrollo con recarga en caliente.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia la versión compilada en producción.
- `npm run lint`: Ejecuta el linter de Next.js / TypeScript.

---

## 🌐 Despliegue en GitHub Pages (Automático con GitHub Actions)

El proyecto está configurado para exportación estática (`output: 'export'`) y cuenta con un flujo automatizado de CI/CD mediante **GitHub Actions**.

### Pasos para activarlo en tu repositorio:

1. Entra en tu repositorio en GitHub: [https://github.com/Gerugo/Planeat](https://github.com/Gerugo/Planeat)
2. Ve a la pestaña **Settings** (Configuración) en la barra superior.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En el apartado **Build and deployment** -> **Source**:
   - Cambia de *"Deploy from a branch"* a 👉 **`GitHub Actions`**.
5. ¡Listo! La acción `.github/workflows/deploy.yml` ya está subida y se encargará automáticamente de:
   - Instalar dependencias con Node.js 20.
   - Compilar la aplicación estática de Next.js (`npm run build`).
   - Publicar el contenido en:  
     👉 **`https://gerugo.github.io/Planeat/`**

> **¿Cómo funciona la IA en GitHub Pages sin servidor?**  
> Gracias a la arquitectura implementada en `src/services/geminiService.ts`, el SDK oficial `@google/genai` se ejecuta directamente en el navegador del cliente con la clave del usuario (o utilizando el generador inteligente de demostración precargado), sin necesidad de mantener ningún servidor Node.js activo.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Creado con ❤️ para optimizar la cesta de la compra y reducir el desperdicio alimentario en España.
