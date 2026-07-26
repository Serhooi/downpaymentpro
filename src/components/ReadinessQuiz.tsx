import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { saveLead } from "@/lib/leads.functions";

type Answers = {
  income: number;
  savings: number;
  monthly: number;
  debt: number;
  region: string;
  timeline: number;
};

const initial: Answers = {
  income: 95000,
  savings: 30000,
  monthly: 1200,
  debt: 400,
  region: "gta",
  timeline: 3,
};

const regionTarget: Record<string, number> = {
  gta: 60000,
  hamilton: 45000,
  ottawa: 45000,
  other: 35000,
};

const regionLabels: [string, string][] = [
  ["gta", "GTA"],
  ["hamilton", "Hamilton / Niagara"],
  ["ottawa", "Ottawa"],
  ["other", "Other Ontario"],
];

export function ReadinessQuiz() {
  const send = useServerFn(saveLead);
  const [a, setA] = useState(initial);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const { score, checklist } = useMemo(() => {
    const target = regionTarget[a.region] ?? 40000;

    const savingsRatio = Math.min(1, a.savings / target);
    const savingsPts = savingsRatio * 35;

    const needed = Math.max(0, target - a.savings);
    const monthsNeeded = a.monthly > 0 ? needed / a.monthly : 999;
    const paceRatio = Math.min(1, (a.timeline * 12) / Math.max(1, monthsNeeded));
    const pacePts = paceRatio * 25;

    const dtiMonthly = a.income / 12;
    const dti = dtiMonthly > 0 ? a.debt / dtiMonthly : 1;
    const debtPts = Math.max(0, 1 - dti / 0.2) * 20;

    const rate = dtiMonthly > 0 ? a.monthly / dtiMonthly : 0;
    const savePts = Math.min(1, rate / 0.2) * 20;

    const total = Math.max(
      12,
      Math.min(99, Math.round(savingsPts + pacePts + debtPts + savePts)),
    );

    const list: { ok: boolean; text: string }[] = [
      {
        ok: savingsRatio >= 0.6,
        text:
          savingsRatio >= 0.6
            ? "Your savings already cover most of a typical down payment in your area."
            : `Build your savings toward roughly ${fmt(target)} for your region.`,
      },
      {
        ok: paceRatio >= 0.95,
        text:
          paceRatio >= 0.95
            ? `Your pace fits your ${a.timeline}-year timeline.`
            : `At ${fmt(a.monthly)}/month you need about ${Math.ceil(monthsNeeded / 12)} years — let's shorten it.`,
      },
      {
        ok: dti <= 0.12,
        text:
          dti <= 0.12
            ? "Your debt payments leave healthy room for a mortgage."
            : "Reduce monthly debt payments — they cut directly into your approval amount.",
      },
      {
        ok: rate >= 0.15,
        text:
          rate >= 0.15
            ? "Your savings rate is strong relative to your income."
            : "Automate a higher monthly transfer — even +$250 moves your date up.",
      },
      {
        ok: false,
        text: "Open an FHSA and check RRSP Home Buyers' Plan eligibility.",
      },
    ];

    return { score: total, checklist: list };
  }, [a]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setBusy(true);
    try {
      await send({ data: { email, source: "score" as const, score } });
      setSent(true);
      toast.success("Sent! Your score summary is on the way.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="quiz">
      <div className="quiz-form">
        <label>
          Household income <output>{fmt(a.income)}</output>
        </label>
        <input
          type="range"
          min={40000}
          max={300000}
          step={5000}
          value={a.income}
          onChange={(e) => setA({ ...a, income: +e.target.value })}
        />
        <label>
          Current savings <output>{fmt(a.savings)}</output>
        </label>
        <input
          type="range"
          min={0}
          max={200000}
          step={2500}
          value={a.savings}
          onChange={(e) => setA({ ...a, savings: +e.target.value })}
        />
        <label>
          Monthly savings <output>{fmt(a.monthly)}</output>
        </label>
        <input
          type="range"
          min={0}
          max={6000}
          step={100}
          value={a.monthly}
          onChange={(e) => setA({ ...a, monthly: +e.target.value })}
        />
        <label>
          Monthly debt payments <output>{fmt(a.debt)}</output>
        </label>
        <input
          type="range"
          min={0}
          max={4000}
          step={50}
          value={a.debt}
          onChange={(e) => setA({ ...a, debt: +e.target.value })}
        />
        <label>
          Buying timeline <output>{a.timeline} yrs</output>
        </label>
        <input
          type="range"
          min={1}
          max={7}
          step={1}
          value={a.timeline}
          onChange={(e) => setA({ ...a, timeline: +e.target.value })}
        />
        <span className="quiz-label">Region</span>
        <div className="chips">
          {regionLabels.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`chip ${a.region === value ? "on" : ""}`}
              onClick={() => setA({ ...a, region: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-result">
        <div
          className="ring live"
          style={{ ["--pct" as any]: `${score}%` }}
          aria-label={`Readiness score ${score} out of 100`}
        >
          <b>{score}</b>
        </div>
        <h3>Your readiness score</h3>
        <ul className="check live-check">
          {checklist.map((item) => (
            <li key={item.text} className={item.ok ? "ok" : "todo"}>
              {item.text}
            </li>
          ))}
        </ul>
        {sent ? (
          <p className="quiz-sent">
            ✓ Your score summary is on the way. We'll follow up with next steps.
          </p>
        ) : (
          <form className="quiz-email" onSubmit={onSend}>
            <input
              type="email"
              required
              placeholder="Email me my score & checklist"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn green" type="submit" disabled={busy}>
              {busy ? "Sending..." : "Send it"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
