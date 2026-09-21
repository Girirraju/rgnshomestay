import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, List } from "@/components/LegalPage";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({
    meta: [
      { title: "Cancellation Policy — RGN's Homestay" },
      {
        name: "description",
        content: "Cancellation, no-show, and rescheduling policy for RGN's Homestay, Karur.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: CancellationPage,
});

function CancellationPage() {
  return (
    <LegalPage title="Cancellation Policy" updated="21 September 2026">
      <Section heading="1. Non-refundable bookings">
        <p>
          All bookings confirmed with RGN's Homestay are <strong>non-refundable</strong>. Once the
          host confirms your reservation, the dates and room are reserved specifically for you and
          are no longer offered to other guests, so cancellations, date changes, or early check-outs
          do not carry a refund.
        </p>
      </Section>

      <Section heading="2. Guest-initiated cancellation">
        <List
          items={[
            "If you need to cancel, contact the host as early as possible by phone, WhatsApp, or email so the dates can be released for other guests.",
            "No refund is issued for guest-initiated cancellations, regardless of notice period, except where the host chooses to make an exception at their sole discretion.",
          ]}
        />
      </Section>

      <Section heading="3. No-shows &amp; early departure">
        <p>
          If you do not arrive for a confirmed stay, or check out earlier than your confirmed
          check-out date, no refund is issued for the unused nights.
        </p>
      </Section>

      <Section heading="4. Rescheduling">
        <p>
          Requests to move a confirmed booking to different dates are considered by the host on a
          case-by-case basis, subject to availability, and are not guaranteed. Contact the host
          directly to request a reschedule.
        </p>
      </Section>

      <Section heading="5. Host-initiated cancellation">
        <p>
          In the rare event the host needs to cancel a confirmed booking (for example, due to
          unforeseen property issues), you will be notified as soon as possible and the host will
          make reasonable efforts to help you find alternative arrangements.
        </p>
      </Section>

      <Section heading="6. Force majeure">
        <p>
          Where a stay is affected by events outside either party's reasonable control (natural
          disasters, extreme weather, government-imposed travel restrictions, public health
          emergencies, etc.), the host will work with affected guests in good faith on rescheduling.
        </p>
      </Section>

      <Section heading="7. Duplicate or conflicting requests">
        <p>
          To keep the calendar accurate for everyone, our system does not allow the same guest
          (identified by phone number or email address) to submit a second reservation request for
          dates that overlap a booking they already hold. If you need to change your existing dates,
          please contact the host directly rather than submitting a new request.
        </p>
      </Section>

      <Section heading="8. Contact">
        <p>
          For any cancellation, rescheduling, or refund question, contact Mrs S Gowri at{" "}
          <a href="tel:+917010775902">+91 70107 75902</a> (call/WhatsApp) or{" "}
          <a href="mailto:rgnshomestay@gmail.com">rgnshomestay@gmail.com</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
