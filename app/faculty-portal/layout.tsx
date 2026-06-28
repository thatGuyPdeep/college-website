import { FacultyNav } from "@/components/faculty/FacultyNav";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-site max-w-4xl py-8">
      <FacultyNav />
      {children}
    </div>
  );
}
