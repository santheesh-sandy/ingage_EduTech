// Supabase Edge Function "chat" – live AI answers for the ingage chatbot.
// Deploy:  npm run deploy:fn
// Secrets: AI_API_KEY, AI_MODEL, AI_BASE_URL (the AI), CHAT_DB_KEY (project secret key, for the shared
//          rate limit and learner lookups), ALLOWED_ORIGINS (your site, e.g. https://ingage.in)
import { createChatHandler } from "../_shared/chat-core.js";

const env = (k: string) => Deno.env.get(k);
const URL_ = env("SUPABASE_URL") || "";
const KEY = env("CHAT_DB_KEY") || env("SUPABASE_SERVICE_ROLE_KEY") || "";
const db = (path: string, init: RequestInit = {}) =>
  fetch(URL_ + path, { ...init, headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", ...(init.headers || {}) } });

// Shared limit across every function instance (Postgres function public.chat_hit).
async function rateLimit(key: string, perMin: number): Promise<boolean> {
  const r = await db("/rest/v1/rpc/chat_hit", { method: "POST", body: JSON.stringify({ p_key: key, p_limit: perMin }) });
  if (!r.ok) throw new Error("chat_hit " + r.status);
  return (await r.json()) === true;
}

// Course titles are looked up from enrollment ids the site stores (course id → title list is sent by the site).
async function verifyUser(token: string) {
  const u = await fetch(URL_ + "/auth/v1/user", { headers: { apikey: KEY, Authorization: "Bearer " + token } });
  if (!u.ok) return null;
  const user = await u.json();
  if (!user?.id) return null;
  const id = encodeURIComponent(user.id);
  const [p, s] = await Promise.all([
    db(`/rest/v1/profiles?id=eq.${id}&select=situation,goal,hours_per_week,education`).then((r) => (r.ok ? r.json() : [])),
    db(`/rest/v1/learner_state?user_id=eq.${id}&select=enrollments,lms`).then((r) => (r.ok ? r.json() : [])),
  ]);
  const enrollments = (s[0]?.enrollments || {}) as Record<string, { t?: string }>;
  const enrolled = Object.entries(enrollments).map(([k, v]) => (v && typeof v === "object" && v.t) || "course " + k).slice(0, 10);
  return { id: user.id, enrolled, profile: p[0] || null };
}

Deno.serve(createChatHandler({ env, rateLimit: KEY ? rateLimit : undefined, verifyUser: KEY ? verifyUser : undefined }));
