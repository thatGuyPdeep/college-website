export type DashboardWidget = {
  label: string;
  value: string;
  href: string;
  color: string;
  group:
    | "admissions"
    | "recruitment"
    | "contact"
    | "payments"
    | "content"
    | "erp"
    | "examination"
    | "iqac"
    | "compliance";
};

export type AdminDashboardData = {
  widgets: DashboardWidget[];
  role: import("@/lib/supabase/types").UserRole;
  openTasks: number;
  unreadNotifications: number;
};
