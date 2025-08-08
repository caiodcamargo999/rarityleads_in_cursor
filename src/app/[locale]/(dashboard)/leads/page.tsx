import { LeadInputForm } from '@/components/leads/LeadInputForm';
import { useTranslations } from 'next-intl';

export default function LeadsPage() {
  const t = useTranslations('leads');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-6">{t('title')}</h1>
      <p className="text-gray-400 mb-8">{t('description')}</p>
      <LeadInputForm />
    </div>
  );
}
