# College Website

A modern, accessible, UGC/AICTE-compliant college website for an Indian HEI.
Built with **Next.js 16** + **Tailwind CSS v4** + **Supabase** + **shadcn/ui**.

## Features
- Public website (all pages incl. Program Explorer, Faculty Directory)
- **Admissions Portal** — multi-step wizard, document upload, status tracking
- **Faculty Recruitment Portal** — vacancies, apply, shortlist
- **Admin Console** — review/approve/reject, Excel export, notifications
- **AI Admission Assistant** — RAG-grounded Q&A
- **UGC/AICTE Mandatory Disclosure** page
- WCAG 2.2 AA accessible · SEO-optimised · Mobile-first

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and other values

# 3. Run DB migrations in Supabase SQL editor (001–026) or: npm run db:migrate

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure
See `Planning Docs/08 - Project Structure.md` in the Obsidian vault for details.

## Planning Documents
All planning docs (Architecture, PRD, DB Schema, API Conventions, Business Rules, etc.) live in:
`D:\Obsidian Vault\second_brain\Education\Professor\Planning Docs\`

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix |
| Backend | Supabase (Auth · Postgres · Storage) |
| Forms | react-hook-form + zod |
| Email | Resend |
| Payments | Razorpay |
| AI | OpenAI / Gemini + pgvector (RAG) |

## Security Notes
- RLS is enabled on all tables. See `db/migrations/001_initial_schema.sql`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose in `NEXT_PUBLIC_*`.
- Signed upload URLs issued by server action only.
- See `Planning Docs/18 - Performance and Security Requirements.md`.
