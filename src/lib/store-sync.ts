import { store } from "@/lib/store";
import { loadSnapshot, persistenceEnabled, saveStudents } from "@/lib/persistence";

let inflight: Promise<void> | null = null;

/**
 * Brings the in-memory store up to date with the database. Serverless instances do not
 * share memory, so every request that reads or writes school data calls this first.
 * No-op when Supabase is not configured.
 */
export async function syncStore(): Promise<void> {
  if (!persistenceEnabled()) return;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const snapshot = await loadSnapshot();
      if (!snapshot) return;
      if (snapshot.students.length === 0) {
        // Empty database: store the built-in sample school once.
        await saveStudents(store.getStudents());
      } else {
        store.hydrate(snapshot.students, snapshot.flags);
      }
    } catch (err) {
      console.error("Could not sync with the database; using the last known data.", err);
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
