/* ==========================================================================
   UI/UX & PRODUCT DESIGN — the only file you need to edit to add your work.

   Each project becomes a card on the home page. Clicking it opens a
   full-screen viewer that plays your design in motion.

   Pick ONE "media" type per project:

   1) VIDEO  (recommended — works for any prototype or screen recording)
        media: { type: "video", src: "assets/uiux/my-app.mp4",
                 webm: "assets/uiux/my-app.webm",      // optional, smaller
                 poster: "assets/uiux/my-app-poster.webp" }

   2) FIGMA  (live, clickable prototype)
        Figma → Share → Get embed code → copy the URL inside src="..."
        media: { type: "video", src: "assets/uiux/dealsprint-pro.mp4" }

   2b) SCROLL (long web pages or tall app screens: each one scrolls top-to-bottom
        by itself inside a phone window, then moves to the next. Click to pause.)
        media: { type: "scroll", images: ["assets/uiux/page-1.webp", "assets/uiux/page-2.webp"] }

   3) FRAMES (a slideshow of exported screens that slides/fades on its own)
        media: { type: "frames", interval: 2800,
                 images: ["assets/uiux/app-1.webp", "assets/uiux/app-2.webp", "assets/uiux/app-3.webp"] }

   4) DEMO   (built-in placeholder animation, shown until you add real media)
        media: { type: "demo" }

   "cover" is optional: an image for the card. If you leave it out, the card
   shows the coloured block + shape from your design.
   ========================================================================== */

window.UIUX_PROJECTS = [
  {
    id: "dealsprint-pro",
    title: "DealSprint Pro",
    description: "Sales-target app: mascot onboarding and a weekly goal dashboard.",
    tone: "#111114",
    shapeColor: "#ffae34",
    shape: "circle",
    cover: "assets/uiux/dealsprint-cover.webp",
    media: {
      type: "frames",
      interval: 2600,
      images: [
        "assets/uiux/dealsprint-1.webp", "assets/uiux/dealsprint-2.webp", "assets/uiux/dealsprint-3.webp",
        "assets/uiux/dealsprint-4.webp", "assets/uiux/dealsprint-5.webp", "assets/uiux/dealsprint-6.webp"
      ]
    }
  },
  {
    id: "the-house",
    title: "THE HOUSE",
    description: "Mobile website for a Lagos social house: home, menu, gallery, events and reservations.",
    tone: "#2d2b25",
    shapeColor: "#ad6bff",
    shape: "square",
    cover: "assets/uiux/the-house-cover.webp",
    media: {
      type: "scroll",
      images: [
        "assets/uiux/the-house-home.webp", "assets/uiux/the-house-menu.webp", "assets/uiux/the-house-gallery.webp",
        "assets/uiux/the-house-events.webp", "assets/uiux/the-house-reserve.webp"
      ]
    }
  },
  {
    id: "chops",
    title: "Chops",
    description: "Food-ordering app flow: welcome, sign up, menu and checkout.",
    tone: "#ffae34",
    shapeColor: "#111114",
    shape: "leaf",
    cover: "assets/uiux/chops-cover.webp",
    media: {
      type: "frames",
      interval: 2600,
      images: [
        "assets/uiux/chops-1.webp", "assets/uiux/chops-2.webp", "assets/uiux/chops-3.webp", "assets/uiux/chops-4.webp",
        "assets/uiux/chops-5.webp", "assets/uiux/chops-6.webp", "assets/uiux/chops-7.webp"
      ]
    }
  }
];
