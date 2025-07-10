import { Button } from "@/components/ui/button";

interface PlayerFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "Tous les favoris", primary: true },
  { id: "attaquant", label: "Attaquants" },
  { id: "milieu", label: "Milieux" },
  { id: "defenseur", label: "Défenseurs" }
];

export function PlayerFilters({ selectedFilter, onFilterChange }: PlayerFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-4">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          size="sm"
          className={`whitespace-nowrap ${
            filter.primary ? "btn-golden" : ""
          } ${selectedFilter === filter.id ? "ring-2 ring-primary" : ""}`}
          variant={filter.primary ? "default" : "outline"}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}