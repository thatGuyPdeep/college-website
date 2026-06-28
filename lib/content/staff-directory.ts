/** Administrative & support staff — public directory (update via CMS when ready) */

export type StaffMember = {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone?: string;
  email?: string;
};

export const STAFF_DIRECTORY: StaffMember[] = [
  {
    id: "office",
    name: "College Office",
    designation: "Administrative Office",
    department: "Administration",
    phone: "07781-252251",
    email: "rkm.narainpur@gmail.com",
  },
  {
    id: "admissions",
    name: "Admissions Office",
    designation: "Admissions & Student Services",
    department: "Administration",
    phone: "07781-252251",
    email: "rkm.narainpur@gmail.com",
  },
  {
    id: "examination",
    name: "Examination Cell",
    designation: "Examination Coordinator",
    department: "Examination",
    email: "rkm.narainpur@gmail.com",
  },
  {
    id: "accounts",
    name: "Accounts Section",
    designation: "Accounts & Finance",
    department: "Administration",
    email: "rkm.narainpur@gmail.com",
  },
  {
    id: "library",
    name: "Library",
    designation: "Librarian",
    department: "Library",
  },
  {
    id: "hostel",
    name: "Hostel Warden",
    designation: "Hostel Administration",
    department: "Campus Services",
  },
  {
    id: "iti",
    name: "ITI Office",
    designation: "Vocational Training",
    department: "ITI",
    phone: "07781-252251",
  },
];

export function staffForDepartment(deptSlug: string): StaffMember[] {
  const map: Record<string, string[]> = {
    commerce: ["office", "admissions", "examination", "accounts"],
    economics: ["office", "admissions", "examination"],
    "computer-science": ["office", "library", "examination"],
    "physical-education": ["office", "hostel"],
  };
  const ids = map[deptSlug] ?? ["office", "admissions"];
  return STAFF_DIRECTORY.filter((s) => ids.includes(s.id));
}

/** Filter staff list (from CMS or static) by department slug */
export function staffForDepartmentFromList(deptSlug: string, all: StaffMember[]): StaffMember[] {
  const map: Record<string, string[]> = {
    commerce: ["office", "admissions", "examination", "accounts"],
    economics: ["office", "admissions", "examination"],
    "computer-science": ["office", "library", "examination"],
    "physical-education": ["office", "hostel"],
  };
  const ids = map[deptSlug] ?? ["office", "admissions"];
  const filtered = all.filter((s) => ids.includes(s.id));
  return filtered.length ? filtered : all.slice(0, 4);
}
