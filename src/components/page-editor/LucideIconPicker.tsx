import { icons, type LucideIcon } from "lucide-react";
import { ICON_OPTIONS } from "./blockTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LucideIconPickerProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export function getLucideIcon(name: string): LucideIcon | null {
  const icon = (icons as Record<string, LucideIcon>)[name];
  return icon || null;
}

export default function LucideIconPicker({ value, onChange, label = "Ícone" }: LucideIconPickerProps) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={value || "Sparkles"} onValueChange={onChange}>
        <SelectTrigger className="mt-1 text-xs h-8">
          <div className="flex items-center gap-2">
            {(() => { const I = getLucideIcon(value); return I ? <I className="w-3.5 h-3.5" /> : null; })()}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-popover z-50 max-h-60">
          {ICON_OPTIONS.map((name) => {
            const I = getLucideIcon(name);
            return (
              <SelectItem key={name} value={name}>
                <div className="flex items-center gap-2">
                  {I && <I className="w-3.5 h-3.5" />}
                  <span>{name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
