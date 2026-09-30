import { getDashboardSummary } from "@/lib/store";
import { syncStore } from "@/lib/store-sync";
import { DashboardClient } from "./DashboardClient";

// Always read live data; never bake the summary in at build time.
export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  await syncStore();
  const initialData = getDashboardSummary("ALL");

  return <DashboardClient initialData={initialData} />;
}
