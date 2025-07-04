import { useState } from 'react';
import ballonDorIcon from '@/assets/ballon-dor-icon.png';
import { AuthModal } from '@/components/ui/AuthModal';

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl shadow-2xl bg-white/80 border border-yellow-300">
        <img src={ballonDorIcon} alt="Ballon d'Or" className="w-20 h-20 mb-2 animate-float" />
        <h1 className="text-4xl font-extrabold text-gradient-gold mb-2 text-center">Ballon d'Or Pulse</h1>
        <p className="text-lg text-yellow-900 text-center max-w-md">
          Rejoignez la communauté, votez pour vos joueurs favoris, partagez vos avis et vivez la course au Ballon d'Or 2025 en temps réel !
        </p>
        <button
          className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg shadow-lg hover:scale-105 transition"
          onClick={() => setShowAuth(true)}
        >
          Commencer
        </button>
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
} 