import type { ReactNode } from "react";
import { TopBar, BottomNav } from "@ats/ui";
import { logout } from "@/app/logout/actions";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/homework", label: "Homework" },
  { href: "/chat", label: "Chat" },
];

export function Shell({
  title,
  subtitle,
  active,
  children,
}: {
  title: string;
  subtitle?: string;
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="flex-1 pb-24">
      <TopBar
        title={title}
        subtitle={subtitle}
        right={
          <form action={logout}>
            <button className="text-xs font-semibold text-[var(--ats-muted)]">Logout</button>
          </form>
        }
      />
      <div className="px-4 mt-4">{children}</div>
      <BottomNav items={NAV_ITEMS.map((i) => ({ ...i, active: i.href === active }))} />
    </div>
  );
}
