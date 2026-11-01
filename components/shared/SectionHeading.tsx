import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  className?: string;
};

export default function SectionHeading({
  label,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-[560px]", className)}>
      <p className="text-[13px] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-primary">
        {label}
      </p>
      <h2 className="mb-3 mt-2 font-heading text-[28px] font-extrabold leading-[1.15] tracking-[-0.025em] sm:text-[32px] lg:text-[38px]">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-[1.6] text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
