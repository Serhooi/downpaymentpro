import { Reveal } from "@/components/Reveal";

const stories = [
  {
    initials: "A&M",
    name: "Amrit & Meera",
    place: "Brampton · closed 2025",
    before: "6 years",
    after: "3 years",
    quote:
      "We thought we were six years away. After the strategy session we opened FHSAs, restructured our savings, and closed on our first home in three.",
    stat: "$62,000 down payment built",
  },
  {
    initials: "JC",
    name: "Jasmine C.",
    place: "Hamilton · closed 2024",
    before: "$0 plan",
    after: "$41,500",
    quote:
      "I was saving with no plan at all. The 90-day monitoring kept me honest — I saved more in one year than in the previous four.",
    stat: "Savings rate 9% → 22%",
  },
  {
    initials: "D&R",
    name: "Daniel & Rosa",
    place: "Ottawa · closing 2026",
    before: "Declined",
    after: "Pre-approved",
    quote:
      "We were declined once and gave up. Serice and Eric mapped out the debt payoff order and the RRSP strategy — now we're pre-approved.",
    stat: "Debt payments cut by $780/mo",
  },
];

export function Testimonials() {
  return (
    <div className="stories">
      {stories.map((s, i) => (
        <Reveal as="article" className="story" key={s.name} delay={i * 90}>
          <div className="story-head">
            <span className="avatar">{s.initials}</span>
            <div>
              <b>{s.name}</b>
              <small>{s.place}</small>
            </div>
          </div>
          <div className="story-shift">
            <span className="was">{s.before}</span>
            <span className="arrow">→</span>
            <span className="now">{s.after}</span>
          </div>
          <p>"{s.quote}"</p>
          <span className="story-stat">{s.stat}</span>
        </Reveal>
      ))}
    </div>
  );
}
