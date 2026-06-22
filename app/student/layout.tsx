import { StudentNav } from "@/components/student/StudentNav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-site max-w-4xl py-8">
      <StudentNav />
      {children}
    </div>
  );
}
