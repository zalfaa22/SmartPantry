import Link from "next/link";
import { ArrowRight, Boxes, ChefHat, Sparkles } from "lucide-react";

export default function Home() {
  return <main className="min-h-screen overflow-hidden">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
      <div className="text-2xl font-black text-[#173d2b]">🌿 SmartPantry</div>
      <div className="flex gap-3"><Link className="rounded-xl px-4 py-2 font-semibold" href="/login">Masuk</Link><Link className="rounded-xl bg-[#173d2b] px-5 py-2 font-semibold text-white" href="/register">Daftar</Link></div>
    </header>
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
      <div><span className="rounded-full bg-[#e6f1e8] px-4 py-2 text-sm font-semibold text-[#27613d]">Manajemen pangan lebih cerdas</span>
        <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight text-[#173d2b] md:text-6xl">Kelola bahan makanan, <span className="text-[#70a77d]">masak lebih bijak.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">Catat persediaan bahan pangan, pantau tanggal kedaluwarsa, dan temukan inspirasi resep berdasarkan bahan yang kamu miliki dengan bantuan AI.</p>
        <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#173d2b] px-6 py-4 font-bold text-white">Mulai sekarang <ArrowRight size={18}/></Link>
      </div>
      <div className="rounded-[2rem] bg-[#eaf2e9] p-8">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between"><p className="font-bold">Ringkasan dapur</p><span className="text-xs text-green-700">● SmartPantry AI</span></div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#f2f7f1] p-5"><Boxes className="text-[#39764b]"/><p className="mt-3 text-3xl font-black">12</p><p className="text-sm text-gray-500">Jenis bahan</p></div>
            <div className="rounded-2xl bg-[#f2f7f1] p-5"><ChefHat className="text-[#39764b]"/><p className="mt-3 text-3xl font-black">5</p><p className="text-sm text-gray-500">Ide resep</p></div>
          </div>
          <div className="mt-4 rounded-2xl bg-[#173d2b] p-5 text-white"><Sparkles/><p className="mt-3 font-bold">Rekomendasi hari ini</p><p className="mt-1 text-sm text-white/75">Nasi goreng sayur — cocok dengan bahan yang tersedia.</p></div>
        </div>
      </div>
    </section>
  </main>;
}
