import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { sendBookingEmail } from "@/lib/booking.functions";
import { Reveal } from "@/components/Reveal";
import { ReadinessQuiz } from "@/components/ReadinessQuiz";
import { LeadMagnet } from "@/components/LeadMagnet";
import { Testimonials } from "@/components/Testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Downpayment Pro | Get Home Faster" },
      {
        name: "description",
        content:
          "A premium first-time home buyer program that helps you build your down payment through education, planning, government programs, and expert guidance.",
      },
      { property: "og:title", content: "Downpayment Pro | Get Home Faster" },
      {
        property: "og:description",
        content:
          "Personalized roadmap, FHSA & RRSP guidance, and 90-day accountability to help you become down-payment ready faster.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);

function Index() {
  const send = useServerFn(sendBookingEmail);

  const [price, setPrice] = useState(800000);
  const [savings, setSavings] = useState(45000);
  const [monthly, setMonthly] = useState(2500);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightsOn, setLightsOn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLightsOn(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const { target, timeline, heroYears } = useMemo(() => {
    const t = price < 500000 ? price * 0.05 : 25000 + (price - 500000) * 0.1;
    const need = Math.max(0, t - savings);
    const yrs = monthly ? need / monthly / 12 : 0;
    return {
      target: t,
      timeline: yrs < 0.1 ? "Ready now" : `${yrs.toFixed(1)} years`,
      heroYears: yrs < 0.1 ? "Ready" : `${yrs.toFixed(1)} yrs`,
    };
  }, [price, savings, monthly]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bestTime: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await send({ data: form });
      if (res?.ok) {
        toast.success("Thanks! We'll be in touch shortly.");
        setForm({ name: "", email: "", phone: "", bestTime: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <Toaster richColors position="top-center" />
      <header className="top">
        <nav className="wrap">
          <a href="#" className="brand">
            <svg className="logo-mark" viewBox="0 0 100 70">
              <path d="M5 38 L38 10 L62 30 L78 16 L96 38" fill="none" stroke="#071b4d" strokeWidth="8" strokeLinecap="round" />
              <path d="M48 38 L78 16 L96 38" fill="none" stroke="#367f23" strokeWidth="8" strokeLinecap="round" />
              <rect x="40" y="36" width="20" height="22" fill="#071b4d" rx="2" />
              <rect x="46" y="43" width="8" height="15" fill="white" />
            </svg>
            <span>
              DOWNPAYMENT<em>PRO</em>
            </span>
          </a>
          <div className="links">
            <a href="#how">How it works</a>
            <a href="#pillars">Program</a>
            <a href="#calculator">Calculator</a>
            <a href="#score">Score</a>
            <a href="#stories">Stories</a>
            <a href="#guide">Free guide</a>
            <a href="#faq">FAQ</a>
          </div>
          <a href="#book" className="btn green">Book a Session</a>
        </nav>
      </header>

      <main>
        <section className="hero wrap">
          <div>
            <p className="eyebrow">First home. Smart plan. Stronger future.</p>
            <h1>Get home faster.</h1>
            <p className="lead">
              A premium first-time home buyer program that helps you build your down payment
              through education, planning, government programs, and expert guidance.
            </p>
            <div className="actions">
              <a href="#book" className="btn">Start your free plan</a>
              <a href="#calculator" className="btn light">Try calculator</a>
            </div>
            <div className="points">
              <div className="point"><span className="icon">✓</span>Personalized roadmap</div>
              <div className="point"><span className="icon">↗</span>Faster savings plan</div>
              <div className="point"><span className="icon">🏛</span>FHSA & RRSP guidance</div>
            </div>
          </div>
          <div
            className={`visual ${lightsOn ? "lit" : ""}`}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTilt({
                x: ((e.clientX - r.left) / r.width - 0.5) * 2,
                y: ((e.clientY - r.top) / r.height - 0.5) * 2,
              });
            }}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div className="glow" style={{ transform: `translate(${tilt.x * -18}px, ${tilt.y * -12}px)` }} />
            <div className="hills" />
            <div className="ground" />
            <div className="house-wrap">
              <svg
                className="house"
                viewBox="0 0 520 360"
                style={{ transform: `translate(${tilt.x * 10}px, ${tilt.y * 6}px) rotate(${tilt.x * 0.5}deg)` }}
                onClick={() => setLightsOn((v) => !v)}
                role="button"
                aria-label="Toggle house lights"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setLightsOn((v) => !v)}
              >
                <defs>
                  <linearGradient id="roofG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#123a7d" />
                    <stop offset="1" stopColor="#07204f" />
                  </linearGradient>
                  <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#eef3fa" />
                  </linearGradient>
                  <linearGradient id="wingG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f7fafd" />
                    <stop offset="1" stopColor="#e6edf7" />
                  </linearGradient>
                  <linearGradient id="glassG" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0" stopColor="#f3f8ff" />
                    <stop offset="1" stopColor="#d9e7f7" />
                  </linearGradient>
                  <linearGradient id="litG" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0" stopColor="#ffe9a8" />
                    <stop offset="1" stopColor="#f7c65c" />
                  </linearGradient>
                  <linearGradient id="pathG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#e8eef0" />
                    <stop offset="1" stopColor="#d5e0e2" />
                  </linearGradient>
                </defs>

                {/* soft contact shadow */}
                <ellipse cx="262" cy="322" rx="186" ry="18" fill="rgba(7,27,77,.10)" />

                {/* walkway in front of the porch */}
                <path d="M222 344 L306 344 L288 320 L242 320 Z" fill="url(#pathG)" />
                <path d="M248 332 H282" stroke="rgba(11,43,104,.10)" strokeWidth="3" strokeLinecap="round" />

                {/* left wing (flat roof garage volume) */}
                <rect x="30" y="236" width="106" height="82" rx="8" fill="url(#wingG)" />
                <rect x="22" y="226" width="122" height="14" rx="6" fill="#0b2b68" />
                <rect x="46" y="256" width="74" height="62" rx="6" fill="#e6edf7" stroke="#cfdaea" strokeWidth="2" />
                <path d="M54 272 H112 M54 288 H112 M54 304 H112" stroke="#cfdaea" strokeWidth="3" strokeLinecap="round" />


                {/* chimney */}
                <rect x="352" y="84" width="26" height="66" rx="4" fill="#0d2f6e" />
                <rect x="346" y="78" width="38" height="12" rx="4" fill="#0b2b68" />

                {/* main roof */}
                <path d="M262 40 L446 186 H78 Z" fill="url(#roofG)" />
                <path d="M262 40 L446 186 L436 196 L262 58 L88 196 L78 186 Z" fill="#08245a" opacity=".55" />
                {/* green fascia accents */}
                <path d="M262 62 L424 190" fill="none" stroke="#3f8a29" strokeWidth="9" strokeLinecap="round" />
                <path d="M262 62 L100 190" fill="none" stroke="#3f8a29" strokeWidth="9" strokeLinecap="round" />

                {/* main body */}
                <rect x="112" y="184" width="300" height="134" rx="10" fill="url(#wallG)" />
                <path
                  d="M132 196 V318 M164 196 V318 M196 196 V318 M228 196 V318 M296 196 V318 M328 196 V318 M360 196 V318 M392 196 V318"
                  stroke="rgba(11,43,104,.055)"
                  strokeWidth="3"
                />

                {/* porch overhang */}
                <rect x="222" y="222" width="86" height="9" rx="4" fill="#0b2b68" opacity=".9" />
                <rect x="226" y="231" width="5" height="87" rx="2" fill="#0b2b68" opacity=".35" />
                <rect x="299" y="231" width="5" height="87" rx="2" fill="#0b2b68" opacity=".35" />

                {/* door */}
                <rect x="242" y="240" width="50" height="78" rx="7" fill="#0b2b68" />
                <rect x="252" y="252" width="30" height="26" rx="4" fill={lightsOn ? "#f7c65c" : "#20437e"} className="win" />
                <circle cx="285" cy="284" r="3.4" fill="#e7b64d" />

                {/* left window */}
                <rect className="win" x="146" y="228" width="60" height="52" rx="6" fill={lightsOn ? "url(#litG)" : "url(#glassG)"} stroke="#0b2b68" strokeWidth="4" />
                <path d="M176 230 V278 M148 254 H204" stroke="#0b2b68" strokeWidth="3" opacity=".85" />

                {/* right window */}
                <rect className="win" x="330" y="228" width="60" height="52" rx="6" fill={lightsOn ? "url(#litG)" : "url(#glassG)"} stroke="#0b2b68" strokeWidth="4" />
                <path d="M360 230 V278 M332 254 H388" stroke="#0b2b68" strokeWidth="3" opacity=".85" />

                {/* attic window */}
                <path className="win" d="M262 108 a20 20 0 0 1 20 20 v16 h-40 v-16 a20 20 0 0 1 20 -20 z" fill={lightsOn ? "url(#litG)" : "#dce9f8"} stroke="#f4f8fd" strokeWidth="5" />
                <path d="M262 110 V144" stroke="#0b2b68" strokeWidth="3" opacity=".5" />

                {/* shrubs */}
                <circle cx="424" cy="306" r="18" fill="#4e9a37" opacity=".9" />
                <circle cx="444" cy="312" r="12" fill="#3f8a29" opacity=".9" />
                <circle cx="16" cy="310" r="14" fill="#4e9a37" opacity=".85" />

                {/* slim tree */}
                <rect x="474" y="278" width="7" height="42" rx="3" fill="#7b5a3a" />
                <ellipse cx="477" cy="258" rx="28" ry="36" fill="#3f8a29" opacity=".92" />
                <ellipse cx="470" cy="244" rx="17" ry="21" fill="#57a63f" opacity=".5" />

              </svg>

            </div>

            <div className="hero-panel">
              <div className="hp-top">
                <span className="hp-label">Down payment timeline</span>
                <span className="hp-tag">Live estimate</span>
              </div>
              <b>{heroYears}</b>
              <div className="hp-bar">
                <i style={{ width: `${Math.max(8, Math.min(100, 100 - parseFloat(heroYears) * 14 || 70))}%` }} />
              </div>
              <span className="hp-note">Based on your custom savings plan below.</span>
            </div>

            <button
              type="button"
              className="hint"
              onClick={() => setLightsOn((v) => !v)}
            >
              {lightsOn ? "Home sweet home ✨" : "Tap the house →"}
            </button>
          </div>
        </section>

        <section className="section dark center">
          <div className="wrap">
            <h2>Most buyers do not fail because they cannot save.</h2>
            <p className="sub">
              They fall behind because nobody shows them the shortest path. Downpayment Pro
              gives you the plan, structure, and accountability to move with confidence.
            </p>
          </div>
        </section>

        <section className="section soft" id="how">
          <div className="wrap center">
            <h2>How it works</h2>
            <p className="sub">
              A simple four-step process to help you become down payment ready faster.
            </p>
            <div className="steps">
              {[
                ["1", "Free strategy session", "We learn about your goals, timeline, savings, and current financial picture."],
                ["2", "Review & analyze", "We review your available programs, savings options, and planning gaps."],
                ["3", "Build your roadmap", "You receive a personalized plan designed to grow your down payment."],
                ["4", "Monitor & adjust", "We monitor your progress for 90 days and adjust the plan as needed."],
              ].map(([n, h, p], i) => (
                <Reveal as="article" className="step" key={n} delay={i * 80}>
                  <span className="step-no">{n}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="pillars">
          <div className="wrap center">
            <h2>The 7 pillars</h2>
            <p className="sub">The complete framework behind the Downpayment Pro program.</p>
            <div className="pillars">
              {[
                ["Goal Setting", "Define price, timeline, and realistic targets."],
                ["Education", "Understand the buying process and key decisions."],
                ["Savings Plan", "Create a structured savings roadmap."],
                ["Tax Strategy", "Use opportunities that may increase savings."],
                ["Programs", "Learn FHSA, HBP, and government options."],
                ["RRSP Strategy", "Use RRSP planning to support your goal."],
                ["90 Days", "Track progress and stay accountable."],
              ].map(([h, p], i) => (
                <Reveal as="article" className="pillar" key={h} delay={i * 60}>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section soft" id="calculator">
          <div className="wrap split">
            <div>
              <p className="eyebrow">Interactive planning</p>
              <h2>See your path in seconds.</h2>
              <p className="sub" style={{ margin: 0, textAlign: "left" }}>
                Use the calculator to estimate how much down payment you may need and how long
                it could take based on your current savings.
              </p>
            </div>
            <div className="calc">
              <label>Home price <output>{fmt(price)}</output></label>
              <input type="range" min={400000} max={1200000} step={25000} value={price} onChange={(e) => setPrice(+e.target.value)} />
              <label>Current savings <output>{fmt(savings)}</output></label>
              <input type="range" min={0} max={200000} step={5000} value={savings} onChange={(e) => setSavings(+e.target.value)} />
              <label>Monthly savings <output>{fmt(monthly)}</output></label>
              <input type="range" min={500} max={8000} step={250} value={monthly} onChange={(e) => setMonthly(+e.target.value)} />
              <div className="results">
                <div className="result"><small>Estimated target</small><b>{fmt(target)}</b></div>
                <div className="result"><small>Timeline</small><b>{timeline}</b></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section dark" id="score">
          <div className="wrap center">
            <Reveal>
              <p className="eyebrow">Signature feature</p>
              <h2>Your roadmap starts with a score.</h2>
              <p className="sub">
                Answer six quick questions and get your personal Down Payment Readiness
                Score plus a checklist of the exact next steps for your situation.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ReadinessQuiz />
            </Reveal>
          </div>
        </section>

        <section className="section" id="stories">
          <div className="wrap center">
            <Reveal>
              <p className="eyebrow">Real clients</p>
              <h2>From "someday" to keys in hand.</h2>
              <p className="sub">
                Every plan is different — these are the shifts our clients made across Ontario.
              </p>
            </Reveal>
            <Testimonials />
          </div>
        </section>

        <section className="section soft" id="guide">
          <div className="wrap">
            <Reveal>
              <LeadMagnet />
            </Reveal>
          </div>
        </section>


        <section className="section soft" id="faq">
          <div className="wrap center">
            <h2>Common questions</h2>
            <div className="faq">
              <details open>
                <summary>Who is this for?</summary>
                <p className="muted">First-time buyers who want a clear plan to become down payment ready within the next 1 to 5 years.</p>
              </details>
              <details>
                <summary>Is this a mortgage service?</summary>
                <p className="muted">It is a planning and education program that helps you prepare before applying for a mortgage.</p>
              </details>
              <details>
                <summary>What programs do you review?</summary>
                <p className="muted">We review FHSA, RRSP Home Buyers' Plan, savings strategies, and available government benefits where appropriate.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="section" id="book">
          <div className="wrap book">
            <div>
              <p className="eyebrow">Let's get you home</p>
              <h2>Book your free strategy session.</h2>
              <p className="sub" style={{ textAlign: "left", margin: 0 }}>
                Take the first step toward owning your home. Book a no-obligation strategy
                session and discover how we can help you reach your down payment goals faster.
              </p>
              <div className="contact">
                <span>☎ (416) 786-1774</span>
                <span>✉ info@downpaymentpro.ca</span>
                <span>📍 Serving families across Ontario</span>
              </div>
            </div>
            <form className="form" onSubmit={onSubmit}>
              <h3>Book your session</h3>
              <label>Full Name
                <input required placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>Email
                <input required type="email" placeholder="Your email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label>Phone
                <input placeholder="Your phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label>Best time to contact
                <select value={form.bestTime} onChange={(e) => setForm({ ...form, bestTime: e.target.value })}>
                  <option value="">Select an option</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </label>
              <label>How can we help?
                <textarea placeholder="Tell us a little about your goals..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
              <button className="btn green" type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Book My Free Session"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <b>Downpayment Pro</b>
          <span>Your path to home ownership.</span>
        </div>
      </footer>
    </>
  );
}

const CSS = `
:root{--navy:#071b4d;--blue:#0b2b68;--green:#367f23;--light:#f6f8fb;--ink:#081534;--muted:#65728b;--line:#e8edf4;--shadow:0 28px 90px rgba(7,27,77,.16)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:white}
a{text-decoration:none;color:inherit}
.wrap{width:min(1180px,92vw);margin:auto}
.top{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.82);backdrop-filter:blur(18px);border-bottom:1px solid rgba(232,237,244,.8)}
nav{height:78px;display:flex;align-items:center;gap:28px}
.brand{display:flex;align-items:center;gap:10px;font-weight:900;letter-spacing:-.03em}
.logo-mark{width:48px;height:34px}
.brand span{display:block;line-height:.9}
.brand em{display:block;color:var(--green);font-style:normal;font-size:19px}
.links{display:flex;gap:24px;margin-left:auto;color:#24314f;font-size:14px;font-weight:700}
.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:14px 22px;background:var(--navy);color:#fff;font-weight:850;box-shadow:0 12px 32px rgba(7,27,77,.18);border:0;cursor:pointer}
.btn.green{background:var(--green)}
.btn.light{background:white;color:var(--navy);box-shadow:inset 0 0 0 1px #cfd8e7}
.btn:disabled{opacity:.65;cursor:not-allowed}
.hero{min-height:760px;display:grid;grid-template-columns:1.02fr .98fr;gap:48px;align-items:center}
.eyebrow{color:var(--green);font-weight:900;text-transform:uppercase;letter-spacing:.06em}
.hero h1{font-size:clamp(62px,8vw,112px);line-height:.88;margin:0 0 22px;letter-spacing:-.075em}
.lead{font-size:22px;line-height:1.55;color:#344360;max-width:660px}
.actions{display:flex;gap:14px;flex-wrap:wrap;margin:34px 0}
.points{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:26px}
.point{display:flex;gap:10px;align-items:center;padding:14px;border:1px solid var(--line);border-radius:18px;background:white;font-weight:800;font-size:13px}
.icon{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#edf7ea;color:var(--green);font-weight:900}
.visual{height:600px;border-radius:40px;background:linear-gradient(180deg,#f4f9ff 0%,#eef5fc 46%,#eaf4e6 100%);position:relative;overflow:hidden;box-shadow:var(--shadow);border:1px solid #e7eef7;display:flex;flex-direction:column;justify-content:flex-end;padding:26px}
.glow{position:absolute;width:300px;height:300px;border-radius:50%;right:-70px;top:-90px;background:radial-gradient(circle,rgba(255,236,178,.95),rgba(245,196,94,.35) 42%,transparent 70%);transition:transform .5s ease-out;pointer-events:none}
.hills{position:absolute;left:-10%;right:-10%;bottom:150px;height:150px;background:linear-gradient(180deg,#e7f0e2,#dcebd3);border-radius:50% 50% 0 0/100% 100% 0 0;opacity:.85}
.ground{position:absolute;left:0;right:0;bottom:0;height:190px;background:linear-gradient(180deg,#cfe6c2,#eef6ea)}
.house-wrap{position:absolute;left:0;right:0;top:44px;display:grid;place-items:center;pointer-events:none}
.house{width:min(88%,430px);height:auto;pointer-events:auto;overflow:visible}
.hero-panel{position:relative;z-index:2;border-radius:26px;padding:22px 24px;background:rgba(255,255,255,.78);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.9);box-shadow:0 24px 60px rgba(7,27,77,.14)}
.hp-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.hp-label{font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:850;color:var(--muted)}
.hp-tag{font-size:11px;font-weight:850;color:var(--green);background:#eaf5e6;border-radius:999px;padding:5px 10px;white-space:nowrap}
.hero-panel b{display:block;margin:8px 0 14px;font-size:52px;line-height:1;color:var(--navy);letter-spacing:-.05em}
.hp-bar{height:8px;border-radius:999px;background:#e6edf6;overflow:hidden}
.hp-bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--green),#7cc45a);transition:width .5s cubic-bezier(.22,1,.36,1)}
.hp-note{display:block;margin-top:12px;font-size:13px;font-weight:700;color:var(--muted)}
.section{padding:110px 0}
.soft{background:var(--light)}
.dark{background:linear-gradient(135deg,var(--navy),#092d72);color:white}
.center{text-align:center}
.section h2{font-size:clamp(40px,5vw,76px);line-height:.95;letter-spacing:-.055em;margin:0 0 18px}
.section p.sub{font-size:21px;color:var(--muted);margin:0 auto;max-width:780px;line-height:1.5}
.dark p.sub{color:#d7dfef}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:52px}
.step,.pillar,.calc,.score,.faq details,.quote,.form{background:white;border:1px solid var(--line);border-radius:30px;padding:30px;box-shadow:0 14px 40px rgba(7,27,77,.06)}
.step-no{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--green);color:white;font-weight:900;margin-bottom:22px}
.step h3,.pillar h3{margin:0 0 10px;font-size:21px;letter-spacing:-.03em}
.step p,.pillar p,.muted{color:var(--muted);line-height:1.6}
.pillars{display:grid;grid-template-columns:repeat(7,1fr);gap:14px;margin-top:52px}
.pillar{padding:22px 16px;text-align:center}
.pillar h3{font-size:15px}
.pillar p{font-size:13px}
.split{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.calc label{display:flex;justify-content:space-between;font-weight:850;margin:18px 0 10px}
.calc input{width:100%;accent-color:var(--green)}
.results{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:28px}
.result{background:var(--light);border-radius:20px;padding:20px}
.result small{display:block;color:var(--muted);font-weight:800}
.result b{font-size:28px;letter-spacing:-.04em}
.score{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.16);text-align:center;color:white}
.score p{color:#d7dfef}
.ring{width:230px;height:230px;border-radius:50%;margin:auto;background:conic-gradient(#54a83f 78%,rgba(255,255,255,.18) 0);display:grid;place-items:center;position:relative}
.ring:before{content:"";position:absolute;inset:18px;border-radius:50%;background:#071b4d}
.ring b{position:relative;font-size:80px;color:white}
.check{list-style:none;padding:0;line-height:2;color:#e8eef9}
.check li:before{content:"✓";color:#91e47a;margin-right:10px}
.quote{text-align:center}
.quote h2{font-size:clamp(36px,5vw,70px);line-height:1;letter-spacing:-.06em;margin:0}
.book{display:grid;grid-template-columns:1fr .95fr;gap:64px;align-items:center}
.contact{display:grid;gap:16px;margin-top:28px;font-weight:850}
.form{display:grid;gap:14px}
.form h3{font-size:28px;text-align:center;margin:0 0 8px}
.form label{font-size:13px;font-weight:850;display:block}
.form input,.form textarea,.form select{width:100%;border:1px solid #dce3ee;border-radius:14px;padding:14px;margin-top:7px;font:inherit}
.form textarea{height:112px}
.faq{width:min(860px,92vw);margin:44px auto 0}
.faq details{margin:12px 0}
.faq summary{font-size:20px;font-weight:900;cursor:pointer}
.footer{background:var(--navy);color:white;padding:34px 0}
.footer .wrap{display:flex;justify-content:space-between;gap:20px}
@media(max-width:980px){.links{display:none}.hero,.split,.book{grid-template-columns:1fr}.visual{height:520px}.steps{grid-template-columns:1fr 1fr}.pillars{grid-template-columns:1fr 1fr}.points{grid-template-columns:1fr}}
@media(max-width:560px){.hero h1{font-size:58px}.steps,.pillars,.results{grid-template-columns:1fr}.footer .wrap{display:grid}}

/* --- reveal on scroll --- */
.reveal{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
.reveal.is-in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}
/* --- micro interactions --- */
.step,.pillar,.story{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s,border-color .35s}
.step:hover,.pillar:hover,.story:hover{transform:translateY(-8px);box-shadow:0 26px 60px rgba(7,27,77,.14);border-color:#cfe0c6}
.btn{transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s,filter .25s}
.btn:hover{transform:translateY(-2px);box-shadow:0 18px 40px rgba(7,27,77,.26)}
.links a{position:relative}
.links a:after{content:"";position:absolute;left:0;right:100%;bottom:-6px;height:2px;background:var(--green);transition:right .3s}
.links a:hover:after{right:0}
/* --- interactive hero house --- */
.house{cursor:pointer;transition:transform .35s cubic-bezier(.22,1,.36,1);filter:drop-shadow(0 22px 34px rgba(7,27,77,.10));outline:none}
.house:focus{outline:none}
.house:focus-visible{outline:3px solid var(--green);outline-offset:6px;border-radius:24px}
.win{transition:fill .5s ease}
.visual.lit .win{filter:drop-shadow(0 0 14px rgba(255,205,90,.75))}
.hint{position:absolute;right:24px;top:22px;z-index:3;border:1px solid rgba(255,255,255,.9);background:rgba(255,255,255,.85);backdrop-filter:blur(8px);border-radius:999px;padding:9px 16px;font:inherit;font-size:12px;font-weight:850;color:var(--navy);cursor:pointer;box-shadow:0 8px 24px rgba(7,27,77,.10);transition:transform .25s ease}
.hint:hover{transform:translateY(-2px)}
/* --- readiness quiz --- */
.quiz{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:52px;text-align:left}
.quiz-form,.quiz-result{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:30px;padding:30px;color:white}
.quiz-form label{display:flex;justify-content:space-between;font-weight:850;margin:16px 0 10px;font-size:14px}
.quiz-form input[type=range]{width:100%;accent-color:#7ed957}
.quiz-label{display:block;font-weight:850;margin:22px 0 12px;font-size:14px}
.chips{display:flex;flex-wrap:wrap;gap:10px}
.chip{border:1px solid rgba(255,255,255,.28);background:transparent;color:white;border-radius:999px;padding:10px 16px;font:inherit;font-size:13px;font-weight:800;cursor:pointer;transition:all .25s}
.chip:hover{border-color:#7ed957}
.chip.on{background:var(--green);border-color:var(--green)}
.quiz-result{text-align:center}
.ring.live{width:200px;height:200px;background:conic-gradient(#54a83f var(--pct),rgba(255,255,255,.18) 0);transition:background .5s ease}
.ring.live b{font-size:66px}
.quiz-result h3{margin:18px 0 6px;font-size:22px}
.live-check{text-align:left;line-height:1.55;display:grid;gap:10px;margin:18px 0 22px}
.live-check li{font-size:14px}
.live-check li:before{content:"○";color:#ffd977}
.live-check li.ok:before{content:"✓";color:#91e47a}
.quiz-email{display:flex;gap:10px;flex-wrap:wrap}
.quiz-email input{flex:1 1 180px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:white;border-radius:14px;padding:14px;font:inherit}
.quiz-email input::placeholder{color:#c6d2e8}
.quiz-sent{color:#91e47a;font-weight:850}
/* --- stories --- */
.stories{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:52px;text-align:left}
.story{background:white;border:1px solid var(--line);border-radius:30px;padding:30px;box-shadow:0 14px 40px rgba(7,27,77,.06)}
.story-head{display:flex;gap:14px;align-items:center}
.avatar{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:#edf7ea;color:var(--green);font-weight:900;font-size:14px}
.story-head b{display:block;letter-spacing:-.02em}
.story-head small{color:var(--muted);font-weight:700}
.story-shift{display:flex;align-items:center;gap:12px;margin:22px 0}
.was{color:var(--muted);text-decoration:line-through;font-weight:850}
.arrow{color:var(--green);font-weight:900}
.now{color:var(--navy);font-weight:900;font-size:24px;letter-spacing:-.03em}
.story p{color:#344360;line-height:1.65;margin:0 0 18px}
.story-stat{display:inline-block;background:#edf7ea;color:#2c6a1c;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:900}
/* --- lead magnet --- */
.magnet{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.magnet h2{font-size:clamp(34px,4vw,60px);line-height:1;letter-spacing:-.05em;margin:0 0 16px}
.dark-check{color:#344360;list-style:none;padding:0;line-height:2}
.dark-check li:before{content:"✓";color:var(--green);font-weight:900;margin-right:10px}
.magnet-form{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}
.magnet-form input{flex:1 1 190px;border:1px solid #dce3ee;border-radius:14px;padding:15px;font:inherit;background:white}
.magnet-done{display:flex;flex-direction:column;gap:6px;margin-top:26px;color:var(--muted);background:#f2f8f4;border:1px solid #d6e9dd;border-radius:16px;padding:16px 18px}
.magnet-done strong{color:var(--green);font-size:18px}
.magnet-note{margin-top:14px;font-size:13px;color:var(--muted);opacity:.85}
.magnet-cover{display:block;border-radius:28px;overflow:hidden;box-shadow:var(--shadow);transition:transform .4s cubic-bezier(.22,1,.36,1)}
.magnet-cover:hover{transform:translateY(-8px) rotate(-1deg)}
.magnet-locked{background:linear-gradient(160deg,var(--navy),#16305a);color:#fff;padding:38px 34px;display:flex;align-items:center}
.magnet-locked-inner{width:100%}
.magnet-badge{display:inline-block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:var(--green);background:rgba(255,255,255,.08);border-radius:999px;padding:7px 14px}
.magnet-locked h3{margin:18px 0 8px;font-size:30px;line-height:1.15;color:#fff}
.magnet-locked p{margin:0 0 18px;opacity:.8}
.magnet-locked ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.magnet-locked li{padding-left:26px;position:relative;opacity:.92}
.magnet-locked li:before{content:"";position:absolute;left:0;top:7px;width:12px;height:12px;border-radius:50%;background:var(--green)}
@media(max-width:980px){.quiz,.stories,.magnet{grid-template-columns:1fr}.hint{display:none}}
`;
