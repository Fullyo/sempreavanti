import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import { Booking, formatMXN } from "@/lib/calculations";

Font.register({
  family: "Cormorant",
  fonts: [
    { src: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.ttf", fontWeight: 300 },
    { src: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjQAllvuQWJ5g.ttf", fontWeight: 400 },
  ],
});
Font.register({
  family: "Jost",
  fonts: [
    { src: "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7myjJQVGPokMmuHL.ttf", fontWeight: 300 },
    { src: "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7mygJQVGPokMmuHL.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7mybIwVGPokMmuHL.ttf", fontWeight: 500 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: "Jost", fontSize: 10, color: "#1C1914" },
  brandRow: {
    borderBottomWidth: 2,
    borderBottomColor: "#B8924A",
    paddingBottom: 14,
    marginBottom: 22,
  },
  brand: { fontFamily: "Cormorant", fontWeight: 300, fontSize: 26, color: "#1C1914" },
  brandSub: { fontSize: 8, color: "#B8924A", letterSpacing: 2, marginTop: 4, textTransform: "uppercase" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  metaLabel: { fontSize: 8, color: "#9E9080", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 },
  metaValue: { fontSize: 11 },
  guestBox: {
    backgroundColor: "#F7F4EE",
    borderLeftWidth: 3,
    borderLeftColor: "#B8924A",
    padding: 14,
    borderRadius: 3,
    marginBottom: 22,
  },
  guestLabel: { fontSize: 8, color: "#9E9080", letterSpacing: 1.5, textTransform: "uppercase" },
  guestName: { fontFamily: "Cormorant", fontWeight: 400, fontSize: 20, marginTop: 4 },
  guestDates: { fontSize: 10, color: "#5A5242", marginTop: 4 },
  sectionLabel: {
    fontSize: 8,
    color: "#9E9080",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#B8924A",
    paddingBottom: 6,
    marginBottom: 4,
  },
  th: { color: "#B8924A", fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: 1 },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5DDC9",
  },
  totalsBlock: { marginTop: 18, marginLeft: "45%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalDueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: "#B8924A",
  },
  totalDueLabel: { fontFamily: "Cormorant", fontSize: 14, fontWeight: 400 },
  totalDueValue: { fontFamily: "Cormorant", fontSize: 16, fontWeight: 400 },
  footer: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: "#E5DDC9",
    paddingTop: 18,
    textAlign: "center",
  },
  thanksES: { fontFamily: "Cormorant", fontStyle: "italic", color: "#B8924A", fontSize: 14 },
  thanksEN: { fontSize: 9, color: "#9E9080", marginTop: 6 },
});

function Cell({ width, align, children, bold }: { width: string; align?: "right" | "left"; children: any; bold?: boolean }) {
  return (
    <View style={{ width }}>
      <Text style={{ fontSize: 10, textAlign: align ?? "left", fontWeight: bold ? 500 : 400 }}>{children}</Text>
    </View>
  );
}

function InvoiceDoc({ booking }: { booking: Booking }) {
  const servicesSubtotal = booking.items.reduce((s, i) => s + (i.guest_total ?? 0), 0);
  const tipPct =
    booking.tip_mode === "percent" ? `Staff Tip (${booking.tip_value}%)` : "Staff Tip";
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const ref = "SA-" + String(booking.id).padStart(8, "0").slice(-8);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>Villas Sempre Avanti</Text>
          <Text style={styles.brandSub}>Riviera Nayarit · Mexico</Text>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Invoice</Text>
            <Text style={styles.metaValue}>{ref}</Text>
          </View>
          <View>
            <Text style={[styles.metaLabel, { textAlign: "right" }]}>Date Issued</Text>
            <Text style={[styles.metaValue, { textAlign: "right" }]}>{today}</Text>
          </View>
        </View>

        <View style={styles.guestBox}>
          <Text style={styles.guestLabel}>Prepared For</Text>
          <Text style={styles.guestName}>{booking.guest}</Text>
          <Text style={styles.guestDates}>
            Check-in: {booking.checkin}
            {booking.checkout ? ` · Check-out: ${booking.checkout}` : ""}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Concierge Services</Text>

        <View style={styles.tableHead}>
          <View style={{ width: "50%" }}>
            <Text style={styles.th}>Service</Text>
          </View>
          <View style={{ width: "10%" }}>
            <Text style={[styles.th, { textAlign: "right" }]}>Qty</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={[styles.th, { textAlign: "right" }]}>Unit Price</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={[styles.th, { textAlign: "right" }]}>Amount</Text>
          </View>
        </View>

        {booking.items.map((i, idx) => {
          const unit = i.qty ? (i.guest_total ?? 0) / i.qty : 0;
          return (
            <View key={idx} style={styles.row}>
              <Cell width="50%">{i.name}</Cell>
              <Cell width="10%" align="right">
                {i.qty}
              </Cell>
              <Cell width="20%" align="right">
                {formatMXN(unit)}
              </Cell>
              <Cell width="20%" align="right" bold>
                {formatMXN(i.guest_total)}
              </Cell>
            </View>
          );
        })}

        <View style={styles.totalsBlock}>
          {(booking.tip > 0 || booking.cc_fee > 0) && (
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{formatMXN(servicesSubtotal)}</Text>
            </View>
          )}
          {booking.tip > 0 && (
            <View style={styles.totalRow}>
              <Text>{tipPct}</Text>
              <Text>{formatMXN(booking.tip)}</Text>
            </View>
          )}
          {booking.cc_fee > 0 && (
            <View style={styles.totalRow}>
              <Text>3% Credit Card Fee</Text>
              <Text>{formatMXN(booking.cc_fee)}</Text>
            </View>
          )}
          <View style={styles.totalDueRow}>
            <Text style={styles.totalDueLabel}>TOTAL DUE (MXN)</Text>
            <Text style={styles.totalDueValue}>{formatMXN(booking.total_guest)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.thanksES}>¡Gracias por su visita!</Text>
          <Text style={styles.thanksEN}>Thank you for choosing Villas Sempre Avanti.</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function downloadInvoice(booking: Booking) {
  const blob = await pdf(<InvoiceDoc booking={booking} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${booking.guest.replace(/\s+/g, "_")}-${booking.checkin}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
