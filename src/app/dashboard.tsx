import { api, HydrateClient } from "~/trpc/server";

export default async function Dashboard() {
  await api.task.getLatestList.prefetch();
  return <HydrateClient>Welcome to the Dashboard</HydrateClient>;
}
