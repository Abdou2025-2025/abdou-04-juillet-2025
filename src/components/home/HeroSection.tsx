import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onCountdownClick: () => void;
}

export function HeroSection({ onCountdownClick }: HeroSectionProps) {
  return (
    <div className="text-center space-y-4">
      <Badge 
        className="bg-primary/10 text-primary border-primary/20 animate-pulse cursor-pointer"
        onClick={onCountdownClick}
      >
        🏆 Cérémonie dans 298 jours
      </Badge>
      
      <div>
        <h2 className="text-2xl font-bold text-gradient-gold mb-2">
          Votez pour votre favori
        </h2>
        <p className="text-muted-foreground">
          Découvrez les candidats au Ballon d'Or 2025 et participez aux votes de la communauté
        </p>
      </div>
    </div>
  );
}