import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/session";
import {
  CHATBOT_MODEL,
  SYSTEM_PROMPT,
  audienceContext,
  chatbotEnabled,
} from "@/lib/chatbot";

export const runtime = "nodejs";

type ClientMessage = { role: "user" | "assistant"; content: string };

const SEARCH_TOOL: Anthropic.Tool = {
  name: "search_athletes",
  description:
    "Search the public athlete directory. Returns public profile info (name, sport, position, school, graduation year, location, verified status) and a profile link. Does NOT return contact info. Use when a coach asks to find or filter athletes.",
  input_schema: {
    type: "object",
    properties: {
      sport: { type: "string", description: "Sport, e.g. 'Soccer', 'Basketball'." },
      position: { type: "string", description: "Position, e.g. 'Forward', 'Quarterback'." },
      state: { type: "string", description: "Two-letter US state, e.g. 'NY'." },
      graduationYear: { type: "integer", description: "Graduation/class year, e.g. 2027." },
      verifiedOnly: { type: "boolean", description: "Only return verified athletes." },
      limit: { type: "integer", description: "Max results (default 8, max 15)." },
    },
    required: [],
  },
};

async function runSearchAthletes(input: Record<string, unknown>): Promise<string> {
  const take = Math.min(Math.max(Number(input.limit) || 8, 1), 15);
  const where: Prisma.StudentProfileWhereInput = {};
  if (typeof input.sport === "string" && input.sport)
    where.sport = { equals: input.sport, mode: "insensitive" };
  if (typeof input.position === "string" && input.position)
    where.position = { equals: input.position, mode: "insensitive" };
  if (typeof input.state === "string" && input.state)
    where.state = { equals: input.state, mode: "insensitive" };
  if (Number.isFinite(Number(input.graduationYear)))
    where.graduationYear = Number(input.graduationYear);
  if (input.verifiedOnly === true) where.verified = true;

  const rows = await prisma.studentProfile.findMany({
    where,
    take,
    orderBy: [{ boosted: "desc" }, { verified: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      sport: true,
      position: true,
      school: true,
      graduationYear: true,
      location: true,
      state: true,
      verified: true,
    },
  });

  if (rows.length === 0) return JSON.stringify({ count: 0, athletes: [] });

  return JSON.stringify({
    count: rows.length,
    athletes: rows.map((r) => ({
      name: `${r.firstName} ${r.lastName}`,
      sport: r.sport,
      position: r.position,
      school: r.school,
      classOf: r.graduationYear,
      location: [r.location, r.state].filter(Boolean).join(", ") || null,
      verified: r.verified,
      profileUrl: `/athletes/${r.id}`,
    })),
  });
}

export async function POST(req: Request) {
  if (!chatbotEnabled()) {
    return new Response(JSON.stringify({ error: "Chat is not configured." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = (await req.json()) as { messages?: ClientMessage[] };
  const incoming = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim())
    .slice(-20); // cap history
  if (incoming.length === 0) {
    return new Response(JSON.stringify({ error: "No message." }), { status: 400 });
  }

  const user = await getCurrentUser();
  const canSearch = user?.role === "COACH" || user?.role === "ADMIN";
  const system =
    SYSTEM_PROMPT +
    audienceContext({ signedIn: !!user, role: user?.role, canSearch });
  const tools = canSearch ? [SEARCH_TOOL] : undefined;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const convo: Anthropic.MessageParam[] = incoming.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Agentic loop: stream text; if Claude calls the tool, run it and continue.
        for (let turn = 0; turn < 5; turn++) {
          const s = client.messages.stream({
            model: CHATBOT_MODEL,
            max_tokens: 1024,
            system,
            tools,
            messages: convo,
          });
          s.on("text", (t) => controller.enqueue(encoder.encode(t)));
          const final = await s.finalMessage();

          if (final.stop_reason !== "tool_use") break;

          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const block of final.content) {
            if (block.type === "tool_use" && block.name === "search_athletes") {
              const result = canSearch
                ? await runSearchAthletes(block.input as Record<string, unknown>)
                : JSON.stringify({ error: "not authorized" });
              toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: result,
              });
            }
          }
          convo.push({ role: "assistant", content: final.content });
          convo.push({ role: "user", content: toolResults });
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — I hit an error. Please try again in a moment.",
          ),
        );
        console.error("chat error", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
