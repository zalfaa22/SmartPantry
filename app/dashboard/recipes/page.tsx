
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChefHat,
  Clock,
  Search,
  ShoppingBasket,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
  Package,
  X,
} from "lucide-react";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

type Suggestion = {
  recipe_id: string;
  recipe_name: string;
  description: string | null;
  cooking_time: number | null;
  available_ingredients: string[];
  missing_ingredients: string[];
  recipe_ingredients: string[];
  recipe_steps: string[];
  match_percent: number;
  explanation?: string;
};

type SearchMode = "inventory" | "name";

function MatchRing({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const color =
    pct >= 80 ? "#2f8f4e" : pct >= 50 ? "#e49a3b" : "#d9644a";

  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#e6f1e8"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * pct) / 100}
        />
      </svg>
      <span className="absolute text-sm font-black text-[#173d2b]">
        {pct}%
      </span>
    </div>
  );
}

export default function RecipesPage() {
  const [mode, setMode] = useState<SearchMode>("inventory");

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [recommendationLimit, setRecommendationLimit] = useState(5);
  const [recipeQuery, setRecipeQuery] = useState("");

  const [items, setItems] = useState<Suggestion[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [loadingInventory, setLoadingInventory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function loadInventory() {
      try {
        const response = await fetch("/api/inventory");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal memuat inventaris");
        }

        const rows: InventoryItem[] = Array.isArray(result)
          ? result
          : result.data || [];

        setInventory(rows.filter((item) => Number(item.quantity) > 0));
        setSelectedIds(
          rows
            .filter((item) => Number(item.quantity) > 0)
            .map((item) => item.id)
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat inventaris"
        );
      } finally {
        setLoadingInventory(false);
      }
    }

    loadInventory();
  }, []);

  const selectedCount = selectedIds.length;

  const allSelected = useMemo(
    () =>
      inventory.length > 0 &&
      inventory.every((item) => selectedIds.includes(item.id)),
    [inventory, selectedIds]
  );

  function toggleIngredient(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  }

  function toggleAllIngredients() {
    setSelectedIds(
      allSelected ? [] : inventory.map((item) => item.id)
    );
  }

  async function searchRecipes() {
    setLoading(true);
    setError("");
    setItems([]);
    setExpandedId(null);
    setDone(false);

    try {
      const payload =
        mode === "inventory"
          ? {
              mode: "inventory",
              inventoryIds: selectedIds,
              limit: recommendationLimit,
            }
          : {
              mode: "name",
              query: recipeQuery.trim(),
              limit: recommendationLimit,
            };
            console.log("MODE:", mode);
console.log("ID BAHAN TERPILIH:", selectedIds);
console.log(
  "NAMA BAHAN TERPILIH:",
  inventory
    .filter((item) => selectedIds.includes(item.id))
    .map((item) => item.name)
);
console.log("PAYLOAD:", payload);

      const response = await fetch("/api/recipes/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mencari resep");
      }

      const recommendations: Suggestion[] =
  mode === "name"
    ? result.data || []
    : (result.data || []).filter(
        (item: Suggestion) => item.match_percent > 0
      );

console.log("HASIL REKOMENDASI:", result.data);
console.log("HASIL SETELAH FILTER:", recommendations);

setItems(recommendations);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  const canSearch =
    mode === "inventory"
      ? selectedCount > 0
      : recipeQuery.trim().length >= 2;

  return (
    <div className="text-[#173d2b]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#4f9566]">
        SmartPantry / Resep AI
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
        Rekomendasi{" "}
        <span className="font-serif font-semibold italic text-[#4f9566]">
          resep
        </span>
      </h1>

      <p className="mt-2 text-[#173d2b]/60">
        Pilih bahan yang ingin digunakan atau cari masakan favoritmu.
      </p>

      {/* Banner */}
      <div className="relative mt-7 overflow-hidden rounded-3xl bg-[#173d2b] p-7 text-white md:p-9">
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#4f9566]/40 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 h-44 w-44 rounded-full bg-[#f4a259]/25 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f4a259]">
            <Sparkles size={14} /> SmartPantry AI
          </span>

          <h2 className="mt-4 text-2xl font-black md:text-3xl">
            Mau masak apa hari ini?
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/70">
            Temukan inspirasi masakan dari bahan yang kamu miliki atau
            langsung cari resep berdasarkan nama masakan.
          </p>
        </div>
      </div>

      {/* Mode pencarian */}
      <div className="mt-7 rounded-3xl border border-[#173d2b]/10 bg-white p-5 md:p-7">
        <h2 className="text-lg font-black">Atur pencarian resep</h2>
        <p className="mt-1 text-sm text-[#173d2b]/55">
          Tentukan cara SmartPantry mencari resep untukmu.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => {
              setMode("inventory");
              setItems([]);
              setError("");
              setDone(false);
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === "inventory"
                ? "border-[#39764b] bg-[#edf5ed] ring-1 ring-[#39764b]"
                : "border-[#173d2b]/10 hover:bg-[#f7faf6]"
            }`}
          >
            <Package
              className="mb-3 text-[#39764b]"
              size={23}
            />
            <p className="font-bold">Berdasarkan inventaris</p>
            <p className="mt-1 text-xs leading-5 text-[#173d2b]/55">
              Pilih bahan makanan yang ingin digunakan.
            </p>
          </button>

          <button
            onClick={() => {
              setMode("name");
              setItems([]);
              setError("");
              setDone(false);
            }}
            className={`rounded-2xl border p-4 text-left transition ${
              mode === "name"
                ? "border-[#39764b] bg-[#edf5ed] ring-1 ring-[#39764b]"
                : "border-[#173d2b]/10 hover:bg-[#f7faf6]"
            }`}
          >
            <Search className="mb-3 text-[#39764b]" size={23} />
            <p className="font-bold">Cari nama masakan</p>
            <p className="mt-1 text-xs leading-5 text-[#173d2b]/55">
              Cari resep berdasarkan nama makanan yang kamu inginkan.
            </p>
          </button>
        </div>

        {/* Mode inventaris */}
        {mode === "inventory" && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">Pilih bahan makanan</h3>
                <p className="mt-1 text-xs text-[#173d2b]/55">
                  {selectedCount} dari {inventory.length} bahan dipilih
                </p>
              </div>

              <button
                type="button"
                onClick={toggleAllIngredients}
                disabled={!inventory.length}
                className="text-sm font-bold text-[#39764b] hover:underline disabled:opacity-40"
              >
                {allSelected ? "Batalkan semua" : "Pilih semua"}
              </button>
            </div>

            {loadingInventory ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#173d2b]/60">
                <Loader2 size={16} className="animate-spin" />
                Memuat inventaris...
              </div>
            ) : inventory.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm text-orange-800">
                Inventaris masih kosong. Tambahkan bahan makanan terlebih
                dahulu.
              </div>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item) => {
                  const checked = selectedIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleIngredient(item.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        checked
                          ? "border-[#4f9566] bg-[#f0f7ef]"
                          : "border-[#173d2b]/10 bg-white hover:bg-[#f8faf7]"
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                          checked
                            ? "border-[#39764b] bg-[#39764b] text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {checked && <Check size={13} />}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">
                          {item.name}
                        </span>
                        <span className="text-xs text-[#173d2b]/50">
                          Stok: {item.quantity} {item.unit}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Mode pencarian nama */}
        {mode === "name" && (
          <div className="mt-6">
            <label className="text-sm font-bold" htmlFor="recipe-query">
              Nama masakan yang ingin dicari
            </label>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#173d2b]/15 px-4 focus-within:border-[#4f9566]">
                <Search size={18} className="shrink-0 text-[#4f9566]" />
                <input
                  id="recipe-query"
                  value={recipeQuery}
                  onChange={(event) => setRecipeQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && canSearch && !loading) {
                      searchRecipes();
                    }
                  }}
                  placeholder="Contoh: nasi goreng, ayam kecap..."
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />
                {recipeQuery && (
                  <button
                    onClick={() => setRecipeQuery("")}
                    aria-label="Hapus pencarian"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <p className="mt-2 text-xs text-[#173d2b]/50">
              Resep dicari dari database, kemudian Qwen AI membantu
              menganalisis kecocokan bahan dan memberikan penjelasan.
            </p>
          </div>
        )}

        {/* Jumlah rekomendasi */}
        <div className="mt-6">
          <label className="text-sm font-bold" htmlFor="recommendation-limit">
            Jumlah rekomendasi
          </label>

          <select
            id="recommendation-limit"
            value={recommendationLimit}
            onChange={(event) =>
              setRecommendationLimit(Number(event.target.value))
            }
            className="mt-2 block w-full rounded-xl border border-[#173d2b]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#4f9566] sm:w-52"
          >
            <option value={3}>3 resep</option>
            <option value={5}>5 resep</option>
            <option value={10}>10 resep</option>
          </select>
        </div>

        <button
          onClick={searchRecipes}
          disabled={!canSearch || loading || loadingInventory}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d2b] px-6 py-4 font-bold text-white transition hover:bg-[#24543a] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {loading
            ? "Sedang mencari dan menganalisis..."
            : "Cari rekomendasi resep"}
        </button>

        {loading && (
          <p className="mt-3 text-xs text-[#173d2b]/50">
            Analisis AI dilakukan secara bertahap. Mohon tunggu sampai hasil
            selesai dimuat.
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-[#173d2b]/10 bg-white p-6"
            >
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

      {/* Hasil rekomendasi */}
      {!loading && items.length > 0 && (
        <div className="mt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-black">Hasil rekomendasi</h2>
              <p className="mt-1 text-sm text-[#173d2b]/55">
                Ditemukan {items.length} resep dengan kecocokan bahan di atas
                0%.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((item) => {
              const expanded = expandedId === item.recipe_id;

              return (
                <article
                  key={item.recipe_id}
                  className="flex flex-col rounded-3xl border border-[#173d2b]/10 bg-white p-6 transition hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-xl font-black leading-snug">
                        {item.recipe_name}
                      </h2>

                      <p className="mt-1 text-sm text-[#173d2b]/55">
                        {item.description || "Resep pilihan SmartPantry"}
                      </p>

                      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f2f7f1] px-3 py-1 text-xs font-bold text-[#27613d]">
                        <Clock size={13} />
                        {item.cooking_time ?? "-"} menit
                      </span>
                    </div>

                    <MatchRing value={item.match_percent} />
                  </div>

                  {/* Bahan tersedia */}
                  <div className="mt-5 rounded-2xl bg-green-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-green-800">
                      <Check size={15} />
                      Bahan tersedia ({item.available_ingredients.length})
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.available_ingredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-700"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bahan kurang */}
                  <div className="mt-3 rounded-2xl bg-orange-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-orange-800">
                      <ShoppingBasket size={15} />
                      Bahan kurang ({item.missing_ingredients.length})
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.missing_ingredients.length > 0 ? (
                        item.missing_ingredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700"
                          >
                            {ingredient}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm font-semibold text-orange-700">
                          Semua bahan tersedia! 🎉
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Penjelasan AI */}
                  {item.explanation && (
                    <div className="mt-3 rounded-2xl bg-[#173d2b] p-5 text-white">
                      <p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#f4a259]">
                        <Sparkles size={15} />
                        Penjelasan AI
                      </p>
                      <p className="whitespace-pre-line text-sm leading-6 text-white/80">
                        {item.explanation}
                      </p>
                    </div>
                  )}

                  {/* Detail resep */}
                  <button
                    onClick={() =>
                      setExpandedId(expanded ? null : item.recipe_id)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#39764b]/25 py-3 text-sm font-bold text-[#39764b] transition hover:bg-[#f2f7f1]"
                  >
                    <ChefHat size={17} />
                    {expanded ? "Tutup detail resep" : "Lihat detail & cara memasak"}
                    {expanded ? (
                      <ChevronUp size={17} />
                    ) : (
                      <ChevronDown size={17} />
                    )}
                  </button>

                  {expanded && (
                    <div className="mt-5 border-t border-[#173d2b]/10 pt-5">
                      <h3 className="font-black">Bahan yang dibutuhkan</h3>

                      <ul className="mt-3 space-y-2">
                        {item.recipe_ingredients.map((ingredient) => {
                          const available =
                            item.available_ingredients.some(
                              (name) =>
                                name.trim().toLowerCase() ===
                                ingredient.trim().toLowerCase()
                            );

                          return (
                            <li
                              key={ingredient}
                              className="flex items-center gap-2 text-sm"
                            >
                              {available ? (
                                <Check
                                  size={16}
                                  className="text-green-600"
                                />
                              ) : (
                                <ShoppingBasket
                                  size={16}
                                  className="text-orange-500"
                                />
                              )}
                              <span>{ingredient}</span>
                              <span
                                className={`ml-auto text-xs font-semibold ${
                                  available
                                    ? "text-green-700"
                                    : "text-orange-600"
                                }`}
                              >
                                {available ? "Tersedia" : "Belum tersedia"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="mt-6">
                        <h3 className="font-black">Langkah memasak</h3>

                        {item.recipe_steps?.length > 0 ? (
                          <ol className="mt-3 space-y-3">
                            {item.recipe_steps.map((step, index) => (
                              <li
                                key={index}
                                className="flex gap-3 text-sm leading-6 text-[#173d2b]/75"
                              >
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eaf2e9] text-xs font-black text-[#39764b]">
                                  {index + 1}
                                </span>
                                <span className="pt-0.5">{step}</span>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="mt-2 text-sm text-[#173d2b]/50">
                            Langkah memasak belum tersedia untuk resep ini.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !loading && !error && (
        <div className="mt-7 rounded-3xl border-2 border-dashed border-[#173d2b]/15 bg-[#f7faf6] px-6 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eaf2e9]">
            <ChefHat className="text-[#39764b]" size={30} />
          </span>

          <p className="mt-4 font-bold">
            {done ? "Belum ada resep yang cocok" : "Belum ada rekomendasi"}
          </p>

          <p className="mx-auto mt-1 max-w-sm text-sm text-[#173d2b]/55">
            {done
              ? "Coba pilih bahan lain atau gunakan nama masakan yang berbeda."
              : "Atur pencarian di atas untuk menemukan resep yang kamu inginkan."}
          </p>
        </div>
      )}
    </div>
  );
}
