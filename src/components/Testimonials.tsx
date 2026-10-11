import { Reveal } from "@/components/Reveal";

const quotes = [
  {
    text: "We thought we would need to rent for another 3 years. With the help of Downpayment Pro, we purchased in 14 months. Save a ton on rent!",
    author: "Joseph & Amanda • June 2026",
  },
  {
    text: "We love the step-by-step program and the encouragement from our trainer. Bought in 10 months vs. 2 years.",
    author: "Jayden & Kim • May 2026",
  },
];

export function Testimonials() {
  return (
    <div className="testimonials">
      {quotes.map((q, i) => (
        <Reveal as="article" className="quote" key={q.author} delay={i * 100}>
          <h2>"{q.text}"</h2>
          <p className="testimonial-author">— {q.author}</p>
        </Reveal>
      ))}
    </div>
  );
}
