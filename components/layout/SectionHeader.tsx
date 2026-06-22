import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-8 sm:mb-10 md:mb-12",
        centered && "text-center mx-auto max-w-3xl",
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs sm:text-sm font-bold text-[#C8201A] uppercase tracking-wider mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2660] text-balance">
        {title}
      </h2>
      {description && (
        <p className={cn("text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed", centered && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
