import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Boxes,
  CalendarClock,
  Check,
  ChefHat,
  Clock,
  Flame,
  Leaf,
  ShoppingBasket,
  Sparkles,
  TrendingDown,
} from "lucide-react";

const marquee = [
  "🥕 Wortel", "🥚 Telur", "🥛 Susu", "🍅 Tomat", "🧄 Bawang putih", "🍗 Ayam",
  "🥬 Bayam", "🍚 Beras", "🧀 Keju", "🌶️ Cabai", "🥔 Kentang", "🍋 Lemon",
];

const features = [
  {
    icon: Boxes,
    title: "Inventaris real-time",
    desc: "Catat semua bahan beserta jumlah, satuan, dan kategorinya. Stok dapur selalu rapi dan mudah dicari.",
    span: "md:col-span-2",
    tone: "bg-white",
  },
  {
    icon: Bell,
    title: "Pengingat kedaluwarsa",
    desc: "Dapat peringatan sebelum bahan basi, jadi tidak ada lagi yang terbuang sia-sia.",
    span: "",
    tone: "bg-[#173d2b] text-white",
  },
  {
    icon: Sparkles,
    title: "Resep dari AI",
    desc: "Pilih bahan yang kamu punya, AI langsung menyusun ide resep lengkap dengan langkah memasaknya.",
    span: "",
    tone: "bg-[#f4a259]/20",
  },
  {
    icon: TrendingDown,
    title: "Kurangi food waste",
    desc: "Prioritaskan bahan yang hampir kedaluwarsa dan hemat belanja bulanan tanpa ribet.",
    span: "md:col-span-2",
    tone: "bg-white",
  },
];

const steps = [
  { n: "01", title: "Catat bahan", desc: "Tambahkan bahan yang ada di dapur, lengkap dengan tanggal kedaluwarsa." },
  { n: "02", title: "Pantau stok", desc: "Lihat ringkasan stok dan bahan yang perlu segera dipakai dalam satu dashboard." },
  { n: "03", title: "Masak cerdas", desc: "Minta rekomendasi resep AI berdasarkan bahan yang tersedia saat itu juga." },
];

