import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trophy } from "lucide-react";

interface CountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CountdownModal = ({ isOpen, onClose }: CountdownModalProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Date de la cérémonie du Ballon d'Or 2025 (personnalisable)
  const ceremonyDate = new Date('2025-10-30T20:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = ceremonyDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-golden max-w-sm mx-auto animate-scale-in">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-glow">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-gradient-gold text-xl font-bold">
            Ballon d'Or 2025
          </DialogTitle>
          <DialogDescription>
            Compte à rebours jusqu'à la cérémonie officielle
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Cérémonie officielle</span>
            </div>
            <div className="text-sm text-muted-foreground mb-2">30 Octobre 2025, 20h00</div>
            
            <div className="grid grid-cols-4 gap-2 mt-6">
              {[
                { label: "Jours", value: timeLeft.days },
                { label: "Heures", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="bg-muted rounded-lg p-3 mb-1">
                    <div className="text-xl font-bold text-gradient-gold">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Votes ouverts</div>
                <div className="text-xs text-muted-foreground">Votez pour votre favori dès maintenant</div>
              </div>
            </div>
          </div>

          <Button 
            onClick={onClose} 
            className="btn-golden w-full"
          >
            Découvrir les favoris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};