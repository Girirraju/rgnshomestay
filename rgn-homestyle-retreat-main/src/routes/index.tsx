import { createFileRoute } from "@tanstack/react-router";
import { HomestayPage } from "@/components/HomestayPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RGN's Homestay — Homestyle Living in Karur" },
      { name: "description", content: "Book a warm, traditional homestay near Sri Thanthonimalai Perumal Temple in Karur. Family, wedding, and pilgrim stays hosted by Mrs S Gowri." },
      { property: "og:title", content: "RGN's Homestay — Homestyle Living in Karur" },
      { property: "og:description", content: "Your comfort, our tradition. Direct homestay booking in Karur for families, weddings, and pilgrims." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomestayPage,
});
