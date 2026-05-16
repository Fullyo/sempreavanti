import { Booking, formatMXN, OWNER_SHARE, LUX_SHARE, TYPE_LABEL, TYPE_COLOR } from "@/lib/calculations";

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function badge(label: string, color: string) {
  return `<span style="display:inline-block;padding:2px 8px;font-size:10px;border-radius:10px;background:${color}1a;color:${color};letter-spacing:0.5px;text-transform:uppercase;font-weight:500">${label}</span>`;
}

export function openOwnerStatement(month: string, year: number, bookings: Booking[]) {
  const totalGuestRevenue = bookings.reduce((s, b) => s + Number(b.total_guest), 0);
  const upsellRevenue = bookings.reduce(
    (s, b) => s + b.items.reduce((sum, i) => sum + (i.guest_total ?? 0), 0),
    0,
  );
  const profitPool = bookings.reduce((s, b) => s + Number(b.total_profit), 0);
  const ownerShare = Math.round(profitPool * OWNER_SHARE);
  const luxShare = Math.round(profitPool * LUX_SHARE);
  const tipsTotal = bookings.reduce((s, b) => s + Number(b.tip), 0);
  const ccFeesTotal = bookings.reduce((s, b) => s + Number(b.cc_fee), 0);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const bookingHTML = bookings
    .map((b) => {
      const ref = "SA-" + String(b.id).padStart(8, "0").slice(-8);
      const dateRange = `${b.checkin}${b.checkout ? ` → ${b.checkout}` : ""}`;
      const itemRows = b.items
        .map((i) => {
          const profit = i.profit ?? 0;
          const owner = Math.round(profit * OWNER_SHARE);
          const lux = Math.round(profit * LUX_SHARE);
          const tColor = TYPE_COLOR[i.type] ?? "#5A5242";
          const tLabel = TYPE_LABEL[i.type] ?? i.type;
          return `<tr>
            <td>${escape(i.name)} <span style="color:#9E9080;font-size:11px">×${i.qty}</span></td>
            <td>${badge(tLabel, tColor)}</td>
            <td style="text-align:right">${formatMXN(i.guest_total)}</td>
            <td style="text-align:right">${i.profit === null ? '<em style="color:#7A5C1E">TBD</em>' : formatMXN(i.profit)}</td>
            <td style="text-align:right;color:#2D6A45">${i.profit === null ? "—" : formatMXN(owner)}</td>
            <td style="text-align:right;color:#7A5C1E">${i.profit === null ? "—" : formatMXN(lux)}</td>
          </tr>`;
        })
        .join("");

      const tipRow =
        Number(b.tip) > 0
          ? `<tr>
              <td>Staff Tip${b.tip_mode === "percent" ? ` (${b.tip_value}%)` : ""}</td>
              <td>${badge("Pass-through", "#1E4477")}</td>
              <td style="text-align:right">${formatMXN(b.tip)}</td>
              <td colspan="3" style="text-align:right;color:#9E9080;font-style:italic">Pay to staff</td>
            </tr>`
          : "";

      const ccRow =
        Number(b.cc_fee) > 0
          ? `<tr>
              <td>Credit Card Fee (3% on total)</td>
              <td>${badge("Pass-through", "#9E9080")}</td>
              <td style="text-align:right">${formatMXN(b.cc_fee)}</td>
              <td colspan="3" style="text-align:right;color:#9E9080">—</td>
            </tr>`
          : "";

      const subtotalProfit = b.items.reduce((s, i) => s + (i.profit ?? 0), 0);
      const ownerB = Math.round(subtotalProfit * OWNER_SHARE);
      const luxB = Math.round(subtotalProfit * LUX_SHARE);

      return `
      <section class="booking">
        <div class="booking-head">
          <div>
            <div class="guest">${escape(b.guest)}</div>
            <div class="dates">${dateRange}</div>
          </div>
          <div class="ref">${ref}</div>
        </div>
        <table>
          <thead>
            <tr><th>Item</th><th>Type</th><th style="text-align:right">Guest Paid</th><th style="text-align:right">Profit</th><th style="text-align:right">Owner 85%</th><th style="text-align:right">LUX 15%</th></tr>
          </thead>
          <tbody>
            ${itemRows}
            ${tipRow}
            ${ccRow}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align:right;font-weight:500">Booking Totals</td>
              <td style="text-align:right;font-weight:500">${formatMXN(b.total_guest)}</td>
              <td style="text-align:right;font-weight:500">${formatMXN(subtotalProfit)}</td>
              <td style="text-align:right;color:#2D6A45;font-weight:500">${formatMXN(ownerB)}</td>
              <td style="text-align:right;color:#7A5C1E;font-weight:500">${formatMXN(luxB)}</td>
            </tr>
          </tfoot>
        </table>
      </section>`;
    })
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"/>
    <title>${month} ${year} — Owner Statement — Villas Sempre Avanti</title>
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
      .card.owner { background: #F0F7F4; }
      .card.owner .value { color: #2D6A45; }
      .card.lux { background: #FDF4E3; }
      .card.lux .value { color: #7A5C1E; }
      .card.tips { background: #1C1914; color: #F7F4EE; }
      .card.tips .label { color: rgba(247,244,238,0.5); }
      .card.tips .value { color: #B8924A; }
      .booking { background: #fff; border: 1px solid #DDD5C4; border-radius: 4px; padding: 20px; margin-bottom: 18px; }
      .booking-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
      .guest { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; }
      .dates { color: #5A5242; font-size: 12px; margin-top: 2px; }
      .ref { color: #9E9080; font-size: 11px; }
      table { width: 100%; border-collapse: collapse; }
      th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9E9080; font-weight: 500; padding: 8px 6px; border-bottom: 1px solid #DDD5C4; text-align: left; }
      td { padding: 8px 6px; border-bottom: 1px solid #F0EBE0; font-size: 12px; }
      tfoot td { border-top: 2px solid #1C1914; border-bottom: none; padding-top: 10px; }
      .grand { background: #1C1914; color: #F7F4EE; padding: 24px; border-radius: 4px; margin-top: 28px; }
      .grand h2 { font-family: 'Cormorant Garamond', serif; font-weight: 300; color: #B8924A; margin: 0 0 18px; font-size: 22px; }
      .grand-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
      .grand-cell .l { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(247,244,238,0.5); }
      .grand-cell .v { font-size: 16px; margin-top: 4px; font-weight: 500; }
      .grand-foot { display: flex; gap: 28px; margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(247,244,238,0.15); font-size: 12px; }
      @media print {
        .print-btn { display: none; }
        body { background: #fff; }
      }
    </style>
  </head><body>
    <div class="wrap">
      <button class="print-btn" onclick="window.print()">⬇ Print / Save as PDF</button>
      <div class="conf">Internal Report · Confidential</div>
      <h1>Villas Sempre Avanti</h1>
      <div class="sub">Upsell Revenue &amp; Profit Report — ${month} ${year}</div>
      <div class="meta">${bookings.length} bookings · All figures in MXN · Accommodation excluded · Split: 85% owner / 15% LUX</div>
      <div class="cards">
        <div class="card"><div class="label">Total Upsell Revenue</div><div class="value">${formatMXN(upsellRevenue)}</div></div>
        <div class="card"><div class="label">Total Profit Pool</div><div class="value">${formatMXN(profitPool)}</div></div>
        <div class="card owner"><div class="label">Owner's Share 85%</div><div class="value">${formatMXN(ownerShare)}</div></div>
        <div class="card lux"><div class="label">LUX's Cut 15%</div><div class="value">${formatMXN(luxShare)}</div></div>
        <div class="card tips"><div class="label">Tips to Staff</div><div class="value">${formatMXN(tipsTotal)}</div></div>
      </div>
      ${bookingHTML}
      <div class="grand">
        <h2>${month} ${year} — Grand Summary</h2>
        <div class="grand-grid">
          <div class="grand-cell"><div class="l">Bookings</div><div class="v">${bookings.length}</div></div>
          <div class="grand-cell"><div class="l">Guest Paid Total</div><div class="v">${formatMXN(totalGuestRevenue)}</div></div>
          <div class="grand-cell"><div class="l">Upsell Revenue</div><div class="v">${formatMXN(upsellRevenue)}</div></div>
          <div class="grand-cell"><div class="l" style="color:#7DD89E">Owner's Share</div><div class="v" style="color:#7DD89E">${formatMXN(ownerShare)}</div></div>
          <div class="grand-cell"><div class="l" style="color:#D4A96A">LUX's Cut</div><div class="v" style="color:#D4A96A">${formatMXN(luxShare)}</div></div>
        </div>
        <div class="grand-foot">
          <div><span style="color:rgba(247,244,238,0.5)">Tips to Staff (pay out):</span> <span style="color:#7DD89E">${formatMXN(tipsTotal)}</span></div>
          <div><span style="color:rgba(247,244,238,0.5)">CC Fees (pass-through):</span> <span style="color:rgba(247,244,238,0.7)">${formatMXN(ccFeesTotal)}</span></div>
          <div><span style="color:rgba(247,244,238,0.5)">Total Profit Pool:</span> ${formatMXN(profitPool)}</div>
        </div>
        <div style="margin-top:16px;font-size:10px;color:rgba(247,244,238,0.4)">All figures in MXN · Accommodation excluded · Generated ${today}</div>
      </div>
    </div>
  </body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

export function downloadOwnerStatementCSV(month: string, year: number, bookings: Booking[]) {
  const rows: string[][] = [];
  rows.push(["Guest", "Check-in", "Check-out", "Service", "Type", "Guest Paid (MXN)", "Total Profit (MXN)", "Owner 85% (MXN)", "LUX 15% (MXN)"]);
  bookings.forEach((b) => {
    b.items.forEach((i) => {
      const profit = i.profit ?? 0;
      rows.push([
        b.guest,
        b.checkin,
        b.checkout ?? "",
        i.name,
        i.type,
        String(Math.round(i.guest_total ?? 0)),
        i.profit === null ? "TBD" : String(Math.round(profit)),
        i.profit === null ? "TBD" : String(Math.round(profit * OWNER_SHARE)),
        i.profit === null ? "TBD" : String(Math.round(profit * LUX_SHARE)),
      ]);
    });
    if (Number(b.tip) > 0) rows.push([b.guest, b.checkin, b.checkout ?? "", "Staff Tip", "pass-through", String(Math.round(b.tip)), "", "", ""]);
    if (Number(b.cc_fee) > 0) rows.push([b.guest, b.checkin, b.checkout ?? "", "3% Credit Card Fee", "pass-through", String(Math.round(b.cc_fee)), "", "", ""]);
  });

  const totalRevenue = bookings.reduce((s, b) => s + Number(b.total_guest), 0);
  const totalProfit = bookings.reduce((s, b) => s + Number(b.total_profit), 0);
  const tips = bookings.reduce((s, b) => s + Number(b.tip), 0);
  const ccFees = bookings.reduce((s, b) => s + Number(b.cc_fee), 0);
  rows.push([]);
  rows.push(["SUMMARY"]);
  rows.push(["Total Revenue", String(Math.round(totalRevenue))]);
  rows.push(["Total Profit", String(Math.round(totalProfit))]);
  rows.push(["Owner 85%", String(Math.round(totalProfit * OWNER_SHARE))]);
  rows.push(["LUX 15%", String(Math.round(totalProfit * LUX_SHARE))]);
  rows.push(["Tips (pass-through)", String(Math.round(tips))]);
  rows.push(["CC Fees (pass-through)", String(Math.round(ccFees))]);

  const csv = rows.map((r) => r.map((c) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sempre-avanti-owner-statement-${month}-${year}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
