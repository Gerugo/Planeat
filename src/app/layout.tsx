import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WhippES | Planificador Semanal & Desperdicio Cero (Mercadona, Aldi, Lidl...)',
  description:
    'Planifica tus comidas de la semana con IA optimizada para supermercados españoles. Desperdicio Cero, recetas rápidas de batch-cooking y lista de la compra organizada por pasillos.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WhippES',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full scroll-smooth">
      <body className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
