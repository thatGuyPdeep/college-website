"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAuditLogsCsv } from "@/lib/actions/admin-audit";

export function AuditExportButton() {
  const [pending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const res = await exportAuditLogsCsv();
      if (!res.ok) { toast.error(res.error); return; }
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Audit log exported");
    });
  }

  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={handleExport}>
      <Download className="h-4 w-4 mr-1" /> Export CSV
    </Button>
  );
}
