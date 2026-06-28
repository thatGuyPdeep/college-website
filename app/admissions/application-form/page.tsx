"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle, ChevronLeft, ChevronRight,
  Upload, FileText, Loader2, Download, LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { personalDetailsSchema, type PersonalDetails } from "@/lib/validation/application";
import { REQUIRED_DOCUMENTS } from "@/lib/utils/constants";
import { academicFromUnknown, EMPTY_ACADEMIC } from "@/lib/admissions/helpers";
import { toast } from "sonner";
import {
  createOrResumeDraft,
  savePersonalStep,
  saveAcademicStep,
  saveProgramStep,
  saveDocumentsStep,
  recordDocumentUploaded,
  submitApplication,
  getActivePrograms,
} from "@/lib/actions/admissions";
import type { Application, AcademicData } from "@/lib/supabase/types";
import { DpdpConsent } from "@/components/legal/DpdpConsent";
import { AdmissionPaymentStep } from "@/components/admissions/AdmissionPaymentStep";
import { getPaymentConfig, isApplicationPaid } from "@/lib/actions/payments";

const STEPS = [
  { id: 1, label: "Personal"  },
  { id: 2, label: "Academic"  },
  { id: 3, label: "Programme" },
  { id: 4, label: "Documents" },
  { id: 5, label: "Review"    },
];

type ProgramOption = { id: string; name: string; level: string };
type DocUploadState = "pending" | "uploading" | "uploaded" | "error";

