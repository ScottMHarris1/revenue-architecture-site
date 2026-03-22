import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  revenue?: string;
  concentration?: string;
  forecast?: string;
  trigger?: string;
  notes?: string;
  source?: string;
  snapshot?: {
    hasSnapshotData?: boolean;
    fragilityScore?: number | null;
    concentrationRisk?: string | null;
    founderDependency?: string | null;
    forecastRisk?: string | null;
    marginRisk?: string | null;
    evRisk?: string | null;
    source?: string | null;
  };
};

function parseRevenue(value?: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseConcentration(value?: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function scoreLead(payload: LeadPayload): { score: number; band: string } {
  let score = 0;

  const revenue = parseRevenue(payload.revenue);
  const concentration = parseConcentration(payload.concentration);
  const forecast = (payload.forecast || "").toLowerCase();
  const fragilityScore = payload.snapshot?.fragilityScore || 0;
  const trigger = (payload.trigger || "").toLowerCase();

  if (revenue >= 10 && revenue <= 50) score += 20;
  else if (revenue > 0) score += 10;

  if (concentration >= 40) score += 20;
  else if (concentration >= 25) score += 10;

  if (forecast === "low") score += 20;
  else if (forecast === "medium") score += 10;

  if (fragilityScore >= 70) score += 25;
  else if (fragilityScore >= 50) score += 15;
  else if (fragilityScore > 0) score += 5;

  if (
    trigger.includes("forecast") ||
    trigger.includes("concentration") ||
    trigger.includes("valuation") ||
    trigger.includes("founder")
  ) {
    score += 5;
  }

  score = Math.min(score, 100);

  let band = "Cool";
  if (score >= 70) band = "Hot";
  else if (score >= 40) band = "Warm";

  return { score, band };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const { score, band } = scoreLead(body);

    const airtableToken = process.env.AIRTABLE_ACCESS_TOKEN;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME;
    const calendlyUrl =
      process.env.CALENDLY_URL || "https://calendly.com/scott-m-harris-1";

    if (airtableToken && airtableBaseId && airtableTableName) {
      const airtableRes = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(
          airtableTableName
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${airtableToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  Name: body.name || "",
                  Email: body.email || "",
                  Company: body.company || "",
                  Role: body.role || "",
                  Revenue: body.revenue || "",
                  Top3ClientConcentration: body.concentration || "",
                  ForecastPredictability: body.forecast || "",
                  Trigger: body.trigger || "",
                  Notes: body.notes || "",
                  Source: body.source || body.snapshot?.source || "landing-page",
                  FragilityScore:
                    body.snapshot?.fragilityScore !== null &&
                    body.snapshot?.fragilityScore !== undefined
                      ? body.snapshot.fragilityScore
                      : "",
                  ConcentrationRisk: body.snapshot?.concentrationRisk || "",
                  FounderDependency: body.snapshot?.founderDependency || "",
                  ForecastRisk: body.snapshot?.forecastRisk || "",
                  MarginRisk: body.snapshot?.marginRisk || "",
                  EVRisk: body.snapshot?.evRisk || "",
                  LeadScore: score,
                  LeadBand: band,
                },
              },
            ],
          }),
        }
      );

      if (!airtableRes.ok) {
        const errText = await airtableRes.text();
        return NextResponse.json(
          { error: `Airtable write failed: ${errText}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      score,
      band,
      redirectUrl: calendlyUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
