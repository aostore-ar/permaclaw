import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExperimentSelectorProps {
  experiments: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function ExperimentSelector({ experiments, selected, onSelect }: ExperimentSelectorProps) {
  return (
    <Select value={selected} onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by experiment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All experiments</SelectItem>
        {experiments.map(exp => (
          <SelectItem key={exp} value={exp}>
            {exp}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}