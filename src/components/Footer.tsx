import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 mx-auto px-6 py-8 text-center bg-ayurGreen/10 dark:bg-gray-800 text-gray-700 dark:text-gray-300 relative z-10">
      <p>{t('footerText', { defaultValue: '© 2025 AyurVibe. All rights reserved. Embrace a natural lifestyle.' })}</p>
    </footer>
  );
};

export default Footer;