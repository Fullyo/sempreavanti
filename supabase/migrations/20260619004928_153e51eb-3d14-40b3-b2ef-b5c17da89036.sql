UPDATE public.bookings
SET guest = 'SAMPLE — Fully Stacked Invoice (preview only)',
    items = '[
      {"name":"2-Seater Polaris UTV Rental","type":"flat","qty":2,"price":4000,"unit_cost":4000,"guest_total":8000,"cost":8000,"profit":2000},
      {"name":"Private Chef — Dinner Service","type":"flat","qty":3,"price":4500,"unit_cost":3000,"guest_total":13500,"cost":9000,"profit":4500},
      {"name":"Open Bar & Premium Drinks","type":"flat","qty":1,"price":3200,"unit_cost":1500,"guest_total":3200,"cost":1500,"profit":1700},
      {"name":"In-Villa Couples Massage","type":"flat","qty":2,"price":2700,"unit_cost":1500,"guest_total":5400,"cost":3000,"profit":2400}
    ]'::jsonb,
    accommodation_fare = 1000,
    accommodation_currency = 'USD',
    exchange_rate = 16,
    tip_mode = 'amount',
    tip_value = 0,
    payment_status = 'unpaid',
    amount_paid = NULL,
    paid_at = NULL,
    stripe_session_id = NULL
WHERE pay_token = '679dcea3-7496-42ec-b744-667d78b1a0db';