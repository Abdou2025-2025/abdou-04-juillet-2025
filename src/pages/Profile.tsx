import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings, 
  Edit3, 
  Users, 
  Heart, 
  Trophy, 
  Bell, 
  Lock, 
  Trash2, 
  Flag, 
  Moon, 
  Sun,
  LogOut,
  Mail,
  Shield
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile(user?.id);
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || ''
  });
  const { toast } = useToast();

  useEffect(() => {
    setEditForm({
      username: profile?.username || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || ''
    });
  }, [profile]);

  // Synchronise le state avec la classe 'dark' sur <html> au chargement et lors des changements
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (stored === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      // Si aucune préférence, détecte la classe sur <html>
      setIsDark(document.documentElement.classList.contains('dark'));
    }
    // Écoute les changements de storage (autre onglet)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        if (e.newValue === 'dark') {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDark(false);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleSaveProfile = async () => {
    const { error } = await updateProfile(editForm);
    if (!error) {
      setEditingProfile(false);
      toast({
        title: 'Profil mis à jour !',
        description: 'Vos informations ont été sauvegardées.',
      });
    } else {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    toast({
      title: notifications ? "Notifications désactivées" : "Notifications activées",
      description: "Vos préférences ont été mises à jour.",
    });
  };

  const handleToggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
    
  };

  const handlePasswordChange = () => {
    toast({
      title: "Changement de mot de passe",
      description: "Un email vous sera envoyé pour modifier votre mot de passe.",
    });
  };

  const handleReportProblem = () => {
    const subject = encodeURIComponent("Signalement - Ballon d'Or 2025");
    const body = encodeURIComponent("Bonjour,\n\nJe souhaite signaler le problème suivant :\n\n[Décrivez votre problème]\n\nCordialement");
    window.open(`mailto:support@ballondor2025.com?subject=${subject}&body=${body}`);
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Suppression de compte",
      description: "Cette action nécessite une confirmation par email.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "À bientôt ! Vous avez été déconnecté.",
    });
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent("Demande d'aide - Ballon d'Or 2025");
    const body = encodeURIComponent("Bonjour,\n\nJ'ai besoin d'aide concernant :\n\n[Décrivez votre demande]\n\nCordialement");
    window.open(`mailto:support@ballondor2025.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-primary animate-float" />
            <h1 className="text-2xl font-bold text-gradient-gold">Profil</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleDarkMode}
              aria-label="Toggle dark mode"
              className="rounded-full hover:bg-muted transition ml-2"
            >
              {isDark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-zinc-500" />}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" aria-label="Paramètres">
                  <Settings className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="card-golden max-w-sm mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-gradient-gold">Paramètres</DialogTitle>
                  <DialogDescription>
                    Gérez vos préférences et paramètres de compte
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Switch checked={notifications} onCheckedChange={handleToggleNotifications} />
                  </div>
                  <Button variant="outline" className="w-full" onClick={handlePasswordChange}><Lock className="w-4 h-4 mr-2" />Changer le mot de passe</Button>
                  <Button variant="outline" className="w-full" onClick={handleContactSupport}><Mail className="w-4 h-4 mr-2" />Contacter le support</Button>
                  <Button variant="outline" className="w-full" onClick={handleReportProblem}><Flag className="w-4 h-4 mr-2" />Signaler un problème</Button>
                  <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}><Trash2 className="w-4 h-4 mr-2" />Supprimer le compte</Button>
                  <Button variant="ghost" className="w-full" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Déconnexion</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        <Card className="card-golden">
          <CardHeader className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || 'avatar'} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-gradient-gold">{profile?.username || 'Nouveau profil'}</h2>
            <p className="text-sm text-muted-foreground text-center">{profile?.bio || 'Aucune bio pour le moment.'}</p>
            <Button size="sm" variant="outline" onClick={() => setEditingProfile(true)}><Edit3 className="w-4 h-4 mr-2" />Éditer le profil</Button>
          </CardHeader>
        </Card>

        {/* Modale édition profil */}
        <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
          <DialogContent className="max-w-xs mx-auto">
            <DialogHeader>
              <DialogTitle>Éditer le profil</DialogTitle>
              <DialogDescription>
                Modifiez vos informations personnelles
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSaveProfile(); }}>
              <Input
                type="text"
                placeholder="Nom d'utilisateur"
                value={editForm.username}
                onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                required
                autoComplete="username"
              />
              <Textarea
                placeholder="Bio"
                value={editForm.bio}
                onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
              />
              <Input
                type="url"
                placeholder="URL de l'avatar"
                value={editForm.avatar_url}
                onChange={e => setEditForm(f => ({ ...f, avatar_url: e.target.value }))}
                autoComplete="photo"
              />
              <Button type="submit" className="w-full btn-golden">Sauvegarder</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Statistiques */}
        <Card className="card-golden">
          <CardHeader>
            <h3 className="font-semibold text-gradient-gold flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Mes statistiques
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">{user?.stats?.posts || 0}</div>
              <div className="text-xs text-muted-foreground">Publications</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">{user?.stats?.likes || 0}</div>
              <div className="text-xs text-muted-foreground">J'aime reçus</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">{user?.stats?.votes || 0}</div>
              <div className="text-xs text-muted-foreground">Votes</div>
            </div>
          </CardContent>
        </Card>

        {/* Mes favoris */}
        <Card className="card-golden">
          <CardHeader>
            <h3 className="font-semibold text-gradient-gold flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Mes favoris Ballon d'Or
            </h3>
          </CardHeader>
          <CardContent className="space-y-2">
            {user?.favorites?.map((favorite, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">{favorite}</span>
                <Badge className="bg-primary/10 text-primary">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mes abonnements */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-golden cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => toast({title: "Followers", description: "Liste de vos abonnés (fonctionnalité à venir)"})}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Followers</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Voir qui vous suit
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-golden cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => toast({title: "Suivi", description: "Liste des personnes que vous suivez (fonctionnalité à venir)"})}>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Suivi</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Personnes suivies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact admin */}
        <Card className="card-golden">
          <CardContent className="p-4 text-center space-y-3">
            <Shield className="w-12 h-12 text-primary mx-auto animate-glow" />
            <h3 className="font-bold text-gradient-gold">
              Besoin d'aide ?
            </h3>
            <p className="text-sm text-muted-foreground">
              Contactez notre équipe support pour toute question
            </p>
            <Button className="btn-golden w-full" onClick={handleContactSupport}>
              <Mail className="w-4 h-4 mr-2" />
              Contacter le support
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}