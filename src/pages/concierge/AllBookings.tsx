import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Booking,
  BookingItem,
  calcCCFee,
  calcCost,
  calcGuestTotal,
  calcProfit,
  calcTip,
  formatMXN,
} from "@/lib/calculations";
import { COLORS, btnGhost, btnPrimary, btnDanger, fieldLabel, input, sectionTitle } from "./styles";
import { downloadInvoice } from "./GuestInvoicePDF";
import { downloadOwnerStatementCSV, openOwnerStatement } from "./ownerStatement";
import { openApril2026Historical } from "./april2026Historical";

function monthKey(d: string) {
  const dt = new Date(d);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState("all");
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState<Booking | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("checkin", { ascending: true });
    setLoading(false);
    if (error) return toast.error(error.message);
    setBookings(((data ?? []) as unknown as Booking[]).map((b) => ({
      ...b,
      items: Array.isArray(b.items) ? b.items : [],
    })));
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      const k = monthKey(b.checkin);
      (groups[k] ||= []).push(b);
    });
    Object.values(groups).forEach((arr) => arr.sort((a, b) => a.guest.localeCompare(b.guest)));
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .filter(([k]) => monthFilter === "all" || k === monthFilter);
  }, [bookings, monthFilter]);

  const months = useMemo(() => {
    const set = new Set(bookings.map((b) => monthKey(b.checkin)));
    return Array.from(set).sort();
  }, [bookings]);

  const startEdit = (b: Booking) => {
    setEditId(b.id);
    setEdit(JSON.parse(JSON.stringify(b)));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEdit(null);
  };

  const saveEdit = async () => {
    if (!edit) return;
    const items: BookingItem[] = edit.items.map((i) => ({
      ...i,
      guest_total: calcGuestTotal(i.type, i.price, i.qty),
      cost: calcCost(i.type, i.price, i.qty, i.unit_cost),
      profit: calcProfit(i.type, i.price, i.qty, i.unit_cost),
    }));
    const servicesSubtotal = items.reduce((s, i) => s + i.guest_total, 0);
    const tip = calcTip(edit.tip_mode, Number(edit.tip_value), servicesSubtotal);
    const cc_fee = calcCCFee(edit.cc_fee_on, servicesSubtotal, tip);
    const total_guest = servicesSubtotal + tip + cc_fee;
    const total_profit = items.reduce((s, i) => s + (i.profit ?? 0), 0);

    const { error } = await supabase
      .from("bookings")
      .update({
        guest: edit.guest,
        checkin: edit.checkin,
        checkout: edit.checkout,
        items,
        cc_fee_on: edit.cc_fee_on,
        tip_mode: edit.tip_mode,
        tip_value: edit.tip_value,
        tip,
        cc_fee,
        total_guest,
        total_profit,
      })
      .eq("id", edit.id);
    if (error) return toast.error(error.message);
    toast.success("Booking updated");
    cancelEdit();
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const downloadAllCSV = () => {
    const rows: string[][] = [];
    rows.push(["Month","Guest","Check-in","Check-out","Service","Qty","Unit Price (MXN)","Guest Total (MXN)","Our Cost (MXN)","Profit (MXN)"]);
    bookings.forEach((b) => {
      const m = monthLabel(monthKey(b.checkin));
      b.items.forEach((i) =>
        rows.push([m, b.guest, b.checkin, b.checkout ?? "", i.name, String(i.qty), String(Math.round(i.price)), String(Math.round(i.guest_total ?? 0)), i.cost === null ? "" : String(Math.round(i.cost)), i.profit === null ? "TBD" : String(Math.round(i.profit))]),
      );
      if (Number(b.tip) > 0) rows.push([m, b.guest, b.checkin, b.checkout ?? "", b.tip_mode === "percent" ? `Staff Tip (${b.tip_value}%)` : "Staff Tip", "", "", String(Math.round(b.tip)), "", "pass-through"]);
      if (Number(b.cc_fee) > 0) rows.push([m, b.guest, b.checkin, b.checkout ?? "", "3% Credit Card Fee", "", "", String(Math.round(b.cc_fee)), "", ""]);
    });
    const csv = rows.map((r) => r.map((c) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sempre-avanti-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(bookings, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sempre-avanti-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const restore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed: Booking[] = JSON.parse(reader.result as string);
        const existingIds = new Set(bookings.map((b) => b.id));
        const toInsert = parsed.filter((b) => !existingIds.has(b.id));
        if (!toInsert.length) {
          toast("No new bookings to restore");
          return;
        }
        const { error } = await supabase.from("bookings").upsert(
          toInsert.map(({ id, ...rest }) => ({ ...rest })) as any,
        );
        if (error) throw error;
        toast.success(`Restored ${toInsert.length} bookings`);
        load();
      } catch (err: any) {
        toast.error(err.message ?? "Restore failed");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <h1 style={sectionTitle}>All Bookings</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Filter by month
          </label>
          <select
            style={{ ...input, width: "auto", padding: "8px 10px" }}
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="all">All months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
          <button onClick={load} style={btnGhost}>↻ Refresh</button>
          <button onClick={downloadAllCSV} style={btnGhost}>Download All as CSV</button>
        </div>
      </div>
      <div style={{ fontStyle: "italic", color: COLORS.textMuted, fontSize: 12, marginBottom: 14 }}>
        Click Download Invoice on a booking for a guest PDF, or Owner Statement on a month for the owner's report.
      </div>

      {loading && <div style={{ color: COLORS.textMuted }}>Loading…</div>}
      {!loading && bookings.length === 0 && <div style={{ color: COLORS.textMuted }}>No bookings yet.</div>}

      {grouped.map(([key, list]) => {
        const charged = list.reduce((s, b) => s + Number(b.total_guest), 0);
        const profit = list.reduce((s, b) => s + Number(b.total_profit), 0);
        const label = monthLabel(key);
        const [yStr, mStr] = key.split("-");
        const monthName = new Date(Date.UTC(Number(yStr), Number(mStr) - 1, 1)).toLocaleDateString("en-US", { month: "long" });
        return (
          <div key={key} style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300 }}>
                  {label}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                  {list.length} bookings · Charged: {formatMXN(charged)} · Profit: {formatMXN(profit)}
                </div>
              </div>
              <button
                onClick={() => openOwnerStatement(monthName, Number(yStr), list)}
                style={btnPrimary}
              >
                ⬇ Owner Statement
              </button>
            </div>

            {list.map((b) => {
              const isEdit = editId === b.id && edit;
              const view = (isEdit ? edit! : b);
              return (
                <div key={b.id} style={{ background: "#fff", border: `1px solid ${isEdit ? COLORS.gold : COLORS.border}`, borderRadius: 4, padding: "18px 22px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      {isEdit ? (
                        <input
                          style={{ ...input, fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300 }}
                          value={view.guest}
                          onChange={(e) => setEdit({ ...edit!, guest: e.target.value })}
                        />
                      ) : (
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300 }}>
                          {view.guest}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, display: "flex", gap: 10, alignItems: "center" }}>
                        {isEdit ? (
                          <>
                            <input type="date" style={{ ...input, width: "auto" }} value={view.checkin} onChange={(e) => setEdit({ ...edit!, checkin: e.target.value })} />
                            <input type="date" style={{ ...input, width: "auto" }} value={view.checkout ?? ""} onChange={(e) => setEdit({ ...edit!, checkout: e.target.value || null })} />
                          </>
                        ) : (
                          <span>
                            Check-in: {view.checkin}{view.checkout ? ` · Check-out: ${view.checkout}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 500 }}>{formatMXN(view.total_guest)}</div>
                      <div style={{ fontSize: 12, color: COLORS.green, marginTop: 2 }}>Profit: {formatMXN(view.total_profit)}</div>
                    </div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 13 }}>
                    <thead>
                      <tr style={{ color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Service</th>
                        {isEdit && <th style={{ width: 70, padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Qty</th>}
                        {isEdit && <th style={{ width: 100, padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Unit Price</th>}
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Total</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Cost</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.items.map((i, idx) => {
                        const gt = isEdit ? calcGuestTotal(i.type, i.price, i.qty) : i.guest_total;
                        const c = isEdit ? calcCost(i.type, i.price, i.qty, i.unit_cost) : i.cost;
                        const p = isEdit ? calcProfit(i.type, i.price, i.qty, i.unit_cost) : i.profit;
                        return (
                          <tr key={idx}>
                            <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                              {i.name} <span style={{ color: COLORS.textMuted }}>×{i.qty}</span>
                            </td>
                            {isEdit && (
                              <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                                <input type="number" min={1} style={input} value={i.qty} onChange={(e) => {
                                  const items = [...edit!.items];
                                  items[idx] = { ...i, qty: Math.max(1, Number(e.target.value) || 1) };
                                  setEdit({ ...edit!, items });
                                }} />
                              </td>
                            )}
                            {isEdit && (
                              <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                                <input type="number" min={0} style={input} value={i.price} onChange={(e) => {
                                  const items = [...edit!.items];
                                  items[idx] = { ...i, price: Number(e.target.value) || 0 };
                                  setEdit({ ...edit!, items });
                                }} />
                              </td>
                            )}
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatMXN(gt)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMid }}>{c === null ? "—" : formatMXN(c)}</td>
                            <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: p === null ? COLORS.amber : COLORS.green, fontStyle: p === null ? "italic" : "normal" }}>{p === null ? "TBD" : formatMXN(p)}</td>
                          </tr>
                        );
                      })}
                      {Number(view.tip) > 0 && (
                        <tr>
                          <td style={{ padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>
                            {view.tip_mode === "percent" ? `Staff Tip (${view.tip_value}%)` : "Staff Tip"}
                          </td>
                          {isEdit && <td colSpan={2} />}
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}` }}>{formatMXN(view.tip)}</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>—</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.blue, fontStyle: "italic", fontSize: 11 }}>pass-through</td>
                        </tr>
                      )}
                      {Number(view.cc_fee) > 0 && (
                        <tr>
                          <td style={{ padding: "8px 6px" }}>3% Credit Card Fee</td>
                          {isEdit && <td colSpan={2} />}
                          <td style={{ textAlign: "right", padding: "8px 6px" }}>{formatMXN(view.cc_fee)}</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", color: COLORS.textMuted }}>—</td>
                          <td style={{ textAlign: "right", padding: "8px 6px", color: COLORS.textMuted }}>—</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {isEdit && (
                    <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label style={fieldLabel}>Tip</label>
                        <button
                          onClick={() => setEdit({ ...edit!, tip_mode: edit!.tip_mode === "amount" ? "percent" : "amount", tip_value: 0 })}
                          style={{ ...btnGhost, padding: "6px 12px", minWidth: 36 }}
                        >
                          {edit!.tip_mode === "amount" ? "$" : "%"}
                        </button>
                        <input
                          type="number"
                          min={0}
                          style={{ ...input, width: 90 }}
                          value={edit!.tip_value || ""}
                          onChange={(e) => setEdit({ ...edit!, tip_value: Number(e.target.value) || 0 })}
                        />
                      </div>
                      <button
                        onClick={() => setEdit({ ...edit!, cc_fee_on: !edit!.cc_fee_on })}
                        style={{ ...btnGhost, color: edit!.cc_fee_on ? COLORS.red : COLORS.textMid }}
                      >
                        CC Fee: {edit!.cc_fee_on ? "ON" : "OFF"}
                      </button>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                    {isEdit ? (
                      <>
                        <button onClick={cancelEdit} style={btnGhost}>Cancel</button>
                        <button onClick={saveEdit} style={btnPrimary}>Save Changes</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => downloadInvoice(b)} style={btnPrimary}>Download Invoice</button>
                        <button onClick={() => startEdit(b)} style={btnGhost}>Edit</button>
                        <button onClick={() => remove(b.id)} style={btnDanger}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted, marginBottom: 10 }}>
          Historical Reports
        </div>
        <button onClick={openApril2026Historical} style={btnGhost}>
          View April 2026 Report (USD, pre-tool)
        </button>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8, fontStyle: "italic" }}>
          Original USD report from Guesty invoices, before the tool was built.
        </div>
      </div>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: COLORS.textMuted, marginBottom: 10 }}>
          Advanced — Data Safety
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={downloadBackup} style={btnGhost}>Download Data Backup</button>
          <label style={{ ...btnGhost, display: "inline-block" }}>
            Restore from Backup
            <input type="file" accept="application/json" style={{ display: "none" }} onChange={restore} />
          </label>
        </div>
      </div>
    </div>
  );
}
