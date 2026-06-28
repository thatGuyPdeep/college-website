import { SITE_FULL_NAME } from "@/lib/utils/constants";
import { KNOWLEDGE_BASE } from "@/lib/ai/knowledge-base";
import { retrieveContextHybrid } from "@/lib/ai/rag";
import { retrieveContextKeyword } from "@/lib/ai/keyword-retrieval";

async function getContextForQuery(query: string, limit = 4): Promise<{ text: string; source: string }[]> {
  return retrieveContextHybrid(query, limit);
}

function ruleBasedAnswer(query: string, chunks: { text: string; source: string }[]): { answer: string; sources: string[] } {
  const sources = [...new Set(chunks.map((c) => c.source))];
  const q = query.toLowerCase();

  if (q.includes("document") || q.includes("required") || q.includes("upload")) {
    return {
      answer: `Admission applications for ${SITE_FULL_NAME} are submitted on the official Shaheed Mahendra Karma Vishwavidyalaya (Bastar University) portal at https://smkvbastar.ac.in — not on this college website. Visit /admissions/apply for instructions. Required documents: 10th marksheet, 12th marksheet, caste certificate, domicile certificate, transfer certificate (TC), and migration certificate.`,
      sources: ["/admissions/apply", "/admissions/how-to-apply"],
    };
  }
  if (q.includes("fee") || q.includes("cost") || q.includes("payment")) {
    return {
      answer: `Programme fees vary by course. UG programmes under NEP 2020 FYUGP are affiliated to Bastar University. For the latest fee structure, visit /admissions/fees or contact the admissions office at rkm.narainpur@gmail.com or 07781-252251.`,
      sources: ["/admissions/fees", "/contact"],
    };
  }
  if (q.includes("eligib") || q.includes("qualif")) {
    return {
      answer: `Eligibility depends on the programme. UG programmes require 10+2 pass from a recognized board. ITI trades require 10th pass (some need Maths & Science). Check /academics for programme-specific requirements.`,
      sources: ["/academics"],
    };
  }
  if (q.includes("apply") || q.includes("admission") || q.includes("how to")) {
    return {
      answer: `Admission applications are submitted on the official Bastar University portal at https://smkvbastar.ac.in — visit /admissions/apply on this site for step-by-step instructions. Select Ramakrishna Mission Vivekananda College, Narayanpur when applying. For local queries contact rkm.narainpur@gmail.com or 07781-252251.`,
      sources: ["/admissions/apply", "/admissions/how-to-apply"],
    };
  }
  if (q.includes("deadline") || q.includes("last date") || q.includes("when")) {
    return {
      answer: `Admissions for Session 2026–27 are open. Specific closing dates are announced on the News page and college notice board. We recommend applying early as seats are limited.`,
      sources: ["/news", "/admissions/apply"],
    };
  }
  if (q.includes("scholar")) {
    return {
      answer: `Scholarships and fee concessions may be available for eligible SC/ST/OBC and economically weaker students as per government norms. See /admissions/scholarships or contact the admissions office.`,
      sources: ["/admissions/scholarships", "/contact"],
    };
  }
  if (q.includes("status") || q.includes("track")) {
    return {
      answer: `Track your application at /admissions/dashboard after logging in. You'll see your application number (RKM-YYYY-XXXXX), current status, and any document requests.`,
      sources: ["/admissions/dashboard"],
    };
  }

  const context = chunks.map((c) => c.text).join("\n\n");
  return {
    answer: context
      ? `Based on our official information:\n\n${context}\n\nFor more details, visit ${sources.join(" or ")} or contact us at rkm.narainpur@gmail.com.`
      : `I'm the RMVK College Admission Assistant. I can help with eligibility, required documents, how to apply, fees, and application status. What would you like to know?`,
    sources,
  };
}

async function openAiAnswer(query: string): Promise<{ answer: string; sources: string[] } | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const chunks = await getContextForQuery(query);
  const context = chunks.map((c) => `[${c.source}] ${c.text}`).join("\n\n");
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model:       process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role:    "system",
            content: `You are the admission assistant for Ramakrishna Mission Vivekananda College, Narayanpur. Answer ONLY using the provided context. If unsure, say you don't know and suggest contacting rkm.narainpur@gmail.com or 07781-252251. Never guarantee admission. Include relevant page paths like /admissions/apply when helpful.\n\nContext:\n${context}`,
          },
          { role: "user", content: query },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    const answer = data.choices?.[0]?.message?.content;
    if (!answer) return null;

    return {
      answer,
      sources: [...new Set(chunks.map((c) => c.source))],
    };
  } catch {
    return null;
  }
}

export async function generateAnswer(query: string): Promise<{ answer: string; sources: string[] }> {
  const chunks = await getContextForQuery(query);
  const ai = await openAiAnswer(query);
  if (ai) return ai;
  return ruleBasedAnswer(query, chunks);
}

export type StreamChunk =
  | { type: "token"; text: string }
  | { type: "done"; sources: string[]; answer: string };

/** Stream tokens when OpenAI is configured; otherwise emit full rule-based answer. */
export async function* streamAnswer(query: string): AsyncGenerator<StreamChunk> {
  const chunks = await getContextForQuery(query);
  const sources = [...new Set(chunks.map((c) => c.source))];
  const key = process.env.OPENAI_API_KEY;

  if (key) {
    const context = chunks.map((c) => `[${c.source}] ${c.text}`).join("\n\n");
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method:  "POST",
        headers: {
          Authorization:  `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:       process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          temperature: 0.2,
          stream:      true,
          messages: [
            {
              role:    "system",
              content: `You are the admission assistant for Ramakrishna Mission Vivekananda College, Narayanpur. Answer ONLY using the provided context. If unsure, say you don't know and suggest contacting rkm.narainpur@gmail.com or 07781-252251. Never guarantee admission. Include relevant page paths when helpful.\n\nContext:\n${context}`,
            },
            { role: "user", content: query },
          ],
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as {
                choices?: { delta?: { content?: string } }[];
              };
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                full += token;
                yield { type: "token", text: token };
              }
            } catch {
              /* skip malformed SSE */
            }
          }
        }

        if (full) {
          yield { type: "done", sources, answer: full };
          return;
        }
      }
    } catch {
      /* fall through */
    }
  }

  const fallback = ruleBasedAnswer(query, chunks);
  yield { type: "token", text: fallback.answer };
  yield { type: "done", sources: fallback.sources, answer: fallback.answer };
}

/** @deprecated Use retrieveContextKeyword from keyword-retrieval */
export function retrieveContext(query: string, limit = 4) {
  return retrieveContextKeyword(query, limit);
}

export { KNOWLEDGE_BASE };
