import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const PageUpButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full bg-ayurGreen text-white shadow-lg z-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'} hover:bg-ayurGreen/90`}
      aria-label="Scroll to top"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};

export default PageUpButton;