import type { ReactNode } from "react";

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card p-4 mb-3 ${className}`}>{children}</div>;
}

export function Tag({ children, color = "purple" }: { children: ReactNode; color?: "purple" | "orange" }) {
  return (
    <span className={`tag-${color} inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-2`}>
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`btn-primary rounded-2xl px-4 py-2.5 font-semibold ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function TopBar({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="glass-topbar flex items-center justify-between p-4 mx-4 mt-4">
      <div>
        {subtitle && <div className="text-xs text-[var(--ats-muted)]">{subtitle}</div>}
        <div className="text-lg font-bold text-[var(--ats-ink)]">{title}</div>
      </div>
      {right}
    </div>
  );
}

export function BottomNav({ items }: { items: { href: string; label: string; active?: boolean }[] }) {
  return (
    <div className="glass-nav fixed bottom-4 left-4 right-4 flex justify-around items-center h-16 max-w-md mx-auto">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`text-xs font-semibold px-3 py-2 rounded-xl ${
            item.active ? "btn-primary" : "text-[var(--ats-muted)]"
          }`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
