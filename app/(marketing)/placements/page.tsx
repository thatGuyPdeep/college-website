import type { Metadata } from "next";
import { TrendingUp, Building2, IndianRupee } from "lucide-react";

export const metadata: Metadata = { title: "Placements" };

const STATS = [{ label:"Students Placed",value:"450+"},{label:"Avg. Package",value:"₹6.2 LPA"},{label:"Highest Package",value:"₹28 LPA"},{label:"Recruiters",value:"80+"}];
const RECRUITERS = ["TCS","Infosys","Wipro","Accenture","HCL","Cognizant","IBM","Amazon","Flipkart","Deloitte","KPMG","EY"];

export default function PlacementsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2"><li><a href="/" className="hover:text-blue-700">Home</a></li><li>/</li><li aria-current="page">Placements</li></ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Placement Cell</h1>
      <p className="text-gray-500 mb-12">Our dedicated placement cell works year-round to connect students with leading employers.</p>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {STATS.map((s) => (
          <div key={s.label} className="bg-blue-700 text-white rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-sm text-blue-200">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Recruiters</h2>
      <div className="flex flex-wrap gap-3 mb-14">
        {RECRUITERS.map((r) => (
          <div key={r} className="bg-white border rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <Building2 className="inline h-4 w-4 mr-2 text-blue-600" aria-hidden="true" />{r}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Placement Process</h2>
        <ol className="space-y-3">
          {["Pre-Placement Training (Resume, Interview Skills, Aptitude)","Company Registration & Pre-Placement Talks","Written Test / Online Assessment","Group Discussion & Technical Interview","HR Interview & Offer Letter"].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-blue-700 text-white text-sm flex items-center justify-center font-bold">{i+1}</span>
              <span className="text-gray-700 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
