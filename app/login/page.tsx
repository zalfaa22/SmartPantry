"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, ArrowLeft, ArrowRight, Bell, Check, Eye, EyeOff, Leaf, Loader2, Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard");
    router.refresh();
  }

  const input =
    "w-full rounded-xl border border-[#173d2b]/10 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#173d2b]/30 focus:border-[#4f9566] focus:ring-4 focus:ring-[#4f9566]/15";

  return (
    <main className="grid min-h-screen bg-[#faf7ef] text-[#173d2b] lg:grid-cols-[1.05fr_1fr]">
      <style>{`
        @keyframes sp-float { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-12px) rotate(var(--r,0deg))} }
        @keyframes sp-rise { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .sp-float{animation:sp-float 6s ease-in-out infinite}
        .sp-float-slow{animation:sp-float 8s ease-in-out infinite}
        .sp-rise{animation:sp-rise .7s ease-out both}
      `}</style>

      {/* Panel kiri (desktop) */}
      <aside className="relative hidden overflow-hidden bg-[#173d2b] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#4f9566]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#f4a259]/25 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />

        <Link href="/" className="relative flex items-center gap-3 text-2xl font-black">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
            <Leaf size={22} />
          </span>
          SmartPantry
        </Link>

        <div className="relative">
          <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
            Dapur rapi,
            <br />
            <span className="font-serif font-semibold italic text-[#f4a259]">masak lebih bijak.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-white/75">
            {["Catat dan pantau stok bahan makanan", "Pengingat sebelum bahan kedaluwarsa", "Ide resep dari bahan yang kamu punya"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                  <Check size={14} className="text-[#f4a259]" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          {/* kartu melayang */}
          <div className="relative mt-12 h-44">
            <div className="sp-float absolute left-0 top-0 w-64 rounded-2xl bg-white p-4 text-[#173d2b] shadow-2xl" style={{ ["--r" as string]: "-3deg" }}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-red-600">
                  <Bell size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold">Bayam besok basi!</p>
                  <p className="text-xs text-[#173d2b]/55">Yuk dimasak hari ini</p>
                </div>
              </div>
            </div>
            <div className="sp-float-slow absolute left-40 top-20 w-64 rounded-2xl bg-[#eaf2e9] p-4 text-[#173d2b] shadow-2xl" style={{ ["--r" as string]: "3deg" }}>
              <p className="flex items-center gap-2 text-xs font-bold text-[#27613d]">
                <Sparkles size={14} /> Rekomendasi hari ini
              </p>
              <p className="mt-1.5 font-bold">Omelet bayam tomat</p>
              <p className="text-xs text-[#173d2b]/60">95% cocok · 15 menit</p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-white/50">© {new Date().getFullYear()} SmartPantry</p>
      </aside>

      {/* Panel kanan: form */}
      <section className="relative flex items-center justify-center overflow-hidden px-6 py-10">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#cfe3cf] opacity-60 blur-3xl lg:hidden" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#f9d9b0] opacity-50 blur-3xl" />

        <div className="sp-rise relative w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-black lg:invisible">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173d2b] text-white">
                <Leaf size={18} />
              </span>
              SmartPantry
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-[#173d2b]/60 transition hover:text-[#173d2b]">
              <ArrowLeft size={15} /> Beranda
            </Link>
          </div>

          <div className="rounded-3xl border border-white bg-white/80 p-7 shadow-2xl shadow-[#173d2b]/10 backdrop-blur md:p-9">
            <h1 className="text-3xl font-black tracking-tight">
              Selamat datang <span className="font-serif font-semibold italic text-[#4f9566]">kembali</span> 👋
            </h1>
            <p className="mt-2 text-[#173d2b]/60">Masuk untuk mengelola persediaan dapurmu.</p>

            <form onSubmit={submit} className="mt-8 grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                <div className="relative">
                  <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#173d2b]/35" />
                  <input
                    id="email"
                    className={input}
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-semibold">Password</label>
                <div className="relative">
                  <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#173d2b]/35" />
                  <input
                    id="password"
                    className={`${input} pr-12`}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#173d2b]/40 transition hover:bg-[#173d2b]/5 hover:text-[#173d2b]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
                </div>
              )}

              <button
                disabled={loading}
                className="group flex items-center justify-center gap-2 rounded-xl bg-[#173d2b] px-5 py-4 font-bold text-white shadow-xl shadow-[#173d2b]/25 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    Masuk <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#173d2b]/60">
              Belum punya akun?{" "}
              <Link className="font-bold text-[#27613d] underline-offset-4 hover:underline" href="/register">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}