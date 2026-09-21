import { createFileRoute } from "@tanstack/react-router";
import { HomestayPage } from "@/components/HomestayPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RGN's Homestay — Homestyle Living in Karur" },
      {
        name: "description",
        content:
          "Book a warm, traditional homestay near Sri Thanthonimalai Perumal Temple in Karur. Family, wedding, and pilgrim stays hosted by Mrs S Gowri.",
      },
      { property: "og:title", content: "RGN's Homestay — Homestyle Living in Karur" },
      {
        property: "og:description",
        content:
          "Your comfort, our tradition. Direct homestay booking in Karur for families, weddings, and pilgrims.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "800" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RGN's Homestay — Homestyle Living in Karur" },
      {
        name: "twitter:description",
        content:
          "Your comfort, our tradition. Direct homestay booking in Karur for families, weddings, and pilgrims.",
      },
      { name: "twitter:image", content: "/og-image.jpg" },
      { name: "theme-color", content: "#801323" },
    ],
  }),
  component: HomestayPage,
});
