import Link from "next/link";
import { requirePermission } from "@/lib/auth/helpers";
import { getChatAnalytics, listChatLogs } from "@/lib/actions/admin-ai";

export default async function AdminAiPage() {
  await requirePermission("ai", "view");

  const [analyticsResult, logsResult] = await Promise.all([
    getChatAnalytics(),
    listChatLogs(30),
  ]);

  const analytics = analyticsResult.ok ? analyticsResult.data : { total: 0, last7Days: 0, topQuestions: [] };
  const logs = logsResult.ok ? logsResult.data : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:text-[#0D2660]">Admin</Link> / AI Analytics
      </nav>
      <h1 className="text-2xl font-bold text-[#0D2660] mb-6">Admission Assistant Analytics</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-blue-100 rounded-xl p-5">
          <p className="text-xs text-gray-400">Questions (sample)</p>
          <p className="text-2xl font-bold text-[#0D2660]">{analytics.total}</p>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-5">
          <p className="text-xs text-gray-400">Last 7 days</p>
          <p className="text-2xl font-bold text-[#0D2660]">{analytics.last7Days}</p>
        </div>
      </div>

      {analytics.topQuestions.length > 0 && (
        <section className="mb-10">
          <h2 className="font-semibold text-gray-900 mb-3">Frequent questions</h2>
          <ul className="space-y-2 text-sm">
            {analytics.topQuestions.map((q) => (
              <li key={q.question} className="flex justify-between border border-blue-50 rounded-lg px-4 py-2">
                <span className="text-gray-700 line-clamp-1">{q.question}</span>
                <span className="text-gray-400 shrink-0 ml-2">×{q.count}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-2">Use these to improve knowledge base content and disclosure pages.</p>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-gray-900 mb-3">Recent conversations</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400">No chat logs yet — run migration 005 if table is missing.</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li key={log.id} className="bg-white border border-blue-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-gray-800">{log.question}</p>
                {log.answer && <p className="text-gray-600 mt-1 line-clamp-2">{log.answer}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(log.created_at).toLocaleString("en-IN")} · session {log.session_id.slice(0, 8)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
