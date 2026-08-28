-- ============================================================
-- GreenLine — Almacén compartido (stock en tienda y en almacén)
-- ------------------------------------------------------------
-- FASE 1: tabla prod_color_stock, sucursales reales, trigger que
-- mantiene prod_color_rel.stock = SUMA por (producto, color),
-- RLS/grants, y vista v_stock_resumen.
--
-- Ejecutar con DIRECT_URL (conexión directa, NO pgbouncer/pooler).
-- Re-ejecutable (idempotente).
-- ============================================================

-- 1) Tabla: una fila por (producto, color, ubicación) ------------
create table if not exists public.prod_color_stock (
  id          bigint generated always as identity primary key,
  producto_id int      not null references public.productos(id) on delete cascade,
  color_id    int      not null references public.colores(id) on delete cascade,
  tienda_id   uuid     not null references public.tiendas(id) on delete cascade,
  stock       int      not null default 0 check (stock >= 0),
  updated_at  timestamptz not null default now(),
  unique (producto_id, color_id, tienda_id)
);

comment on table public.prod_color_stock is
  'Stock por (producto, color, sucursal). prod_color_rel.stock es agregado mantenido por trigger.';

-- 2) Sucursales reales -------------------------------------------
-- Las 4 del seed ya existen (Almacén Central, Lince, Surco, Huancayo).
-- Se agregan las 4 tiendas faltantes (direcciones por confirmar).
insert into public.tiendas (id, nombre, direccion, ciudad, tipo, activa)
select '00000000-0000-0000-0000-000000000005', 'GreenLine Tienda La Molina', 'Av. La Molina 123 (direccion por confirmar)', 'Lima', 'tienda', true
where not exists (select 1 from public.tiendas where nombre = 'GreenLine Tienda La Molina');

insert into public.tiendas (id, nombre, direccion, ciudad, tipo, activa)
select '00000000-0000-0000-0000-000000000006', 'GreenLine Tienda Ate', 'Av. Ate 123 (direccion por confirmar)', 'Lima', 'tienda', true
where not exists (select 1 from public.tiendas where nombre = 'GreenLine Tienda Ate');

insert into public.tiendas (id, nombre, direccion, ciudad, tipo, activa)
select '00000000-0000-0000-0000-000000000007', 'GreenLine Tienda Comas', 'Av. Comas 123 (direccion por confirmar)', 'Lima', 'tienda', true
where not exists (select 1 from public.tiendas where nombre = 'GreenLine Tienda Comas');

insert into public.tiendas (id, nombre, direccion, ciudad, tipo, activa)
select '00000000-0000-0000-0000-000000000008', 'GreenLine Tienda San Miguel', 'Av. San Miguel 123 (direccion por confirmar)', 'Lima', 'tienda', true
where not exists (select 1 from public.tiendas where nombre = 'GreenLine Tienda San Miguel');

-- 3) Opción B: el stock actual (1-6 uds) se descarta; todo a cero --
-- Las relaciones producto-color se conservan; los stocks quedan 0 y
-- se ingresan a mano desde el panel por sucursal.
update public.prod_color_rel set stock = 0 where stock <> 0;

-- 4) Trigger: prod_color_rel.stock = SUMA(stock) por (producto,color)
create or replace function public.fn_sync_stock_total()
returns trigger
language plpgsql
as $$
declare
  v_producto int;
  v_color    int;
begin
  v_producto := coalesce(new.producto_id, old.producto_id);
  v_color    := coalesce(new.color_id, old.color_id);

  update public.prod_color_rel pcr
     set stock = (
       select coalesce(sum(pcs.stock), 0)::int
         from public.prod_color_stock pcs
        where pcs.producto_id = v_producto
          and pcs.color_id   = v_color
     )
   where pcr.producto_id = v_producto
     and pcr.color_id   = v_color;

  return null;
end;
$$;

drop trigger if exists trg_sync_stock_total on public.prod_color_stock;
create trigger trg_sync_stock_total
  after insert or update or delete on public.prod_color_stock
  for each row
  execute function public.fn_sync_stock_total();

-- 5) Vista de resumen: suma por tipo (almacén/tienda) + total ------
create or replace view public.v_stock_resumen as
with por_tipo as (
  select pcs.producto_id,
         pcs.color_id,
         t.tipo,
         sum(pcs.stock)::int as stock_por_tipo
    from public.prod_color_stock pcs
    join public.tiendas t on t.id = pcs.tienda_id
   group by pcs.producto_id, pcs.color_id, t.tipo
)
select pt.producto_id,
       pt.color_id,
       pt.tipo,
       pt.stock_por_tipo,
       sum(pt.stock_por_tipo) over (partition by pt.producto_id, pt.color_id)::int as stock_total
  from por_tipo pt;

-- 6) RLS y grants ------------------------------------------------
-- Espejo de prod_color_rel: solo roles del panel (es_admin_panel()).
alter table public.prod_color_stock enable row level security;

drop policy if exists "Admin puede gestionar stock por ubicación" on public.prod_color_stock;
create policy "Admin puede gestionar stock por ubicación" on public.prod_color_stock
  for all to authenticated
  using (public.es_admin_panel())
  with check (public.es_admin_panel());

-- Acceso del panel: ya existía grant sobre tiendas; se reafirma.
grant select, insert, update, delete on public.prod_color_stock to authenticated;
grant select on public.tiendas to authenticated;