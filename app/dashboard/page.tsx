import { createClient } from "@/lib/supabase/server";
import { Boxes, AlertTriangle, ChefHat } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase=await createClient();
  const {data:userData}=await supabase.auth.getUser();
  const {data:items}=await supabase.from("inventory_items").select("*").order("created_at",{ascending:false});
  const inventory=items??[];
  const low=inventory.filter((x:any)=>Number(x.quantity)<=Number(x.minimum_quantity??1));
  const expiring=inventory.filter((x:any)=>x.expiry_date && new Date(x.expiry_date).getTime()>=Date.now() && new Date(x.expiry_date).getTime()<=Date.now()+3*86400000);
  return <div>
    <p className="text-sm font-semibold text-[#568064]">SMARTPANTRY / DASHBOARD</p>
    <h1 className="mt-2 text-3xl font-black">Halo, {userData.user?.user_metadata?.full_name || "Pengguna"} 👋</h1>
    <p className="mt-2 text-gray-500">Ini ringkasan persediaan bahan makananmu.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <Stat icon={<Boxes/>} label="Jenis bahan" value={inventory.length}/>
      <Stat icon={<AlertTriangle/>} label="Stok menipis" value={low.length}/>
      <Stat icon={<ChefHat/>} label="Segera kedaluwarsa" value={expiring.length}/>
    </div>
    <div className="mt-9 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Bahan terbaru</h2><Link className="font-bold text-[#39764b]" href="/dashboard/inventory">Kelola inventaris →</Link></div>
    <div className="mt-4 overflow-hidden rounded-2xl border">
      {inventory.length===0?<p className="p-6 text-sm text-gray-500">Belum ada bahan. Tambahkan bahan pertamamu di halaman Inventaris.</p>:<div className="divide-y">{inventory.slice(0,6).map((item:any)=><div key={item.id} className="flex justify-between gap-3 p-4"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-500">{item.expiry_date?`Kedaluwarsa: ${item.expiry_date}`:"Tanpa tanggal kedaluwarsa"}</p></div><p className="font-bold">{item.quantity} {item.unit}</p></div>)}</div>}
    </div>
    <Link href="/dashboard/recipes" className="mt-6 flex items-center justify-between rounded-2xl bg-[#edf5ed] p-5"><div><p className="font-bold text-[#173d2b]">Cari inspirasi masakan</p><p className="mt-1 text-sm text-gray-600">Temukan resep dari bahan yang kamu punya.</p></div><ChefHat className="text-[#39764b]"/></Link>
  </div>;
}
function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:number}) {
  return <div className="rounded-2xl border p-5"><div className="flex items-center gap-2 text-[#568064]">{icon}<span className="text-sm">{label}</span></div><p className="mt-4 text-4xl font-black">{value}</p></div>;
}
