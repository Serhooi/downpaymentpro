import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { saveLead } from "@/lib/leads.functions";

export function LeadMagnet() {
  const send = useServerFn(saveLead);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setBusy(true);
    try {
      await send({ data: { email, name, source: "guide" as const } });
      setUnlocked(true);
      toast.success("Check your inbox — the guide is on its way.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="magnet">
      <div>
        <p className="eyebrow">Free download</p>
        <h2>5 programs every Ontario first-time buyer should know.</h2>
        <p className="sub" style={{ textAlign: "left", margin: "0 0 22px" }}>
          Our Fast Track guide breaks down FHSA, the RRSP Home Buyers' Plan, the
          7 pillars, and the exact checklist we use with clients — free, no
          obligation.
        </p>
        <ul className="check dark-check">
          <li>FHSA, HBP &amp; land transfer rebates explained</li>
          <li>The 7-pillar Fast Track framework</li>
          <li>A savings plan template you can use today</li>
        </ul>

        {unlocked ? (
          <div className="magnet-done">
            <strong>Sent!</strong>
            <span>
              We emailed the Fast Track guide to {email} from
              Downpaymentpro@gmail.com. If it isn't there in a few minutes, check
              your spam folder.
            </span>
          </div>
        ) : (
          <form className="magnet-form" onSubmit={onSubmit}>
            <input
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn green" type="submit" disabled={busy}>
              {busy ? "Sending..." : "Email me the free guide"}
            </button>
          </form>
        )}
        <p className="magnet-note">
          We email the guide straight to you — no spam, unsubscribe anytime.
        </p>
      </div>

      <div className="magnet-cover magnet-locked" aria-hidden="true">
        <div className="magnet-locked-inner">
          <span className="magnet-badge">Fast Track Program</span>
          <h3>Your free guide</h3>
          <p>Delivered to your inbox in one click.</p>
          <ul>
            <li>FHSA &amp; HBP breakdown</li>
            <li>7 pillars framework</li>
            <li>Savings plan template</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
