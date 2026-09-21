import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, List } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — RGN's Homestay" },
      {
        name: "description",
        content: "Terms and conditions for booking a stay at RGN's Homestay, Karur.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms &amp; Conditions" updated="21 September 2026">
      <Section heading="1. Who we are">
        <p>
          RGN's Homestay ("we", "us", "the homestay") is a family-run homestay located at 25/4
          Kamaraj Nagar, Sungagate, Near Sungagate Bus stop, Thanthonimalai Post, Karur-639004,
          Tamil Nadu, India, personally managed by Mrs S Gowri. These Terms &amp; Conditions govern
          your use of our website and any booking made through it. By submitting a reservation
          request, you agree to these terms.
        </p>
      </Section>

      <Section heading="2. Direct booking, no platform commission">
        <p>
          RGN's Homestay is booked directly with the host — there is no third-party booking platform
          or agent involved, and no platform fees are charged. A reservation request submitted
          through this website is sent straight to the host, who personally confirms every stay by
          phone, WhatsApp, or email.
        </p>
      </Section>

      <Section heading="3. Making a reservation">
        <List
          items={[
            <>
              You must provide accurate, current, and complete information (full name, phone number,
              email address, room type, check-in/check-out dates, and guest count) when submitting a
              reservation request.
            </>,
            <>
              Submitting the form generates a Booking ID and sends your request to the host; it is a{" "}
              <strong>request</strong>, not a guaranteed confirmation, until the host confirms it
              directly.
            </>,
            <>
              One person may not submit overlapping reservation requests for the same stay dates
              using the same contact details — duplicate requests for dates you already hold a
              booking for will be automatically declined.
            </>,
            <>
              Guests must be 18 years or older to make a booking. Guests under 18 must be
              accompanied by a parent or legal guardian.
            </>,
          ]}
        />
      </Section>

      <Section heading="4. Check-in, check-out &amp; identification">
        <List
          items={[
            <>
              Standard check-in time is 2:00 PM and check-out time is 2:00 PM, unless otherwise
              agreed with the host in advance.
            </>,
            <>
              All guests must carry and present a valid government-issued photo ID at check-in, as
              required under Indian lodging regulations.
            </>,
            <>
              The homestay is offered for lawful stays only — for families, weddings, pilgrims, and
              individual travellers. Any unlawful, unsafe, or disruptive use is grounds for the host
              to refuse or end a stay without refund.
            </>,
          ]}
        />
      </Section>

      <Section heading="5. Rates &amp; payment">
        <p>
          Room rates displayed on this website (2BHK Full Home and 1BHK Suite) are per night and
          exclude the one-time cleaning charge noted on the site. Payment method and timing (e.g. on
          arrival, or an advance amount) are arranged directly between you and the host at the time
          of confirmation. Rates are subject to change without notice for future, unconfirmed dates.
        </p>
      </Section>

      <Section heading="6. Cancellations &amp; changes">
        <p>
          Cancellations and rescheduling are governed by our{" "}
          <a href="/cancellation-policy">Cancellation Policy</a>, which forms part of these Terms.
        </p>
      </Section>

      <Section heading="7. Guest conduct">
        <List
          items={[
            <>
              Guests are expected to follow all house rules communicated by the host on arrival,
              treat the property and its furnishings with care, and be considerate of neighbours and
              other guests.
            </>,
            <>
              Guests are responsible for any damage caused to the property during their stay, beyond
              normal wear and tear.
            </>,
            <>
              The host may decline entry or end a stay early, without refund, in cases of abusive
              behaviour, illegal activity, or serious violation of house rules.
            </>,
          ]}
        />
      </Section>

      <Section heading="8. Website use &amp; the chat assistant">
        <p>
          This website provides an AI-powered chat assistant to answer general questions about
          rooms, rates, and the local area, and to help you check whether given dates are booked.
          The assistant's answers are provided for convenience only and do not themselves constitute
          a confirmed booking or a binding offer — always confirm final details with the host. Do
          not use the website, the reservation form, or the chat assistant to submit false
          information, attempt to overwhelm the system with repeated requests, or attempt to access
          data that is not intended for you.
        </p>
      </Section>

      <Section heading="9. Limitation of liability">
        <p>
          To the fullest extent permitted by law, RGN's Homestay is not liable for indirect,
          incidental, or consequential loss arising from your use of this website or your stay,
          except where such liability cannot be excluded under applicable Indian law. Nothing in
          these Terms limits liability for death or personal injury caused by negligence, or for
          fraud.
        </p>
      </Section>

      <Section heading="10. Force majeure">
        <p>
          Neither party is liable for a failure to perform obligations caused by circumstances
          beyond reasonable control, including natural disasters, extreme weather, government
          restrictions, or public health emergencies. In such cases the host will work with affected
          guests in good faith on rescheduling.
        </p>
      </Section>

      <Section heading="11. Governing law">
        <p>
          These Terms are governed by the laws of India, and any dispute arising from them is
          subject to the exclusive jurisdiction of the courts having jurisdiction over Karur, Tamil
          Nadu.
        </p>
      </Section>

      <Section heading="12. Changes to these terms">
        <p>
          We may update these Terms from time to time to reflect changes to our services or for
          legal reasons. The "Last updated" date above shows when these Terms were last revised.
          Continued use of the website after changes are posted constitutes acceptance of the
          revised Terms.
        </p>
      </Section>

      <Section heading="13. Contact">
        <p>
          Questions about these Terms can be sent to{" "}
          <a href="mailto:rgnshomestay@gmail.com">rgnshomestay@gmail.com</a> or by phone/WhatsApp at{" "}
          <a href="tel:+917010775902">+91 70107 75902</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
