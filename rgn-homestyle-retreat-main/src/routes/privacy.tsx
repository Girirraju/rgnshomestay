import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, List } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — RGN's Homestay" },
      {
        name: "description",
        content: "How RGN's Homestay collects, uses, and protects your personal information.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="21 September 2026">
      <Section heading="1. Overview">
        <p>
          This Privacy Policy explains what personal information RGN's Homestay ("we", "us")
          collects through rgnshomestay's booking website, how we use it, who we share it with, and
          the choices you have. We collect the minimum information needed to process your
          reservation and communicate with you about your stay.
        </p>
      </Section>

      <Section heading="2. Information we collect">
        <List
          items={[
            <>
              <strong>Booking details you provide:</strong> full name, phone number, email address,
              preferred room type, check-in/check-out dates, and guest count, submitted via the
              Guest Reservation Form.
            </>,
            <>
              <strong>Chat messages:</strong> if you use the website's chat assistant, the messages
              you type are sent to our server and, to generate a reply, to Google's Gemini AI API.
            </>,
            <>
              <strong>Basic technical data:</strong> standard web server logs (such as request
              timestamps) generated automatically when you use the site, used only for operating and
              securing the service.
            </>,
          ]}
        />
        <p>
          We do not use third-party advertising or analytics cookies, and we do not sell your
          personal information.
        </p>
      </Section>

      <Section heading="3. How we use your information">
        <List
          items={[
            "To process and confirm your reservation, and to contact you about it.",
            "To record your booking in our internal booking record (Google Sheets) and block the relevant dates on our booking calendar.",
            "To notify the host by email that a new reservation request has been received.",
            "To detect and prevent duplicate or fraudulent booking submissions for the same guest and dates.",
            "To answer questions through the chat assistant about rooms, availability, and your stay.",
          ]}
        />
      </Section>

      <Section heading="4. Who we share it with">
        <p>
          We use the following third-party service providers ("processors") to operate the booking
          system. We do not sell or rent your data to anyone, and we do not share it for advertising
          purposes.
        </p>
        <List
          items={[
            <>
              <strong>Google (Sheets, Calendar &amp; Gmail APIs):</strong> your booking details are
              stored in a private Google Sheet accessible only to the host, used to block dates on
              the host's Google Calendar, and used to email the host a booking notification.
            </>,
            <>
              <strong>Google (Gemini API):</strong> if you chat with our assistant, your message
              text (and, where relevant, an existing guest's name and booking dates — never phone,
              email, or Booking ID) is sent to Google's Gemini API to generate a reply. See Section
              6 for how we limit what the assistant can access.
            </>,
          ]}
        />
      </Section>

      <Section heading="5. Data retention">
        <p>
          Booking records are kept in our internal Google Sheet for as long as reasonably necessary
          for record-keeping, tax/legal compliance, and handling any post-stay queries, after which
          they may be archived or deleted. Calendar events are generally retained for historical
          availability reference. Chat conversations are not permanently stored by us beyond the
          active session needed to generate a reply.
        </p>
      </Section>

      <Section heading="6. Privacy by design in the chat assistant">
        <p>
          Our chat assistant is deliberately limited in what guest data it can see or say. When
          answering questions about existing bookings, the server only ever gives the assistant a
          guest's <strong>name</strong>, the <strong>room type</strong>, and the{" "}
          <strong>stay dates</strong> — phone numbers, email addresses, guest counts, and Booking
          IDs are filtered out on our server before the assistant ever receives the data, so it
          cannot reveal information it was never given, regardless of how it is asked.
        </p>
      </Section>

      <Section heading="7. Your rights">
        <p>
          You may ask us to access, correct, or delete the personal information we hold about your
          booking, or ask us how it has been used, by contacting{" "}
          <a href="mailto:rgnshomestay@gmail.com">rgnshomestay@gmail.com</a> or{" "}
          <a href="tel:+917010775902">+91 70107 75902</a>. We will respond within a reasonable time.
          Please note we may need to keep certain booking records where required for legitimate
          record-keeping or legal reasons even after a deletion request.
        </p>
      </Section>

      <Section heading="8. Security">
        <p>
          We apply reasonable technical safeguards to protect your information, including
          restricting access to booking records to the host, encrypting data in transit (HTTPS),
          rate-limiting our booking and chat endpoints against abuse, and validating all submitted
          data on our server. No method of transmission or storage is 100% secure, but we work to
          protect your information appropriately for a small business of our size.
        </p>
      </Section>

      <Section heading="9. Children's privacy">
        <p>
          This website is not directed at children, and reservations may only be made by adults
          (18+). We do not knowingly collect personal information from children.
        </p>
      </Section>

      <Section heading="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The "Last updated" date above
          reflects the most recent revision. Significant changes will be reflected on this page.
        </p>
      </Section>

      <Section heading="11. Contact">
        <p>
          For any privacy question or request, contact Mrs S Gowri at{" "}
          <a href="mailto:rgnshomestay@gmail.com">rgnshomestay@gmail.com</a> or{" "}
          <a href="tel:+917010775902">+91 70107 75902</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
