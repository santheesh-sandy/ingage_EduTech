# ingage EduTech – website with a live‑AI chatbot

The chatbot answers from the site's **predefined Q&A first** (course cards, fees, salaries, enrolling, payments, the course knowledge base, 5 languages).
Anything those answers don't really cover goes to a **live AI API** through a small backend that keeps the API key secret.

```
public/
  index.html            the website (unchanged except the CHAT_API / CHAT_FN config and one <script> tag)
  chat-live.js          live‑AI routing layer for the chatbot
  site-features.js/.css course page sections, syllabus + review‑before‑enroll, Internships page, floating chatbot
  progress.js           progress %, milestone congratulations, internship recommendations, chatbot progress answers
  course-knowledge.js   IT Network course knowledge from the 30 slide decks: facts, software, hardware → chatbot
  drive-media.js        lesson slides (PDF/PPTX) and 25 videos played from Google Drive
supabase/
  functions/chat/index.ts        Supabase Edge Function entry
  functions/_shared/chat-core.js backend logic (Claude / OpenAI / Gemini), shared with the dev server and tests
  config.toml                    verify_jwt = false for the chat function
server/dev-server.mjs   local server: site + /api/chat (reads .env)
scripts/check-ai.mjs    one live test call with your .env settings
.env                    👉 your AI_API_KEY goes here (git-ignored)
.env.example            copy of the template
scripts/build.mjs       makes dist/index.html, one self‑contained file to upload anywhere
tests/                  85 automated tests (node:test + jsdom)
```

## Website features

| # | Feature | Where | Details |
|---|---|---|---|
| 1 | **Course syllabus** | every course page | Module‑by‑module accordion (lessons, hours, MCQ tests, capstone), *Expand all*, *Download / Print*. **Enroll now** first shows a "Review syllabus" step (once per course per visit). |
| 2 | **What You'll Learn** | course page | Learning points + **Skills**, **Technologies & tools** and **Topics covered**. |
| 3 | **Industry Relevance** | course page | Why it matters in industry, real‑world applications, industries that hire. |
| 4 | **Learning Outcomes** | course page | Practical, industry‑ready outcomes as numbered cards. |
| 5 | **Career Opportunities** | course page | Job roles with typical fresher pay (₹ LPA). |
| 6 | **Internship & 100% Placement Assistance** | course page + Internships page | Stats, 6 support services, honest note (assistance, not a job guarantee). |
| 7 | **Progress tracking** | My Learning, course page, chatbot | Completion %, ring + bar with 30/50/60/80/100% markers, badges, and an automatic congratulation pop‑up when a milestone is reached (once each; waits if another pop‑up is open). |
| 8 | **Internship recommendations** | My Learning, Internships page, chatbot | Networking: each completed module unlocks its job‑board roles. Other courses: internship tracks unlock at 30%, 60%, 100%. Shows the next unlock. |
| 9 | **AI chatbot** | every page (floating) | Course modules, learning doubts, internships; "What is my progress?" and "Which internships am I eligible for?" are answered from the learner's data; the live AI also receives progress + recommendations. |

