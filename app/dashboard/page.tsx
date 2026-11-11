import { createClient } from "@/lib/supabase/server";
import { AlertTriangle, ArrowRight, Boxes, ChefHat, Clock, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

type Item = {
  id: string;
  name: string;
  quantity: number | string;
  unit: string;
  expiry_date: string | null;
  minimum_quantity?: number | string | null;
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

function toBase(item: { quantity: number | string; unit: string }): { kind: Kind; qty: number } {
  const u = (item.unit || "").toLowerCase().trim();
  const q = Number(item.quantity) || 0;
  if (u === "kg") return { kind: "g", qty: q * 1000 };
  if (u === "gram" || u === "g") return { kind: "g", qty: q };
  if (u === "liter" || u === "l") return { kind: "ml", qty: q * 1000 };
  if (u === "ml") return { kind: "ml", qty: q };
  return { kind: "n", qty: q };
}

function lowStockThreshold(item: { name: string; quantity: number | string; unit: string }) {
  const { kind } = toBase(item);
  const n = (item.name || "").toLowerCase();
  const rule = RULES.find((r) => r.keys.some((k) => n.includes(k)));
  return { kind, value: rule?.[kind] ?? FALLBACK[kind] };
}

function isLowStock(item: { name: string; quantity: number | string; unit: string }): boolean {
  return toBase(item).qty <= lowStockThreshold(item).value;
}

function thresholdLabel(item: { name: string; quantity: number | string; unit: string }): string {
  const { kind, value } = lowStockThreshold(item);
  if (kind === "g") return value >= 1000 ? `${value / 1000} kg` : `${value} gram`;
  if (kind === "ml") return value >= 1000 ? `${value / 1000} liter` : `${value} ml`;
  return `${value} ${item.unit}`;
}
// ===== akhir aturan stok =====

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
  const n = (name || "").toLowerCase();
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

function greeting() {
  const h = (new Date().getUTCHours() + 7) % 24; // WIB
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: items } = await supabase.from("inventory_items").select("*").order("created_at", { ascending: false });
  const inventory: Item[] = items ?? [];

  const low = inventory.filter(isLowStock);
  const expiring = inventory
    .filter(
      (x) =>
        x.expiry_date &&
        new Date(x.expiry_date).getTime() >= Date.now() &&
        new Date(x.expiry_date).getTime() <= Date.now() + 3 * 86400000
    )
    .sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime());

  const name = userData.user?.user_metadata?.full_name || "Pengguna";

  return (
    <div className="text-[#173d2b]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#4f9566]">SmartPantry / Dashboard</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
        {greeting()}, <span className="font-serif font-semibold italic text-[#4f9566]">{name}</span> 👋
      </h1>
      <p className="mt-2 text-[#173d2b]/60">Ini ringkasan persediaan bahan makananmu hari ini.</p>

      {/* Statistik */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={<Boxes size={20} />} label="Jenis bahan" value={inventory.length} cls="bg-[#173d2b] text-white" sub="text-white/60" />
        <Stat icon={<AlertTriangle size={20} />} label="Stok menipis" value={low.length} cls="bg-orange-50" sub="text-[#173d2b]/55" />
        <Stat icon={<Clock size={20} />} label="Segera kedaluwarsa" value={expiring.length} cls="bg-amber-50" sub="text-[#173d2b]/55" />
      </div>

      {/* Perlu perhatian */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Segera kedaluwarsa" icon={<Clock size={16} />} tone="text-amber-700">
          {expiring.length === 0 ? (
            <Empty emoji="🌿" text="Tidak ada bahan yang hampir kedaluwarsa." />
          ) : (
            expiring.slice(0, 4).map((x) => {
              const b = expiryBadge(x.expiry_date);
              return (
                <Row key={x.id} emoji={emojiFor(x.name)} title={x.name} sub={`${x.quantity} ${x.unit}`}>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${b.cls}`}>{b.text}</span>
                </Row>
              );
            })
          )}
        </Panel>
        <Panel title="Stok menipis" icon={<AlertTriangle size={16} />} tone="text-orange-700">
          {low.length === 0 ? (
            <Empty emoji="🧺" text="Semua stok masih aman." />
          ) : (
            low.slice(0, 4).map((x) => (
              <Row key={x.id} emoji={emojiFor(x.name)} title={x.name} sub={`Batas menipis ${thresholdLabel(x)}`}>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  {x.quantity} {x.unit}
                </span>
              </Row>
            ))
          )}
        </Panel>
      </div>

      {/* Bahan terbaru */}
      <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black">Bahan terbaru</h2>
        <Link className="flex items-center gap-1 font-bold text-[#39764b] transition hover:gap-2" href="/dashboard/inventory">
          Kelola inventaris <ArrowRight size={16} />
        </Link>
      </div>
      <div className="mt-4 overflow-hidden rounded-3xl border border-[#173d2b]/10">
        {inventory.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-5xl">🧺</p>
            <p className="mt-4 font-bold">Belum ada bahan</p>
            <p className="mt-1 text-sm text-[#173d2b]/55">Tambahkan bahan pertamamu di halaman Inventaris.</p>
            <Link
              href="/dashboard/inventory"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#173d2b] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              <Plus size={16} /> Tambah bahan
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#173d2b]/5">
            {inventory.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[#f7faf6]">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eaf2e9] text-2xl">{emojiFor(item.name)}</span>
                  <div className="min-w-0">
                    <p className="truncate font-bold">{item.name}</p>
                    <p className="text-xs text-[#173d2b]/50">
                      {item.expiry_date ? `Kedaluwarsa: ${item.expiry_date}` : "Tanpa tanggal kedaluwarsa"}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-black">
                  {item.quantity} <span className="text-sm font-semibold text-[#173d2b]/50">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA resep */}
      <Link
        href="/dashboard/recipes"
        className="group relative mt-6 flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-[#173d2b] p-6 text-white transition hover:-translate-y-0.5 hover:shadow-xl md:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#4f9566]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-[#f4a259]/25 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f4a259]">
            <Sparkles size={14} /> SmartPantry AI
          </span>
          <p className="mt-3 text-xl font-black md:text-2xl">Cari inspirasi masakan</p>
          <p className="mt-1 text-sm text-white/70">Temukan resep dari bahan yang kamu punya.</p>
        </div>
        <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[#173d2b] transition group-hover:scale-105">
          <ChefHat size={24} />
        </span>
      </Link>
    </div>
  );
}

function Stat({ icon, label, value, cls, sub }: { icon: React.ReactNode; label: string; value: number; cls: string; sub: string }) {
  return (
    <div className={`rounded-3xl p-6 ${cls}`}>
      <div className="opacity-80">{icon}</div>
      <p className="mt-4 text-4xl font-black">{value}</p>
      <p className={`mt-1 text-sm font-medium ${sub}`}>{label}</p>
    </div>
  );
}

function Panel({ title, icon, tone, children }: { title: string; icon: React.ReactNode; tone: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#173d2b]/10 bg-white p-5">
      <h2 className={`mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider ${tone}`}>
        {icon} {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ emoji, title, sub, children }: { emoji: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f7faf6] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{title}</p>
          <p className="text-xs text-[#173d2b]/50">{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[#f7faf6] px-4 py-8 text-center">
      <p className="text-3xl">{emoji}</p>
      <p className="mt-2 text-sm text-[#173d2b]/55">{text}</p>
    </div>
  );
}