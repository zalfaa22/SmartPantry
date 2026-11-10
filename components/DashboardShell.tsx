import Sidebar from "@/components/Sidebar";
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-5 p-5 md:flex-row">
    <Sidebar />
    <section className="min-w-0 flex-1 rounded-3xl bg-white p-6 shadow-sm md:p-9">{children}</section>
  </main>;
}
