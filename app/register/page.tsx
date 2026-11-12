"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, ArrowLeft, ArrowRight, Boxes, ChefHat, Eye, EyeOff, Leaf, Loader2, Lock, Mail, User } from "lucide-react";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length === 0) return { s: 0, label: "", color: "" };
  const levels = [
    { label: "Lemah", color: "bg-red-400" },
    { label: "Cukup", color: "bg-amber-400" },
    { label: "Bagus", color: "bg-lime-500" },
    { label: "Kuat", color: "bg-green-600" },
  ];
  const idx = Math.max(0, s - 1);
  return { s: Math.max(1, s), ...levels[idx] };
}

export default function RegisterPage() {
  const [name, setName] = useState("");
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
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/login?registered=1");
  }

  const pw = strength(password);
  const input =
    "w-full rounded-xl border border-[#173d2b]/10 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#173d2b]/30 focus:border-[#4f9566] focus:ring-4 focus:ring-[#4f9566]/15";

  const steps = [
    { icon: Boxes, title: "Catat bahan", desc: "Isi stok dan tanggal kedaluwarsa" },
    { icon: Leaf, title: "Pantau stok", desc: "Dapat peringatan sebelum bahan basi" },
    { icon: ChefHat, title: "Masak cerdas", desc: "Resep AI dari bahan yang ada" },
  ];

  return (
    <main className="grid min-h-screen bg-[#faf7ef] text-[#173d2b] lg:grid-cols-[1.05fr_1fr]">
      <style>{`
        @keyframes sp-rise { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
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
            Mulai dari
            <br />
            <span className="font-serif font-semibold italic text-[#f4a259]">dapurmu sendiri.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-white/70">
            Buat akun dan kelola bahan makanan dengan lebih mudah. Kurangi makanan terbuang, hemat uang belanja.
          </p>

          <div className="mt-10 space-y-3">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-[#173d2b]">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="font-bold">
                    <span className="mr-2 text-[#f4a259]">0{i + 1}</span>
                    {title}
                  </p>
                  <p className="text-sm text-white/65">{desc}</p>
                </div>
              </div>
            ))}
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
              Buat akun <span className="font-serif font-semibold italic text-[#4f9566]">SmartPantry</span>
            </h1>
            <p className="mt-2 text-[#173d2b]/60">Mulai kelola bahan makananmu dengan lebih mudah.</p>

            <form onSubmit={submit} className="mt-8 grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-semibold">Nama</label>
                <div className="relative">
                  <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#173d2b]/35" />
                  <input
                    id="name"
                    className={input}
                    autoComplete="name"
                    placeholder="Nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    minLength={8}
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
                {password.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= pw.s ? pw.color : "bg-[#173d2b]/10"}`} />
                      ))}
                    </div>
                    <span className="w-12 text-right text-xs font-semibold text-[#173d2b]/60">{pw.label}</span>
                  </div>
                )}
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
                    Daftar <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#173d2b]/60">
              Sudah punya akun?{" "}
              <Link className="font-bold text-[#27613d] underline-offset-4 hover:underline" href="/login">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}