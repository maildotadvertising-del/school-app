import type { ReactNode } from "react";
import { TopBar, BottomNav } from "@ats/ui";
import PushInit from "@/components/PushInit";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/homework", label: "Home Work" },
  { href: "/chat", label: "Chat" },
  { href: "/profile", label: "Profile" },
];

export function Shell({
  title,
  subtitle,
  active,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  active: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex-1 pb-24">
      <PushInit />
      <TopBar title={title} subtitle={subtitle} right={right} />
      <div className="px-4 mt-4">{children}</div>
      <BottomNav items={NAV_ITEMS.map((i) => ({ ...i, active: i.href === active }))} />
    </div>
  );
}
