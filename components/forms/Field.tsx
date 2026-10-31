import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ---------- Small reusable field: label + input + error ---------- */
type FieldProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
};

export const Field = ({
  id,
  label,
  error,
  hint,
  rightSlot,
  ...inputProps
}: FieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`h-12 rounded-xl px-4 ${rightSlot ? "pr-12" : ""}`}
          {...inputProps}
        />
        {rightSlot}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
