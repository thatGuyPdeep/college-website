export type FallbackFacultyItem = {
  id: string;
  name: string;
  designation: string;
  dept: string;
  qual: string;
  exp: number;
  specialization: string;
  photo_url: string | null;
};

/** Shown when Supabase `faculty` table is empty — update via Admin → Content or seed DB. */
export const FALLBACK_FACULTY: FallbackFacultyItem[] = [
  {
    id: "fac-commerce",
    name: "Commerce Faculty",
    designation: "Assistant Professor",
    dept: "Commerce",
    qual: "M.Com / Ph.D. (as notified)",
    exp: 5,
    specialization: "Accounting, Business Law & Taxation",
    photo_url: "/images/school-1.jpg",
  },
  {
    id: "fac-economics",
    name: "Economics Faculty",
    designation: "Assistant Professor",
    dept: "Economics",
    qual: "M.A. Economics (as notified)",
    exp: 4,
    specialization: "Indian Economy & Development Studies",
    photo_url: "/images/school-2.jpg",
  },
  {
    id: "fac-cs",
    name: "Computer Science Faculty",
    designation: "Assistant Professor",
    dept: "Computer Science",
    qual: "M.Sc. / M.Tech. (as notified)",
    exp: 6,
    specialization: "Programming, DBMS & Web Technologies",
    photo_url: "/images/ashrama-3.jpg",
  },
  {
    id: "fac-pe",
    name: "Physical Education Faculty",
    designation: "Assistant Professor (Sports)",
    dept: "Physical Education",
    qual: "M.P.Ed. / B.P.Ed. (as notified)",
    exp: 8,
    specialization: "Sports Coaching & Fitness Training",
    photo_url: "/images/ashrama-4.jpg",
  },
];
