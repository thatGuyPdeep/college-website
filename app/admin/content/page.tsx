import { requireRole } from "@/lib/auth/helpers";
import {
  listNewsEvents,
  listDisclosureItems,
  listFacultyMembers,
  listProgramsAdmin,
  listDepartments,
} from "@/lib/actions/admin-content";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { DisclosureEditor } from "@/components/admin/DisclosureEditor";
import { FacultyEditor } from "@/components/admin/FacultyEditor";
import { ProgramEditor } from "@/components/admin/ProgramEditor";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { LeadershipEditor } from "@/components/admin/LeadershipEditor";
import { PublicationsEditor } from "@/components/admin/PublicationsEditor";
import { listGalleryItems } from "@/lib/actions/admin-gallery";
import { listLeadershipEntries, listPublicationLinks } from "@/lib/actions/admin-site-content";

export default async function AdminContentPage() {
  await requireRole(["content_editor", "admin", "super_admin"]);
  const [newsResult, discResult, facultyResult, programsResult, deptResult, galleryResult, leadershipResult, pubsResult] = await Promise.all([
    listNewsEvents(),
    listDisclosureItems(),
    listFacultyMembers(),
    listProgramsAdmin(),
    listDepartments(),
    listGalleryItems(),
    listLeadershipEntries(),
    listPublicationLinks(),
  ]);
  const news = newsResult.ok ? newsResult.data : [];
  const disclosure = discResult.ok ? discResult.data : [];
  const faculty = facultyResult.ok ? facultyResult.data : [];
  const programs = programsResult.ok ? programsResult.data : [];
  const departments = deptResult.ok ? deptResult.data : [];
  const gallery = galleryResult.ok ? galleryResult.data : [];
  const leadership = leadershipResult.ok ? leadershipResult.data : [];
  const publications = pubsResult.ok ? pubsResult.data : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0D2660] mb-2">Content Management</h1>
      <p className="text-sm text-gray-500 mb-8">Manage news, programmes, faculty, gallery, leadership, publications, and disclosure</p>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">News & Events</h2>
        <NewsEditor items={news} />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Programmes</h2>
        <ProgramEditor items={programs} departments={departments} />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Faculty</h2>
        <FacultyEditor items={faculty} departments={departments} />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
        <GalleryEditor items={gallery} />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leadership &amp; Functionaries</h2>
        <LeadershipEditor items={leadership} />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Library Publications Links</h2>
        <PublicationsEditor items={publications} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Disclosure Items</h2>
        <DisclosureEditor items={disclosure} />
      </section>
    </div>
  );
}