function clampStep(n: number) {
  return Math.min(Math.max(n, 1), 5);
}

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep]               = useState(1);
  const [app, setApp]                 = useState<Application | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [authError, setAuthError]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [submittedNo, setSubmittedNo] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentAmount, setPaymentAmount]   = useState(0);
  const [paymentKeyId, setPaymentKeyId]     = useState<string | null>(null);
  const [feePaid, setFeePaid]               = useState(false);
  const [docStates, setDocStates]     = useState<Record<string, DocUploadState>>({});
  const [programs, setPrograms]       = useState<ProgramOption[]>([]);
  const [academic, setAcademic]       = useState<AcademicData>({ ...EMPTY_ACADEMIC });
  const [selectedProgram, setSelectedProgram] = useState<{ id: string; name: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<PersonalDetails>({
    resolver: zodResolver(personalDetailsSchema),
  });

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  // ── INIT ────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [draftResult, programsResult] = await Promise.all([
        createOrResumeDraft(),
        getActivePrograms(),
      ]);

      if (programsResult.ok) setPrograms(programsResult.data);

      if (!draftResult.ok) {
        setAuthError(true);
        setInitLoading(false);
        return;
      }

      const draft = draftResult.data;
      setApp(draft);
      setStep(clampStep(draft.current_step ?? 1));

      const savedPersonal = draft.personal_data as PersonalDetails | null;
      if (savedPersonal?.full_name) reset(savedPersonal);

      setAcademic(academicFromUnknown(draft.academic_data));

      const pd = draft.program_data as { program_id?: string; program_name?: string } | null;
      if (pd?.program_id && pd?.program_name) {
        setSelectedProgram({ id: pd.program_id, name: pd.program_name });
      }

      const cl = draft.docs_checklist;
      if (cl) {
        const ds: Record<string, DocUploadState> = {};
        Object.entries(cl).forEach(([k, v]) => {
          if (v.status === "submitted" || v.status === "approved") ds[k] = "uploaded";
        });
        setDocStates(ds);
      }

      if ((draft.current_step ?? 1) > 1) {
        toast.info("Draft resumed — your previous progress is restored.");
      }
      setInitLoading(false);
    })();
  }, [reset]);

  useEffect(() => {
    if (step !== 5 || !app?.id) return;
    (async () => {
      const cfg = await getPaymentConfig();
      setPaymentRequired(cfg.required);
      setPaymentAmount(cfg.amount);
      setPaymentKeyId(cfg.keyId);
      if (!cfg.required) {
        setFeePaid(true);
        return;
      }
      const paid = await isApplicationPaid(app.id);
      if (paid.ok) setFeePaid(paid.data);
    })();
  }, [step, app?.id]);

  // ── AUTOSAVE ────────────────────────────────────────────────────
  const autosave = useCallback(async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setSaving(true);
    const res = await fn();
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return false;
    }
    return true;
  }, []);

  function patchAcademic(path: keyof AcademicData | "tenth" | "twelfth", field: string, value: string) {
    setAcademic((prev) => {
      if (path === "tenth" || path === "twelfth") {
        return { ...prev, [path]: { ...prev[path], [field]: value } };
      }
      return { ...prev, [path]: value };
    });
  }

  // ── STEP HANDLERS ───────────────────────────────────────────────
  async function onStep1Submit(data: PersonalDetails) {
    if (!app) return;
    const ok = await autosave(() => savePersonalStep(app.id, data));
    if (ok) setStep(2);
  }

  async function goStep3() {
    if (!app) return;
    if (!academic.tenth.board.trim() || !academic.tenth.year.trim()) {
      toast.error("10th board and year of passing are required");
      return;
    }
    const ok = await autosave(() => saveAcademicStep(app.id, academic));
    if (ok) setStep(3);
  }

  async function goStep4() {
    if (!app || !selectedProgram) {
      toast.error("Please select a programme");
      return;
    }
    const ok = await autosave(() =>
      saveProgramStep(app.id, { program_id: selectedProgram.id, program_name: selectedProgram.name })
    );
    if (ok) setStep(4);
  }

  async function goStep5() {
    if (!app) return;
    const ok = await autosave(() => saveDocumentsStep(app.id));
    if (ok) setStep(5);
  }

  async function handleFileChange(docType: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !app) return;

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) { toast.error("Only PDF, JPG, PNG allowed"); return; }
    if (file.size > 5 * 1024 * 1024)  { toast.error("File must be under 5 MB"); return; }

    setDocStates((s) => ({ ...s, [docType]: "uploading" }));

    try {
      const formData = new FormData();
      formData.append("application_id", app.id);
      formData.append("doc_type", docType);
      formData.append("file", file);

      const res = await fetch("/api/admissions/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Upload failed");
      }

      const { file_path } = await res.json() as { file_path: string };
      const recorded = await recordDocumentUploaded(app.id, docType, file_path);
      if (!recorded.ok) throw new Error(recorded.error);

      setDocStates((s) => ({ ...s, [docType]: "uploaded" }));
      toast.success(`${docType.replace(/_/g, " ")} uploaded`);
    } catch (err) {
      setDocStates((s) => ({ ...s, [docType]: "error" }));
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
    e.target.value = "";
  }

  async function handleFinalSubmit() {
    if (!app) return;
    if (!dpdpConsent) {
      toast.error("Please accept the privacy consent to submit");
      return;
    }
    setSubmitting(true);
    try {
      // Sync latest data to DB before submit
      const personal = getValues();
      if (personal.full_name) await savePersonalStep(app.id, personal);
      await saveAcademicStep(app.id, academic);
      if (selectedProgram) {
        await saveProgramStep(app.id, {
          program_id:   selectedProgram.id,
          program_name: selectedProgram.name,
        });
      }

      const result = await submitApplication(app.id, { dpdpConsent: true });
      if (result.ok) {
        setSubmittedNo(result.data.application_no);
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ── LOADING ─────────────────────────────────────────────────────
  if (initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0D2660] mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your application…</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-blue-100 shadow-md p-10 text-center">
          <LogIn className="h-12 w-12 text-[#0D2660] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[#0D2660] mb-2">Sign in to apply</h1>
          <p className="text-sm text-gray-500 mb-6">You need to log in before starting your admission application.</p>
          <Button
            className="bg-[#0D2660] hover:bg-[#071540] text-white w-full"
            onClick={() => router.push("/login?redirect=/admissions/application-form")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-blue-100 shadow-md p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Application Submitted!</h1>
          <p className="text-gray-500 mb-1 text-sm">Your application reference:</p>
          <p className="text-xl font-bold text-[#C8201A] mb-4">{submittedNo}</p>
          <p className="text-sm text-gray-500 mb-7">A confirmation email has been sent. Track your status in the dashboard.</p>
          <div className="flex flex-col gap-3">
            <Button asChild className="bg-[#0D2660] hover:bg-[#071540] text-white">
              <a href="/admissions/dashboard">Track Application</a>
            </Button>
            <Button asChild variant="outline" className="border-[#0D2660] text-[#0D2660] gap-2">
              <a href={`/api/admissions/pdf?id=${app?.id}`} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" /> Download Admission Form
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const personal = getValues();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2">
          <li><a href="/" className="hover:text-[#0D2660]">Home</a></li>
          <li>/</li>
          <li aria-current="page" className="text-[#0D2660] font-medium">Apply</li>
        </ol>
      </nav>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#0D2660]">Admission Application 2026–27</h1>
          {app?.application_no && (
            <p className="text-sm text-[#C8201A] font-semibold mt-0.5">Ref: {app.application_no}</p>
          )}
        </div>
        {saving && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
          </div>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-8">Progress is saved automatically at each step.</p>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Step {step} of {STEPS.length}: {STEPS[step - 1].label}</span>
          <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-3">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                s.id < step ? "bg-green-500 text-white" : s.id === step ? "bg-[#0D2660] text-white" : "bg-gray-200 text-gray-400"
              }`}>
                {s.id < step ? <CheckCircle className="h-4 w-4" /> : s.id}
              </div>
              <span className="text-[10px] text-gray-400 hidden md:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-8">

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSubmit(onStep1Submit)} aria-label="Personal details">
            <h2 className="text-lg font-bold text-[#0D2660] mb-6">Personal Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Label htmlFor="full_name">Full Name <span className="text-[#C8201A]">*</span></Label>
                <Input id="full_name" {...register("full_name")} placeholder="As per certificate" className="mt-1.5" />
                {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email <span className="text-[#C8201A]">*</span></Label>
                <Input id="email" type="email" {...register("email")} className="mt-1.5" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone <span className="text-[#C8201A]">*</span></Label>
                <Input id="phone" {...register("phone")} placeholder="+91 XXXXX XXXXX" className="mt-1.5" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth <span className="text-[#C8201A]">*</span></Label>
                <Input id="dob" type="date" {...register("dob")} className="mt-1.5" />
                {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob.message}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Gender <span className="text-[#C8201A]">*</span></Label>
                <select id="gender" {...register("gender")} className="mt-1.5 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2660]">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
              </div>
              <div>
                <Label htmlFor="category">Category <span className="text-[#C8201A]">*</span></Label>
                <select id="category" {...register("category")} className="mt-1.5 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2660]">
                  <option value="">Select</option>
                  {[["general","General"],["obc","OBC"],["sc","SC"],["st","ST"],["ews","EWS"],["other","Other"]].map(([v,l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address <span className="text-[#C8201A]">*</span></Label>
                <Input id="address" {...register("address")} className="mt-1.5" />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="city">City <span className="text-[#C8201A]">*</span></Label>
                <Input id="city" {...register("city")} className="mt-1.5" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="state">State <span className="text-[#C8201A]">*</span></Label>
                <Input id="state" {...register("state")} className="mt-1.5" />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <Label htmlFor="pincode">Pincode <span className="text-[#C8201A]">*</span></Label>
                <Input id="pincode" {...register("pincode")} maxLength={6} className="mt-1.5" />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <Button type="submit" className="bg-[#0D2660] hover:bg-[#071540] text-white">
                Next: Academic History <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-[#0D2660] mb-6">Academic History</h2>
            <div className="space-y-5">
              <div className="border border-blue-100 rounded-xl p-5">
                <h3 className="font-semibold text-[#0D2660] mb-4 text-sm">10th Standard <span className="text-[#C8201A]">*</span></h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Board</Label><Input value={academic.tenth.board} onChange={(e) => patchAcademic("tenth", "board", e.target.value)} className="mt-1.5" /></div>
                  <div><Label>School Name</Label><Input value={academic.tenth.school} onChange={(e) => patchAcademic("tenth", "school", e.target.value)} className="mt-1.5" /></div>
                  <div><Label>Year of Passing</Label><Input value={academic.tenth.year} onChange={(e) => patchAcademic("tenth", "year", e.target.value)} className="mt-1.5" /></div>
                  <div><Label>Percentage / CGPA</Label><Input value={academic.tenth.percentage} onChange={(e) => patchAcademic("tenth", "percentage", e.target.value)} className="mt-1.5" /></div>
                </div>
              </div>
              <div className="border border-blue-100 rounded-xl p-5">
                <h3 className="font-semibold text-[#0D2660] mb-4 text-sm">12th Standard / Diploma</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Board</Label><Input value={academic.twelfth.board} onChange={(e) => patchAcademic("twelfth", "board", e.target.value)} className="mt-1.5" /></div>
                  <div><Label>School / College</Label><Input value={academic.twelfth.school} onChange={(e) => patchAcademic("twelfth", "school", e.target.value)} className="mt-1.5" /></div>
                  <div><Label>Year of Passing</Label><Input value={academic.twelfth.year} onChange={(e) => patchAcademic("twelfth", "year", e.target.value)} className="mt-1.5" /></div>
                  <div><Label>Percentage / CGPA</Label><Input value={academic.twelfth.percentage} onChange={(e) => patchAcademic("twelfth", "percentage", e.target.value)} className="mt-1.5" /></div>
                </div>
              </div>
              <div className="border border-blue-100 rounded-xl p-5">
                <h3 className="font-semibold text-[#0D2660] mb-4 text-sm">Entrance Exam (optional)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Exam Name</Label><Input value={academic.entrance_exam ?? ""} onChange={(e) => patchAcademic("entrance_exam", "", e.target.value)} className="mt-1.5" /></div>
                  <div><Label>Score / Rank</Label><Input value={academic.entrance_score ?? ""} onChange={(e) => patchAcademic("entrance_score", "", e.target.value)} className="mt-1.5" /></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
              <Button className="bg-[#0D2660] hover:bg-[#071540] text-white" onClick={goStep3}>
                Next: Programme <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-[#0D2660] mb-6">Programme Choice</h2>
            <div className="space-y-3">
              {programs.length === 0 ? (
                <p className="text-sm text-amber-600">No programmes available. Please contact the admissions office.</p>
              ) : (
                programs.map((p) => (
                  <label key={p.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedProgram?.id === p.id ? "border-[#0D2660] bg-blue-50" : "border-gray-200 hover:border-blue-300"
                  }`}>
                    <input type="radio" name="program" checked={selectedProgram?.id === p.id}
                      onChange={() => setSelectedProgram({ id: p.id, name: p.name })} className="accent-[#0D2660]" />
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  </label>
                ))
              )}
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(2)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
              <Button className="bg-[#0D2660] hover:bg-[#071540] text-white" onClick={goStep4}>
                Next: Documents <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold text-[#0D2660] mb-2">Upload Documents</h2>
            <p className="text-sm text-gray-400 mb-6">All documents are required. PDF, JPG, or PNG — max 5 MB each.</p>
            <div className="space-y-3">
              {REQUIRED_DOCUMENTS.map((doc) => {
                const state = docStates[doc.type] ?? "pending";
                return (
                  <div key={doc.type} className={`flex items-center justify-between p-4 rounded-xl border ${
                    state === "uploaded" ? "bg-green-50 border-green-300" :
                    state === "error" ? "bg-red-50 border-red-300" :
                    state === "uploading" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <FileText className={`h-5 w-5 ${state === "uploaded" ? "text-green-600" : state === "error" ? "text-red-500" : "text-gray-400"}`} />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{doc.label}</div>
                        <Badge variant="outline" className={`text-xs mt-0.5 ${
                          state === "uploaded" ? "text-green-700 border-green-400" :
                          state === "error" ? "text-red-700 border-red-400" :
                          state === "uploading" ? "text-blue-700 border-blue-400" : "text-amber-700 border-amber-400"
                        }`}>
                          {state === "uploading" ? "Uploading…" : state.charAt(0).toUpperCase() + state.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                        disabled={state === "uploading"} onChange={(e) => handleFileChange(doc.type, e)} />
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium ${
                        state === "uploading" ? "opacity-50 cursor-not-allowed" : "border-gray-300 hover:bg-gray-50"
                      }`}>
                        {state === "uploading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        {state === "uploaded" ? "Replace" : "Upload"}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(3)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
              <Button className="bg-[#0D2660] hover:bg-[#071540] text-white" onClick={goStep5}>
                Next: Review <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5 — REVIEW */}
        {step === 5 && (
          <div>
            <h2 className="text-lg font-bold text-[#0D2660] mb-6">Review Your Application</h2>
            <div className="space-y-4">
              <div className="border border-blue-100 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#0D2660] text-sm">Personal Details</h3>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-[#C8201A] hover:underline">Edit</button>
                </div>
                <dl className="space-y-1 text-sm">
                  {[["Name", personal.full_name], ["Email", personal.email], ["Phone", personal.phone],
                    ["DOB", personal.dob], ["Category", personal.category],
                    ["Address", `${personal.address}, ${personal.city}, ${personal.state} - ${personal.pincode}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-gray-400 shrink-0">{k}</dt>
                      <dd className="font-medium text-gray-800 text-right">{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="border border-blue-100 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#0D2660] text-sm">Academic History</h3>
                  <button type="button" onClick={() => setStep(2)} className="text-xs text-[#C8201A] hover:underline">Edit</button>
                </div>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-400">10th</dt><dd className="font-medium">{academic.tenth.board} — {academic.tenth.year} ({academic.tenth.percentage}%)</dd></div>
                  {academic.twelfth.board && (
                    <div className="flex justify-between"><dt className="text-gray-400">12th</dt><dd className="font-medium">{academic.twelfth.board} — {academic.twelfth.year}</dd></div>
                  )}
                  {academic.entrance_exam && (
                    <div className="flex justify-between"><dt className="text-gray-400">Entrance</dt><dd className="font-medium">{academic.entrance_exam} — {academic.entrance_score}</dd></div>
                  )}
                </dl>
              </div>

              <div className="border border-blue-100 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#0D2660] text-sm">Programme</h3>
                  <button type="button" onClick={() => setStep(3)} className="text-xs text-[#C8201A] hover:underline">Edit</button>
                </div>
                <p className="text-sm font-medium text-gray-800">{selectedProgram?.name ?? "—"}</p>
              </div>

              <div className="border border-blue-100 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-[#0D2660] text-sm">Documents</h3>
                  <button type="button" onClick={() => setStep(4)} className="text-xs text-[#C8201A] hover:underline">Edit</button>
                </div>
                {REQUIRED_DOCUMENTS.map((doc) => (
                  <div key={doc.type} className="flex justify-between text-sm py-1">
                    <span className="text-gray-500">{doc.label}</span>
                    <Badge variant="outline" className={docStates[doc.type] === "uploaded"
                      ? "text-green-700 border-green-400 text-xs" : "text-amber-700 border-amber-400 text-xs"}>
                      {docStates[doc.type] === "uploaded" ? "Uploaded" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-5 space-y-4">
              {paymentRequired && paymentKeyId && app && (
                <AdmissionPaymentStep
                  applicationId={app.id}
                  amount={paymentAmount}
                  keyId={paymentKeyId}
                  paid={feePaid}
                  onPaid={() => setFeePaid(true)}
                />
              )}
              <DpdpConsent checked={dpdpConsent} onChange={setDpdpConsent} id="apply-dpdp-consent" />
              <p className="text-xs text-blue-700">
                By submitting, I also confirm that all information provided is accurate and authentic.
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(4)}><ChevronLeft className="mr-1 h-4 w-4" /> Back</Button>
              <Button className="bg-[#C8201A] hover:bg-[#9B1812] text-white font-semibold"
                onClick={handleFinalSubmit}
                disabled={submitting || (paymentRequired && !feePaid) || !dpdpConsent}>
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting…</> : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
