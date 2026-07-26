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
            <div className="sun" style={{ transform: `translate(${tilt.x * -16}px, ${tilt.y * -10}px)` }} />
            <div className="lawn" />
            <div className="road" />
            <svg
              className="house"
              viewBox="0 0 520 330"
              style={{ transform: `translate(${tilt.x * 14}px, ${tilt.y * 9}px) rotate(${tilt.x * 1.1}deg)` }}
              onClick={() => setLightsOn((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setLightsOn((v) => !v)}
            >
              <path d="M60 160 L260 20 L460 160" fill="#0b2b68" />
              <path d="M100 155 H420 V315 H100 Z" fill="#fff" stroke="#d9e1ee" strokeWidth="4" />
              <path d="M145 190 H225 V315 H145 Z" fill="#0b2b68" />
              <rect className="win" x="285" y="190" width="85" height="60" fill={lightsOn ? "#ffd977" : "#dceeff"} stroke="#0b2b68" strokeWidth="6" />
              <path d="M100 155 L260 45 L420 155" fill="none" stroke="#367f23" strokeWidth="12" />
              <circle cx="205" cy="255" r="6" fill="#fff" />
            </svg>
            <div className="card">
              <span>Down payment timeline</span>
              <b>{heroYears}</b>
              <span>Estimated with your custom savings plan.</span>
            </div>
            <span className="hint">{lightsOn ? "Home sweet home ✨" : "Tap the house →"}</span>
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
              ].map(([n, h, p]) => (
                <article className="step" key={n}>
                  <span className="step-no">{n}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </article>
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
              ].map(([h, p]) => (
                <article className="pillar" key={h}>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </article>
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
          <div className="wrap split">
            <div className="score">
              <div className="ring"><b>78</b></div>
              <h3>Down Payment Readiness Score</h3>
              <p>A simple way to understand how prepared you are and what steps can improve your timeline.</p>
            </div>
            <div>
              <p className="eyebrow">Signature feature</p>
              <h2>Your roadmap starts with a score.</h2>
              <ul className="check">
                <li>Identify savings gaps</li>
                <li>Review FHSA and RRSP opportunities</li>
                <li>Estimate your buying timeline</li>
                <li>Get clear next steps</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap quote">
            <h2>"We thought buying a home would take six years. With a plan, we saw a path to three."</h2>
            <p className="sub">Replace this section later with real client stories and photos.</p>
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
.visual{height:600px;border-radius:44px;background:linear-gradient(160deg,#f8fbff,#eef5ea);position:relative;overflow:hidden;box-shadow:var(--shadow);border:1px solid #edf1f6}
.sun{position:absolute;width:260px;height:260px;border-radius:50%;right:-50px;top:-40px;background:radial-gradient(circle,#fff7c7,#f5c45e 45%,transparent 66%);opacity:.9}
.house{position:absolute;left:70px;right:70px;bottom:150px;height:270px}
.lawn{position:absolute;left:-80px;right:-80px;bottom:0;height:190px;background:linear-gradient(0deg,#85b95d,#dcefd2);border-radius:50% 50% 0 0/38% 38% 0 0}
.road{position:absolute;left:220px;bottom:-40px;width:210px;height:260px;background:#e8e0d6;transform:skewX(-14deg);border-left:10px solid #fff;border-right:10px solid #fff}
.card{position:absolute;left:36px;bottom:32px;width:300px;padding:24px;border-radius:28px;background:rgba(255,255,255,.82);backdrop-filter:blur(18px);box-shadow:0 20px 50px rgba(7,27,77,.16)}
.card b{font-size:54px;display:block;color:var(--navy);letter-spacing:-.06em}
.card span{color:var(--muted);font-weight:700}
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
`;
