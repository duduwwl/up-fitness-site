import { Band } from "@/components/band";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Plans } from "@/components/plans";
import { Structure } from "@/components/structure";
import { Unit } from "@/components/unit";
import { address, contact, hours } from "@/content/site";

const dayCodes = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Structured data built only from confirmed facts in src/content/site.ts.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: "UP Fitness Zona Sul",
  telephone: `+${contact.whatsappNumber}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: address.street,
    addressLocality: address.city,
    addressRegion: address.state,
    postalCode: address.postalCode,
    addressCountry: "BR",
  },
  openingHoursSpecification: hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days.map((d) => dayCodes[d]),
    opens: h.open,
    closes: h.close === "24:00" ? "23:59" : h.close,
  })),
  sameAs: [contact.instagramUnit],
};

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Structure />
        <Plans />
        <Band />
        <Unit />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
