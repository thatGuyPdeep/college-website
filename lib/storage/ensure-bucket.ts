import { adminClient } from "@/lib/supabase/admin";

export type StorageBucketSpec = {
  public: boolean;
  fileSizeLimit?: number;
  allowedMimeTypes?: string[];
};

/** Create a Supabase Storage bucket if it does not exist (service role). */
export async function ensureStorageBucket(id: string, spec: StorageBucketSpec): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = adminClient as any;

  const { data: buckets, error: listErr } = await admin.storage.listBuckets();
  if (listErr) {
    console.error(`[storage] listBuckets failed for ${id}:`, listErr.message);
  } else if (buckets?.some((b: { id: string }) => b.id === id)) {
    return;
  }

  const { error } = await admin.storage.createBucket(id, {
    public: spec.public,
    fileSizeLimit: spec.fileSizeLimit,
    allowedMimeTypes: spec.allowedMimeTypes,
  });

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already exists") || msg.includes("duplicate")) return;
    throw error;
  }
}

export const RECRUITMENT_FILES_BUCKET = {
  id: "recruitment-files" as const,
  spec: {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["application/pdf"],
  },
};
