import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CATEGORY_ORDER, Service, commissionRule, formatMXN } from "@/lib/calculations";
import { COLORS, btnGhost, btnPrimary, input, sectionTitle } from "./styles";

const TYPES = ["tour", "mgmt", "margin", "fixedprofit", "grocery", "beer", "flat", "villa"];

export default function Settings() {
  const [services, setServices] = useState<Service[]>([]);
  const [edits, setEdits] = useState<Record<number, Partial<Service>>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newSvc, setNewSvc] = useState<Partial<Service>>({ type: "tour", price: 0, is_active: true });

  const load = () =>
    supabase
      .from("services")
      .select("*")
      .order("category")
      .order("sort_order")
      .then(({ data }) => setServices((data ?? []) as Service[]));

  useEffect(() => {
    load();
  }, []);

  const patch = (id: number, p: Partial<Service>) =>
    setEdits((e) => ({ ...e, [id]: { ...e[id], ...p } }));

  const saveRow = async (id: number) => {
    const p = edits[id];
    if (!p) return;
    const { error } = await supabase.from("services").update(p).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEdits((e) => {
      const { [id]: _, ...rest } = e;
      return rest;
    });
    load();
  };

  const removeRow = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const addService = async () => {
    if (!newSvc.category || !newSvc.name) return toast.error("Category and name required");
    const { error } = await supabase.from("services").insert({
      category: newSvc.category,
      name: newSvc.name,
      type: newSvc.type ?? "tour",
      price: Number(newSvc.price ?? 0),
      unit_cost: newSvc.unit_cost ?? null,
      sub_text: newSvc.sub_text ?? null,
      is_active: true,
      sort_order: 999,
    });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setShowAdd(false);
    setNewSvc({ type: "tour", price: 0, is_active: true });
    load();
  };

  const downloadCSV = () => {
    const rows: string[][] = [["Category", "Service", "Type", "Guest Price (MXN)", "Unit Cost (MXN)", "Commission Rule"]];
    services.forEach((s) =>
      rows.push([s.category, s.name, s.type, String(s.price), s.unit_cost === null ? "" : String(s.unit_cost), commissionRule(s.type, Number(s.price), s.unit_cost === null ? null : Number(s.unit_cost))]),
    );
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `sempre-avanti-price-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const byCat: Record<string, Service[]> = {};
  services.forEach((s) => ((byCat[s.category] ||= []).push(s)));
  const cats = [...CATEGORY_ORDER.filter((c) => byCat[c]), ...Object.keys(byCat).filter((c) => !CATEGORY_ORDER.includes(c))];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
        <h1 style={sectionTitle}>Master Service Catalogue</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={downloadCSV} style={btnGhost}>Download Price List as CSV</button>
          <button onClick={() => setShowAdd((v) => !v)} style={btnPrimary}>+ Add Service</button>
        </div>
      </div>
      <div style={{ color: COLORS.textMuted, fontStyle: "italic", marginBottom: 22, fontSize: 13 }}>
        Changes apply immediately across the entire tool.
      </div>

      {showAdd && (
        <div style={{ background: "#fff", border: `1px solid ${COLORS.gold}`, padding: 18, borderRadius: 4, marginBottom: 22, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <input style={input} placeholder="Category" value={newSvc.category ?? ""} onChange={(e) => setNewSvc({ ...newSvc, category: e.target.value })} />
          <input style={input} placeholder="Service name" value={newSvc.name ?? ""} onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })} />
          <select style={input} value={newSvc.type} onChange={(e) => setNewSvc({ ...newSvc, type: e.target.value })}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input style={input} type="number" placeholder="Guest price" value={newSvc.price ?? ""} onChange={(e) => setNewSvc({ ...newSvc, price: Number(e.target.value) })} />
          <input style={input} type="number" placeholder="Unit cost (optional)" value={newSvc.unit_cost ?? ""} onChange={(e) => setNewSvc({ ...newSvc, unit_cost: e.target.value === "" ? null : Number(e.target.value) })} />
          <input style={input} placeholder="Sub-text (optional)" value={newSvc.sub_text ?? ""} onChange={(e) => setNewSvc({ ...newSvc, sub_text: e.target.value })} />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowAdd(false)} style={btnGhost}>Cancel</button>
            <button onClick={addService} style={btnPrimary}>Save</button>
          </div>
        </div>
      )}

      {cats.map((cat) => (
        <div key={cat} style={{ marginBottom: 26 }}>
          <div style={{ background: COLORS.bg, borderLeft: `3px solid ${COLORS.gold}`, padding: "10px 14px", fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>
            {cat}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", fontSize: 12 }}>
            <thead>
              <tr style={{ color: COLORS.textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid ${COLORS.border}` }}>Service</th>
                <th style={{ padding: 8, borderBottom: `1px solid ${COLORS.border}` }}>Type</th>
                <th style={{ padding: 8, borderBottom: `1px solid ${COLORS.border}` }}>Price</th>
                <th style={{ padding: 8, borderBottom: `1px solid ${COLORS.border}` }}>Unit Cost</th>
                <th style={{ padding: 8, borderBottom: `1px solid ${COLORS.border}` }}>Active</th>
                <th style={{ padding: 8, borderBottom: `1px solid ${COLORS.border}` }}>Rule</th>
                <th style={{ padding: 8, borderBottom: `1px solid ${COLORS.border}` }}></th>
              </tr>
            </thead>
            <tbody>
              {byCat[cat].map((s) => {
                const e = edits[s.id] ?? {};
                const cur = { ...s, ...e };
                const dirty = !!edits[s.id];
                const hasUnitCost = ["margin", "fixedprofit", "flat"].includes(cur.type);
                const priceDisabled = ["grocery", "beer"].includes(cur.type);
                return (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: 6 }}>
                      <input style={input} value={cur.name} onChange={(ev) => patch(s.id, { name: ev.target.value })} />
                    </td>
                    <td style={{ padding: 6 }}>
                      <select style={input} value={cur.type} onChange={(ev) => patch(s.id, { type: ev.target.value })}>
                        {TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: 6 }}>
                      {priceDisabled ? (
                        <span style={{ color: COLORS.textMuted, fontStyle: "italic" }}>Variable</span>
                      ) : (
                        <input style={input} type="number" value={Number(cur.price)} onChange={(ev) => patch(s.id, { price: Number(ev.target.value) })} />
                      )}
                    </td>
                    <td style={{ padding: 6 }}>
                      {hasUnitCost ? (
                        <input style={input} type="number" value={cur.unit_cost ?? ""} onChange={(ev) => patch(s.id, { unit_cost: ev.target.value === "" ? null : Number(ev.target.value) })} />
                      ) : <span style={{ color: COLORS.textMuted }}>—</span>}
                    </td>
                    <td style={{ padding: 6, textAlign: "center" }}>
                      <input type="checkbox" checked={cur.is_active} onChange={(ev) => patch(s.id, { is_active: ev.target.checked })} />
                    </td>
                    <td style={{ padding: 6, fontSize: 11, color: COLORS.textMid }}>
                      {commissionRule(cur.type, Number(cur.price), cur.unit_cost === null ? null : Number(cur.unit_cost))}
                    </td>
                    <td style={{ padding: 6, display: "flex", gap: 4 }}>
                      {dirty && <button onClick={() => saveRow(s.id)} style={{ ...btnPrimary, padding: "6px 10px", fontSize: 10 }}>Save</button>}
                      <button onClick={() => removeRow(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.red, fontSize: 18 }}>×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: 14, marginTop: 30, borderRadius: 4, fontSize: 12, color: COLORS.textMid, textAlign: "center" }}>
        All profits split: 85% owner · 15% LUX (universal rule, not editable here)
      </div>
    </div>
  );
}
