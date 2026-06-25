#!/usr/bin/env node
/** Embed knowledge-base chunks into content_chunks for pgvector RAG. Requires OPENAI_API_KEY. */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=\s]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY   = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
if (!OPENAI_KEY) {
  console.error("Missing OPENAI_API_KEY — required for embeddings");
  process.exit(1);
}

const CHUNKS = [
  { source: "/about", text: "Ramakrishna Mission Vivekananda College, Narayanpur, Chhattisgarh is a branch centre of Ramakrishna Math & Ramakrishna Mission, Belur Math. Affiliated to Bastar University. NEP 2020 FYUGP undergraduate programmes." },
  { source: "/about/history", text: "Ramakrishna Mission Ashrama Narainpur established 1985. Serves Abujhmarh tribal region — 34000 population, 233 villages, 4000 sq km. PVTG Hill Marias. Education healthcare tribal welfare since inception." },
  { source: "/about/awards", text: "National awards: Bhagwan Mahaveer Foundation 1996, Indira Gandhi Social Service 1998, Dr Ambedkar National Award 2000, Indira Gandhi National Integration 2009, Rajya Khel Alankaran 2018." },
  { source: "/about#leadership", text: "Leadership: Secretary Swami Vyaptananda heads Ramakrishna Mission Ashrama Narayanpur. College Principal leads UG programmes. Contact rkm.narainpur@gmail.com 07781-252251." },
  { source: "/about/activities", text: "Service activities: Vivekananda Vidyapeeth residential school, interior Vidyamandirs, Vivekananda Arogya Dham hospital, mobile medical units, agriculture training Brehabeda, ITI vocational training." },
  { source: "/about/inspiration/swami-vivekananda", text: "Swami Vivekananda man-making education. Arise awake stop not till goal reached. Founded Ramakrishna Mission 1897." },
  { source: "/donate", text: "Donate to Ramakrishna Mission Ashrama Narayanpur. 80G tax deduction. Online Razorpay minimum 500 rupees." },
  { source: "/admissions", text: "Admissions overview at /admissions. How to apply at /admissions/how-to-apply. Fee structure at /admissions/fees. Scholarships at /admissions/scholarships." },
  { source: "/admissions/apply", text: "Online 5-step admission: Personal, Academic, Programme, Documents, Submit. Sign in with email OTP. Application number format RKM-YYYY-XXXXX. Track at /admissions/dashboard." },
  { source: "/admissions/apply", text: "Required documents: 10th Marksheet, 12th Marksheet, ID Proof, Passport Photo, Transfer Certificate. PDF/JPG/PNG max 5 MB each." },
  { source: "/admissions/fees", text: "Application fee is paid online during submission. Programme fees vary; see /admissions/fees. Refunds follow university and state government norms." },
  { source: "/admissions/scholarships", text: "Post-Matric scholarships for SC/ST/OBC via National Scholarship Portal. Reservation follows Chhattisgarh government norms." },
  { source: "/academics", text: "UG programmes under NEP 2020 FYUGP. Also ITI vocational training and Vivekananda Vidyapeeth residential school for tribal children." },
  { source: "/careers", text: "Faculty vacancies at /careers. Apply online with CV. Track at /careers/dashboard." },
  { source: "/contact", text: "Contact: rkm.narainpur@gmail.com, phone 07781-252251. Narayanpur, Chhattisgarh." },
  { source: "/disclosure", text: "UGC/AICTE mandatory disclosure at /disclosure including programmes, faculty, fees, and policies." },
  { source: "/campus/hostel", text: "Residential hostel facilities for students at Ramakrishna Mission Vivekananda College campus." },
  { source: "/placements", text: "Placement cell supports UG graduates with career guidance and recruiter connections." },
  { source: "/academics/iti", text: "Ramakrishna Mission ITI Narayanpur NCVT trades Electrician Fitter Turner Wireman COPA Mason Welder Mechanic Diesel Mechanic Tractor Draughtsman Civil. Admission priority Abujhmarh tribal youth. Contact 07781-252360 info@rkmitinpr.org" },
];

async function embed(text) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method:  "POST",
    headers: { Authorization: `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
    body:    JSON.stringify({ model: "text-embedding-3-small", input: text }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.data[0].embedding;
}

const db = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  console.log(`Ingesting ${CHUNKS.length} chunks…`);
  for (const chunk of CHUNKS) {
    const embedding = await embed(chunk.text);
    const { error } = await db.from("content_chunks").insert({
      source_url: chunk.source,
      text:       chunk.text,
      embedding,
    });
    if (error) console.warn("Insert warning:", error.message);
    else console.log("✓", chunk.source);
  }
  console.log("Done. Run migration 009_rag_rpc.sql if match_content_chunks is missing.");
}

main().catch((e) => { console.error(e); process.exit(1); });
