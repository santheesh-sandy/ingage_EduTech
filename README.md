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

## Cyber Security Essentials (course 6)

`public/cyber-course.js` holds the course: 10 modules, 26 slide decks and a 5-question MCQ test per module
(questions written from the slides; score 3 of 5 to unlock the next module). Decks load from S3:
`Cyber Security Essentials/Slides/<deck file name>.pptx`, shown with the Office Online viewer.
18 lab videos come from `Cyber Security Essentials/Videos/<file name>.mp4` (list `VIDEOS` in the same file: module,
deck it follows, S3 file name, title). They play in the site's own player; finishing a video completes the step, and a video
that is not uploaded yet shows "This video is not available yet". Upload them as `.mp4` (browsers cannot play `.wmv`).
`npm run check-media` checks these links too.

## Mobile App Development (course 7)

`public/mad-course.js` holds the course: 10 modules, each with 2 slide decks, that day's video and a 5-question MCQ test.
Files load from S3: `Mobile App Development/Slides/<file name>.pptx` and `Mobile App Development/Videos/Day1.mp4 … Day 10.mp4`.
Lesson titles come from the file names; modules 8–10 reuse the Day-6 slides (API basics, state management, offline storage).
Course card details (careers, pay ranges, industries) are in `index.html` (`C`, `AIDEF`, `AISAL`), the course page sections
in `public/site-features.js` (`COURSE_INFO[7]`) and the chatbot career map in `public/role-skills.js`.

## Course slides & videos (Amazon S3)

`public/drive-media.js` loads every lesson of *IT Network System Administrator* from the S3 bucket `ingage-lms` (ap-south-1),
folder `IT Network System Administrator/`:
- Slides: `slides/M1-1.pptx` (*Download PPT*) and `slides/pdf/M1-1.pdf` (shown in the lesson viewer), 30 decks.
- Videos: `videos/<the lesson's video path in MD>.mp4`, played in the site's own player (so watching to the end marks the step complete).
- Files must stay publicly readable. To move the files, change `DRIVE_MEDIA.s3`.
- A video that S3 doesn't have falls back to the Google Drive copy (`DRIVE_MEDIA.videos`). Today all 25 videos are on S3;
  `npm run check-media` checks every slide and video address.
- To host the files next to `index.html` instead (`public/slides/`, `public/slides/pdf/`, `public/videos/`), set `DRIVE_MEDIA.on = false`.

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

Project: `ingage-edutech` (`https://mjmkkboesjxrpowkmjjf.supabase.co`). `.env` (git-ignored) holds `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_ACCESS_TOKEN` (for the CLI and the management API) and the AI settings.

```bash
npm run db:push      # create/update tables and security rules (supabase/migrations/…_learner_data.sql)
npm run deploy:fn    # deploy the chat function and upload ONLY its secrets (AI_*, ALLOWED_ORIGINS, RATE_LIMIT, CHAT_DB_KEY)
npm run gold         # 38 gold conversations against the real AI → docs/gold-eval-results.md
npm run build        # dist/index.html, the single file to upload
```

`CFG.supabase` in `public/index.html` holds the project URL and the **publishable** key (safe in a page); the chatbot finds
`…/functions/v1/chat` by itself.

**Before going live, set `ALLOWED_ORIGINS`** in `.env` to your site (for example `ALLOWED_ORIGINS=https://ingage.in,https://www.ingage.in`)
and run `npm run deploy:fn` again. Until then any website can call the function (it is still rate-limited).

**Mentors and admins** use Admin login with a normal account (sign up once on the site) that has a row in `public.staff`.
When Supabase is on, the in-page demo admin password is not accepted. Add a staff member with:

```bash
node scripts/sb-sql.mjs -e "insert into public.staff (user_id, role) select id, 'admin' from auth.users where email = 'name@example.com'"
```

### Server data (Supabase; Row Level Security on every table)

| Table | Holds | Access |
|---|---|---|
| `profiles` | name, phone, situation, goal, hours per week | the learner; staff can read |
| `learner_state` | enrollments and LMS progress (previously browser-only) | the learner; staff can read |
| `doubts` | mentor doubts and mentor answers | learner adds/reads own; staff read and answer |
| `staff` | mentors and admins | added by the project owner only |
| `chat_rate` | shared chat rate limit | the chat function only |

### Backend settings (Supabase secrets or environment variables)

| Name | Purpose |
|---|---|
| `AI_API_KEY` + `AI_BASE_URL` + `AI_MODEL` | any OpenAI-compatible API (used first; this project: Gemini) |
| `AI_REASONING_EFFORT` | sent as `reasoning_effort` (Gemini default `low`; empty = not sent) |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY` | alternatives, checked after `AI_API_KEY` |
| `CHAT_MODEL` | override model |
| `ALLOWED_ORIGINS` | comma-separated site origins allowed to call the function (default `*`; **set this in production**) |
| `RATE_LIMIT` | messages per user or IP per minute, shared across all function instances (default 15) |
| `CHAT_DB_KEY` | the project secret key; the function uses it for the rate limit and to look up signed-in learners |
| `MOCK_AI=1` | canned replies, no AI call |

Never put an AI key or the secret key in `index.html`.

## How a message is answered (gold document rules)

1. **The AI leads.** Every typed question goes to the AI when it is available. The old keyword answer is sent to it as context,
   and that answer's buttons and course cards are shown under the AI reply. If the AI is off or fails, the keyword answer is shown.
2. **Rules** (`systemPrompt` in `supabase/functions/_shared/chat-core.js`): an honest guide; a fit check with at most 3 questions,
   one at a time (situation, goal, hours per week); a recommendation with 2–3 reasons and what the course will not give, or a plain
   "nothing fits"; ingage courses only; "coming soon" courses never pushed. Learners get concept help with an example and a module
   reference, never quiz answers; career answers use 5 parts (Goal, How far this course gets you, Gaps, Next steps, Honest timing).
   No job or salary guarantees and no unsourced figures; no pressure tactics; never asks for or repeats Aadhaar, PAN, card numbers,
   OTPs or passwords (these are also removed before the AI sees them); says it is an AI; under-18s are pointed to a parent or guardian.
3. **Hand-offs**: the AI ends a reply with `HANDOFF: support | mentor | helpline`, and the site turns it into buttons (contact and call,
   send doubt to mentor, Tele-MANAS 14416 / 112). Distress is also detected on the server, so the helpline is always shown even if
   the AI forgets or fails.
4. **Login check**: signed-in learners send their Supabase access token; the function reads their enrollments and profile from the
   database instead of trusting the browser. Everyone else is treated as a visitor.
5. **Role-to-skills map** (`public/role-skills.js`, a DRAFT for ingage to sign off) feeds career answers. A course with no roles
   written there gets draft roles built from its own job roles, skills and modules (marked "not reviewed yet").
7. **New courses need no chatbot change.** Every message sends the AI the current course list from the website (status, fee,
   hours, modules, outcomes, skills, job roles, capstone projects) and, for the course on screen, its module and lesson material.
   Adding a course (a `*-course.js` file or the admin course editor) is enough; the chat function only needs a redeploy when
   `supabase/functions/_shared/chat-core.js` itself changes. Up to 40 courses are sent.
6. Mentor doubts (`Send doubt to mentor`) are saved to the `doubts` table, never sent to the AI; mentors answer them in the admin dashboard.

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
