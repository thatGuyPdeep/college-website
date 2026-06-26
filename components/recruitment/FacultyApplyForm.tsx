"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitFacultyApplication } from "@/lib/actions/recruitment";
import type { Vacancy } from "@/lib/supabase/types";
import { DpdpConsent } from "@/components/legal/DpdpConsent";

interface Props {
  vacancy: Vacancy;
}

export function FacultyApplyForm({ vacancy }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", address: "",
    current_org: "", current_role: "",
    total_exp_years: 0, teaching_exp_years: 0,
    qualifications: "", specialization: "",
  });
  const [cvFile, setCvFile]       = useState<File | null>(null);
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [consent, setConsent]     = useState(false);

  function setField(k: string, v: string | number) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function uploadFile(file: File, fileType: string): Promise<string> {
    const fd = new FormData();
    fd.append("vacancy_id", vacancy.id);
    fd.append("file_type", fileType);
    fd.append("file", file);
    const res = await fetch("/api/recruitment/upload", { method: "POST", body: fd });
    const data = await res.json() as { file_path?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data.file_path!;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cvFile) { toast.error("Please upload your CV (PDF)"); return; }
    if (!consent) { toast.error("Please accept the privacy consent"); return; }
    setLoading(true);
    try {
      const cv_path = await uploadFile(cvFile, "cv");
      const cert_paths: string[] = [];
      for (let i = 0; i < certFiles.length; i++) {
        cert_paths.push(await uploadFile(certFiles[i], `cert-${i}`));
      }
      const result = await submitFacultyApplication(vacancy.id, form, { cv_path, cert_paths }, { dpdpConsent: true });
      if (!result.ok) { toast.error(result.error); return; }
      setSubmitted(true);
      toast.success("Application submitted successfully!");
      setTimeout(() => router.push("/careers/dashboard?submitted=1"), 2500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-green-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-[#0D2660]">Application Submitted</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Please <strong>do not reload this page</strong> until you are redirected to your dashboard.
          Your application status will appear there shortly.
        </p>
        <p className="text-xs text-gray-400">Redirecting to your careers dashboard…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" required value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" required value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="qualifications">Highest Qualification</Label>
          <Input id="qualifications" required value={form.qualifications} onChange={(e) => setField("qualifications", e.target.value)} className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" required value={form.address} onChange={(e) => setField("address", e.target.value)} className="mt-1.5" rows={2} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" required value={form.specialization} onChange={(e) => setField("specialization", e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="current_org">Current Organization</Label>
          <Input id="current_org" value={form.current_org} onChange={(e) => setField("current_org", e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="total_exp">Total Experience (years)</Label>
          <Input id="total_exp" type="number" min={0} required value={form.total_exp_years} onChange={(e) => setField("total_exp_years", Number(e.target.value))} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="teaching_exp">Teaching Experience (years)</Label>
          <Input id="teaching_exp" type="number" min={0} required value={form.teaching_exp_years} onChange={(e) => setField("teaching_exp_years", Number(e.target.value))} className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label htmlFor="cv">CV (PDF, max 5 MB)</Label>
        <Input id="cv" type="file" accept="application/pdf" required onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="certs">Certificates (PDF, optional)</Label>
        <Input id="certs" type="file" accept="application/pdf" multiple onChange={(e) => setCertFiles(Array.from(e.target.files ?? []))} className="mt-1.5" />
      </div>
      <DpdpConsent checked={consent} onChange={setConsent} id="faculty-dpdp-consent" />
      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !consent} className="bg-[#C8201A] hover:bg-[#9B1812] text-white flex-1">
          {loading ? "Submitting…" : "Submit Application"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/careers">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
