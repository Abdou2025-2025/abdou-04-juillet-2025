import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, loading, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email || !password) {
      setFormError('Veuillez remplir tous les champs.');
      return;
    }
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setFormError(error);
      else onClose();
    } else {
      const { error } = await signUp(email, password);
      if (error) setFormError(error);
      else onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs mx-auto p-6 rounded-2xl bg-background border border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte pour commencer'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            required
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
          <Button type="submit" className="w-full btn-golden" disabled={loading}>
            {loading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'Créer un compte')}
          </Button>
        </form>
        <div className="text-center mt-4 text-sm">
          {mode === 'login' ? (
            <>
              Pas encore de compte ?{' '}
              <button className="text-primary underline" onClick={() => setMode('register')}>Créer un compte</button>
            </>
          ) : (
            <>
              Déjà inscrit ?{' '}
              <button className="text-primary underline" onClick={() => setMode('login')}>Se connecter</button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}