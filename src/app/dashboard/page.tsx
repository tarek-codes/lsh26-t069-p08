import { getDashboardSummary } from "@/lib/store";
import { DashboardClient } from "./DashboardClient";

export default function DashboardOverviewPage() {
  const initialData = getDashboardSummary("ALL");

  return <DashboardClient initialData={initialData} />;
}

