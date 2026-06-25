import { cn } from "@/lib/utils";

export function AdminPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-blue-100/80 bg-white shadow-sm overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-blue-50 bg-gradient-to-r from-[#F8FAFC] to-white">
        <div>
          <h2 className="font-semibold text-[#0D2660]">{title}</h2>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
