import type { Metadata } from "next";
import { Cpu, BookOpen, Dumbbell, Wifi, Car, FlaskConical } from "lucide-react";

export const metadata: Metadata = { title: "Infrastructure" };

const FACILITIES = [
  { icon: Cpu, name: "Computing Labs", desc: "6 state-of-the-art computer labs with latest hardware and high-speed internet." },
  { icon: FlaskConical, name: "Research Labs", desc: "Dedicated research labs for AI/ML, IoT, Robotics, and Biotechnology." },
  { icon: BookOpen, name: "Central Library", desc: "40,000+ books, 200+ journals, e-resources, and digital cataloguing." },
  { icon: Dumbbell, name: "Sports Complex", desc: "Indoor and outdoor facilities including cricket, football, basketball and gym." },
  { icon: Wifi, name: "Smart Classrooms", desc: "60+ smart classrooms with projectors, audio systems, and LAN/Wi-Fi." },
  { icon: Car, name: "Transport", desc: "Fleet of 20+ buses covering major city routes for students and staff." },
];

export default function InfrastructurePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex gap-2"><li><a href="/" className="hover:text-blue-700">Home</a></li><li>/</li><li><a href="#" className="hover:text-blue-700">Campus Life</a></li><li>/</li><li aria-current="page">Infrastructure</li></ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Infrastructure</h1>
      <p className="text-gray-500 mb-12">World-class facilities designed to support learning, research, and student life.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {FACILITIES.map((f) => (
          <div key={f.name} className="bg-white border rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-blue-50 w-fit mb-4"><f.icon className="h-6 w-6 text-blue-700" aria-hidden="true" /></div>
            <h2 className="font-semibold text-gray-900 mb-2">{f.name}</h2>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
