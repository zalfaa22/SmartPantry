import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema=z.object({
  name:z.string().trim().min(1).max(100),
  quantity:z.number().min(0),
  unit:z.string().trim().min(1).max(20),
  expiry_date:z.string().nullable().optional()
});

export async function GET(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({message:"Unauthorized"},{status:401});
 const {data,error}=await supabase.from("inventory_items").select("*").eq("user_id",user.id).order("name");
 if(error)return NextResponse.json({message:error.message},{status:500});
 return NextResponse.json({success:true,data});
}

export async function POST(request:Request){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({message:"Unauthorized"},{status:401});
 const parsed=schema.safeParse(await request.json());
 if(!parsed.success)return NextResponse.json({message:"Data bahan tidak valid",errors:parsed.error.flatten()},{status:400});
 const {data,error}=await supabase.from("inventory_items").insert({...parsed.data,user_id:user.id}).select().single();
 if(error)return NextResponse.json({message:error.message},{status:400});
 return NextResponse.json({success:true,data},{status:201});
}
