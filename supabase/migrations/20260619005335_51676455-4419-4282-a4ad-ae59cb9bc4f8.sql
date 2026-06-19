UPDATE public.bookings
SET items = '[
      {"name":"Polaris Ranger 6-seater UTV Rental","type":"mgmt","qty":2,"price":2200,"unit_cost":null,"guest_total":4400,"cost":3740,"profit":660},
      {"name":"Private Chef — Dinner Service","type":"flat","qty":3,"price":4500,"unit_cost":3000,"guest_total":13500,"cost":9000,"profit":4500},
      {"name":"Open Bar & Premium Drinks","type":"flat","qty":1,"price":3200,"unit_cost":1500,"guest_total":3200,"cost":1500,"profit":1700},
      {"name":"In-Villa Couples Massage","type":"flat","qty":2,"price":2700,"unit_cost":1500,"guest_total":5400,"cost":3000,"profit":2400}
    ]'::jsonb
WHERE pay_token = '679dcea3-7496-42ec-b744-667d78b1a0db';