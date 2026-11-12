import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("id-ID");
}

function normalizeUnit(value: string) {
  return value.trim().toLocaleLowerCase("id-ID");
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: any;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Format request tidak valid." },
      { status: 400 }
    );
  }

  const mode = body.mode ?? "inventory";
  const limit = Math.min(Math.max(Number(body.limit) || 3, 1), 20);
  const inventoryIds: string[] = Array.isArray(body.inventoryIds)
    ? body.inventoryIds
    : [];
  const query = typeof body.query === "string" ? body.query.trim() : "";

  if (mode !== "inventory" && mode !== "name") {
    return NextResponse.json(
      { message: "Mode rekomendasi tidak valid." },
      { status: 400 }
    );
  }

  if (mode === "name" && !query) {
    return NextResponse.json(
      { message: "Masukkan nama resep yang ingin dicari." },
      { status: 400 }
    );
  }

  // 1. Ambil inventaris milik user.
  let inventoryQuery = supabase
    .from("inventory_items")
    .select(`
      id,
      ingredient_id,
      quantity,
      unit,
      ingredients (
        id,
        name,
        normalized_name
      )
    `)
    .eq("user_id", user.id)
    .gt("quantity", 0);

  // Jika user memilih bahan tertentu, gunakan bahan yang dipilih saja.
  if (inventoryIds.length > 0) {
    inventoryQuery = inventoryQuery.in("id", inventoryIds);
  }

  const { data: inventory, error: inventoryError } = await inventoryQuery;

  if (inventoryError) {
    return NextResponse.json(
      { message: inventoryError.message },
      { status: 500 }
    );
  }

  if (mode === "inventory" && (!inventory || inventory.length === 0)) {
    return NextResponse.json(
      {
        message:
          "Inventaris masih kosong. Tambahkan atau pilih bahan terlebih dahulu.",
      },
      { status: 400 }
    );
  }

  // 2. Ambil resep, bahan resep, dan seluruh langkah memasak.
  const { data: recipes, error: recipeError } = await supabase
    .from("recipes")
    .select(`
      id,
      name,
      description,
      recipe_ingredients (
        id,
        ingredient_id,
        quantity,
        unit,
        original_text,
        ingredients (
          id,
          name,
          normalized_name
        )
      ),
      recipe_steps (
        step_number,
        instruction
      )
    `)
    .limit(500);

  if (recipeError) {
    return NextResponse.json(
      { message: recipeError.message },
      { status: 500 }
    );
  }

  // 3. Filter resep berdasarkan nama jika menggunakan mode pencarian.
  let filteredRecipes = recipes ?? [];

  if (mode === "name") {
    filteredRecipes = filteredRecipes.filter((recipe: any) =>
      normalize(recipe.name).includes(normalize(query))
    );
  }

  // 4. Hitung kecocokan bahan setiap resep.
  const candidates = filteredRecipes
    .map((recipe: any) => {
      const recipeIngredients = recipe.recipe_ingredients ?? [];
      const recipeSteps = (recipe.recipe_steps ?? [])
        .sort(
          (a: any, b: any) => a.step_number - b.step_number
        )
        .map((step: any) => step.instruction);

      const availableDetails: any[] = [];
      const missingDetails: any[] = [];

      for (const item of recipeIngredients) {
        const ingredientName =
          item.ingredients?.name ?? item.original_text ?? "Bahan tidak diketahui";

        const inventoryItem = (inventory ?? []).find(
          (stock: any) =>
            stock.ingredient_id === item.ingredient_id &&
            normalize(stock.ingredients?.normalized_name ?? "") ===
              normalize(item.ingredients?.normalized_name ?? "")
        );

        let isAvailable = false;
        let reason = "";

        if (!inventoryItem) {
          reason = "Bahan belum tersedia di inventaris.";
        } else if (item.quantity === null || item.quantity === undefined) {
          // Jika resep tidak mencantumkan jumlah, cukup cek keberadaan bahan.
          isAvailable = true;
        } else if (
          normalizeUnit(inventoryItem.unit) !==
          normalizeUnit(item.unit ?? "")
        ) {
          reason = `Satuan inventaris (${inventoryItem.unit}) berbeda dengan kebutuhan resep (${item.unit ?? "tidak diketahui"}).`;
        } else if (
          Number(inventoryItem.quantity) >= Number(item.quantity)
        ) {
          isAvailable = true;
        } else {
          reason = `Stok tersedia ${inventoryItem.quantity} ${inventoryItem.unit}, sedangkan resep membutuhkan ${item.quantity} ${item.unit}.`;
        }

        const detail = {
          ingredient_id: item.ingredient_id,
          name: ingredientName,
          required_quantity:
            item.quantity === null ? null : Number(item.quantity),
          required_unit: item.unit,
          available_quantity: inventoryItem
            ? Number(inventoryItem.quantity)
            : 0,
          available_unit: inventoryItem?.unit ?? null,
          original_text: item.original_text,
          reason,
        };

        if (isAvailable) {
          availableDetails.push(detail);
        } else {
          missingDetails.push(detail);
        }
      }

      const matchPercent = recipeIngredients.length
        ? Math.round(
            (availableDetails.length / recipeIngredients.length) * 100
          )
        : 0;

      return {
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        description: recipe.description,

        // Format string agar tetap cocok dengan frontend saat ini.
        available_ingredients: availableDetails.map((item) => item.name),
        missing_ingredients: missingDetails.map((item) => item.name),
        recipe_ingredients: recipeIngredients.map(
          (item: any) =>
            item.ingredients?.name ?? item.original_text ?? "Bahan tidak diketahui"
        ),

        // Data detail untuk AI dan informasi stok.
        inventory_match_demo: {
          available: availableDetails,
          missing: missingDetails,
        },

        recipe_ingredients_detail: recipeIngredients.map((item: any) => ({
          ingredient_id: item.ingredient_id,
          name:
            item.ingredients?.name ??
            item.original_text ??
            "Bahan tidak diketahui",
          quantity: item.quantity === null ? null : Number(item.quantity),
          unit: item.unit,
          original_text: item.original_text,
        })),

        recipe_steps: recipeSteps,
        match_percent: matchPercent,
        explanation: "",
      };
    })
    .filter((recipe: any) => recipe.recipe_ingredients.length > 0)
    .sort((a: any, b: any) => b.match_percent - a.match_percent)
    .slice(0, limit);

  // 5. Kirim data resep ke AI Service.
  const aiUrl = process.env.AI_SERVICE_URL?.replace(/\/+$/, "");
  const enriched = [];

  for (const candidate of candidates) {
    let explanation =
      "Penjelasan AI belum tersedia. Data kecocokan bahan dihitung dari inventaris.";
    let cookingSteps = candidate.recipe_steps;
    let stepsSource = "database";

    if (aiUrl) {
      try {
        const response = await fetch(`${aiUrl}/explain`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_name: candidate.recipe_name,
            recipe_ingredients: candidate.recipe_ingredients_detail,
            inventory_match_demo: candidate.inventory_match_demo,
            recipe_steps: candidate.recipe_steps,
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(120000),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`AI Service ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (typeof result.explanation === "string" && result.explanation.trim()) {
          explanation = result.explanation;
        }

        // Database tetap menjadi sumber utama langkah memasak.
        // Hasil AI hanya digunakan jika format dan isinya sama persis.
        if (
          Array.isArray(result.cooking_steps) &&
          JSON.stringify(result.cooking_steps) ===
            JSON.stringify(candidate.recipe_steps)
        ) {
          cookingSteps = result.cooking_steps;
          stepsSource = "ai_validated";
        }
      } catch (error) {
        console.error(
          `AI error untuk resep ${candidate.recipe_name}:`,
          error
        );
      }
    }

    enriched.push({
      ...candidate,
      explanation,
      cooking_steps: cookingSteps,
      steps_source: stepsSource,
    });
  }

  return NextResponse.json({
    success: true,
    data: enriched,
  });
}