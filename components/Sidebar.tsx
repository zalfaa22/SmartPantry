import Link from "next/link";
import { Boxes, ChefHat, LayoutDashboard, LogOut, Leaf } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export default function Sidebar() {
  return <aside className="flex w-full flex-col justify-between rounded-3xl bg-[#173d2b] p-6 text-white md:min-h-[calc(100vh-40px)] md:w-64">
    <div>
      <Link href="/dashboard" className="mb-10 flex items-center gap-2 text-2xl font-bold"><Leaf /> SmartPantry</Link>
      <nav className="grid gap-2">
        <Link className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10" href="/dashboard"><LayoutDashboard size={18}/> Dashboard</Link>
        <Link className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10" href="/dashboard/inventory"><Boxes size={18}/> Inventaris</Link>
        <Link className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10" href="/dashboard/recipes"><ChefHat size={18}/> Rekomendasi Resep</Link>
      </nav>
    </div>
    <form action={signOut}><button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left hover:bg-white/10"><LogOut size={18}/> Keluar</button></form>
  </aside>;
}
