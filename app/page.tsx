"use client";

import { useMemo, useState } from "react";
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

export default function RevenueArchitectureDiagnosticLandingPage() {
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
    if (snapshot.fragilityScore >= 70) return "High structural fragility.";
    if (snapshot.fragilityScore >= 50) return "Moderate structural fragility.";
    return "Lower structural fragility.";
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-indigo-300 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
              Revenue Architecture Diagnostic
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-tight">
              Fix the revenue system issues that make agency growth harder than
              it should be.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
              For agency founders in the{" "}
              <span className="font-semibold text-slate-900">$10M–$50M</span>{" "}
              range who are growing, but starting to feel the hidden pressure
              underneath it.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                "Forecasts are becoming less reliable.",
                "Growth feels harder than it should.",
                "A few clients are carrying too much weight.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-base font-medium leading-7 text-slate-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#book"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Book a Revenue Architecture Diagnostic
              </a>
              <a
                href="#what-you-get"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                See What’s Included
              </a>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Built for founders and executives who want predictability, margin
              discipline, and valuation-ready revenue systems.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              The problem
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Most agencies do not have a pipeline problem.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              They have a{" "}
              <span className="font-semibold text-slate-900">
                revenue system problem
              </span>
              .
            </p>
            <p className="mt-5 text-base leading-8 text-slate-600">
              On the surface, revenue may still be growing. Pipeline may still
              look healthy. But underneath, the operating system is starting to
              weaken. Forecast calls become harder to trust. Margins vary too
              much deal to deal. Concentration risk quietly rises. Founders get
              pulled back into accounts that should already be managed by the
              system.
            </p>
            <p className="mt-5 text-base leading-8 text-slate-600">
              By the time it becomes obvious, the damage is already showing up
              in planning, team confidence, and valuation.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Common symptoms
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Forecast calls feel less credible than they used to.",
                "Revenue growth is happening, but predictability is falling.",
                "Margin quality varies too widely across teams or deals.",
                "A small number of accounts drive too much of the business.",
                "Managers are inspecting deals, but not enforcing the same standard of ‘good.’",
                "Founders still have to step in to stabilize key opportunities.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
                  <p className="text-base leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              What this diagnostic does
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              It identifies where your revenue model is structurally unstable
              before it breaks at scale.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              This is not a generic GTM audit. It is a focused Revenue
              Architecture Diagnostic designed to pressure-test the structure
              underneath growth.
            </p>
          </div>
        </div>
      </section>

      <section id="what-you-get" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Forecast Governance",
              body: "Assess whether forecast accuracy is manager-owned, consistently inspected, and tied to a shared definition of deal quality.",
            },
            {
              title: "Revenue Concentration",
              body: "Identify whether a handful of accounts, founders, or relationship patterns are creating hidden risk in the model.",
            },
            {
              title: "Margin Integrity",
              body: "Pressure-test how segmentation, pricing, and coverage decisions are affecting margin consistency across the portfolio.",
            },
            {
              title: "Operating Model Discipline",
              body: "Evaluate whether strategy is actually being translated into enforceable behavior through roles, standards, and governance rhythms.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-slate-950">
                {card.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                What you walk away with
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                A clear view of where the system is holding and where it is
                quietly failing.
              </h2>
              <div className="mt-8 space-y-5">
                {[
                  "A structured view of your core revenue risks.",
                  "Clear diagnosis of where predictability is breaking down.",
                  "Priority areas to stabilize margin, concentration, and forecast quality.",
                  "A sharper understanding of whether growth is durable or masking fragility.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-indigo-600" />
                    <p className="text-base leading-8 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Best fit
              </p>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
                <p>
                  This diagnostic is best suited for agencies that are already
                  growing, but starting to feel friction underneath the surface.
                </p>
                <p>
                  Typically, that means firms in the{" "}
                  <span className="font-semibold text-slate-950">
                    $10M–$50M revenue range
                  </span>{" "}
                  that are dealing with one or more of the following:
                </p>
                <ul className="list-disc space-y-3 pl-5">
                  <li>Forecast calls that are becoming harder to trust.</li>
                  <li>Client concentration that feels manageable until it doesn’t.</li>
                  <li>Margin inconsistency across teams, books, or deals.</li>
                  <li>Founder dependency that still shows up at critical moments.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-indigo-50 via-slate-50 to-white p-8 shadow-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Interactive self-assessment
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Start with the Revenue Fragility Snapshot.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                If you want a faster self-serve starting point before booking,
                use the live Revenue Fragility Snapshot to pressure-test
                concentration risk, founder dependency, forecast instability,
                and enterprise value exposure.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                It is designed to surface the same structural patterns this
                diagnostic goes deeper on.
              </p>
              <p className="mt-4 text-base text-slate-600">
                Most founders start with the Snapshot, then book a diagnostic
                once they see where the system is breaking.
              </p>

              <a
                href={SNAPSHOT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-indigo-300 bg-white px-5 py-3 text-base font-semibold text-slate-900 shadow-sm transition hover:bg-indigo-50"
              >
                Open Revenue Fragility Snapshot
              </a>

              <p className="mt-3 text-sm text-slate-500">
                After completing the Snapshot, you will have the option to
                review the results together.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Best use
              </p>
              <p className="mt-4 text-base leading-7 text-slate-700">
                Use the Snapshot if you want a quick structural read. Book the
                Diagnostic if you want a founder-level review of where the
                instability is coming from and what to change first.
              </p>

              {snapshot.hasSnapshotData ? (
                <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">
                    Snapshot detected
                  </p>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                    {snapshot.fragilityScore !== null && (
                      <p>
                        <span className="font-semibold">Fragility Score:</span>{" "}
                        {snapshot.fragilityScore}
                      </p>
                    )}
                    {scoreLabel && (
                      <p>
                        <span className="font-semibold">Read:</span> {scoreLabel}
                      </p>
                    )}
                    {snapshot.concentrationRisk && (
                      <p>
                        <span className="font-semibold">
                          Concentration Risk:
                        </span>{" "}
                        {snapshot.concentrationRisk}
                      </p>
                    )}
                    {snapshot.founderDependency && (
                      <p>
                        <span className="font-semibold">
                          Founder Dependency:
                        </span>{" "}
                        {snapshot.founderDependency}
                      </p>
                    )}
                    {snapshot.forecastRisk && (
                      <p>
                        <span className="font-semibold">Forecast Risk:</span>{" "}
                        {snapshot.forecastRisk}
                      </p>
                    )}
                    {snapshot.marginRisk && (
                      <p>
                        <span className="font-semibold">Margin Risk:</span>{" "}
                        {snapshot.marginRisk}
                      </p>
                    )}
                    {snapshot.evRisk && (
                      <p>
                        <span className="font-semibold">EV Risk:</span>{" "}
                        {snapshot.evRisk}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm leading-6 text-slate-600">
                    No Snapshot data detected yet. Use the self-assessment first
                    if you want a faster structural read before booking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Credibility
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Built from enterprise-scale revenue, commercialization, and
            operating model work.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <p className="text-3xl font-semibold text-slate-950">14,000+</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sellers supported through global commercialization and sales
                excellence initiatives at Google.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <p className="text-3xl font-semibold text-slate-950">
                39% → 83%
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Increase in product adoption through operating model redesign
                and commercialization architecture.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <p className="text-3xl font-semibold text-slate-950">$57M</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Incremental revenue generated through AI-enabled GTM and revenue
                architecture work at SmartThink.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Founder case study
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              What this looks like in practice.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-8 text-slate-700">
              <p>
                A founder-led agency in the mid-market range came in with
                revenue growth still intact, but leadership confidence was
                starting to erode. Forecast calls had become harder to trust. A
                handful of accounts carried disproportionate weight. Margin
                quality varied too much across books.
              </p>
              <p>
                The issue was not top-of-funnel volume. The issue was structural
                inconsistency. Different managers were applying different
                standards to deal quality, forecast classification, and account
                prioritization.
              </p>
              <p>
                Once the revenue architecture was pressure-tested and
                redesigned, the team had a clearer operating standard for what
                counted as a defendable deal, where concentration risk was
                actually sitting, and how manager accountability needed to work
                to stabilize predictability.
              </p>
              <p className="font-medium text-slate-950">
                The outcome was not just better visibility. It was a revenue
                model leadership could trust.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              What happens in the first 30 minutes
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              A focused founder-level working session.
            </h2>
            <div className="mt-8 space-y-4">
              {[
                "Clarify where predictability is breaking: forecast discipline, concentration, margin, or founder dependency.",
                "Pressure-test whether the issue is really pipeline volume or a structural conversion and governance problem.",
                "Identify where standards for deal quality, inspection, and accountability are inconsistent across the system.",
                "Determine whether a deeper Revenue Architecture Diagnostic is warranted, and what it would need to answer.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
                  <p className="text-base leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="book"
        className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                Book a conversation
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                If growth is getting harder to manage, your system is usually
                the constraint.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Book a private strategy discussion to walk through where the
                instability is likely coming from and whether a deeper
                diagnostic makes sense.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
              <div className="mb-6 rounded-2xl border border-white/10 bg-black/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Quick Intake
                </p>

                <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
                  <input
                    name="name"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
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
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
                  />

                  <input
                    name="company"
                    placeholder="Agency Name"
                    value={form.company}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
                  />

                  <input
                    name="role"
                    placeholder="Role"
                    value={form.role}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
                  />

                  <input
                    name="revenue"
                    placeholder="Approx Revenue (e.g. $20M)"
                    value={form.revenue}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, revenue: e.target.value }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
                  />

                  <input
                    name="concentration"
                    placeholder="% in Top 3 Clients"
                    value={form.concentration}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        concentration: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
                  />

                  <select
                    name="forecast"
                    value={form.forecast}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, forecast: e.target.value }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white"
                  >
                    <option value="">Forecast Predictability</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <input
                    name="trigger"
                    placeholder="What prompted this?"
                    value={form.trigger}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, trigger: e.target.value }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
                  />

                  <textarea
                    name="notes"
                    placeholder="Anything else I should know?"
                    rows={4}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-slate-400"
                  />

                  {submitError ? (
                    <p className="text-sm text-rose-300">{submitError}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Intake and Continue"}
                  </button>
                </form>
              </div>

              <h3 className="text-2xl font-semibold">Ready to talk?</h3>
              <p className="mt-4 text-base leading-7 text-slate-300">
                If you are an agency founder between $10M–$50M and forecasts are
                getting less reliable, growth feels harder than it should, or
                revenue is becoming too concentrated, this is the right place to
                start.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-950 shadow-sm transition hover:opacity-90"
                >
                  Book a Revenue Architecture Diagnostic
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-transparent px-6 py-4 text-base font-semibold text-white transition hover:bg-white/5"
                >
                  Message Me on LinkedIn
                </a>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                The intake form captures your details, writes the lead to
                Airtable, calculates a lead score, and then redirects you to
                Calendly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
