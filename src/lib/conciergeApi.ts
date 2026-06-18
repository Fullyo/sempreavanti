import { supabase } from "@/integrations/supabase/client";

// Client wrapper around the secured `concierge-db` edge function.
// All concierge data access goes through here so the browser never touches the
// underlying tables directly (RLS denies anon access to them).

const TOKEN_KEY = "concierge_token";

function getToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) ?? "";
}

async function call<T = unknown>(op: string, payload: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke("concierge-db", {
    body: { op, token: getToken(), ...payload },
  });
  if (error) {
    // Surface the function's JSON error message when available.
    let msg = error.message;
    try {
      const ctx = (error as { context?: Response }).context;
      if (ctx && typeof ctx.json === "function") {
        const j = await ctx.json();
        if (j?.error) msg = typeof j.error === "string" ? j.error : JSON.stringify(j.error);
      }
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
  return data as T;
}

export const conciergeDb = {
  servicesList: (activeOnly = false) =>
    call<{ data: any[] }>("services_list", { activeOnly }).then((r) => r.data ?? []),
  servicesInsert: (record: Record<string, unknown>) => call("services_insert", { record }),
  servicesUpdate: (id: number, patch: Record<string, unknown>) => call("services_update", { id, patch }),
  servicesDelete: (id: number) => call("services_delete", { id }),

  bookingsList: () => call<{ data: any[] }>("bookings_list").then((r) => r.data ?? []),
  bookingsInsert: (record: Record<string, unknown>) =>
    call<{ data: { pay_token?: string } }>("bookings_insert", { record }).then((r) => r.data),
  bookingsUpdate: (id: number, patch: Record<string, unknown>) => call("bookings_update", { id, patch }),
  bookingsDelete: (id: number) => call("bookings_delete", { id }),
  bookingsUpsert: (rows: Record<string, unknown>[]) => call("bookings_upsert", { rows }),

  pettyCashList: () => call<{ data: any[] }>("petty_cash_list").then((r) => r.data ?? []),
  pettyCashUpsert: (row: Record<string, unknown>) => call("petty_cash_upsert", { row }),
};
