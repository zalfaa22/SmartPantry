"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CalendarDays,
  Clock,
  Plus,
  RefreshCw,
  Search,
  TrendingDown,
  Trash2,
} from "lucide-react";

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  minimum_quantity: number;
};

// ===== Aturan "stok menipis" berdasarkan kebiasaan rumah tangga =====
// g = berat (gram/kg), ml = volume (ml/liter), n = hitungan (pcs/butir/bungkus/ikat)
// Ubah angkanya di RULES sesuai kebutuhan keluargamu.
type Kind = "g" | "ml" | "n";
type Rule = { keys: string[]; g?: number; ml?: number; n?: number };

// Urutan penting: yang lebih spesifik ditaruh lebih dulu (mis. "bawang putih" sebelum "bawang").
const RULES: Rule[] = [
  { keys: ["beras"], g: 1000 },
  { keys: ["gula"], g: 250, n: 1 },
  { keys: ["garam"], g: 100, n: 1 },
  { keys: ["tepung"], g: 250, n: 1 },
  { keys: ["mentega", "margarin"], g: 100, n: 1 },
  { keys: ["kopi", "teh"], g: 50, n: 1 },
  { keys: ["mie", "mi instan", "indomie"], n: 2, g: 150 },
  { keys: ["roti"], n: 2 },
  { keys: ["minyak"], ml: 500, n: 1 },
  { keys: ["susu"], ml: 250, n: 1 },
  { keys: ["kecap", "saus", "sambal"], ml: 100, n: 1 },
  { keys: ["telur"], n: 4, g: 250 },
  { keys: ["ayam", "daging", "sapi", "ikan", "udang", "cumi"], g: 250, n: 1 },
  { keys: ["tahu"], n: 2 },
  { keys: ["tempe"], n: 1 },
  { keys: ["bawang putih"], g: 50, n: 3 },
  { keys: ["bawang merah", "bawang bombay", "bawang"], g: 100, n: 3 },
  { keys: ["cabai", "cabe", "rawit"], g: 50 },
  { keys: ["jahe", "kunyit", "lengkuas", "serai"], g: 50 },
  { keys: ["bayam", "kangkung", "sawi", "selada"], g: 150, n: 1 },
  { keys: ["tomat"], g: 200, n: 2 },
  { keys: ["kentang"], g: 300, n: 2 },
  { keys: ["wortel"], g: 200, n: 2 },
  { keys: ["jagung", "brokoli", "kol", "kubis", "timun", "mentimun", "terong"], g: 200, n: 1 },
  { keys: ["jeruk", "apel", "pisang", "lemon", "alpukat"], n: 2 },
];
const FALLBACK: Record<Kind, number> = { g: 100, ml: 100, n: 1 };

function isLowStock(item: { name: string; quantity: number | string; unit: string }): boolean {
  const u = (item.unit || "").toLowerCase().trim();
  const q = Number(item.quantity) || 0;
  let kind: Kind = "n";
  let qty = q;
  if (u === "kg") { kind = "g"; qty = q * 1000; }
  else if (u === "gram" || u === "g") { kind = "g"; }
  else if (u === "liter" || u === "l") { kind = "ml"; qty = q * 1000; }
  else if (u === "ml") { kind = "ml"; }
  const n = (item.name || "").toLowerCase();
  const rule = RULES.find((r) => r.keys.some((k) => n.includes(k)));
  return qty <= (rule?.[kind] ?? FALLBACK[kind]);
}
// ===== akhir aturan stok =====

type Filter = "all" | "soon" | "expired" | "low";

const UNITS = ["pcs", "gram", "kg", "ml", "liter", "butir", "bungkus", "ikat"];

