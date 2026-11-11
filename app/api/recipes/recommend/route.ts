import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function normalize(value:string){return value.trim().toLocaleLowerCase("id-ID");}

export async function POST(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({message:"Unauthorized"},{status:401});

 const [{data:inventory,error:inventoryError},{data:recipes,error:recipeError}]=await Promise.all([
   supabase.from("inventory_items").select("name,quantity,unit").eq("user_id",user.id).gt("quantity",0),
   supabase.from("recipes").select("id,name,description,cooking_time,steps,recipe_ingredients(ingredient_name,quantity,unit,notes)").limit(100)
 ]);
 if(inventoryError||recipeError)return NextResponse.json({message:inventoryError?.message||recipeError?.message},{status:500});
 if(!inventory?.length)return NextResponse.json({message:"Inventaris masih kosong. Tambahkan bahan terlebih dahulu."},{status:400});

 const availableNames=inventory.map(x=>x.name);
 const candidates=(recipes||[]).map((recipe:any)=>{
   const ingredients=recipe.recipe_ingredients||[];
   const available=ingredients.filter((i:any)=>availableNames.some(n=>normalize(n)===normalize(i.ingredient_name)));
   const missing=ingredients.filter((i:any)=>!availableNames.some(n=>normalize(n)===normalize(i.ingredient_name)));
   const percent=ingredients.length?Math.round(available.length/ingredients.length*100):0;
   return {recipe_id:recipe.id,recipe_name:recipe.name,description:recipe.description,cooking_time:recipe.cooking_time,
     available_ingredients:available.map((i:any)=>i.ingredient_name),
     missing_ingredients:missing.map((i:any)=>i.ingredient_name),
     recipe_ingredients:ingredients.map((i:any)=>i.ingredient_name),
     match_percent:percent};
 }).filter(x=>x.recipe_ingredients.length>0).sort((a,b)=>b.match_percent-a.match_percent).slice(0,3);

 
const aiUrl = process.env.AI_SERVICE_URL?.replace(/\/$/, "");

const enriched = [];

for (const candidate of candidates) {
  if (!aiUrl) {
    enriched.push({
      ...candidate,
      explanation: "AI_SERVICE_URL belum dikonfigurasi."
    });
    continue;
  }

  const recipe = (recipes || []).find(
    (r: any) => r.id === candidate.recipe_id
  ) as any;

  try {
    const response = await fetch(`${aiUrl}/explain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipe_name: candidate.recipe_name,
        recipe_ingredients: candidate.recipe_ingredients,
        available_ingredients: candidate.available_ingredients,
        missing_ingredients: candidate.missing_ingredients,
        recipe_steps: recipe?.steps || []
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(120000)
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `AI Service ${response.status}: ${errorText}`
      );
    }

    const result = await response.json();

    enriched.push({
      ...candidate,
      explanation:
        result.explanation || "AI tidak memberikan penjelasan."
    });

  } catch (error) {
    console.error(
      `AI error untuk resep ${candidate.recipe_name}:`,
      error
    );

    enriched.push({
      ...candidate,
      explanation:
        "AI sedang tidak dapat dihubungi. Data kecocokan bahan tetap dihitung dari inventaris."
    });
  }
}

 return NextResponse.json({success:true,data:enriched});
}
