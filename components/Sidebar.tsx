import Link from "next/link";
import { Boxes, ChefHat, LayoutDashboard, LogOut, Leaf, Sparkles } from "lucide-react";
import { signOut } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Inventaris", icon: Boxes },
  { href: "/dashboard/recipes", label: "Rekomendasi Resep", icon: ChefHat },
];

export default function Sidebar() {
  return (
    <aside className="relative flex w-full flex-col gap-6 overflow-hidden rounded-3xl bg-[#173d2b] p-5 text-white md:sticky md:top-5 md:h-[calc(100vh-40px)] md:w-72 md:shrink-0 md:justify-between md:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#4f9566]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#f4a259]/20 blur-3xl" />

      <div className="relative">
        <Link href="/dashboard" className="mb-6 flex items-center gap-3 text-2xl font-black md:mb-10">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
            <Leaf size={20} />
          </span>
          SmartPantry
        </Link>
        <nav className="flex gap-2 overflow-x-auto md:grid md:overflow-visible">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative hidden rounded-2xl bg-white/10 p-4 md:block">
        <p className="flex items-center gap-2 text-xs font-bold text-[#f4a259]">
          <Sparkles size={14} /> Tips hari ini
        </p>
        <p className="mt-2 text-sm leading-6 text-white/75">
          Isi tanggal kedaluwarsa tiap bahan supaya AI bisa memprioritaskan yang hampir basi.
        </p>
      </div>

      <form action={signOut} className="relative">
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
          <LogOut size={18} /> Keluar
        </button>
      </form>
    </aside>
  );
}