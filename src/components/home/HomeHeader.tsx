import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import ballonDorIcon from "@/assets/ballon-dor-icon.png";

interface HomeHeaderProps {
  unreadCount: number;
  onNotificationClick: () => void;
}

export function HomeHeader({ unreadCount, onNotificationClick }: HomeHeaderProps) {
  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
      <div className="flex items-center justify-between p-3 max-w-[320px] mx-auto">
        <div className="flex items-center gap-2">
          <img 
            src={ballonDorIcon} 
            alt="Ballon d'Or" 
            className="w-8 h-8 animate-float"
          />
          <div>
            <h1 className="text-gradient-gold font-bold text-base">Ballon d'Or</h1>
            <p className="text-xs text-muted-foreground">2025</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="relative" 
            onClick={onNotificationClick}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-bold">
                  {unreadCount}
                </span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}