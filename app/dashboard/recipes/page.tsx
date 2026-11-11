"use client";
import { useState } from "react";
import { AlertTriangle, Check, ChefHat, Clock, ShoppingBasket, Sparkles } from "lucide-react";

type Suggestion = {
  recipe_id: string;
  recipe_name: string;
  description: string | null;
  cooking_time: number | null;
  available_ingredients: string[];
  missing_ingredients: string[];
  match_percent: number;
  explanation?: string;
};

function MatchRing({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = 26;
  const c = 2 * Math.PI * r;
  const color = pct >= 80 ? "#2f8f4e" : pct >= 50 ? "#e49a3b" : "#d9644a";
  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e6f1e8" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-black text-[#173d2b]">{pct}%</span>
    </div>
  );
}

export default function RecipesPage() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function recommend() {
    setLoading(true);
    setError("");
    setItems([]);
    setDone(false);
    try {
      const r = await fetch("/api/recipes/recommend", { method: "POST" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Gagal mencari resep");
      setItems(j.data || []);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-[#173d2b]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#4f9566]">SmartPantry / Resep AI</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
        Rekomendasi <span className="font-serif font-semibold italic text-[#4f9566]">resep</span>
      </h1>
      <p className="mt-2 text-[#173d2b]/60">Temukan resep yang sesuai dengan persediaan bahan makananmu.</p>

      {/* Banner aksi */}
      <div className="relative mt-7 overflow-hidden rounded-3xl bg-[#173d2b] p-7 text-white md:p-9">
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#4f9566]/40 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 h-44 w-44 rounded-full bg-[#f4a259]/25 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f4a259]">
              <Sparkles size={14} /> SmartPantry AI
            </span>
            <h2 className="mt-4 text-2xl font-black md:text-3xl">Bingung masak apa hari ini?</h2>
            <p className="mt-2 text-white/70">
              AI akan membaca inventarismu dan mencocokkannya dengan resep yang tersedia, lengkap dengan bahan yang masih kurang.
            </p>
          </div>
          <button
            onClick={recommend}
            disabled={loading}
            className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-[#173d2b] shadow-xl transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
          >
            <Sparkles size={18} className={loading ? "animate-pulse" : ""} />
            {loading ? "Mencari dan menganalisis..." : items.length ? "Buat ulang rekomendasi" : "Buat rekomendasi AI"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-[#173d2b]/10 bg-white p-6">
              <div className="flex justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-2/3 rounded bg-[#eaf2e9]" />
                  <div className="h-3 w-full rounded bg-[#f2f7f1]" />
                </div>
                <div className="h-16 w-16 rounded-full bg-[#eaf2e9]" />
              </div>
              <div className="mt-6 h-16 rounded-2xl bg-[#f2f7f1]" />
              <div className="mt-3 h-16 rounded-2xl bg-[#f2f7f1]" />
            </div>
          ))}
        </div>
      )}

      {/* Hasil */}
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.recipe_id}
            className="flex flex-col rounded-3xl border border-[#173d2b]/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-black leading-snug">{item.recipe_name}</h2>
                <p className="mt-1 text-sm text-[#173d2b]/55">{item.description || "Resep pilihan SmartPantry"}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f2f7f1] px-3 py-1 text-xs font-bold text-[#27613d]">
                  <Clock size={13} /> {item.cooking_time ?? "-"} menit
                </span>
              </div>
              <MatchRing value={item.match_percent} />
            </div>

            <div className="mt-5 rounded-2xl bg-green-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-green-800">
                <Check size={15} /> Bahan tersedia ({item.available_ingredients.length})
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.available_ingredients.length ? (
                  item.available_ingredients.map((b) => (
                    <span key={b} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-700">
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-green-700">-</span>
                )}
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-orange-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-orange-800">
                <ShoppingBasket size={15} /> Bahan kurang ({item.missing_ingredients.length})
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.missing_ingredients.length ? (
                  item.missing_ingredients.map((b) => (
                    <span key={b} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-orange-700">Semua bahan tersedia! 🎉</span>
                )}
              </div>
            </div>

            {item.explanation && (
              <div className="mt-3 rounded-2xl bg-[#173d2b] p-5 text-white">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#f4a259]">
                  <Sparkles size={15} /> Penjelasan AI
                </p>
                <p className="whitespace-pre-line text-sm leading-6 text-white/80">{item.explanation}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Kosong */}
      {items.length === 0 && !loading && !error && (
        <div className="mt-7 rounded-3xl border-2 border-dashed border-[#173d2b]/15 bg-[#f7faf6] px-6 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eaf2e9]">
            <ChefHat className="text-[#39764b]" size={30} />
          </span>
          <p className="mt-4 font-bold">{done ? "Belum ada resep yang cocok" : "Belum ada rekomendasi"}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[#173d2b]/55">
            {done
              ? "Coba tambah lebih banyak bahan di inventaris, lalu buat rekomendasi lagi."
              : "Klik tombol di atas untuk mencari resep berdasarkan inventarismu."}
          </p>
        </div>
      )}
    </div>
  );
}