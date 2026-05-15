import { Search } from "lucide-react";
import { Input } from "../common/Input";

export function MenuFilters({ search, onSearch }: { search: string; onSearch: (value: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
      <Input className="pl-12" placeholder="Search for pizza, burgers, drinks..." value={search} onChange={(event) => onSearch(event.target.value)} />
    </div>
  );
}
