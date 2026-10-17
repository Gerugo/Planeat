import { Supermarket, SupermarketId } from '@/types/whipp';

export const SUPERMARKETS: Record<SupermarketId, Supermarket> = {
  mercadona: {
    id: 'mercadona',
    name: 'Mercadona',
    brandName: 'Hacendado',
    color: '#00875A',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    strengths: ['Marca Hacendado', 'Bandejas familiares estandarizadas', 'Frescos limpios'],
  },
  aldi: {
    id: 'aldi',
    name: 'Aldi',
    brandName: 'GutBio / Milsani',
    color: '#002B49',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    strengths: ['Línea ecológica GutBio', 'Lácteos Milsani', 'Ofertas semanales'],
  },
  lidl: {
    id: 'lidl',
    name: 'Lidl',
    brandName: 'Milbona / Chef Select',
    color: '#0050AA',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    strengths: ['Lácteos Milbona', 'Panadería recién horneada', 'Precios imbatibles'],
  },
  carrefour: {
    id: 'carrefour',
    name: 'Carrefour',
    brandName: 'Carrefour Classic / BIO',
    color: '#004E98',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    strengths: ['Variedad de formatos al peso', 'Gama BIO certificada', 'Descuentos'],
  },
  dia: {
    id: 'dia',
    name: 'Dia',
    brandName: 'Dia / Al Punto',
    color: '#D32F2F',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    strengths: ['Supermercado de barrio', 'Gama Al Punto', 'Ahorro diario'],
  },
  consum: {
    id: 'consum',
    name: 'Consum',
    brandName: 'Consum / Eco',
    color: '#FF6F00',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    strengths: ['Frescos de la huerta mediterránea', 'Charcutería al corte', 'Cooperativa local'],
  },
};

export const COMMON_PANTRY_ITEMS = [
  'Aceite de oliva virgen extra (AOVE)',
  'Sal fina y sal gruesa',
  'Pimienta negra molida',
  'Dientes de ajo',
  'Cebollas',
  'Orégano seco',
  'Pimentón dulce de la Vera',
  'Arroz redondo',
  'Pasta básica',
  'Vinagre de manzana o jerez',
  'Salsa de soja',
];
