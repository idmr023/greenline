import { useState, useEffect } from 'react';
import { ArrowUp } from '../lib/icons';
import FloatingActionButton from './ui/general/FloatingActionButton';

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <FloatingActionButton
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      icon={<ArrowUp className="w-6 h-6" />}
      ariaLabel="Volver arriba"
      visible={visible}
      className="bottom-24 z-40"
    />
  );
}