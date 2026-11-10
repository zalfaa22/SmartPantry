"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";

type Item={id:string;name:string;quantity:number;unit:string;expiry_date:string|null;minimum_quantity:number};
export default function InventoryPage(){
 const [items,setItems]=useState<Item[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 const [name,setName]=useState(""); const [quantity,setQuantity]=useState("1"); const [unit,setUnit]=useState("pcs"); const [expiry,setExpiry]=useState("");
 async function load(){setLoading(true);const r=await fetch("/api/inventory");const j=await r.json();if(!r.ok)setError(j.message||"Gagal memuat");else setItems(j.data);setLoading(false);}
 useEffect(()=>{load();},[]);
 async function add(e:React.FormEvent){e.preventDefault();setError("");const r=await fetch("/api/inventory",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,quantity:Number(quantity),unit,expiry_date:expiry||null})});const j=await r.json();if(!r.ok){setError(j.message);return;}setName("");setQuantity("1");setExpiry("");load();}
 async function remove(id:string){if(!confirm("Hapus bahan ini?"))return;const r=await fetch(`/api/inventory/${id}`,{method:"DELETE"});if(!r.ok){const j=await r.json();setError(j.message);return;}load();}
 return <div><p className="text-sm font-semibold text-[#568064]">SMARTPANTRY / INVENTARIS</p><h1 className="mt-2 text-3xl font-black">Inventaris bahan</h1><p className="mt-2 text-gray-500">Catat dan pantau persediaan bahan makanan.</p>
 <form onSubmit={add} className="mt-7 grid gap-3 rounded-2xl bg-[#f7faf6] p-5 md:grid-cols-5">
 <input className="rounded-xl border bg-white p-3 md:col-span-2" placeholder="Nama bahan" value={name} onChange={e=>setName(e.target.value)} required/>
 <input className="rounded-xl border bg-white p-3" type="number" min="0" step="0.01" value={quantity} onChange={e=>setQuantity(e.target.value)} required/>
 <select className="rounded-xl border bg-white p-3" value={unit} onChange={e=>setUnit(e.target.value)}>{["pcs","gram","kg","ml","liter","butir","bungkus","ikat"].map(x=><option key={x}>{x}</option>)}</select>
 <input className="rounded-xl border bg-white p-3" type="date" value={expiry} onChange={e=>setExpiry(e.target.value)}/>
 <button className="flex items-center justify-center gap-2 rounded-xl bg-[#173d2b] p-3 font-bold text-white md:col-span-5"><Plus size={18}/> Tambah bahan</button>
 </form>
 {error&&<p className="mt-3 text-sm text-red-600">{error}</p>}
 <div className="mt-7 overflow-hidden rounded-2xl border"><div className="flex items-center justify-between border-b p-4"><h2 className="font-bold">Daftar bahan ({items.length})</h2><button onClick={load} className="text-sm text-[#39764b]"><RefreshCw size={16}/></button></div>
 {loading?<p className="p-5 text-gray-500">Memuat...</p>:items.length===0?<p className="p-5 text-gray-500">Belum ada bahan.</p>:<div className="divide-y">{items.map(x=><div key={x.id} className="flex items-center justify-between gap-3 p-4"><div><p className="font-bold">{x.name}</p><p className="text-sm text-gray-500">{x.expiry_date?`Kedaluwarsa ${x.expiry_date}`:"Tanggal kedaluwarsa belum diisi"}</p></div><div className="flex items-center gap-4"><span className="font-semibold">{x.quantity} {x.unit}</span><button onClick={()=>remove(x.id)} aria-label="Hapus" className="text-red-500"><Trash2 size={18}/></button></div></div>)}</div>}</div>
 </div>;
}
