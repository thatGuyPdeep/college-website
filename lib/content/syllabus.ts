/**
 * FYUGP syllabus 2024–28 — curated from Professor/Syllabus-2024-28-Organized/
 * (Bastar University). Full OCR library lives in Obsidian; this is the public web summary.
 */

export const SYLLABUS_SESSION = "2024–28";

export type SyllabusCourse = {
  code: string;
  title: string;
  type?: string;
  credits?: string;
  marks?: string;
};

export type SyllabusSemester = {
  semester: number;
  courses: SyllabusCourse[];
  note?: string;
};

export type SyllabusSubject = {
  slug: string;
  name: string;
  programme: string;
  departmentSlug: string;
  session: string;
  university: string;
  outcomes: string[];
  semesters: SyllabusSemester[];
  electiveNote?: string;
  downloadNote?: string;
};

export const SYLLABUS_SUBJECTS: SyllabusSubject[] = [
  {
    slug: "computer-science",
    name: "Computer Science",
    programme: "B.Sc. — Computer Science (FYUGP)",
    departmentSlug: "computer-science",
    session: SYLLABUS_SESSION,
    university: "Bastar University",
    outcomes: [
      "Exposure to theories and practices of computer science",
      "Skilled learner and active programmer",
      "Problem-solving through CS concepts and real-world applications",
    ],
    semesters: [
      { semester: 1, courses: [
        { code: "CSSC-01T", title: "Computer Fundamental and Operating System", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-01P", title: "Lab 1: Operating Systems (DOS, Windows, Linux)", type: "Lab", credits: "1", marks: "50" },
      ]},
      { semester: 2, courses: [
        { code: "CSSC-02T", title: "Programming in C++", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-02P", title: "Lab 2: Programming in C++", type: "Lab", credits: "1", marks: "50" },
      ]},
      { semester: 3, courses: [
        { code: "CSSC-03T", title: "Data Structure", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-03P", title: "Lab 3: Data Structure Using C++", type: "Lab", credits: "1", marks: "50" },
        { code: "CSSE-01", title: "Data Communication and Networking", type: "DSE", credits: "4", marks: "100" },
      ]},
      { semester: 4, courses: [
        { code: "CSSC-04T", title: "Relational Database Management System", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-04P", title: "Lab 4: RDBMS (Oracle/MySQL)", type: "Lab", credits: "1", marks: "50" },
        { code: "CSSE-02", title: "Computer System Architecture", type: "DSE", credits: "4", marks: "100" },
      ]},
      { semester: 5, courses: [
        { code: "CSSC-05T", title: "Programming in Java", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-05P", title: "Lab 5: Programming in Java", type: "Lab", credits: "1", marks: "50" },
        { code: "CSSE-03", title: "Cyber Security and Cyber Law", type: "DSE", credits: "4", marks: "100" },
      ]},
      { semester: 6, courses: [
        { code: "CSSC-06T", title: "Web Technology", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-06P", title: "Lab 6: Web Technology", type: "Lab", credits: "1", marks: "50" },
        { code: "CSSE-04", title: "Introduction to Artificial Intelligence", type: "DSE", credits: "4", marks: "100" },
      ]},
      { semester: 7, courses: [
        { code: "CSSC-07T", title: "Programming in Python", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-07P", title: "Lab 7: Programming in Python", type: "Lab", credits: "1", marks: "50" },
        { code: "CSSE-05", title: "Computer Graphics", type: "DSE", credits: "4", marks: "100" },
        { code: "CSSE-06T", title: "Machine Learning", type: "DSE", credits: "3", marks: "100" },
        { code: "CSSE-06P", title: "Lab 8: Machine Learning", type: "Lab", credits: "1", marks: "50" },
        { code: "CSSE-07", title: "Software Engineering", type: "DSE", credits: "4", marks: "100" },
        { code: "CSSE-08", title: "Theory of Computation", type: "DSE", credits: "4", marks: "100" },
        { code: "CSSC-08T", title: "Fundamental of IoT and Applications", type: "DSC", credits: "3", marks: "100" },
        { code: "CSSC-08P", title: "Lab 9: IoT and Applications", type: "Lab", credits: "1", marks: "50" },
      ]},
      { semester: 8, courses: [
        { code: "CSSE-09", title: "Soft Computing", type: "DSE", credits: "4", marks: "100" },
        { code: "CSSE-10", title: "Advanced Operating Systems", type: "DSE", credits: "4", marks: "100" },
        { code: "CSSE-11", title: "Cloud Computing", type: "DSE", credits: "4", marks: "100" },
        { code: "CSSE-12", title: "Major Project", type: "DSE", credits: "4", marks: "100" },
      ]},
    ],
    electiveNote: "DSC = Discipline Specific Core · DSE = Discipline Specific Elective · VAC/SEC papers per university pool.",
  },
  {
    slug: "commerce",
    name: "Commerce",
    programme: "B.Com. — Commerce (FYUGP)",
    departmentSlug: "commerce",
    session: SYLLABUS_SESSION,
    university: "Bastar University",
    outcomes: [
      "Competence in accounting, business law, economics, and taxation",
      "Elective depth in Management, Finance, or Marketing from Semester III",
      "NEP multiple exit: Certificate (Sem II), Diploma (Sem IV), Degree (Sem VI+)",
    ],
    semesters: [
      { semester: 1, note: "20 credits · 500 marks", courses: [
        { code: "COSC-01", title: "Fundamental of Accounting", credits: "4", marks: "100" },
        { code: "COSC-02", title: "Business Law", credits: "4", marks: "100" },
        { code: "COSC-03", title: "Business Economics", credits: "4", marks: "100" },
        { code: "COGE-01", title: "Generic Elective", credits: "4", marks: "100" },
        { code: "COAEC-01", title: "Environmental Studies", credits: "2", marks: "50" },
        { code: "COVAC-01", title: "Concept of Business", credits: "2", marks: "50" },
      ]},
      { semester: 2, note: "Exit: UG Certificate after Sem II (44 credits)", courses: [
        { code: "COSC-04", title: "Business Accounting", credits: "4", marks: "100" },
        { code: "COSC-05", title: "Business Mathematics", credits: "4", marks: "100" },
        { code: "COSC-06", title: "Business Environment", credits: "4", marks: "100" },
        { code: "COGE-02", title: "Generic Elective", credits: "4", marks: "100" },
        { code: "COAEC-02", title: "English Language", credits: "2", marks: "50" },
        { code: "COSEC-01", title: "Accounting For Every One", credits: "2", marks: "50" },
      ]},
      { semester: 3, courses: [
        { code: "COSC-07", title: "Corporate Accounting", credits: "4", marks: "100" },
        { code: "COSC-08", title: "Company Law", credits: "4", marks: "100" },
        { code: "COSC-09", title: "Principles of Management", credits: "4", marks: "100" },
        { code: "COSE-01", title: "Elective (HR / Finance / Marketing)", credits: "4", marks: "100" },
        { code: "COAEC-03", title: "Hindi Language", credits: "2", marks: "50" },
        { code: "COVAC-02", title: "Fundamentals of Stock Market", credits: "2", marks: "50" },
      ]},
      { semester: 4, note: "Exit: UG Diploma after Sem IV (84 credits)", courses: [
        { code: "COSC-10", title: "Business Statistics", credits: "4", marks: "100" },
        { code: "COSC-11", title: "Cost Accounting", credits: "4", marks: "100" },
        { code: "COSC-12", title: "Fundamentals of Entrepreneurship", credits: "4", marks: "100" },
        { code: "COSE-02", title: "Elective (Org / Fin Markets / Intl Marketing)", credits: "4", marks: "100" },
        { code: "COAEC-04", title: "Communicative English & Soft Skills", credits: "2", marks: "50" },
        { code: "COSEC-02", title: "Banking Operation", credits: "2", marks: "50" },
      ]},
      { semester: 5, courses: [
        { code: "COSC-13", title: "Income Tax Law & Accounts", credits: "4", marks: "100" },
        { code: "COSC-14", title: "Auditing", credits: "4", marks: "100" },
        { code: "COSC-15", title: "Management Accounting", credits: "4", marks: "100" },
        { code: "COSE-03", title: "Elective (Production / Fin Institutions / Sales)", credits: "4", marks: "100" },
        { code: "COVAC-03", title: "Investing in Stock Markets", credits: "2", marks: "50" },
        { code: "COSEC-03", title: "Communication & E-Filing", credits: "2", marks: "50" },
      ]},
      { semester: 6, courses: [
        { code: "COSC-16", title: "Indirect Tax with GST", credits: "4", marks: "100" },
        { code: "COSC-17", title: "Managerial Economics", credits: "4", marks: "100" },
        { code: "COSC-18", title: "Principle & Practice of Insurance", credits: "4", marks: "100" },
        { code: "COSE-04", title: "Elective (Strategic Mgmt / Fin Services / Advertising)", credits: "4", marks: "100" },
      ]},
    ],
    electiveNote: "Elective groups: Group I Management · Group II Finance · Group III Marketing (COSE papers).",
  },
  {
    slug: "physics",
    name: "Physics",
    programme: "B.Sc. — Physics (FYUGP)",
    departmentSlug: "physics",
    session: SYLLABUS_SESSION,
    university: "Bastar University",
    outcomes: [
      "Classical and modern physics foundations",
      "Laboratory skills in electronics and instrumentation",
      "Preparation for higher studies and applied science careers",
    ],
    semesters: [
      { semester: 1, note: "Per Bastar University Physics syllabus 2024–28", courses: [
        { code: "—", title: "Mechanics & Mathematical Physics", type: "DSC" },
        { code: "—", title: "Electricity & Magnetism", type: "DSC" },
        { code: "—", title: "Practical — General Physics", type: "Lab" },
      ]},
      { semester: 2, courses: [
        { code: "—", title: "Oscillations, Waves & Optics", type: "DSC" },
        { code: "—", title: "Thermal Physics", type: "DSC" },
        { code: "—", title: "Practical — Optics & Thermodynamics", type: "Lab" },
      ]},
    ],
    downloadNote: "Detailed semester-wise papers are published by Bastar University. Contact the Physics department for the latest PDF.",
  },
  {
    slug: "common-courses",
    name: "Common Ability Enhancement Courses",
    programme: "All UG Programmes (AEC)",
    departmentSlug: "",
    session: SYLLABUS_SESSION,
    university: "Bastar University",
    outcomes: [
      "Environmental awareness and sustainability literacy",
      "English and Hindi communication skills",
      "Soft skills for employability",
    ],
    semesters: [
      { semester: 1, courses: [{ code: "AEC-01", title: "Environmental Studies", credits: "2", marks: "50" }] },
      { semester: 2, courses: [{ code: "AEC-02", title: "English Language", credits: "2", marks: "50" }] },
      { semester: 3, courses: [{ code: "AEC-03", title: "Hindi Language", credits: "2", marks: "50" }] },
      { semester: 4, courses: [{ code: "AEC-04", title: "Communicative English & Soft Skills", credits: "2", marks: "50" }] },
    ],
  },
];

export function getSyllabusBySlug(slug: string): SyllabusSubject | null {
  return SYLLABUS_SUBJECTS.find((s) => s.slug === slug) ?? null;
}

export function getSyllabusForDepartment(deptSlug: string): SyllabusSubject | null {
  return SYLLABUS_SUBJECTS.find((s) => s.departmentSlug === deptSlug) ?? null;
}

export const SYLLABUS_TYPE_LEGEND: Record<string, string> = {
  DSC: "Discipline Specific Core",
  DSE: "Discipline Specific Elective",
  GE:  "Generic Elective",
  AEC: "Ability Enhancement Course",
  VAC: "Value Added Course",
  SEC: "Skill Enhancement Course",
  Lab: "Practical / Laboratory",
};
