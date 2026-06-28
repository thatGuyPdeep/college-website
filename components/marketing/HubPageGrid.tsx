import Link from "next/link";

type HubItem = {
  label: string;
  href: string;
  description?: string;
};

export function HubPageGrid({ items }: { items: readonly HubItem[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group rounded-xl border border-blue-100 bg-white p-5 shadow-sm hover:border-[#0D2660]/30 hover:shadow-md transition-all"
        >
          <h2 className="font-semibold text-[#0D2660] group-hover:text-[#C8201A] transition-colors">
            {item.label}
          </h2>
          {item.description && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
          )}
          <span className="inline-block mt-3 text-xs font-semibold text-[#C8201A]">Explore →</span>
        </Link>
      ))}
    </div>
  );
}
