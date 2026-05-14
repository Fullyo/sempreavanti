import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Status = "loading" | "ready" | "already" | "invalid" | "submitting" | "done" | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } }
        );
        const data = await res.json();
        if (!res.ok) { setStatus("invalid"); return; }
        if (data.valid === false && data.reason === "already_unsubscribed") setStatus("already");
        else if (data.valid) setStatus("ready");
        else setStatus("invalid");
      } catch {
        setStatus("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    setStatus("submitting");
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) setStatus("done");
      else if (data.reason === "already_unsubscribed") setStatus("already");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <SEO
        title="Unsubscribe — Villas Sempre Avanti"
        description="Manage your email preferences and unsubscribe from communications sent by Villas Sempre Avanti."
        path="/unsubscribe"
        noindex
      />
      <section className="min-h-[70dvh] flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center bg-card border border-border rounded-2xl p-10">
          <h1 className="font-serif text-3xl font-light text-foreground mb-4">
            Email Preferences
          </h1>

          {status === "loading" && (
            <p className="text-sm font-sans text-muted-foreground">Verifying your request…</p>
          )}
          {status === "ready" && (
            <>
              <p className="text-sm font-sans text-muted-foreground mb-6">
                Confirm you'd like to unsubscribe from emails sent by Villas Sempre Avanti.
              </p>
              <Button
                onClick={confirm}
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 py-6 uppercase tracking-widest text-xs"
              >
                Confirm Unsubscribe
              </Button>
            </>
          )}
          {status === "submitting" && (
            <p className="text-sm font-sans text-muted-foreground">Processing…</p>
          )}
          {status === "done" && (
            <p className="text-sm font-sans text-foreground">
              You've been unsubscribed. We're sorry to see you go.
            </p>
          )}
          {status === "already" && (
            <p className="text-sm font-sans text-foreground">
              You've already unsubscribed from our emails.
            </p>
          )}
          {status === "invalid" && (
            <p className="text-sm font-sans text-destructive">
              This unsubscribe link is invalid or has expired.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm font-sans text-destructive">
              Something went wrong. Please try again later.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
