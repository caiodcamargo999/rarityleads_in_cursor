import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
 
export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'pt'}, {locale: 'es'}, {locale: 'fr'}];
}
 
export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  let messages;
  try {
    messages = (await import(`../../i18n/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
