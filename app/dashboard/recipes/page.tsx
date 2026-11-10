"use client";
import { useState } from "react";
import { Sparkles, ChefHat } from "lucide-react";

type Suggestion={recipe_id:string;recipe_name:string;description:string|null;cooking_time:number|null;available_ingredients:string[];missing_ingredients:string[];match_percent:number;explanation?:string};
export default function RecipesPage(){
 const [items,setItems]=useState<Suggestion[]>([]);const [loading,setLoading]=useState(false);const [error,setError]=useState("");
 async function recommend(){setLoading(true);setError("");setItems([]);try{const r=await fetch("/api/recipes/recommend",{method:"POST"});const j=await r.json();if(!r.ok)throw new Error(j.message||"Gagal mencari resep");setItems(j.data||[]);}catch(e){setError(e instanceof Error?e.message:"Terjadi kesalahan");}finally{setLoading(false);}}
 return <div><p className="text-sm font-semibold text-[#568064]">SMARTPANTRY / RESEP AI</p><h1 className="mt-2 text-3xl font-black">Rekomendasi resep</h1><p className="mt-2 text-gray-500">Temukan resep yang sesuai dengan persediaan bahan makananmu.</p>
 <button onClick={recommend} disabled={loading} className="mt-7 flex items-center gap-2 rounded-xl bg-[#173d2b] px-5 py-3 font-bold text-white disabled:opacity-60"><Sparkles size={18}/>{loading?"Mencari dan menganalisis...":"Buat rekomendasi AI"}</button>
 {error&&<p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
 <div className="mt-7 grid gap-4 lg:grid-cols-2">{items.map(item=><article key={item.recipe_id} className="rounded-2xl border p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{item.recipe_name}</h2><p className="mt-1 text-sm text-gray-500">{item.description||"Resep pilihan SmartPantry"}</p></div><span className="rounded-full bg-[#eaf4e9] px-3 py-1 text-sm font-bold text-[#27613d]">{item.match_percent}% cocok</span></div>
 <p className="mt-4 text-sm text-gray-600">⏱ {item.cooking_time??"-"} menit</p>
 <div className="mt-4"><p className="text-sm font-bold">Bahan tersedia</p><p className="mt-1 text-sm text-green-700">{item.available_ingredients.join(", ")||"-"}</p></div>
 <div className="mt-3"><p className="text-sm font-bold">Bahan kurang</p><p className="mt-1 text-sm text-orange-700">{item.missing_ingredients.join(", ")||"Semua bahan tersedia!"}</p></div>
 {item.explanation&&<div className="mt-4 rounded-xl bg-[#f2f7f1] p-4"><p className="mb-1 flex items-center gap-2 text-sm font-bold text-[#27613d]"><Sparkles size={15}/> Penjelasan AI</p><p className="whitespace-pre-line text-sm leading-6 text-gray-700">{item.explanation}</p></div>}
 </article>)}</div>
 {items.length===0&&!loading&&!error&&<div className="mt-8 rounded-2xl border border-dashed p-10 text-center"><ChefHat className="mx-auto text-[#568064]" size={36}/><p className="mt-3 font-bold">Belum ada rekomendasi</p><p className="mt-1 text-sm text-gray-500">Klik tombol di atas untuk mencari resep berdasarkan inventarismu.</p></div>}
 </div>;
}
