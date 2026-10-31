/* ---------- Password strength ---------- */
const STRENGTH_LEVELS = [
  { label: "Weak", bar: "bg-[#DC2626] dark:bg-[#F87171]" },
  { label: "Fair", bar: "bg-[#D97706] dark:bg-[#FBBF24]" },
  { label: "Good", bar: "bg-[#2563EB] dark:bg-[#60A5FA]" },
  { label: "Strong", bar: "bg-[#16A34A] dark:bg-[#4ADE80]" },
];

/* Returns 0 (Week) to 3 (Strong) */
const getStrengthLevel = (password: string) => {
  const points = [
    password.length >= 6,
    password.length >= 10,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (points <= 1) return 0;
  if (points === 2) return 1;
  if (points === 3) return 2;
  return 3;
};

const PasswordStrength = ({ password }: { password: string }) => {
  const level = getStrengthLevel(password);
  const selectedLevel = STRENGTH_LEVELS[level];
  const label = selectedLevel.label;
  return (
    <div aria-live="polite" className="flex flex-col gap-1.5">
      <div className="flex gap-1.5" aria-hidden>
        {STRENGTH_LEVELS.map((item, index) => (
          <span
            key={item.label}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              index <= level ? item.bar : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Password strength:{" "}
        <span className="font-semibold text-foreground">{label}</span>
      </p>
    </div>
  );
};

export default PasswordStrength;
