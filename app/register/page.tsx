"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthFrame from "@/components/AuthFrame";

export default function RegisterPage() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const supabase=createClient();
    const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});
    setLoading(false);
    if(error) return setError(error.message);
    router.push("/login?registered=1");
  }
  return <AuthFrame title="Buat akun SmartPantry" subtitle="Mulai kelola bahan makananmu dengan lebih mudah.">
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-semibold">Nama<input className="rounded-xl border p-3 font-normal" value={name} onChange={e=>setName(e.target.value)} required /></label>
      <label className="grid gap-2 text-sm font-semibold">Email<input className="rounded-xl border p-3 font-normal" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
      <label className="grid gap-2 text-sm font-semibold">Password<input className="rounded-xl border p-3 font-normal" type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required /></label>
      {error&&<p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="rounded-xl bg-[#173d2b] p-3 font-bold text-white">{loading?"Memproses...":"Daftar"}</button>
      <p className="text-center text-sm text-gray-500">Sudah punya akun? <Link className="font-bold text-[#27613d]" href="/login">Masuk</Link></p>
    </form>
  </AuthFrame>;
}
