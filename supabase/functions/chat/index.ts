// Supabase Edge Function "chat" – live AI answers for the ingage chatbot.
// Deploy:  supabase functions deploy chat --no-verify-jwt
// Secrets: supabase secrets set ANTHROPIC_API_KEY=... ALLOWED_ORIGINS=https://your-site.com
import { createChatHandler } from "../_shared/chat-core.js";

Deno.serve(createChatHandler({ env: (k: string) => Deno.env.get(k) }));
