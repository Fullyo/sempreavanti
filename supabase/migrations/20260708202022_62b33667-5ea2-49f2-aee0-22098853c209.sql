-- UTV rentals are owner-owned assets: 15% of fare is a maintenance/insurance
-- reserve (cost), 85% is profit that splits 85% owner / 15% LUX.
update services set type = 'utv'
where category ilike '%utv%' and (name ilike '%can-am%' or name ilike '%polaris%' or name ilike '%maverick%');

-- Fix existing June live bookings: on each UTV line (currently type 'mgmt')
-- swap cost <-> profit (15% cost / 85% profit) and retype to 'utv',
-- then recompute total_profit.
update bookings b
set items = sub.new_items,
    total_profit = sub.new_profit
from (
  select id,
    jsonb_agg(
      case when elem->>'type' = 'mgmt'
        then jsonb_set(
               jsonb_set(
                 jsonb_set(elem, '{type}', '"utv"'),
                 '{cost}', elem->'profit'),
               '{profit}', elem->'cost')
        else elem
      end
      order by ord
    ) as new_items,
    sum(
      case when elem->>'type' = 'mgmt'
        then coalesce((elem->>'cost')::numeric, 0)
        else coalesce((elem->>'profit')::numeric, 0)
      end
    ) as new_profit
  from bookings, jsonb_array_elements(items) with ordinality as t(elem, ord)
  where guest ilike '%julie%' or guest ilike '%shannon%' or guest ilike '%eric%'
  group by id
) sub
where b.id = sub.id;