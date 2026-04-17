import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/routing';
import '../../styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transformer Robotics™ | #1 Modular Dining Furniture',
  description: 'Shop the world\'s best modular dining furniture. Extendable dining tables, modular sectionals & more. Free Shipping.',
}
import { Be_Vietnam_Pro, Montserrat } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-montserrat'
});

import SplashScreen from '@/components/common/SplashScreen';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${beVietnamPro.variable} ${montserrat.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SplashScreen />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