const pantry = [
  { emoji: "🥬", name: "Bayam", qty: "2 ikat", status: "Besok", color: "bg-red-100 text-red-700" },
  { emoji: "🥚", name: "Telur", qty: "10 butir", status: "5 hari", color: "bg-amber-100 text-amber-700" },
  { emoji: "🍅", name: "Tomat", qty: "6 buah", status: "3 hari", color: "bg-amber-100 text-amber-700" },
  { emoji: "🍚", name: "Beras", qty: "3 kg", status: "Aman", color: "bg-green-100 text-green-700" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf7ef] text-[#173d2b]">
      <style>{`
        @keyframes sp-float { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-14px) rotate(var(--r,0deg))} }
        @keyframes sp-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes sp-rise { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .sp-float{animation:sp-float 6s ease-in-out infinite}
        .sp-float-slow{animation:sp-float 8s ease-in-out infinite}
        .sp-marquee{animation:sp-marquee 32s linear infinite}
        .sp-rise{animation:sp-rise .8s ease-out both}
      `}</style>

      {/* dekorasi latar */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#cfe3cf] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 h-[26rem] w-[26rem] rounded-full bg-[#f9d9b0] opacity-50 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(#173d2b 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      {/* NAVBAR */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-2xl font-black">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#173d2b] text-white">
            <Leaf size={20} />
          </span>
          SmartPantry
        </div>
        <nav className="hidden gap-8 text-sm font-semibold text-[#173d2b]/70 md:flex">
          <a href="#fitur" className="hover:text-[#173d2b]">Fitur</a>
          <a href="#cara-kerja" className="hover:text-[#173d2b]">Cara kerja</a>
          <a href="#resep-ai" className="hover:text-[#173d2b]">Resep AI</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-[#173d2b]/5">Masuk</Link>
          <Link href="/register" className="rounded-xl bg-[#173d2b] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#173d2b]/20 transition hover:-translate-y-0.5">Daftar</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-12 md:grid-cols-[1.05fr_1fr] md:pt-20">
        <div className="sp-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#173d2b]/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#27613d] backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Manajemen pangan berbasis AI
          </span>
          <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            Dapur rapi,
            <br />
            <span className="font-serif italic font-semibold text-[#4f9566]">masak lebih</span>{" "}
            <span className="relative inline-block">
              bijak.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M2 8c40-8 120-8 196 0" stroke="#f4a259" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#173d2b]/70">
            Catat persediaan bahan pangan, pantau tanggal kedaluwarsa, dan dapatkan ide resep dari bahan yang sudah kamu punya. Kurangi makanan terbuang, hemat uang belanja.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/register" className="group inline-flex items-center gap-2 rounded-2xl bg-[#173d2b] px-7 py-4 font-bold text-white shadow-xl shadow-[#173d2b]/25 transition hover:-translate-y-0.5">
              Mulai sekarang
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <a href="#cara-kerja" className="rounded-2xl border-2 border-[#173d2b]/15 px-7 py-4 font-bold transition hover:bg-white">
              Lihat cara kerja
            </a>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#173d2b]/70">
            {["Gratis digunakan", "Tanpa ribet", "Rekomendasi AI"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check size={16} className="text-green-600" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* mockup dashboard */}
        <div className="relative sp-rise" style={{ animationDelay: ".15s" }}>
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#cfe3cf] to-[#f9d9b0] opacity-70 blur-2xl" />
          <div className="relative rounded-[2rem] border border-white bg-white/80 p-6 shadow-2xl shadow-[#173d2b]/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#173d2b]/50">Ringkasan dapur</p>
                <p className="text-xl font-black">Halo, Chef! 👋</p>
              </div>
              <span className="rounded-full bg-[#e6f1e8] px-3 py-1 text-xs font-bold text-[#27613d]">● SmartPantry AI</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: Boxes, v: "12", l: "Jenis bahan" },
                { icon: Clock, v: "3", l: "Segera habis" },
                { icon: ChefHat, v: "5", l: "Ide resep" },
              ].map(({ icon: I, v, l }) => (
                <div key={l} className="rounded-2xl bg-[#f2f7f1] p-4">
                  <I size={18} className="text-[#39764b]" />
                  <p className="mt-2 text-2xl font-black">{v}</p>
                  <p className="text-[11px] text-[#173d2b]/55">{l}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {pantry.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-2xl border border-[#173d2b]/5 bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className="text-sm font-bold">{p.name}</p>
                      <p className="text-xs text-[#173d2b]/50">{p.qty}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.color}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* kartu melayang: resep AI */}
          <div className="sp-float absolute -bottom-10 -left-8 hidden w-64 rounded-2xl bg-[#173d2b] p-5 text-white shadow-2xl md:block" style={{ ["--r" as string]: "-3deg" }}>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#f4a259]">
              <Sparkles size={14} /> Rekomendasi hari ini
            </div>
            <p className="mt-2 font-bold">Omelet bayam tomat</p>
            <p className="mt-1 text-xs text-white/70">Pakai bayam yang hampir kedaluwarsa · 15 menit</p>
          </div>

          {/* kartu melayang: notifikasi */}
          <div className="sp-float-slow absolute -right-6 -top-6 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-xl md:flex" style={{ ["--r" as string]: "4deg" }}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-red-600">
              <Bell size={18} />
            </span>
            <div>
              <p className="text-sm font-bold">Bayam besok basi!</p>
              <p className="text-xs text-[#173d2b]/55">Yuk dimasak hari ini</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative z-10 border-y border-[#173d2b]/10 bg-[#173d2b] py-4 text-white">
        <div className="flex w-[200%] overflow-hidden whitespace-nowrap">
          <div className="sp-marquee flex min-w-full gap-10 text-lg font-semibold">
            {[...marquee, ...marquee, ...marquee, ...marquee].map((m, i) => (
              <span key={i} className="opacity-90">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR (bento) */}
      <section id="fitur" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#4f9566]">Fitur</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Semua yang dapurmu butuhkan, <span className="font-serif italic font-semibold text-[#4f9566]">dalam satu tempat.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, span, tone }) => {
            const dark = tone.includes("text-white");
            return (
              <div
                key={title}
                className={`${span} ${tone} group rounded-3xl border border-[#173d2b]/10 p-8 transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${dark ? "bg-white/10" : "bg-[#e6f1e8] text-[#27613d]"}`}>
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 text-2xl font-black">{title}</h3>
                <p className={`mt-3 leading-7 ${dark ? "text-white/75" : "text-[#173d2b]/65"}`}>{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="relative z-10 bg-[#eaf2e9] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#4f9566]">Cara kerja</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Tiga langkah mudah</h2>
          </div>
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-[#173d2b]/20 md:block" />
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-3xl bg-white p-8 text-center shadow-sm">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#173d2b] text-xl font-black text-white">{s.n}</span>
                <h3 className="mt-6 text-xl font-black">{s.title}</h3>
                <p className="mt-2 leading-7 text-[#173d2b]/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEP AI */}
      <section id="resep-ai" className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div className="relative rounded-[2rem] bg-[#173d2b] p-8 text-white shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#f4a259]">
            <Sparkles size={16} /> SmartPantry AI
          </div>
          <p className="mt-4 text-sm text-white/60">Bahan yang dipilih</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["🥬 Bayam", "🥚 Telur", "🍅 Tomat", "🧄 Bawang putih"].map((b) => (
              <span key={b} className="rounded-full bg-white/10 px-3 py-1.5 text-sm">{b}</span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-white p-6 text-[#173d2b]">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-black">Omelet bayam tomat</h3>
              <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                <Flame size={12} /> 15 mnt
              </span>
            </div>
            <ol className="mt-4 space-y-2 text-sm text-[#173d2b]/75">
              <li>1. Tumis bawang putih hingga harum.</li>
              <li>2. Masukkan bayam dan tomat, aduk sebentar.</li>
              <li>3. Tuang telur kocok, masak hingga matang.</li>
            </ol>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#4f9566]">Resep AI</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Bingung masak apa? <span className="font-serif italic font-semibold text-[#4f9566]">Tanya AI.</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#173d2b]/70">
            Pilih bahan yang ada, dan SmartPantry menyarankan resep yang cocok. Bahan yang hampir kedaluwarsa diprioritaskan supaya tidak terbuang.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { i: ShoppingBasket, t: "Berdasarkan stok nyata di dapurmu" },
              { i: CalendarClock, t: "Prioritaskan bahan yang segera kedaluwarsa" },
              { i: ChefHat, t: "Langkah memasak yang jelas dan singkat" },
            ].map(({ i: I, t }) => (
              <li key={t} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e6f1e8] text-[#27613d]">
                  <I size={20} />
                </span>
                <span className="font-semibold">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#173d2b] px-8 py-16 text-center text-white md:py-20">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#4f9566]/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#f4a259]/30 blur-3xl" />
          <h2 className="relative text-4xl font-black tracking-tight md:text-5xl">
            Siap bikin dapurmu <span className="font-serif italic font-semibold text-[#f4a259]">lebih cerdas?</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-white/70">
            Mulai catat bahan pangan hari ini dan biarkan SmartPantry membantu kamu memasak lebih hemat.
          </p>
          <Link href="/register" className="group relative mt-9 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-[#173d2b] transition hover:-translate-y-0.5">
            Daftar gratis <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#173d2b]/10 py-8 text-center text-sm text-[#173d2b]/55">
        © {new Date().getFullYear()} SmartPantry · Kelola bahan makanan, masak lebih bijak.
      </footer>
    </main>
  );
}
