import { Button } from "@/components/ui/button";

interface CallToActionProps {
  onExploreClick: () => void;
}

export function CallToAction({ onExploreClick }: CallToActionProps) {
  return (
    <div className="bg-gradient-to-r from-muted to-card p-6 rounded-2xl text-center space-y-4 border border-border/50">
      <h3 className="text-xl font-bold text-gradient-gold">
        Votre vote compte !
      </h3>
      <p className="text-sm text-muted-foreground">
        Rejoignez des milliers de fans et votez pour le prochain Ballon d'Or
      </p>
      <Button className="btn-golden w-full" onClick={onExploreClick}>
        Découvrir tous les candidats
      </Button>
    </div>
  );
}