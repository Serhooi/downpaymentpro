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
      toast.success("Your guide is unlocked below.");
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
          <li>FHSA, HBP & land transfer rebates explained</li>
          <li>The 7-pillar Fast Track framework</li>
          <li>A savings plan template you can use today</li>
        </ul>

        {unlocked ? (
          <div className="magnet-done">
            <a className="btn green" href={brochure.url} download="fast-track-program.png">
              Download the guide
            </a>
            <span>Also sent to {email}</span>
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
              {busy ? "Sending..." : "Get the free guide"}
            </button>
          </form>
        )}
      </div>

      <a className="magnet-cover" href={brochure.url} target="_blank" rel="noreferrer">
        <img
          src={brochure.url}
          alt="Fast Track Program guide for Ontario first-time home buyers"
          loading="lazy"
        />
      </a>
    </div>
  );
}
