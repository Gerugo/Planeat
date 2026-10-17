import { SupermarketConfig, SupermarketId, AisleType } from '@/types/whipp';

export const SUPERMARKETS: Record<SupermarketId, SupermarketConfig> = {
  mercadona: {
    id: 'mercadona',
    name: 'Mercadona',
    brand: 'Hacendado',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentColor: '#00875A',
    logoInitial: 'M',
    description: 'Líder en España con marca blanca Hacendado, envases estandarizados familiares.',
  },
  aldi: {
    id: 'aldi',
    name: 'Aldi',
    brand: 'GutBio / Milsani',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    accentColor: '#002B49',
    logoInitial: 'A',
    description: 'Enfoque en ecológico (GutBio) y lácteos de calidad (Milsani/El Horno).',
  },
  lidl: {
    id: 'lidl',
    name: 'Lidl',
    brand: 'Milbona / Chef Select',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    accentColor: '#0050AA',
    logoInitial: 'L',
    description: 'Excelente relación calidad-precio en lácteos (Milbona) y preparados frescos.',
  },
  carrefour: {
    id: 'carrefour',
    name: 'Carrefour',
    brand: 'Carrefour Classic / BIO',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    accentColor: '#004E98',
    logoInitial: 'C',
    description: 'Gran variedad de formatos a granel y línea BIO certificada.',
  },
  consum: {
    id: 'consum',
    name: 'Consum',
    brand: 'Consum / Eco',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    accentColor: '#FF6F00',
    logoInitial: 'Co',
    description: 'Frescos de cercanía, cooperativa con excelentes productos de huerta mediterránea.',
  },
  dia: {
    id: 'dia',
    name: 'Dia',
    brand: 'Dia / Al Punto',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    accentColor: '#D32F2F',
    logoInitial: 'D',
    description: 'Precios económicos de proximidad con marcas Dia y selección Al Punto.',
  },
};

export const AISLE_LABELS: Record<AisleType, { label: string; icon: string }> = {
  'fruta-verdura': { label: 'Fruta y Verdura', icon: 'Apple' },
  'carniceria-pescaderia': { label: 'Carnicería y Pescadería', icon: 'Beef' },
  'lacteos-huevos': { label: 'Lácteos y Huevos', icon: 'Egg' },
  'despensa': { label: 'Despensa y Básicos', icon: 'Package' },
  'congelados': { label: 'Congelados', icon: 'Snowflake' },
  'panaderia': { label: 'Panadería y Cereales', icon: 'Croissant' },
};

export const COMMON_PANTRY_ITEMS = [
  'Aceite de oliva virgen extra (AOVE)',
  'Sal fina y gruesa',
  'Pimienta negra molida',
  'Ajo en dientes',
  'Cebollas',
  'Orégano seco',
  'Pimentón dulce de la Vera',
  'Arroz redondo',
  'Pasta básica (espaguetis/macarrones)',
  'Vinagre de manzana o jerez',
  'Harina de trigo / maicena',
  'Salsa de soja baja en sal',
];
