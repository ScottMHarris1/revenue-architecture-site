'use client';

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type FormState = {
  name: string;
  email: string;
  company: string;
  role: string;
  revenue: string;
  concentration: string;
  forecast: string;
  trigger: string;
  notes: string;
};

const CALENDLY_URL = "https://calendly.com/scott-m-harris-1";
const LINKEDIN_URL = "https://www.linkedin.com/in/mrscottharris/";
const SNAPSHOT_URL = "https://revenue-fragility-web-app.vercel.app/";

function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-950" />
          <p className="text-base leading-7 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

function RevenueArchitectureLandingPage() {
  const searchParams = useSearchParams();

  const snapshot = useMemo(() => {
    const fragilityScore = parseNumber(searchParams.get("fragilityScore"));
    const concentrationRisk = searchParams.get("concentrationRisk");
    const founderDependency = searchParams.get("founderDependency");
    const forecastRisk = searchParams.get("forecastRisk");
    const marginRisk = searchParams.get("marginRisk");
    const evRisk = searchParams.get("evRisk");
    const source = searchParams.get("source");

    const hasSnapshotData =
      fragilityScore !== null ||
      !!concentrationRisk ||
      !!founderDependency ||
      !!forecastRisk ||
      !!marginRisk ||
      !!evRisk ||
      !!source;

    return {
      hasSnapshotData,
      fragilityScore,
      concentrationRisk,
      founderDependency,
      forecastRisk,
      marginRisk,
      evRisk,
      source,
    };
  }, [searchParams]);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    role: "",
    revenue: "",
    concentration: "",
    forecast: "",
    trigger: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const scoreLabel = useMemo(() => {
    if (snapshot.fragilityScore === null) return null;
    if (snapshot.fragilityScore >= 70) return "High structural fragility";
    if (snapshot.fragilityScore >= 50) return "Moderate structural fragility";
    return "Lower structural fragility";
  }, [snapshot.fragilityScore]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...form,
        snapshot,
        source: snapshot.source || "landing-page",
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      const redirectUrl = data?.redirectUrl || CALENDLY_URL;
      window.location.href = redirectUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Sticky nav */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-tight text-slate-950">
            Revenue Architecture™
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#problem" className="text-sm font-medium text-slate-600 hover:text-slate-950">
              Problem
            </a>
            <a href="#self-test" className="text-sm font-medium text-slate-600 hover:text-slate-950">
              Snapshot
            </a>
            <a href="#process" className="text-sm font-medium text-slate-600 hover:text-slate-950">
              Process
            </a>
            <a href="#book" className="text-sm font-medium text-slate-600 hover:text-slate-950">
              Book Review
            </a>
          </nav>
          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Book 30-Min Review
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_34%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-4xl">
              <div className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
                Founder-led agencies · $10M–$50M · Structural revenue diagnostics
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.05]">
                Your agency is growing.
                <br />
                But your revenue system might be breaking.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                Most agencies do not break when revenue drops.
                <span className="font-semibold text-slate-950"> They break while revenue is still growing.</span>
                <br className="hidden md:block" />
                The issue is usually not pipeline.
                It is <span className="font-semibold text-slate-950">Revenue Architecture</span> — the structure underneath growth.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#book"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Book a 30-Minute Review
                </a>
                <a
                  href="#self-test"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Run the Fragility Snapshot
                </a>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  "Forecasts are getting harder to trust",
                  "Founder involvement is creeping back into deals",
                  "Growth is happening, but confidence is not",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-base font-medium leading-7 text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
              <SectionEyebrow>What this helps you answer</SectionEyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                Is your growth predictable, chaotic, or dependent on you?
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  "How concentrated is revenue?",
                  "Can you trust your forecast without going back into the weeds?",
                  "Do managers own outcomes, or just report activity?",
                  "Does margin hold as the business scales?",
                  "Could growth continue without the founder rescuing key deals?",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-6 text-slate-600">
                  In 30 minutes, we determine whether your revenue system is stable — or quietly breaking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-2xl font-semibold text-slate-950">$25M Example</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Same revenue. Completely different enterprise value depending on structural durability.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-2xl font-semibold text-slate-950">$18.75M Gap</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Example value difference between fragile and durable revenue architecture.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-2xl font-semibold text-slate-950">14 Days</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Full diagnostic timeline from data review to executive readout and stabilization priorities.
            </p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <SectionEyebrow>The hidden problem</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Growth is not the signal.
              <br />
              Structure is.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Most agencies assume growth is proof of health.
              But experienced operators — and buyers — look for something else:
            </p>

            <div className="mt-6">
              <BulletList
                items={[
                  "How concentrated is revenue?",
                  "How predictable is forecasting?",
                  "Do managers own outcomes?",
                  "Whether growth works without the founder",
                  "Whether margin holds as complexity scales",
                ]}
              />
            </div>

            <p className="mt-6 text-base leading-8 text-slate-600">
              When those answers are unclear, value is already leaking.
              Revenue may still be rising.
              <span className="font-semibold text-slate-950"> Confidence usually is not.</span>
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <SectionEyebrow>What fragility feels like</SectionEyebrow>
            <div className="mt-6 space-y-4">
              {[
                "Forecast review turns into debate instead of confidence",
                "A deal slips and no one can clearly explain why",
                "Leadership meetings become problem-solving sessions",
                "One or two clients carry more weight than they should",
                "Managers inspect activity, but outcomes still feel unstable",
                "Nothing appears broken — but nothing feels stable",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-950" />
                  <p className="text-base leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-4xl">
            <SectionEyebrow>Revenue Architecture™</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Durable growth is determined by four structural revenue systems.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Most agencies overbuild production and neglect governance, resilience, and scalability.
              Fragility does not come from lack of growth.
              <span className="font-semibold text-white"> It comes from imbalance.</span>
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Revenue Production",
                body: "How revenue is generated, how pipeline behaves, and how acquisition patterns hold up under pressure.",
              },
              {
                title: "Revenue Governance",
                body: "Forecasting discipline, manager accountability, and the cadence required to make outcomes defendable.",
              },
              {
                title: "Revenue Resilience",
                body: "Client concentration, renewal stability, diversification, and how exposed the business is if pressure hits.",
              },
              {
                title: "Revenue Scalability",
                body: "Whether delivery capacity, margin density, and operating leverage improve as revenue grows — or quietly break.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-sm backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Snapshot */}
      <section id="self-test" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionEyebrow>Start here</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Run the Revenue Fragility Snapshot.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              If you want a quick read before booking time, use the snapshot to pressure-test concentration risk,
              founder dependency, forecast instability, margin exposure, and structural fragility.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
              <SectionEyebrow>Self-test prompts</SectionEyebrow>
              <div className="mt-5">
                <BulletList
                  items={[
                    "Is pipeline predictable and diversified?",
                    "Do managers own forecasts and outcomes?",
                    "Could you lose your top 3 clients without breaking the business?",
                    "Does margin improve as revenue grows?",
                  ]}
                />
              </div>

              <a
                href={SNAPSHOT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Open Revenue Fragility Snapshot
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <SectionEyebrow>Snapshot results</SectionEyebrow>
            <p className="mt-4 text-base leading-7 text-slate-700">
              If you came from the snapshot, your results will appear here and carry into the intake form below.
            </p>

            {snapshot.hasSnapshotData ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="space-y-3 text-sm leading-6 text-slate-700">
                  {snapshot.fragilityScore !== null && (
                    <p>
                      <span className="font-semibold text-slate-900">Fragility Score:</span>{" "}
                      {snapshot.fragilityScore}
                    </p>
                  )}
                  {scoreLabel && (
                    <p>
                      <span className="font-semibold text-slate-900">Interpretation:</span>{" "}
                      {scoreLabel}
                    </p>
                  )}
                  {snapshot.concentrationRisk && (
                    <p>
                      <span className="font-semibold text-slate-900">Concentration Risk:</span>{" "}
                      {snapshot.concentrationRisk}
                    </p>
                  )}
                  {snapshot.founderDependency && (
                    <p>
                      <span className="font-semibold text-slate-900">Founder Dependency:</span>{" "}
                      {snapshot.founderDependency}
                    </p>
                  )}
                  {snapshot.forecastRisk && (
                    <p>
                      <span className="font-semibold text-slate-900">Forecast Risk:</span>{" "}
                      {snapshot.forecastRisk}
                    </p>
                  )}
                  {snapshot.marginRisk && (
                    <p>
                      <span className="font-semibold text-slate-900">Margin Risk:</span>{" "}
                      {snapshot.marginRisk}
                    </p>
                  )}
                  {snapshot.evRisk && (
                    <p>
                      <span className="font-semibold text-slate-900">Value Exposure:</span>{" "}
                      {snapshot.evRisk}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                No snapshot data detected yet. You can still book a review below.
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <SectionEyebrow>Typical output</SectionEyebrow>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <p>• Revenue Architecture™ Score</p>
                <p>• Concentration risk profile</p>
                <p>• Forecast reliability assessment</p>
                <p>• Margin density analysis</p>
                <p>• Manager accountability gaps</p>
                <p>• Priority areas to stabilize first</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value + deliverables */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <SectionEyebrow>What buyers actually underwrite</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Two agencies can have the same revenue and completely different value underneath.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                Revenue alone does not determine quality. Buyers look for where the system breaks under pressure:
                where forecasts cannot be trusted, where growth depends on the founder, where margin does not hold,
                and where management depth is thin.
              </p>

              <div className="mt-8 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Fragile architecture
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">Revenue: $25M</p>
                    <p className="text-sm leading-6 text-slate-700">EBITDA Margin: 22%</p>
                    <p className="text-sm leading-6 text-slate-700">Multiple: 5.5x</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">Enterprise Value: $30.25M</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Durable architecture
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">Revenue: $25M</p>
                    <p className="text-sm leading-6 text-slate-700">EBITDA Margin: 28%</p>
                    <p className="text-sm leading-6 text-slate-700">Multiple: 7x</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">Enterprise Value: $49M</p>
                  </div>
                </div>
                <p className="mt-4 text-base font-medium text-slate-950">
                  $18.75M of lost enterprise value — without revenue growth.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <SectionEyebrow>What the diagnostic measures</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                A structural review of the revenue system — not a generic GTM audit.
              </h2>

              <div className="mt-8 space-y-4">
                {[
                  "Revenue concentration exposure",
                  "Forecasting discipline",
                  "Manager accountability structures",
                  "Portfolio economics by client",
                  "Capacity vs. revenue growth alignment",
                  "Pricing and margin structure",
                  "Governance cadence and operating rhythm",
                  "Founder dependency risk",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"
                  >
                    <p className="text-base leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <SectionEyebrow>Process</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Completed in 14 days.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            The full Revenue Architecture™ Diagnostic moves quickly from structural ambiguity to ranked priorities and a stabilization roadmap.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              step: "Step 1",
              title: "Data Review",
              body: "Revenue mix, concentration exposure, client economics, margin patterns, and signals of structural imbalance.",
            },
            {
              step: "Step 2",
              title: "Leadership Interviews",
              body: "Founder, revenue leaders, and delivery leaders to identify where predictability, ownership, and confidence are breaking.",
            },
            {
              step: "Step 3",
              title: "Structural Analysis",
              body: "Fragility is mapped across the four Revenue Architecture™ pillars and pressure-tested against the operating model.",
            },
            {
              step: "Step 4",
              title: "Executive Readout",
              body: "A founder-level briefing, Revenue Architecture™ Score, ranked fragility points, and a 90-day stabilization roadmap.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                {item.step}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Authority */}
      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionEyebrow>About Scott Michael Harris</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                I do not optimize revenue.
                <br />
                I architect how it works.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-300">
              <p>
                I help founder-led agencies and B2B services firms identify where growth becomes structurally fragile as complexity scales — and install the governance, segmentation, and operating discipline required to restore predictable growth.
              </p>
              <p>
                My background spans enterprise GTM, commercialization, and operating model work across Google, Amazon, McKinsey, and growth-stage environments.
              </p>

              <div className="grid gap-4 pt-2 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xl font-semibold text-white">Google</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Enterprise GTM, scaled revenue systems, commercialization, and operating rigor.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xl font-semibold text-white">Amazon</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Commercial ownership, growth management, and operator-level business discipline.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xl font-semibold text-white">McKinsey</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Strategy, structural diagnosis, and growth-stage commercial operating models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <SectionEyebrow>Next step</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Start with a 30-minute Revenue Architecture Review.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Before a full diagnostic, we start with a focused founder-level conversation.
                In 30 minutes, we determine whether your revenue system is stable — or quietly breaking.
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
                <SectionEyebrow>In this conversation</SectionEyebrow>
                <div className="mt-5">
                  <BulletList
                    items={[
                      "Where growth feels most unpredictable",
                      "How revenue concentration is evolving",
                      "Where operational strain is appearing",
                      "Whether forecast and manager accountability are actually holding",
                      "Whether a full diagnostic would be valuable",
                    ]}
                  />
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <SectionEyebrow>Best fit</SectionEyebrow>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  This is best suited for founder-led agencies between $10M–$50M in revenue that are growing,
                  but starting to feel hidden pressure underneath the system:
                  concentration risk, forecast volatility, margin inconsistency, founder dependency, or weak manager ownership.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl md:p-10">
              <SectionEyebrow>Short intake</SectionEyebrow>
              <p className="mt-4 text-base leading-7 text-slate-300">
                A few details before the call help make the conversation sharper and more useful.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-3">
                <input
                  name="name"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />
                <input
                  name="company"
                  placeholder="Agency Name"
                  value={form.company}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />
                <input
                  name="role"
                  placeholder="Role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />
                <input
                  name="revenue"
                  placeholder="Approx Revenue (e.g. $20M)"
                  value={form.revenue}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, revenue: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />
                <input
                  name="concentration"
                  placeholder="% of Revenue in Top 3 Clients"
                  value={form.concentration}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, concentration: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />
                <select
                  name="forecast"
                  value={form.forecast}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, forecast: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white outline-none"
                >
                  <option value="">Forecast Predictability</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  name="trigger"
                  placeholder="What prompted this conversation?"
                  value={form.trigger}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, trigger: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />
                <textarea
                  name="notes"
                  placeholder="Anything else I should know?"
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="rounded-xl border border-white/15 bg-white/10 p-3 text-white placeholder-slate-400 outline-none"
                />

                {submitError ? (
                  <p className="text-sm text-rose-300">{submitError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-950 shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Intake and Continue"}
                </button>
              </form>

              <div className="mt-8 border-t border-white/10 pt-8">
                <div className="flex flex-col gap-4">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/15"
                  >
                    Skip to Calendly
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent px-6 py-4 text-base font-semibold text-white transition hover:bg-white/5"
                  >
                    Message Me on LinkedIn
                  </a>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-400">
                  If there is no real signal, we stop there.
                  If there is, I will show you exactly where the instability is coming from and what to change first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RevenueArchitectureLandingPage />
    </Suspense>
  );
}