**Edit the content** in:
- `public/site-features.js` → `COURSE_INFO` (technologies, industry relevance, applications per course), `PLACEMENT` (placement section), `INTERN` (Internships page)
- `public/progress.js` → `MILESTONES`, `TRACK_UNLOCK`, `MS_TEXT` (congratulation messages)
- `public/index.html` → course list `C` (title, hours, fee, *What you'll learn* `l`, outcomes `o`, skills `k`)

## Layout check

`scripts/check_layout.py` opens every page at 7 screen sizes (1920 → 390 px), logged out and logged in, and reports
sideways scrolling, content running off screen, and headings that don't line up with the logo.
Run `npm start`, then `pip install playwright && playwright install chromium && python3 scripts/check_layout.py`.

## Course slides & videos (Google Drive)

`public/drive-media.js` maps every lesson of *IT Network System Administrator* to your Drive files:
30 slide decks (shown as PDF, with *Download PPT*) and 25 lab videos (played in Drive's player).
- Drive folders: slides `1nHlmdKS4JG8qha2oZE8uQ81uNbpjILp1`, videos `1rgQHxH3ty9FciwXc7lhAHVOdHt9-V-Ko`
- Keep the files shared as **Anyone with the link → Viewer**, otherwise learners see a sign-in page.
- A new or replaced file in Drive gets a new ID: update it in `DRIVE_MEDIA.slides` / `DRIVE_MEDIA.videos`.
- To host the files yourself instead, put them in `public/slides/`, `public/slides/pdf/`, `public/videos/` and set `DRIVE_MEDIA.on = false`.

The chatbot's course knowledge (`public/course-knowledge.js`) was written from the text of all 30 decks:
key facts per module, all software (with system requirements) and the lab PC hardware spec.

## 🔑 Where to put your AI_API_KEY (only one place)

Open the file **`.env`** in the project folder and replace the placeholder:

```diff
- AI_API_KEY=PASTE_YOUR_AI_API_KEY_HERE
+ AI_API_KEY=your-real-key
  AI_MODEL=gemini-3.8-flash
  AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
```

That's it. Don't put the key in `index.html` or any other file. The browser never sees it; only the backend reads it.
Using a different provider? Change `AI_BASE_URL` and `AI_MODEL` too (any OpenAI-compatible API).

## Run it

Needs **Node.js 18+** (https://nodejs.org).

```bash
npm install        # once
npm run check-ai   # sends one test question to the AI: prints the answer, or exactly what is wrong
npm start          # opens the site + backend at http://localhost:5173
npm test           # 85 automated tests (no internet / key needed)
npm run dev        # demo mode: canned AI replies, no key needed
```

`npm start` is the full backend: it serves the website and the chat API at `/api/chat`, so you can also run it on any
Node host (VPS, Render, Railway…): set `PORT` and the same three `AI_…` variables in the host's settings.
If the key is missing or wrong, the chatbot still works with its predefined answers.

## Go live (Supabase)

```bash
supabase link --project-ref YOUR_PROJECT_REF
npm run secrets:fn                      # uploads AI_API_KEY, AI_MODEL, AI_BASE_URL from .env
supabase secrets set ALLOWED_ORIGINS=https://your-site.com,https://www.your-site.com
npm run deploy:fn                       # supabase functions deploy chat --no-verify-jwt
```

Then in `public/index.html` fill in `CFG.supabase` (`url` + publishable `key`). The chatbot finds
`https://YOUR_REF.supabase.co/functions/v1/chat` by itself. Build the single file with:

```bash
npm run build                                           # dist/index.html
CHAT_API=https://other-backend.example/chat npm run build   # if your backend is not on Supabase
```

### Backend settings (Supabase secrets or environment variables)

| Name | Purpose |
|---|---|
| `AI_API_KEY` + `AI_BASE_URL` + `AI_MODEL` | any OpenAI-compatible API (used first; this project: Gemini) |
| `AI_REASONING_EFFORT` | sent as `reasoning_effort` (Gemini default `low`; empty = not sent) |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY` | alternatives, checked after `AI_API_KEY` |
| `CHAT_MODEL` | override model (defaults: `claude-haiku-5-5`, `gpt-4o-mini`, `gemini-2.5-flash`) |
| `ALLOWED_ORIGINS` | comma‑separated site origins allowed to call the function (default `*`; set this in production) |
| `RATE_LIMIT` | messages per IP per minute (default 15) |
| `MOCK_AI=1` | canned replies, no AI call |

Never put an AI key in `index.html`.

## How a message is answered

1. **Predefined routes**: course cards, fee, salary, roles, enroll, compare, job openings, experience level, module lists, mentor doubts, help topics.
2. A predefined reply is **replaced by live AI** when it is only a fallback for the question:
   the "I'm not sure" reply, the help menu shown for unmatched non‑English questions, "couldn't match your interest",
   a course overview shown for an unrelated question, a keyword match where most of the question is about something else
   (e.g. "weekend batches for working professionals in Madurai"), or a question about fitting study around work/time
   ("along with my job", "night shift", "weekends", and Tamil/Hindi/Telugu/Kannada equivalents).
3. Strong course‑knowledge matches ("What is DHCP?") stay predefined.
4. **Live AI** gets: recent chat (HTML stripped), language, chat mode, the course being viewed or studied, matching knowledge entries,
   the predefined answer as a hint, and all course data (fees, roles, salaries, prerequisites). It's told not to invent fees,
   batches, locations or guarantees.
5. If the AI fails, takes over 25 s, or the function doesn't exist (404), the predefined answer is shown instead.
6. Mentor doubts (`Send doubt to mentor`) are always saved for the mentor, never sent to the AI.

## Bugs fixed

| Bug | Fix |
|---|---|
| Live AI never ran (`CHAT_API` was empty, no backend) | backend + automatic Supabase / localhost URL |
| Non‑English questions with no match only got the help menu | sent to live AI |
| On a course page, every unmatched question got the course overview again | real questions go to live AI |
| A keyword hijacked the question ("Can I study while working a night shift **job**?" → job roles list; same in Hindi) | coverage + study‑around‑work checks send these to AI |
| On a course page, "how long is this course" showed two unrelated DHCP/Ubuntu quiz questions | answers duration / fee for the course on screen |
| After one Tamil/Hindi/Telugu message, every later English message was answered in that language | an auto‑detected language switches back when you type English; a language picked from the menu stays |
| No typing indicator while waiting for the AI; double sends possible | typing bubble, send blocked until the reply arrives |
| HTML of bot bubbles was sent to the AI as chat history | plain text only |
| `**bold**` was the only formatting; links/bullets showed raw | safe markdown: bold, `code`, bullets, https links (everything escaped first) |