const EMOJI: [string, string][] = [
  ["wortel", "🥕"], ["telur", "🥚"], ["susu", "🥛"], ["tomat", "🍅"], ["bawang", "🧄"],
  ["ayam", "🍗"], ["bayam", "🥬"], ["sawi", "🥬"], ["kangkung", "🥬"], ["beras", "🍚"],
  ["nasi", "🍚"], ["keju", "🧀"], ["cabai", "🌶️"], ["cabe", "🌶️"], ["kentang", "🥔"],
  ["lemon", "🍋"], ["jeruk", "🍊"], ["apel", "🍎"], ["pisang", "🍌"], ["ikan", "🐟"],
  ["udang", "🦐"], ["daging", "🥩"], ["sapi", "🥩"], ["roti", "🍞"], ["tahu", "🧈"],
  ["tempe", "🟫"], ["mie", "🍜"], ["jagung", "🌽"], ["brokoli", "🥦"], ["timun", "🥒"],
  ["mentimun", "🥒"], ["terong", "🍆"], ["alpukat", "🥑"], ["garam", "🧂"], ["minyak", "🫒"],
  ["gula", "🍬"], ["kopi", "☕"], ["teh", "🍵"],
];
const emojiFor = (name: string) => {
  const n = name.toLowerCase();
  return EMOJI.find(([k]) => n.includes(k))?.[1] ?? "🧺";
};

