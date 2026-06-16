export function openMay2026Historical() {
  const pBox = (spent: string) => `
      <div class="petty">
        <div class="ptitle">Concierge Petty Cash</div>
        <div class="pgrid">
          <div><div class="pl">Owner Float In (USD)</div><div class="pblank"></div></div>
          <div><div class="pl">Spent on Guest</div><div class="pv">${spent}</div></div>
          <div><div class="pl">Balance</div><div class="pblank"></div></div>
        </div>
      </div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"/>
  <title>May 2026 — Historical Report — Villas Sempre Avanti</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@300;400;500&display=swap"/>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #F7F4EE; font-family: 'Jost', sans-serif; color: #1C1914; font-size: 13px; }
    .wrap { max-width: 960px; margin: 0 auto; padding: 40px 32px 80px; }
    .print-btn { display: inline-block; background: #B8924A; color: #fff; padding: 10px 20px; border: none; cursor: pointer; font-family: inherit; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; border-radius: 2px; }
    .conf { color: #B8924A; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; text-align: center; }
    h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 38px; margin: 6px 0 4px; text-align: center; }
    .sub { text-align: center; color: #5A5242; font-size: 14px; }
    .meta { text-align: center; color: #9E9080; font-size: 11px; margin-top: 6px; margin-bottom: 28px; }
    .cards { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 32px; }
    .card { background: #fff; border: 1px solid #DDD5C4; border-radius: 4px; padding: 14px; }
    .card .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #9E9080; }
    .card .value { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; margin-top: 6px; }
    .card.owner { background: #F0F7F4; } .card.owner .value { color: #2D6A45; }
    .card.lux { background: #FDF4E3; } .card.lux .value { color: #7A5C1E; }
    .card.cash { background: #1C1914; color: #F7F4EE; }
    .card.cash .label { color: rgba(247,244,238,0.5); } .card.cash .value { color: #B8924A; }
    .card.accom { background: #F4EFE3; } .card.accom .value { color: #7A5C1E; }
    .accom-bar { background: #FDF4E3; border: 1px solid #E5D8B5; border-radius: 4px; padding: 10px 14px; font-size: 12px; color: #7A5C1E; margin-top: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    .accom-bar strong { color: #1C1914; font-weight: 500; }
    .booking { background: #fff; border: 1px solid #DDD5C4; border-radius: 4px; padding: 20px; margin-bottom: 18px; }
    .booking-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
    .guest { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; }
    .dates { color: #5A5242; font-size: 12px; margin-top: 2px; }
    .ref { color: #9E9080; font-size: 11px; text-align: right; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9E9080; font-weight: 500; padding: 8px 6px; border-bottom: 1px solid #DDD5C4; text-align: left; }
    td { padding: 8px 6px; border-bottom: 1px solid #F0EBE0; font-size: 12px; }
    tfoot td { border-top: 2px solid #1C1914; border-bottom: none; padding-top: 10px; font-weight: 500; }
    .note { color: #7A5C1E; font-size: 11px; font-style: italic; margin-top: 10px; }
    .badge { display: inline-block; padding: 2px 8px; font-size: 10px; border-radius: 10px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 500; }
    .b-35 { background: #8B2E2E1a; color: #8B2E2E; }
    .b-flat { background: #1E44771a; color: #1E4477; }
    .b-15 { background: #7A5C1E1a; color: #7A5C1E; }
    .b-100 { background: #2D6A451a; color: #2D6A45; }
    .b-pass { background: #9E90801a; color: #9E9080; }
    .grand { background: #1C1914; color: #F7F4EE; padding: 24px; border-radius: 4px; margin-top: 28px; }
    .grand h2 { font-family: 'Cormorant Garamond', serif; font-weight: 300; color: #B8924A; margin: 0 0 18px; font-size: 22px; }
    .grand-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
    .grand-cell .l { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,244,238,0.5); }
    .grand-cell .v { font-size: 16px; margin-top: 4px; font-weight: 500; }
    .fx { background: #FDF4E3; border: 1px solid #E5D8B5; border-radius: 4px; padding: 10px 14px; font-size: 11px; color: #7A5C1E; margin-bottom: 18px; }
    .petty { background: #1C1914; border-radius: 4px; padding: 12px 16px; margin-bottom: 10px; }
    .petty .ptitle { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #B8924A; margin-bottom: 10px; font-weight: 500; }
    .petty .pgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .petty .pl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(247,244,238,0.5); }
    .petty .pv { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; margin-top: 4px; color: #F7F4EE; }
    .petty .pblank { display: inline-block; min-width: 90px; border-bottom: 1px solid #4A4338; height: 22px; margin-top: 4px; }
    .petty-summary { background: #FAF7F2; border: 1px solid #B8924A; border-radius: 4px; padding: 16px 18px; margin-top: 6px; margin-bottom: 18px; }
    .petty-summary .ptitle { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: #B8924A; margin-bottom: 12px; font-weight: 500; }
    .petty-summary .pgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .petty-summary .pl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #9E9080; }
    .petty-summary .pv { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; margin-top: 4px; color: #5A5242; }
    @media print { .print-btn { display:none; } body { background: #fff; } }
  </style></head><body>
  <div class="wrap">
    <button class="print-btn" onclick="window.print()">⬇ Print / Save as PDF</button>
    <div class="conf">Internal Report · Confidential</div>
    <h1>Villas Sempre Avanti</h1>
    <div class="sub">Revenue &amp; Profit Report — May 2026</div>
    <div class="meta">7 bookings · All figures in USD · Includes 15% management commission on accommodation fare</div>

    <div class="cards">
      <div class="card"><div class="label">Guest Billed (Upsells)</div><div class="value">$15,425.32</div></div>
      <div class="card accom"><div class="label">Accommodation Fare</div><div class="value">$31,830.05</div></div>
      <div class="card"><div class="label">Upsell Profit Pool</div><div class="value">$5,827.69</div></div>
      <div class="card owner"><div class="label">Owner's Share (Upsells 85%)</div><div class="value">$4,953.53</div></div>
      <div class="card lux"><div class="label">LUX Total Cut</div><div class="value">$5,648.66</div></div>
      <div class="card cash"><div class="label">Cash Collected On Site</div><div class="value">$1,300.00</div></div>
    </div>

    <div class="fx">Transport flat fees follow the standing rule of 1,000 MXN profit per trip (≈$62.50 USD @ 16); the Sprinter cost basis is 6,500 MXN. UTV rates vary per booking — we always use the actual amount charged on the Guesty folio. Accommodation commission is calculated on the room fare only (cleaning fees, taxes, and other Guesty-side line items are excluded from the 15% basis).</div>



    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Maxim</div>
          <div class="dates">May 4–14, 2026 · 10 nights</div>
        </div>
        <div class="ref">Casa Sempre Avanti<br/>(Villa Pietro + Villa Luisa)</div>
      </div>
      ${pBox("$3,869.32")}
      <table>
        <thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Our Cost</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead>
        <tbody>
          <tr><td>Airport SUV (Round Trip) <em style="color:#9E9080;font-size:11px">Flat $55 USD profit per trip</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">$395.00</td><td style="text-align:right">$340.00</td><td style="text-align:right">$55.00</td><td style="text-align:right;color:#2D6A45">$46.75</td><td style="text-align:right;color:#7A5C1E">$8.25</td></tr>
          <tr><td>Taxi <em style="color:#9E9080;font-size:11px">Flat $55 USD profit per trip</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">$290.00</td><td style="text-align:right">$235.00</td><td style="text-align:right">$55.00</td><td style="text-align:right;color:#2D6A45">$46.75</td><td style="text-align:right;color:#7A5C1E">$8.25</td></tr>
          <tr><td>Meal at the House <em style="color:#9E9080;font-size:11px">Chef after-hours · 4 plates × $50</em></td><td><span class="badge b-15">15%</span></td><td style="text-align:right">$200.00</td><td style="text-align:right">$170.00</td><td style="text-align:right">$30.00</td><td style="text-align:right;color:#2D6A45">$25.50</td><td style="text-align:right;color:#7A5C1E">$4.50</td></tr>
          <tr><td>UTV Rental (Side-by-Side) <em style="color:#9E9080;font-size:11px">Owner-owned vehicles · 100% profit pool</em></td><td><span class="badge b-100">Owner asset</span></td><td style="text-align:right">$2,400.00</td><td style="text-align:right">$0.00</td><td style="text-align:right">$2,400.00</td><td style="text-align:right;color:#2D6A45">$2,040.00</td><td style="text-align:right;color:#7A5C1E">$360.00</td></tr>
          <tr><td>Groceries <em style="color:#9E9080;font-size:11px">$2,696 actual food cost · billed $2,977</em></td><td><span class="badge b-35">Margin</span></td><td style="text-align:right">$2,977.00</td><td style="text-align:right">$2,696.00</td><td style="text-align:right">$281.00</td><td style="text-align:right;color:#2D6A45">$238.85</td><td style="text-align:right;color:#7A5C1E">$42.15</td></tr>
          <tr><td>Drinks &amp; Alcohol <em style="color:#9E9080;font-size:11px">Sold at cost — no margin charged this stay</em></td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$232.00</td><td style="text-align:right">$232.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
          <tr><td>Credit Card Fee</td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$196.32</td><td style="text-align:right">$196.32</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right">Totals (billed)</td><td style="text-align:right">$6,690.32</td><td style="text-align:right">$3,869.32</td><td style="text-align:right">$2,821.00</td><td style="text-align:right;color:#2D6A45">$2,397.85</td><td style="text-align:right;color:#7A5C1E">$423.15</td></tr>
          <tr><td colspan="2" style="text-align:right;color:#9E9080;font-weight:400">Less: Cash paid on site (owner direct)</td><td style="text-align:right;color:#9E9080;font-weight:400">−$1,300.00</td><td colspan="4" style="text-align:right;color:#9E9080;font-style:italic;font-weight:400">Offset against CC charge · does not affect profit split</td></tr>
          <tr><td colspan="2" style="text-align:right">Net charged to credit card</td><td style="text-align:right">$5,390.32</td><td colspan="4"></td></tr>
        </tfoot>
      </table>
      <div class="accom-bar"><span>Accommodation fare: <strong>$12,493.00</strong> <em style="color:#9E9080;font-style:normal">(3,750 + 3,800 + 4,943)</em></span><span>LUX 15% commission: <strong>$1,873.95</strong></span><span>Owner retains 85%: <strong>$10,619.05</strong></span></div>
      <div class="note">Note · $1,300 of the balance was paid in cash to the owner directly (offset against the CC charge). Recorded for transparency — does not affect profit split.</div>
      <div class="note">Note · UTV vehicles are owner-owned (our cost = $0). The full $2,400 guest charge is profit. LUX takes the standard 15% management cut ($360); owner keeps $2,040.</div>
      <div class="note">Note · Going forward, alcohol is charged at 100% profit margin. This stay was sold at cost (no margin) as a courtesy.</div>
    </section>

    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Jose Izquierdo</div>
          <div class="dates">Apr 29 – May 4, 2026 · 5 nights</div>
        </div>
        <div class="ref">Villa Pietro<br/>Ref: HMJ3K93XXY</div>
      </div>
      ${pBox("$638.00")}
      <table>
        <thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Our Cost</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead>
        <tbody>
          <tr><td>Groceries <em style="color:#9E9080;font-size:11px">$578 actual food cost · billed $667</em></td><td><span class="badge b-35">Margin</span></td><td style="text-align:right">$667.00</td><td style="text-align:right">$578.00</td><td style="text-align:right">$89.00</td><td style="text-align:right;color:#2D6A45">$75.65</td><td style="text-align:right;color:#7A5C1E">$13.35</td></tr>
          <tr><td>UTV Rental <em style="color:#9E9080;font-size:11px">12,300 MXN for 3-day rental · actual folio amount</em></td><td><span class="badge b-100">Owner asset</span></td><td style="text-align:right">$230.00</td><td style="text-align:right">$0.00</td><td style="text-align:right">$230.00</td><td style="text-align:right;color:#2D6A45">$195.50</td><td style="text-align:right;color:#7A5C1E">$34.50</td></tr>
          <tr><td>Credit Card Fee <em style="color:#9E9080;font-size:11px">5% on $1,186 base</em></td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$60.00</td><td style="text-align:right">$60.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right">Totals (billed)</td><td style="text-align:right">$957.00</td><td style="text-align:right">$638.00</td><td style="text-align:right">$319.00</td><td style="text-align:right;color:#2D6A45">$271.15</td><td style="text-align:right;color:#7A5C1E">$47.85</td></tr>
        </tfoot>
      </table>
      <div class="accom-bar"><span>Accommodation fare: <strong>$3,245.00</strong></span><span>LUX 15% commission: <strong>$486.75</strong></span><span>Owner retains 85%: <strong>$2,758.25</strong></span></div>
      <div class="note">Note · UTV charged at $230 for this stay (below the standard 2,500 MXN/day Can-Am or 2,200 MXN/day Polaris rate). We always use whatever amount is on the Guesty folio.</div>
      <div class="note">Note · Standard UTV rates: Can-Am 4-seater 2,500 MXN/day · Polaris 6-seater 2,200 MXN/day · Gas refill penalty 1,500 MXN if guest fails to refill. UTVs are owner-owned (100% profit pool).</div>
    </section>

    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Teresa</div>
          <div class="dates">May 14–18, 2026 · 4 nights · 4 guests</div>
        </div>
        <div class="ref">Villa Pietro<br/>Ref: GY-GhQQwakD</div>
      </div>
      ${pBox("$297.00")}
      <table>
        <thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Our Cost</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead>
        <tbody>
          <tr><td>UTV Rental <em style="color:#9E9080;font-size:11px">15th &amp; 16th · actual folio amount</em></td><td><span class="badge b-100">Owner asset</span></td><td style="text-align:right">$240.00</td><td style="text-align:right">$0.00</td><td style="text-align:right">$240.00</td><td style="text-align:right;color:#2D6A45">$204.00</td><td style="text-align:right;color:#7A5C1E">$36.00</td></tr>
          <tr><td>Groceries <em style="color:#9E9080;font-size:11px">$247 cost + 35% service markup</em></td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$333.00</td><td style="text-align:right">$247.00</td><td style="text-align:right">$86.00</td><td style="text-align:right;color:#2D6A45">$73.10</td><td style="text-align:right;color:#7A5C1E">$12.90</td></tr>
          <tr><td>UTV Gas Tank Fill <em style="color:#9E9080;font-size:11px">Reimbursement for fuel — pass-through</em></td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$50.00</td><td style="text-align:right">$50.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right">Totals (billed)</td><td style="text-align:right">$623.00</td><td style="text-align:right">$297.00</td><td style="text-align:right">$326.00</td><td style="text-align:right;color:#2D6A45">$277.10</td><td style="text-align:right;color:#7A5C1E">$48.90</td></tr>
        </tfoot>
      </table>
      <div class="accom-bar"><span>Accommodation fare: <strong>$1,600.00</strong> <em style="color:#9E9080;font-style:normal">(room fare only · folio total $2,223 incl. upsells)</em></span><span>LUX 15% commission: <strong>$240.00</strong></span><span>Owner retains 85%: <strong>$1,360.00</strong></span></div>
      <div class="note">Note · UTV vehicles are owner-owned (100% profit pool). Gas tank fill is reimbursement for fuel — billed at cost with no markup.</div>
    </section>

    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Christopher Jackson</div>
          <div class="dates">May 20–27, 2026 · 7 nights · 5 adults, 4 children</div>
        </div>
        <div class="ref">Casa Sempre Avanti<br/>(Villa Pietro + Villa Luisa) · #58 · GY-gNZkbdwv</div>
      </div>
      ${pBox("$3,342.00")}
      <table>
        <thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Our Cost</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead>
        <tbody>
          <tr><td>Groceries <em style="color:#9E9080;font-size:11px">$1,874.25 actual food cost · billed $2,597</em></td><td><span class="badge b-35">Margin</span></td><td style="text-align:right">$2,597.00</td><td style="text-align:right">$1,874.25</td><td style="text-align:right">$722.75</td><td style="text-align:right;color:#2D6A45">$614.34</td><td style="text-align:right;color:#7A5C1E">$108.41</td></tr>
          <tr><td>UTV Rental <em style="color:#9E9080;font-size:11px">Both UTVs at 120usd/day · 240usd × 3</em></td><td><span class="badge b-100">Owner asset</span></td><td style="text-align:right">$765.00</td><td style="text-align:right">$0.00</td><td style="text-align:right">$765.00</td><td style="text-align:right;color:#2D6A45">$650.25</td><td style="text-align:right;color:#7A5C1E">$114.75</td></tr>
          <tr><td>Airport SUV (Round Trip) <em style="color:#9E9080;font-size:11px">Sprinter 6,500p ($406.25) · sold at cost · no profit this stay</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">$425.00</td><td style="text-align:right">$406.25</td><td style="text-align:right">$0.00</td><td style="text-align:right;color:#2D6A45">$0.00</td><td style="text-align:right;color:#7A5C1E">$0.00</td></tr>
          <tr><td>In-House Massage <em style="color:#9E9080;font-size:11px">6 massages (8,600p) · cost 500p each</em></td><td><span class="badge b-15">Markup</span></td><td style="text-align:right">$537.00</td><td style="text-align:right">$187.50</td><td style="text-align:right">$349.50</td><td style="text-align:right;color:#2D6A45">$297.08</td><td style="text-align:right;color:#7A5C1E">$52.43</td></tr>
          <tr><td>Tip <em style="color:#9E9080;font-size:11px">10% of booking · paid in full to staff</em></td><td><span class="badge b-pass">Staff (pass-through)</span></td><td style="text-align:right">$874.00</td><td style="text-align:right">$874.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right">Totals (billed)</td><td style="text-align:right">$5,198.00</td><td style="text-align:right">$3,342.00</td><td style="text-align:right">$1,837.25</td><td style="text-align:right;color:#2D6A45">$1,561.66</td><td style="text-align:right;color:#7A5C1E">$275.59</td></tr>
        </tfoot>
      </table>
      <div class="accom-bar"><span>Accommodation fare: <strong>$8,743.00</strong></span><span>LUX 15% commission: <strong>$1,311.45</strong></span><span>Owner retains 85%: <strong>$7,431.55</strong></span></div>
      <div class="note">Note · UTV vehicles are owner-owned (100% profit pool). Tips are paid in full to staff — recorded for transparency, excluded from the profit split.</div>
    </section>

    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Gustavo Dominguez</div>
          <div class="dates">May 27 – Jun 1, 2026 · 5 nights · 4 adults</div>
        </div>
        <div class="ref">Villa Pietro<br/>Ref: HM3KZYP9KW</div>
      </div>
      ${pBox("$0.00")}
      <table>
        <thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Our Cost</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead>
        <tbody>
          <tr><td>Tip <em style="color:#9E9080;font-size:11px">10% of booking · paid in cash directly to staff</em></td><td><span class="badge b-pass">Staff (cash)</span></td><td style="text-align:right">$197.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right">Totals (billed)</td><td style="text-align:right">$197.00</td><td style="text-align:right">$0.00</td><td style="text-align:right">$0.00</td><td style="text-align:right;color:#2D6A45">$0.00</td><td style="text-align:right;color:#7A5C1E">$0.00</td></tr>
        </tfoot>
      </table>
      <div class="accom-bar"><span>Accommodation fare: <strong>$1,971.05</strong></span><span>LUX 15% commission: <strong>$295.66</strong></span><span>Owner retains 85%: <strong>$1,675.39</strong></span></div>
      <div class="note">Note · Tip was paid in cash directly to staff — excluded from petty cash and the profit split. LUX takes 15% of the accommodation fare only. Host channel fee (−$305.67) is a Guesty-side line item and does not affect the commission basis.</div>
    </section>

    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Diego Alatorre</div>
          <div class="dates">May 16 – 19, 2026 · 3 nights · 8 adults, 1 infant</div>
        </div>
        <div class="ref">Villa Luisa<br/>Ref: HM25A548RR</div>
      </div>
      <div class="accom-bar"><span>Accommodation fare: <strong>$973.05</strong></span><span>LUX 15% commission: <strong>$145.96</strong></span><span>Owner retains 85%: <strong>$827.09</strong></span></div>
      <div class="note">Note · No concierge upsells on this stay. LUX takes 15% of the accommodation fare only.</div>
    </section>



    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Abril García</div>
          <div class="dates">May 28 – Jun 1, 2026 · 4 nights · 7 adults, 1 child</div>
        </div>
        <div class="ref">Villa Luisa<br/>#60 · HM45CA4DB3</div>
      </div>
      ${pBox("$1,629.00")}
      <table>
        <thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Our Cost</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead>
        <tbody>
          <tr><td>In-House Massage <em style="color:#9E9080;font-size:11px">8 massages · billed 11,800p · cost 9,200p ($575)</em></td><td><span class="badge b-15">Markup</span></td><td style="text-align:right">$737.50</td><td style="text-align:right">$575.00</td><td style="text-align:right">$162.50</td><td style="text-align:right;color:#2D6A45">$138.13</td><td style="text-align:right;color:#7A5C1E">$24.38</td></tr>
          <tr><td>Groceries <em style="color:#9E9080;font-size:11px">$780 to guest · cost $811 (loss this stay)</em></td><td><span class="badge b-35">At a loss</span></td><td style="text-align:right">$780.00</td><td style="text-align:right">$811.00</td><td style="text-align:right">-$31.00</td><td style="text-align:right;color:#8B2E2E">-$26.35</td><td style="text-align:right;color:#8B2E2E">-$4.65</td></tr>
          <tr><td>Drinks &amp; Alcohol <em style="color:#9E9080;font-size:11px">1,600p · sold at cost this stay</em></td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$100.00</td><td style="text-align:right">$100.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
          <tr><td>Tip <em style="color:#9E9080;font-size:11px">10% of booking · paid in full to staff</em></td><td><span class="badge b-pass">Staff (pass-through)</span></td><td style="text-align:right">$143.00</td><td style="text-align:right">$143.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right">Totals (billed)</td><td style="text-align:right">$1,760.50</td><td style="text-align:right">$1,629.00</td><td style="text-align:right">$131.50</td><td style="text-align:right;color:#2D6A45">$111.78</td><td style="text-align:right;color:#7A5C1E">$19.73</td></tr>
        </tfoot>
      </table>
      <div class="accom-bar"><span>Accommodation fare: <strong>$1,426.10</strong></span><span>LUX 15% commission: <strong>$213.92</strong></span><span>Owner retains 85%: <strong>$1,212.19</strong></span></div>
      <div class="note">Note · Guest paid all upsells in cash. Massage billed 11,800p vs 9,200p cost ($575); profit calculated at 16 MXN/USD. Groceries ran at a loss this stay ($811 cost vs $780 billed); alcohol sold at cost. Host channel fee (−$221.05) does not affect the 15% commission basis.</div>
    </section>


    <div class="petty-summary">
      <div class="ptitle">Concierge Petty Cash Summary — May 2026</div>
      <div class="pgrid">
        <div><div class="pl">Total Given by Owner (USD)</div><div class="pv">—</div></div>
        <div><div class="pl">Total Spent on Guests</div><div class="pv">$9,382.39</div></div>
        <div><div class="pl">Petty Cash Remaining</div><div class="pv">—</div></div>
      </div>
    </div>

    <div class="grand">
      <h2>May 2026 — Grand Summary</h2>
      <div class="grand-grid">
        <div class="grand-cell"><div class="l">Bookings</div><div class="v">7</div></div>
        <div class="grand-cell"><div class="l">Guest Billed (Upsells)</div><div class="v">$15,228.82</div></div>
        <div class="grand-cell"><div class="l">Accommodation Fare</div><div class="v">$31,830.05</div></div>
        <div class="grand-cell"><div class="l">Upsell Profit Pool</div><div class="v">$5,827.69</div></div>
        <div class="grand-cell"><div class="l" style="color:#7DD89E">Owner's Share (Upsells 85%)</div><div class="v" style="color:#7DD89E">$4,953.53</div></div>
        <div class="grand-cell"><div class="l" style="color:#D4A96A">LUX Total Cut</div><div class="v" style="color:#D4A96A">$5,648.66</div></div>
      </div>
      <div style="margin-top:14px;padding:12px 14px;background:rgba(139,46,46,0.12);border-left:2px solid #8B2E2E;font-size:11px;color:rgba(247,244,238,0.85)">
        <span style="color:#E08585;text-transform:uppercase;letter-spacing:0.1em;font-size:10px">Cost correction (group unknown)</span><br/>
        Two costs paid out of petty cash were not entered at the time: 910 MXN alcohol + 2,000 MXN gas = 2,910 MXN (≈$181.88 @ 16). This was deducted from the upsell profit pool ($6,009.56 → $5,827.69), lowering LUX's upsell cut by ~$27.28 and the owner's 85% share accordingly.
      </div>
      <div style="margin-top:14px;padding:12px 14px;background:rgba(212,169,106,0.08);border-left:2px solid #D4A96A;font-size:11px;color:rgba(247,244,238,0.85)">
        <span style="color:#D4A96A;text-transform:uppercase;letter-spacing:0.1em;font-size:10px">LUX cut breakdown</span><br/>
        $874.15 from upsells (15% of corrected profit pool) + $4,774.51 from accommodation (15% of fare) = <strong style="color:#D4A96A">$5,648.66</strong>
      </div>
      <div style="margin-top:14px;padding:12px 14px;background:rgba(125,216,158,0.08);border-left:2px solid #7DD89E;font-size:11px;color:rgba(247,244,238,0.85)">
        <span style="color:#7DD89E;text-transform:uppercase;letter-spacing:0.1em;font-size:10px">Tips to send to staff (collected via credit card)</span><br/>
        $874.00 (Jackson) + $143.00 (García) = <strong style="color:#7DD89E">$1,017.00</strong> owed by owner to staff. <span style="color:rgba(247,244,238,0.5)">Dominguez $197.00 tip was paid in cash directly to staff (excluded).</span>
      </div>
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(247,244,238,0.15);font-size:12px">
        <span style="color:rgba(247,244,238,0.5)">Cash Collected (owner direct):</span> <span style="color:#B8924A">$1,300.00</span>
        &nbsp;&nbsp;&nbsp;<span style="color:rgba(247,244,238,0.5)">CC Fees (pass-through):</span> <span style="color:rgba(247,244,238,0.7)">$256.32</span>
      </div>
      <div style="margin-top:12px;font-size:10px;color:rgba(247,244,238,0.4)">All figures in USD · Transport flat fee 1,000 MXN profit (≈$62.50) · Sprinter cost 6,500 MXN · Accommodation commission on room fare only</div>
    </div>
  </div></body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
