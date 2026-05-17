export function openMay2026Historical() {
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
    .cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 32px; }
    .card { background: #fff; border: 1px solid #DDD5C4; border-radius: 4px; padding: 14px; }
    .card .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #9E9080; }
    .card .value { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; margin-top: 6px; }
    .card.owner { background: #F0F7F4; } .card.owner .value { color: #2D6A45; }
    .card.lux { background: #FDF4E3; } .card.lux .value { color: #7A5C1E; }
    .card.cash { background: #1C1914; color: #F7F4EE; }
    .card.cash .label { color: rgba(247,244,238,0.5); } .card.cash .value { color: #B8924A; }
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
    .grand-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
    .grand-cell .l { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,244,238,0.5); }
    .grand-cell .v { font-size: 16px; margin-top: 4px; font-weight: 500; }
    .fx { background: #FDF4E3; border: 1px solid #E5D8B5; border-radius: 4px; padding: 10px 14px; font-size: 11px; color: #7A5C1E; margin-bottom: 18px; }
    @media print { .print-btn { display:none; } body { background: #fff; } }
  </style></head><body>
  <div class="wrap">
    <button class="print-btn" onclick="window.print()">⬇ Print / Save as PDF</button>
    <div class="conf">Internal Report · Confidential</div>
    <h1>Villas Sempre Avanti</h1>
    <div class="sub">Upsell Revenue &amp; Profit Report — May 2026</div>
    <div class="meta">1 booking · All figures in USD · Accommodation fare excluded · Split: 85% owner / 15% LUX</div>

    <div class="cards">
      <div class="card"><div class="label">Total Billed to Guest</div><div class="value">$6,690.32</div></div>
      <div class="card"><div class="label">Total Profit Pool</div><div class="value">$3,321.81</div></div>
      <div class="card owner"><div class="label">Owner's Share 85%</div><div class="value">$2,823.54</div></div>
      <div class="card lux"><div class="label">LUX's Cut 15%</div><div class="value">$498.27</div></div>
      <div class="card cash"><div class="label">Cash Collected On Site</div><div class="value">$1,300.00</div></div>
    </div>

    <div class="fx">FX assumption · For peso-denominated profit items (transport flat fees), we use an agreed average of ≈18 MXN / 1 USD. The 1,000 MXN profit on Airport SUV and Taxi is recorded at ≈$60 USD each (rounded for simplicity, not derived from the guest-paid USD amount).</div>

    <section class="booking">
      <div class="booking-head">
        <div>
          <div class="guest">Maxim</div>
          <div class="dates">May 4–14, 2026 · 10 nights</div>
        </div>
        <div class="ref">Casa Sempre Avanti<br/>(Villa Pietro + Villa Luisa)</div>
      </div>
      <table>
        <thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Our Cost</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead>
        <tbody>
          <tr><td>Airport SUV (Round Trip) <em style="color:#9E9080;font-size:11px">1,000 MXN profit per trip ≈ $60</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">$395.00</td><td style="text-align:right">$335.00</td><td style="text-align:right">$60.00</td><td style="text-align:right;color:#2D6A45">$51.00</td><td style="text-align:right;color:#7A5C1E">$9.00</td></tr>
          <tr><td>Taxi <em style="color:#9E9080;font-size:11px">1,000 MXN profit per trip ≈ $60</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">$290.00</td><td style="text-align:right">$230.00</td><td style="text-align:right">$60.00</td><td style="text-align:right;color:#2D6A45">$51.00</td><td style="text-align:right;color:#7A5C1E">$9.00</td></tr>
          <tr><td>Meal at the House <em style="color:#9E9080;font-size:11px">Chef after-hours · 4 plates × $50</em></td><td><span class="badge b-15">15%</span></td><td style="text-align:right">$200.00</td><td style="text-align:right">$170.00</td><td style="text-align:right">$30.00</td><td style="text-align:right;color:#2D6A45">$25.50</td><td style="text-align:right;color:#7A5C1E">$4.50</td></tr>
          <tr><td>UTV Rental (Side-by-Side) <em style="color:#9E9080;font-size:11px">Owner-owned vehicles · 100% profit pool</em></td><td><span class="badge b-100">Owner asset</span></td><td style="text-align:right">$2,400.00</td><td style="text-align:right">$0.00</td><td style="text-align:right">$2,400.00</td><td style="text-align:right;color:#2D6A45">$2,040.00</td><td style="text-align:right;color:#7A5C1E">$360.00</td></tr>
          <tr><td>Groceries <em style="color:#9E9080;font-size:11px">$2,206 + $771 combined · cost ≈ $2,205.19</em></td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$2,977.00</td><td style="text-align:right">$2,205.19</td><td style="text-align:right">$771.81</td><td style="text-align:right;color:#2D6A45">$656.04</td><td style="text-align:right;color:#7A5C1E">$115.77</td></tr>
          <tr><td>Drinks &amp; Alcohol <em style="color:#9E9080;font-size:11px">Sold at cost — no margin charged this stay</em></td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$232.00</td><td style="text-align:right">$232.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
          <tr><td>Credit Card Fee</td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$196.32</td><td style="text-align:right">$196.32</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        </tbody>
        <tfoot>
          <tr><td colspan="2" style="text-align:right">Totals (billed)</td><td style="text-align:right">$6,690.32</td><td style="text-align:right">$3,368.51</td><td style="text-align:right">$3,321.81</td><td style="text-align:right;color:#2D6A45">$2,823.54</td><td style="text-align:right;color:#7A5C1E">$498.27</td></tr>
          <tr><td colspan="2" style="text-align:right;color:#9E9080;font-weight:400">Less: Cash paid on site (owner direct)</td><td style="text-align:right;color:#9E9080;font-weight:400">−$1,300.00</td><td colspan="4" style="text-align:right;color:#9E9080;font-style:italic;font-weight:400">Offset against CC charge · does not affect profit split</td></tr>
          <tr><td colspan="2" style="text-align:right">Net charged to credit card</td><td style="text-align:right">$5,390.32</td><td colspan="4"></td></tr>
        </tfoot>
      </table>
      <div class="note">Note · $1,300 of the balance was paid in cash to the owner directly (offset against the CC charge). Recorded for transparency — does not affect profit split.</div>
      <div class="note">Note · UTV vehicles are owner-owned (our cost = $0). The full $2,400 guest charge is profit. LUX takes the standard 15% management cut ($360); owner keeps $2,040.</div>
      <div class="note">Note · Going forward, alcohol is charged at 100% profit margin. This stay was sold at cost (no margin) as a courtesy.</div>
    </section>

    <div class="grand">
      <h2>May 2026 — Grand Summary</h2>
      <div class="grand-grid">
        <div class="grand-cell"><div class="l">Bookings</div><div class="v">1</div></div>
        <div class="grand-cell"><div class="l">Guest Paid Total</div><div class="v">$9,090.32</div></div>
        <div class="grand-cell"><div class="l">Profit Pool</div><div class="v">$3,321.81</div></div>
        <div class="grand-cell"><div class="l" style="color:#7DD89E">Owner's Share 85%</div><div class="v" style="color:#7DD89E">$2,823.54</div></div>
        <div class="grand-cell"><div class="l" style="color:#D4A96A">LUX's Cut 15%</div><div class="v" style="color:#D4A96A">$498.27</div></div>
      </div>
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(247,244,238,0.15);font-size:12px">
        <span style="color:rgba(247,244,238,0.5)">Cash Collected (owner direct):</span> <span style="color:#B8924A">$1,300.00</span>
        &nbsp;&nbsp;&nbsp;<span style="color:rgba(247,244,238,0.5)">CC Fees (pass-through):</span> <span style="color:rgba(247,244,238,0.7)">$196.32</span>
      </div>
      <div style="margin-top:12px;font-size:10px;color:rgba(247,244,238,0.4)">All figures in USD · FX ≈ 18 MXN/USD for peso-denominated profit items · Accommodation fare excluded</div>
    </div>
  </div></body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