function daysLeft(date: string | null): number | null {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function expiryBadge(date: string | null) {
  const d = daysLeft(date);
  if (d === null) return { text: "Tanpa tanggal", cls: "bg-gray-100 text-gray-500" };
  if (d < 0) return { text: `Lewat ${Math.abs(d)} hari`, cls: "bg-red-100 text-red-700" };
  if (d === 0) return { text: "Hari ini", cls: "bg-red-100 text-red-700" };
  if (d <= 3) return { text: `${d} hari lagi`, cls: "bg-amber-100 text-amber-700" };
  return { text: `${d} hari lagi`, cls: "bg-green-100 text-green-700" };
}

const isLow = (x: Item) => isLowStock(x);

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pcs");
  const [expiry, setExpiry] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  async function load() {
    setLoading(true);
    const r = await fetch("/api/inventory");
    const j = await r.json();
    if (!r.ok) setError(j.message || "Gagal memuat");
    else setItems(j.data);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity: Number(quantity), unit, expiry_date: expiry || null }),
    });
    const j = await r.json();
    if (!r.ok) {
      setError(j.message);
      return;
    }
    setName("");
    setQuantity("1");
    setExpiry("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Hapus bahan ini?")) return;
    const r = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json();
      setError(j.message);
      return;
    }
    load();
  }

  const stats = useMemo(() => {
    let soon = 0, expired = 0, low = 0;
    for (const x of items) {
      const d = daysLeft(x.expiry_date);
      if (d !== null && d < 0) expired++;
      else if (d !== null && d <= 3) soon++;
      if (isLow(x)) low++;
    }
    return { total: items.length, soon, expired, low };
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((x) => !q || x.name.toLowerCase().includes(q))
      .filter((x) => {
        const d = daysLeft(x.expiry_date);
        if (filter === "soon") return d !== null && d >= 0 && d <= 3;
        if (filter === "expired") return d !== null && d < 0;
        if (filter === "low") return isLow(x);
        return true;
      })
      .sort((a, b) => {
        const da = daysLeft(a.expiry_date);
        const db = daysLeft(b.expiry_date);
        if (da === null && db === null) return a.name.localeCompare(b.name);
        if (da === null) return 1;
        if (db === null) return -1;
        return da - db;
      });
  }, [items, query, filter]);

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: stats.total },
    { key: "soon", label: "Segera habis", count: stats.soon },
    { key: "expired", label: "Kedaluwarsa", count: stats.expired },
    { key: "low", label: "Stok menipis", count: stats.low },
  ];

  const statCards = [
    { icon: Boxes, label: "Total bahan", value: stats.total, cls: "bg-[#173d2b] text-white", sub: "text-white/60" },
    { icon: Clock, label: "Segera kedaluwarsa", value: stats.soon, cls: "bg-amber-50 text-[#173d2b]", sub: "text-[#173d2b]/55" },
    { icon: AlertTriangle, label: "Sudah kedaluwarsa", value: stats.expired, cls: "bg-red-50 text-[#173d2b]", sub: "text-[#173d2b]/55" },
    { icon: TrendingDown, label: "Stok menipis", value: stats.low, cls: "bg-[#eaf2e9] text-[#173d2b]", sub: "text-[#173d2b]/55" },
  ];

  const field =
    "w-full rounded-xl border border-[#173d2b]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4f9566] focus:ring-4 focus:ring-[#4f9566]/15";

  return (
    <div className="text-[#173d2b]">
      {/* Header */}
      <p className="text-xs font-bold uppercase tracking-widest text-[#4f9566]">SmartPantry / Inventaris</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Inventaris <span className="font-serif font-semibold italic text-[#4f9566]">bahan</span>
          </h1>
          <p className="mt-2 text-[#173d2b]/60">Catat dan pantau persediaan bahan makanan di dapurmu.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-xl border border-[#173d2b]/10 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-[#f2f7f1]"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Muat ulang
        </button>
      </div>

      {/* Ringkasan */}
      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, cls, sub }) => (
          <div key={label} className={`rounded-2xl p-5 ${cls}`}>
            <Icon size={20} className="opacity-80" />
            <p className="mt-3 text-3xl font-black">{value}</p>
            <p className={`text-xs font-medium ${sub}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Form tambah */}
      <form onSubmit={add} className="mt-6 rounded-3xl border border-[#173d2b]/10 bg-[#f7faf6] p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-black">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#173d2b] text-white">
            <Plus size={16} />
          </span>
          Tambah bahan baru
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-12">
          <input className={`${field} md:col-span-4`} placeholder="Nama bahan, mis. Telur" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className={`${field} md:col-span-2`} type="number" min="0" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <select className={`${field} md:col-span-2`} value={unit} onChange={(e) => setUnit(e.target.value)}>
            {UNITS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <div className="relative md:col-span-3">
            <CalendarDays size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#173d2b]/30" />
            <input className={field} type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </div>
          <button className="flex items-center justify-center rounded-xl bg-[#173d2b] px-4 py-3 font-bold text-white shadow-lg shadow-[#173d2b]/20 transition hover:-translate-y-0.5 md:col-span-1" aria-label="Tambah bahan">
            <Plus size={20} />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Daftar */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#173d2b]/10 bg-white">
        <div className="flex flex-col gap-4 border-b border-[#173d2b]/10 p-5 md:flex-row md:items-center md:justify-between">
          <h2 className="font-black">
            Daftar bahan <span className="font-medium text-[#173d2b]/45">({visible.length})</span>
          </h2>
          <div className="relative md:w-72">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#173d2b]/35" />
            <input className={`${field} pl-10`} placeholder="Cari bahan..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-[#173d2b]/10 px-5 py-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === t.key ? "bg-[#173d2b] text-white" : "bg-[#f2f7f1] text-[#173d2b]/70 hover:bg-[#e6f1e8]"
              }`}
            >
              {t.label} <span className="opacity-60">{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#f2f7f1]" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-5xl">🧺</p>
            <p className="mt-4 font-bold">{items.length === 0 ? "Belum ada bahan" : "Tidak ada bahan yang cocok"}</p>
            <p className="mt-1 text-sm text-[#173d2b]/55">
              {items.length === 0 ? "Tambahkan bahan pertamamu lewat form di atas." : "Coba ubah kata kunci atau filter."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#173d2b]/5">
            {visible.map((x) => {
              const badge = expiryBadge(x.expiry_date);
              return (
                <div key={x.id} className="group flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[#f7faf6]">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eaf2e9] text-2xl">{emojiFor(x.name)}</span>
                    <div className="min-w-0">
                      <p className="truncate font-bold">{x.name}</p>
                      <p className="text-xs text-[#173d2b]/50">
                        {x.expiry_date ? `Kedaluwarsa ${x.expiry_date}` : "Tanggal kedaluwarsa belum diisi"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 md:gap-5">
                    <span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline ${badge.cls}`}>{badge.text}</span>
                    {isLow(x) && (
                      <span className="hidden rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 md:inline">Menipis</span>
                    )}
                    <span className="min-w-[4.5rem] text-right font-black">
                      {x.quantity} <span className="text-sm font-semibold text-[#173d2b]/50">{x.unit}</span>
                    </span>
                    <button
                      onClick={() => remove(x.id)}
                      aria-label="Hapus"
                      className="grid h-9 w-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}