"use client";

import { usePathname } from "next/navigation";
import { ShortlistAnnouncementTicker } from "@/components/marketing/ShortlistAnnouncementTicker";

export function ConditionalChrome({
  header,
  footer,
  chat,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  chat: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone =
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/mfa";

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <ShortlistAnnouncementTicker />
      {children}
      {footer}
      {chat}
    </>
  );
}
