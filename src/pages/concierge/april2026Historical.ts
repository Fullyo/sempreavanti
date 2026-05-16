export function openApril2026Historical() {
  const html = `<!doctype html><html><head><meta charset="utf-8"/>
  <title>April 2026 — Historical Report — Villas Sempre Avanti</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@300;400;500&display=swap"/>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #F7F4EE; font-family: 'Jost', sans-serif; color: #1C1914; font-size: 13px; }
    .wrap { max-width: 880px; margin: 0 auto; padding: 40px 32px 80px; }
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
    .card.tips { background: #1C1914; color: #F7F4EE; }
    .card.tips .label { color: rgba(247,244,238,0.5); } .card.tips .value { color: #B8924A; }
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
    .b-50 { background: #7A5C1E1a; color: #7A5C1E; }
    .b-25 { background: #7A5C1E1a; color: #7A5C1E; }
    .b-pass { background: #1E44771a; color: #1E4477; }
    .b-passcc { background: #9E90801a; color: #9E9080; }
    .grand { background: #1C1914; color: #F7F4EE; padding: 24px; border-radius: 4px; margin-top: 28px; }
    .grand h2 { font-family: 'Cormorant Garamond', serif; font-weight: 300; color: #B8924A; margin: 0 0 18px; font-size: 22px; }
    .grand-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
    .grand-cell .l { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,244,238,0.5); }
    .grand-cell .v { font-size: 16px; margin-top: 4px; font-weight: 500; }
    @media print { .print-btn { display:none; } body { background: #fff; } }
  </style></head><body>
  <div class="wrap">
    <button class="print-btn" onclick="window.print()">⬇ Print / Save as PDF</button>
    <div class="conf">Internal Report · Confidential</div>
    <h1>Villas Sempre Avanti</h1>
    <div class="sub">Upsell Revenue &amp; Profit Report — April 2026</div>
    <div class="meta">6 bookings · All figures in USD · Accommodation fare excluded · Split: 85% owner / 15% LUX</div>

    <div class="cards">
      <div class="card"><div class="label">Total Upsell Revenue</div><div class="value">$7,362.63</div></div>
      <div class="card"><div class="label">Total Profit Pool</div><div class="value">$1,996.71</div></div>
      <div class="card owner"><div class="label">Owner's Share 85%</div><div class="value">$1,697.20</div></div>
      <div class="card lux"><div class="label">LUX's Cut 15%</div><div class="value">$299.51</div></div>
      <div class="card tips"><div class="label">Tips to Staff</div><div class="value">$125.00</div></div>
    </div>

    <section class="booking">
      <div class="booking-head"><div><div class="guest">Jess Geevarghese</div><div class="dates">Apr 1–5, 2026 · 4 nights · 8 adults</div></div><div class="ref">Invoice #19 · GY-kcce78ZE<br/>2- Sempre Avanti</div></div>
      <table><thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead><tbody>
        <tr><td>Groceries</td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$1,080.00</td><td style="text-align:right">$280.00</td><td style="text-align:right;color:#2D6A45">$238.00</td><td style="text-align:right;color:#7A5C1E">$42.00</td></tr>
        <tr><td>Airport SUV (Round Trip) <em style="color:#9E9080;font-size:11px">≈$1,000 MXN</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">$606.00</td><td style="text-align:right">$50.00</td><td style="text-align:right;color:#2D6A45">$42.50</td><td style="text-align:right;color:#7A5C1E">$7.50</td></tr>
        <tr><td>Tip <em style="color:#9E9080;font-size:11px">Pay to staff</em></td><td><span class="badge b-pass">Pass-through</span></td><td style="text-align:right">$125.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
        <tr><td>Credit Card Fee</td><td><span class="badge b-passcc">Pass-through</span></td><td style="text-align:right">$50.58</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
      </tbody><tfoot><tr><td colspan="2" style="text-align:right">Totals</td><td style="text-align:right">$1,861.58</td><td style="text-align:right">$330.00</td><td style="text-align:right;color:#2D6A45">$280.50</td><td style="text-align:right;color:#7A5C1E">$49.50</td></tr></tfoot></table>
    </section>

    <section class="booking">
      <div class="booking-head"><div><div class="guest">Michael Orcutt</div><div class="dates">Apr 6–10, 2026 · 4 nights · 4 adults, 6 children</div></div><div class="ref">Invoice #25 · GY-pQnsRVfG<br/>2- Sempre Avanti</div></div>
      <table><thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead><tbody>
        <tr><td>Groceries</td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$2,010.27</td><td style="text-align:right">$521.61</td><td style="text-align:right;color:#2D6A45">$443.37</td><td style="text-align:right;color:#7A5C1E">$78.24</td></tr>
        <tr><td>Bonfire</td><td><span class="badge b-15">15%</span></td><td style="text-align:right">$150.00</td><td style="text-align:right">$22.50</td><td style="text-align:right;color:#2D6A45">$19.13</td><td style="text-align:right;color:#7A5C1E">$3.38</td></tr>
        <tr><td>Meal at the House <em style="color:#9E9080;font-size:11px">After-hours dinner</em></td><td><span class="badge b-50">50%</span></td><td style="text-align:right">$120.00</td><td style="text-align:right">$60.00</td><td style="text-align:right;color:#2D6A45">$51.00</td><td style="text-align:right;color:#7A5C1E">$9.00</td></tr>
        <tr><td>UTV Rental</td><td><span class="badge b-15">15%</span></td><td style="text-align:right">$475.00</td><td style="text-align:right">$71.25</td><td style="text-align:right;color:#2D6A45">$60.56</td><td style="text-align:right;color:#7A5C1E">$10.69</td></tr>
        <tr><td>Credit Card Fee</td><td><span class="badge b-passcc">Pass-through</span></td><td style="text-align:right">$98.38</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
      </tbody><tfoot><tr><td colspan="2" style="text-align:right">Totals</td><td style="text-align:right">$2,853.65</td><td style="text-align:right">$675.36</td><td style="text-align:right;color:#2D6A45">$574.06</td><td style="text-align:right;color:#7A5C1E">$101.31</td></tr></tfoot></table>
    </section>

    <section class="booking">
      <div class="booking-head"><div><div class="guest">Dan Warneke</div><div class="dates">Apr 10–13, 2026 · 3 nights · 2 adults</div></div><div class="ref">Invoice #26 · HM9J4ZQERP<br/>Villa Pietro</div></div>
      <table><thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead><tbody>
        <tr><td>Groceries</td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$145.00</td><td style="text-align:right">$37.59</td><td style="text-align:right;color:#2D6A45">$31.95</td><td style="text-align:right;color:#7A5C1E">$5.64</td></tr>
        <tr><td>Credit Card Fee</td><td><span class="badge b-passcc">Pass-through</span></td><td style="text-align:right">$4.35</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
      </tbody><tfoot><tr><td colspan="2" style="text-align:right">Totals</td><td style="text-align:right">$149.35</td><td style="text-align:right">$37.59</td><td style="text-align:right;color:#2D6A45">$31.95</td><td style="text-align:right;color:#7A5C1E">$5.64</td></tr></tfoot></table>
      <div class="note">⚠ VAT on Accommodation ($311.52) excluded — not an upsell</div>
    </section>

    <section class="booking">
      <div class="booking-head"><div><div class="guest">Scott Strannigan</div><div class="dates">Apr 13–17, 2026 · 4 nights · 6 adults 1 child 1 infant</div></div><div class="ref">Invoice #29 · HMHNA9AMK5<br/>Villa Luisa</div></div>
      <table><thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead><tbody>
        <tr><td>UTV Rental</td><td><span class="badge b-15">15%</span></td><td style="text-align:right">$435.00</td><td style="text-align:right">$65.25</td><td style="text-align:right;color:#2D6A45">$55.46</td><td style="text-align:right;color:#7A5C1E">$9.79</td></tr>
        <tr><td>In-House Massage <em style="color:#9E9080;font-size:11px">Est. 2 sessions — verify</em></td><td><span class="badge b-25">$25/session</span></td><td style="text-align:right">$522.00</td><td style="text-align:right">$50.00</td><td style="text-align:right;color:#2D6A45">$42.50</td><td style="text-align:right;color:#7A5C1E">$7.50</td></tr>
        <tr><td>Groceries</td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$1,241.00</td><td style="text-align:right">$321.74</td><td style="text-align:right;color:#2D6A45">$273.48</td><td style="text-align:right;color:#7A5C1E">$48.26</td></tr>
        <tr><td>Airport Transfer (Round Trip) <em style="color:#9E9080;font-size:11px">≈$1,000 MXN cash · paid to driver</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">—</td><td style="text-align:right">$50.00</td><td style="text-align:right;color:#2D6A45">$42.50</td><td style="text-align:right;color:#7A5C1E">$7.50</td></tr>
        <tr><td>Credit Card Fee</td><td><span class="badge b-passcc">Pass-through</span></td><td style="text-align:right">$48.00</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
      </tbody><tfoot><tr><td colspan="2" style="text-align:right">Totals</td><td style="text-align:right">$2,246.00</td><td style="text-align:right">$486.99</td><td style="text-align:right;color:#2D6A45">$413.94</td><td style="text-align:right;color:#7A5C1E">$73.05</td></tr></tfoot></table>
      <div class="note">⚠ Massage $522 estimated as 2 sessions × $261 — verify session count</div>
    </section>

    <section class="booking">
      <div class="booking-head"><div><div class="guest">Erikk Pietro</div><div class="dates">Apr 17–21, 2026 · 4 nights · 2 adults</div></div><div class="ref">Invoice #33 · GY-afzErwEm<br/>Villa Pietro</div></div>
      <table><thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead><tbody>
        <tr><td>UTV Rental <em style="color:#9E9080;font-size:11px">Adjusted amount</em></td><td><span class="badge b-15">15%</span></td><td style="text-align:right">$360.00</td><td style="text-align:right">$54.00</td><td style="text-align:right;color:#2D6A45">$45.90</td><td style="text-align:right;color:#7A5C1E">$8.10</td></tr>
        <tr><td>Groceries</td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$567.00</td><td style="text-align:right">$147.00</td><td style="text-align:right;color:#2D6A45">$124.95</td><td style="text-align:right;color:#7A5C1E">$22.05</td></tr>
        <tr><td>UTV Gas</td><td><span class="badge b-15">15%</span></td><td style="text-align:right">$58.00</td><td style="text-align:right">$8.70</td><td style="text-align:right;color:#2D6A45">$7.40</td><td style="text-align:right;color:#7A5C1E">$1.31</td></tr>
        <tr><td>Credit Card Fee</td><td><span class="badge b-passcc">Pass-through</span></td><td style="text-align:right">$29.55</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
      </tbody><tfoot><tr><td colspan="2" style="text-align:right">Totals</td><td style="text-align:right">$1,014.55</td><td style="text-align:right">$209.70</td><td style="text-align:right;color:#2D6A45">$178.25</td><td style="text-align:right;color:#7A5C1E">$31.46</td></tr></tfoot></table>
    </section>

    <section class="booking">
      <div class="booking-head"><div><div class="guest">Alem Sendaba</div><div class="dates">Apr 18–22, 2026 · 4 nights · 3 adults 1 infant</div></div><div class="ref">Invoice #32 · HMD9J2H534<br/>Villa Luisa</div></div>
      <table><thead><tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr></thead><tbody>
        <tr><td>Groceries</td><td><span class="badge b-35">35% markup</span></td><td style="text-align:right">$702.00</td><td style="text-align:right">$182.07</td><td style="text-align:right;color:#2D6A45">$154.76</td><td style="text-align:right;color:#7A5C1E">$27.31</td></tr>
        <tr><td>In-House Massage <em style="color:#9E9080;font-size:11px">1 session × $25</em></td><td><span class="badge b-25">$25/session</span></td><td style="text-align:right">$260.00</td><td style="text-align:right">$25.00</td><td style="text-align:right;color:#2D6A45">$21.25</td><td style="text-align:right;color:#7A5C1E">$3.75</td></tr>
        <tr><td>Airport SUV (Round Trip) <em style="color:#9E9080;font-size:11px">≈$1,000 MXN</em></td><td><span class="badge b-flat">Flat fee</span></td><td style="text-align:right">$288.00</td><td style="text-align:right">$50.00</td><td style="text-align:right;color:#2D6A45">$42.50</td><td style="text-align:right;color:#7A5C1E">$7.50</td></tr>
        <tr><td>Credit Card Fee</td><td><span class="badge b-passcc">Pass-through</span></td><td style="text-align:right">$37.50</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right">—</td></tr>
      </tbody><tfoot><tr><td colspan="2" style="text-align:right">Totals</td><td style="text-align:right">$1,287.50</td><td style="text-align:right">$257.07</td><td style="text-align:right;color:#2D6A45">$218.51</td><td style="text-align:right;color:#7A5C1E">$38.56</td></tr></tfoot></table>
    </section>

    <div class="grand">
      <h2>April 2026 — Grand Summary</h2>
      <div class="grand-grid">
        <div class="grand-cell"><div class="l">Bookings</div><div class="v">6</div></div>
        <div class="grand-cell"><div class="l">Guest Paid Total</div><div class="v">$9,412.63</div></div>
        <div class="grand-cell"><div class="l">Upsell Revenue</div><div class="v">$7,362.63</div></div>
        <div class="grand-cell"><div class="l" style="color:#7DD89E">Owner's Share 85%</div><div class="v" style="color:#7DD89E">$1,697.20</div></div>
        <div class="grand-cell"><div class="l" style="color:#D4A96A">LUX's Cut 15%</div><div class="v" style="color:#D4A96A">$299.51</div></div>
      </div>
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(247,244,238,0.15);font-size:12px">
        <span style="color:rgba(247,244,238,0.5)">Tips to Staff (pay out):</span> <span style="color:#7DD89E">$125.00</span>
        &nbsp;&nbsp;&nbsp;<span style="color:rgba(247,244,238,0.5)">CC Fees (pass-through):</span> <span style="color:rgba(247,244,238,0.7)">$268.36</span>
      </div>
      <div style="margin-top:12px;font-size:10px;color:rgba(247,244,238,0.4)">All figures in USD · Accommodation fare excluded · Massage session counts are estimates</div>
    </div>
  </div></body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
