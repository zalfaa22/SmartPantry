-- Jalankan seluruh SQL ini di Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity numeric(12,2) not null default 0 check (quantity >= 0),
  unit text not null default 'pcs',
  minimum_quantity numeric(12,2) not null default 1,
  expiry_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cooking_time integer,
  servings integer,
  steps text[] not null default '{}',
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  ingredient_name text not null,
  quantity numeric(12,2),
  unit text,
  notes text
);

create index if not exists idx_inventory_user on public.inventory_items(user_id);
create index if not exists idx_recipe_ingredients_recipe on public.recipe_ingredients(recipe_id);

alter table public.inventory_items enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;

drop policy if exists "Users manage own inventory" on public.inventory_items;
create policy "Users manage own inventory" on public.inventory_items
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Authenticated users read recipes" on public.recipes;
create policy "Authenticated users read recipes" on public.recipes
for select to authenticated using (true);

drop policy if exists "Authenticated users read recipe ingredients" on public.recipe_ingredients;
create policy "Authenticated users read recipe ingredients" on public.recipe_ingredients
for select to authenticated using (true);

-- Seed resep demo. Boleh dijalankan sekali.
insert into public.recipes (name,description,cooking_time,servings,steps) values
('Nasi Goreng Telur','Nasi goreng sederhana untuk menu sehari-hari.',15,1,
 array['Tumis bawang putih hingga harum.','Masukkan telur dan orak-arik.','Masukkan nasi dan aduk rata.','Tambahkan kecap dan bumbu, lalu sajikan.']),
('Telur Dadar Sayur','Telur dadar dengan tambahan sayuran.',10,1,
 array['Iris sayuran dan daun bawang.','Kocok telur bersama sayuran dan garam.','Panaskan minyak lalu goreng hingga matang di kedua sisi.']),
('Tumis Kangkung','Tumis sayuran praktis sebagai lauk.',12,2,
 array['Cuci dan siangi kangkung.','Tumis bawang putih dan cabai.','Masukkan kangkung, beri bumbu, lalu masak hingga layu.'])
on conflict do nothing;

insert into public.recipe_ingredients(recipe_id,ingredient_name,quantity,unit)
select r.id,v.ingredient_name,v.quantity,v.unit
from public.recipes r
cross join (values
 ('Nasi Goreng Telur','Nasi',200::numeric,'gram'),
 ('Nasi Goreng Telur','Telur',1::numeric,'butir'),
 ('Nasi Goreng Telur','Bawang putih',2::numeric,'siung'),
 ('Nasi Goreng Telur','Kecap',1::numeric,'sdm'),
 ('Telur Dadar Sayur','Telur',2::numeric,'butir'),
 ('Telur Dadar Sayur','Wortel',30::numeric,'gram'),
 ('Telur Dadar Sayur','Daun bawang',1::numeric,'batang'),
 ('Tumis Kangkung','Kangkung',1::numeric,'ikat'),
 ('Tumis Kangkung','Bawang putih',2::numeric,'siung'),
 ('Tumis Kangkung','Cabai',2::numeric,'buah')
) as v(recipe_name,ingredient_name,quantity,unit)
where r.name=v.recipe_name
and not exists (
 select 1 from public.recipe_ingredients ri
 where ri.recipe_id=r.id and ri.ingredient_name=v.ingredient_name
);
