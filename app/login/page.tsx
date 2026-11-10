"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthFrame from "@/components/AuthFrame";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard"); router.refresh();
  }
  return <AuthFrame title="Selamat datang kembali" subtitle="Masuk untuk mengelola persediaan dapurmu.">
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-semibold">Email<input className="rounded-xl border p-3 font-normal" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
      <label className="grid gap-2 text-sm font-semibold">Password<input className="rounded-xl border p-3 font-normal" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="rounded-xl bg-[#173d2b] p-3 font-bold text-white disabled:opacity-60">{loading ? "Memproses..." : "Masuk"}</button>
      <p className="text-center text-sm text-gray-500">Belum punya akun? <Link className="font-bold text-[#27613d]" href="/register">Daftar</Link></p>
    </form>
  </AuthFrame>;
}

