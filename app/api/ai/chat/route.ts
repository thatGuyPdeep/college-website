import { NextRequest } from "next/server";
import { generateAnswer, streamAnswer } from "@/lib/ai/chat";
import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimitResponse } from "@/lib/security/rate-limit";

function sseLine(data: object) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimitResponse(`ai:chat:${clientIp(req)}`, 30, 60_000);
    if (limited) return limited;

    const body = await req.json() as { message: string; session_id?: string; stream?: boolean };
    if (!body.message?.trim()) {
      return new Response(JSON.stringify({ error: "Message required" }), { status: 400 });
    }

    const wantsStream = body.stream !== false;

    if (wantsStream) {
      const encoder = new TextEncoder();
      let finalAnswer = "";
      let finalSources: string[] = [];

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamAnswer(body.message)) {
              if (chunk.type === "token") {
                controller.enqueue(encoder.encode(sseLine({ type: "token", text: chunk.text })));
              } else {
                finalAnswer = chunk.answer;
                finalSources = chunk.sources;
                controller.enqueue(encoder.encode(sseLine({ type: "done", sources: chunk.sources })));
              }
            }
          } catch (err) {
            controller.enqueue(encoder.encode(sseLine({ type: "error", error: "Stream failed" })));
            console.error("[ai/chat stream]", err);
          } finally {
            controller.close();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (_adminClient as any).from("ai_chat_logs").insert({
              session_id: body.session_id ?? "anonymous",
              question:   body.message,
              answer:     finalAnswer,
              sources:    finalSources,
            }).catch(() => {});
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type":  "text/event-stream",
          "Cache-Control": "no-cache",
          Connection:      "keep-alive",
        },
      });
    }

    const { answer, sources } = await generateAnswer(body.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_adminClient as any).from("ai_chat_logs").insert({
      session_id: body.session_id ?? "anonymous",
      question:   body.message,
      answer,
      sources,
    }).catch(() => {});

    return Response.json({ answer, sources });
  } catch (err) {
    console.error("[ai/chat]", err);
    return Response.json({ error: "Could not process your question" }, { status: 500 });
  }
}
