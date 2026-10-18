import { createHmac } from "node:crypto";
import { checkBotId } from "botid/server";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};
const endpoint =
  "https://crm.sterlingcrestfinancial.com/api/internal/website-booking";
function reply(value: unknown, status = 200) {
  return Response.json(value, { status, headers });
}
async function bridge(input: unknown) {
  const secret = process.env.WEBSITE_BOOKING_BRIDGE_SECRET;
  if (!secret || secret.length < 48)
    return reply(
      {
        error:
          "The calendar is temporarily unavailable. Please call us to book.",
      },
      503,
    );
  const body = JSON.stringify(input),
    timestamp = String(Date.now());
  const signature = createHmac("sha256", secret)
    .update(`website-booking:v1\n${timestamp}\n${body}`)
    .digest("hex");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-booking-timestamp": timestamp,
      "x-booking-signature": signature,
    },
    body,
    signal: AbortSignal.timeout(50_000),
    redirect: "error",
  });
  if (!response.headers.get("content-type")?.includes("application/json"))
    throw new Error("Invalid booking service response");
  const value = await response.json();
  return reply(value, response.status);
}
export async function GET(request: Request) {
  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!/^\d{4}-\d{2}$/.test(month))
    return reply({ error: "Choose a valid month." }, 400);
  try {
    if (process.env.VERCEL_ENV !== "production") {
      const publicResponse = await fetch(
        `https://www.sterlingcrestfinancial.com/api/booking?month=${month}`,
        { signal: AbortSignal.timeout(30_000), redirect: "error" },
      );
      if (
        !publicResponse.headers
          .get("content-type")
          ?.includes("application/json")
      )
        throw new Error("Invalid availability response");
      return reply(await publicResponse.json(), publicResponse.status);
    }
    return await bridge({ action: "availability", month });
  } catch {
    console.error("website-booking availability unavailable");
    return reply(
      { error: "Available times could not be loaded. Please try again." },
      503,
    );
  }
}
export async function POST(request: Request) {
  try {
    // Preview branches can display real availability but never create bookings.
    if (process.env.VERCEL_ENV !== "production")
      return reply({ error: "This preview does not accept bookings." }, 403);
    const host = new URL(request.url).host,
      origin = request.headers.get("origin");
    if (
      !origin ||
      new URL(origin).host !== host ||
      ![
        "www.sterlingcrestfinancial.com",
        "sterlingcrestfinancial.com",
      ].includes(host)
    )
      return reply({ error: "Please book through our website." }, 403);
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return reply({ error: "Invalid request." }, 415);
    if (Number(request.headers.get("content-length") ?? 0) > 6000)
      return reply({ error: "The form is too long." }, 413);
    const raw = await request.text();
    if (raw.length > 6000)
      return reply({ error: "The form is too long." }, 413);
    const input = JSON.parse(raw);
    if (
      input.website ||
      !Number.isFinite(input.formStartedAt) ||
      Date.now() - input.formStartedAt < 2500 ||
      Date.now() - input.formStartedAt > 2 * 3600_000
    )
      return reply({ error: "Please refresh the form and try again." }, 400);
    const bot = await checkBotId({ advancedOptions: { checkLevel: "basic" } });
    if (bot.isBot)
      return reply(
        {
          error:
            "We could not verify this request. Please refresh or call us to book.",
        },
        403,
      );
    const secret = process.env.WEBSITE_BOOKING_BRIDGE_SECRET ?? "";
    const ip =
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const clientHash = createHmac("sha256", secret)
      .update(`booking-client:${ip}`)
      .digest("hex");
    return await bridge({
      action: "book",
      requestId: input.requestId,
      start: input.start,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email,
      reason: input.reason,
      clientHash,
    });
  } catch {
    console.error("website-booking submission unavailable");
    return reply(
      {
        error:
          "We could not confirm your booking. Keep this page open and try again, or call us.",
        pending: true,
      },
      503,
    );
  }
}
