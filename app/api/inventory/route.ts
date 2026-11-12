import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  quantity: z.number().min(0),
  unit: z.string().trim().min(1).max(20),
});

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("id-ID");
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("inventory_items")
    .select(`
      id,
      ingredient_id,
      quantity,
      unit,
      created_at,
      updated_at,
      ingredients (
        id,
        name,
        normalized_name,
        base_unit
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const result = (data ?? []).map((item: any) => ({
    id: item.id,
    ingredient_id: item.ingredient_id,
    name: item.ingredients?.name ?? "Bahan tidak diketahui",
    quantity: Number(item.quantity),
    unit: item.unit,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));

  return NextResponse.json({ success: true, data: result });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Data bahan tidak valid",
        errors: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { name, quantity, unit } = parsed.data;
  const normalizedName = normalize(name);

  // Cari bahan berdasarkan nama yang sudah dinormalisasi.
  let { data: ingredient, error: ingredientError } = await supabase
    .from("ingredients")
    .select("id, name")
    .eq("normalized_name", normalizedName)
    .maybeSingle();

  if (ingredientError) {
    return NextResponse.json(
      { message: ingredientError.message },
      { status: 500 }
    );
  }

  // Jika belum ada, buat data bahan baru.
  if (!ingredient) {
    const { data: newIngredient, error: insertIngredientError } =
      await supabase
        .from("ingredients")
        .insert({
          name: name.trim(),
          normalized_name: normalizedName,
        })
        .select("id, name")
        .single();

    if (insertIngredientError) {
      return NextResponse.json(
        { message: insertIngredientError.message },
        { status: 400 }
      );
    }

    ingredient = newIngredient;
  }

  // Simpan atau perbarui stok milik user.
  const { data, error } = await supabase
    .from("inventory_items")
    .upsert(
      {
        user_id: user.id,
        ingredient_id: ingredient.id,
        quantity,
        unit: unit.trim(),
      },
      {
        onConflict: "user_id,ingredient_id",
      }
    )
    .select(`
      id,
      ingredient_id,
      quantity,
      unit,
      created_at,
      updated_at,
      ingredients (
        id,
        name
      )
    `)
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        id: data.id,
        ingredient_id: data.ingredient_id,
        name: data.ingredients?.name ?? ingredient.name,
        quantity: Number(data.quantity),
        unit: data.unit,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    },
    { status: 201 }
  );
}