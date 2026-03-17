-- Add order type and reservation fields to orders
alter table public.orders
  add column if not exists order_type text not null default 'delivery',
  add column if not exists reservation_people integer null,
  add column if not exists reservation_date date null,
  add column if not exists reservation_time time null;

alter table public.orders
  add constraint orders_order_type_check
  check (order_type in ('delivery', 'pickup', 'reservation'));

alter table public.orders
  add constraint orders_reservation_people_check
  check (reservation_people is null or reservation_people >= 1);
