import { useState } from "react";

type QuizState = "idle" | "open" | "result";

type Answers = {
  savings: number;
  consistency: number;
  timeline: number;
  accounts: number;
  credit: number;
  financing: number;
};

const QUESTIONS: {
  name: keyof Answers;
  label: string;
  options: { label: string; value: number }[];
}[] = [
  {
    name: "savings",
    label: "1. How much of your target down payment have you saved?",
    options: [
      { label: "Choose one", value: -1 },
      { label: "20% or more", value: 30 },
      { label: "10%–19%", value: 22 },
      { label: "5%–9%", value: 14 },
      { label: "Less than 5%", value: 6 },
      { label: "I'm not sure", value: 0 },
    ],
  },
  {
    name: "consistency",
    label: "2. How consistently are you saving?",
    options: [
      { label: "Choose one", value: -1 },
      { label: "Every month or payday", value: 20 },
      { label: "Most months", value: 15 },
      { label: "Occasionally", value: 8 },
      { label: "I have not started", value: 0 },
    ],
  },
  {
    name: "timeline",
    label: "3. Are your savings on track for your preferred timeline?",
    options: [
      { label: "Choose one", value: -1 },
      { label: "Yes, I'm on track", value: 15 },
      { label: "I'm close", value: 10 },
      { label: "I'm behind", value: 5 },
      { label: "I'm not sure", value: 0 },
    ],
  },
  {
    name: "accounts",
    label: "4. Have you reviewed FHSA and RRSP opportunities?",
    options: [
      { label: "Choose one", value: -1 },
      { label: "Yes, and I'm contributing", value: 15 },
      { label: "My account is open", value: 10 },
      { label: "I have researched them", value: 5 },
      { label: "Not yet", value: 0 },
    ],
  },
  {
    name: "credit",
    label: "5. Have you reviewed your credit and debts?",
    options: [
      { label: "Choose one", value: -1 },
      { label: "Yes, and I'm comfortable", value: 10 },
      { label: "Yes, but I need a plan", value: 7 },
      { label: "I know my credit score only", value: 3 },
      { label: "Not yet", value: 0 },
    ],
  },
  {
    name: "financing",
    label: "6. Have you discussed mortgage financing requirements?",
    options: [
      { label: "Choose one", value: -1 },
      { label: "Yes, with a mortgage professional", value: 10 },
      { label: "I have an appointment planned", value: 7 },
      { label: "I have a general idea", value: 3 },
      { label: "Not yet", value: 0 },
    ],
  },
];

const PRIORITIES: { key: keyof Answers; max: number; text: string }[] = [
  { key: "savings", max: 30, text: "Confirm your full down payment target and measure the gap." },
  { key: "consistency", max: 20, text: "Set up a realistic automatic monthly savings amount." },
  { key: "timeline", max: 15, text: "Compare your savings pace with your preferred purchase date." },
  { key: "accounts", max: 15, text: "Review how FHSA and RRSP strategies may support your goal." },
  { key: "credit", max: 10, text: "Review your credit and create a plan for outstanding debts." },
  { key: "financing", max: 10, text: "Coordinate your down payment with mortgage financing requirements." },
];

function getBand(score: number) {
  if (score >= 80) return "Almost purchase-ready";
  if (score >= 60) return "On the right track";
  if (score >= 40) return "Important gaps to address";
  return "Build your foundation first";
}

function getExplanation(score: number) {
  if (score >= 80)
    return "You have strong habits and preparation. Confirm the final numbers and financing details before you shop.";
  if (score >= 60)
    return "You have a solid start. Closing a few planning gaps could improve your confidence and timeline.";
  if (score >= 40)
    return "You have started, but several areas need attention before you will be ready to purchase.";
  return "Start with a clear savings target, a consistent monthly plan, and professional guidance.";
}

export function ReadinessQuiz() {
  const [state, setState] = useState<QuizState>("idle");
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<{
    score: number;
    band: string;
    explanation: string;
    priorities: string[];
  } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const vals = answers as Answers;
    const score = Object.values(vals).reduce((t, v) => t + v, 0);
    const band = getBand(score);
    const explanation = getExplanation(score);
    const priorities = PRIORITIES.sort(
      (a, b) => b.max - (vals[b.key] ?? 0) - (a.max - (vals[a.key] ?? 0)),
    )
      .slice(0, 3)
      .map((p) => p.text);
    setResult({ score, band, explanation, priorities });
    setState("result");
  }

  return (
    <>
      <div className="wrap split" style={{ marginTop: 0 }}>
        <div className="score">
          <div
            className="ring"
            style={
              result
                ? { background: `conic-gradient(#54a83f ${result.score}%,rgba(255,255,255,.18) 0)` }
                : undefined
            }
          >
            <b>{result ? result.score : "—"}</b>
          </div>
          <h3>Down Payment Readiness Score</h3>
          <p>{result ? `${result.score}/100 — ${result.band}` : "Answer six quick questions to see how prepared you are and where to focus next."}</p>
        </div>
        <div>
          <p className="eyebrow">One-minute assessment</p>
          <h2>Your roadmap starts with a score.</h2>
          <ul className="check">
            <li>Identify savings gaps</li>
            <li>Review FHSA and RRSP opportunities</li>
            <li>Check financing preparation</li>
            <li>Get three clear next steps</li>
          </ul>
          <button
            className="btn green"
            type="button"
            onClick={() => setState(state === "open" ? "idle" : "open")}
          >
            {state === "open" ? "Hide Assessment" : "Check My Readiness"}
          </button>
        </div>
      </div>

      {state !== "idle" && (
        <div className="wrap assessment-panel">
          {state === "open" && (
            <form
              onSubmit={handleSubmit}
              onReset={() => {
                setAnswers({});
                setState("open");
                setResult(null);
              }}
            >
              <div className="assessment-grid">
                {QUESTIONS.map((q) => (
                  <label key={q.name}>
                    {q.label}
                    <select
                      required
                      value={answers[q.name] ?? ""}
                      onChange={(e) =>
                        setAnswers({ ...answers, [q.name]: Number(e.target.value) })
                      }
                    >
                      {q.options.map((opt) => (
                        <option
                          key={opt.label}
                          value={opt.value === -1 ? "" : opt.value}
                          disabled={opt.value === -1}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <button className="btn green assessment-submit" type="submit">
                Calculate My Score
              </button>
            </form>
          )}

          {state === "result" && result && (
            <div className="assessment-result">
              <p className="eyebrow">Your result</p>
              <h3>{result.score}/100 — {result.band}</h3>
              <p>{result.explanation}</p>
              <h4>Your three priorities</h4>
              <ol>
                {result.priorities.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
              <a href="#book" className="btn">Build My Personalized Plan</a>
              <p className="assessment-note">
                This score is a planning estimate, not a mortgage approval or guarantee.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
