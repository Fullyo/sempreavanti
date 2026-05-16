import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import NewBooking from "./concierge/NewBooking";
import AllBookings from "./concierge/AllBookings";
import PriceList from "./concierge/PriceList";
import ExportTab from "./concierge/Export";
import SettingsTab from "./concierge/Settings";

const PASSWORD = import.meta.env.VITE_CONCIERGE_PASSWORD as string | undefined;
const SESSION_KEY = "concierge_auth";

const TABS = [
  { id: "new", label: "New Booking" },
  { id: "all", label: "All Bookings" },
  { id: "pricelist", label: "Price List" },
  { id: "export", label: "Export" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Gate({ onPass }: { onPass: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!PASSWORD) {
      setErr(true);
      return;
    }
    if (val === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ auth: true }));
      onPass();
    } else {
      setErr(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F7F4EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "#FDFBF7",
          border: "1px solid #DDD5C4",
          borderRadius: 4,
          padding: "48px 56px",
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#B8924A",
            marginBottom: 14,
          }}
        >
          LUX Internal Access
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 36,
            color: "#1C1914",
            margin: 0,
            marginBottom: 32,
          }}
        >
          Villas Sempre Avanti
        </h1>
        <input
          type="password"
          autoFocus
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setErr(false);
          }}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: `1px solid ${err ? "#8B2E2E" : "#DDD5C4"}`,
            background: "#fff",
            fontFamily: "'Jost', sans-serif",
            fontSize: 14,
            outline: "none",
            color: "#1C1914",
            borderRadius: 2,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#B8924A")}
          onBlur={(e) => (e.currentTarget.style.borderColor = err ? "#8B2E2E" : "#DDD5C4")}
        />
        {err && (
          <div
            style={{
              color: "#8B2E2E",
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              marginTop: 10,
            }}
          >
            Incorrect password — try again
          </div>
        )}
        <button
          type="submit"
          style={{
            marginTop: 24,
            width: "100%",
            padding: "12px 18px",
            background: "#B8924A",
            color: "#fff",
            border: "none",
            fontFamily: "'Jost', sans-serif",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            cursor: "pointer",
            borderRadius: 2,
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default function Concierge() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TabId>("new");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.auth) setAuthed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!authed) {
    return (
      <>
        <SEO title="Concierge — Internal" noindex />
        <Gate onPass={() => setAuthed(true)} />
      </>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ minHeight: "100dvh", background: "#F7F4EE", fontFamily: "'Jost', sans-serif" }}>
      <SEO title="Concierge — Internal" noindex />
      <header
        style={{
          background: "#1C1914",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 22,
              color: "#F7F4EE",
              lineHeight: 1.1,
            }}
          >
            Villas Sempre Avanti
          </div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "rgba(247,244,238,0.4)",
              marginTop: 4,
            }}
          >
            Concierge Booking Tool
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(247,244,238,0.4)" }}>{today}</div>
      </header>

      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #DDD5C4",
          paddingLeft: 32,
          display: "flex",
          gap: 28,
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                padding: "16px 0",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: active ? "#B8924A" : "#9E9080",
                borderBottom: active ? "2px solid #B8924A" : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>
        {tab === "new" && <NewBooking onSaved={() => setTab("all")} />}
        {tab === "all" && <AllBookings />}
        {tab === "pricelist" && <PriceList />}
        {tab === "export" && <ExportTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
