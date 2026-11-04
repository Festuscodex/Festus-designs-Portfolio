# Festus Designs — portfolio website

Plain HTML, CSS and JavaScript. No build step, no dependencies. Open `index.html` to preview, or upload the whole folder to any host (Netlify, Vercel, GitHub Pages, cPanel).

## How everything is linked

| From | Goes to |
| --- | --- |
| Hero: **See my works** | `#work` section on the home page |
| Hero: **See my flyers**, nav **Flyers**, section button **See my flyers** | `flyers.html` |
| Section button **Brandings** | `brandings.html` |
| Box 1 · BYD Conference | `byd.html` |
| Box 2 · Technoville Innovations Nigeria | `technoville.html` |
| Box 3 · Bonny digital literacy Initiative | `bdli.html` |
| Every sub-page: **Back to all work**, logo, nav **Work** / **Contact** | home page (`index.html`, `#work`, `#contact`) |

On every flyer page, click a flyer to open it large. Use the arrow keys, swipe, or Esc.

## Adding your UI/UX designs in motion

Open **`assets/js/projects.js`**. It is the only file you need to touch. Each project there becomes a card, and clicking it expands into a full-screen viewer that plays your design.

Pick one way to show each project:

1. **Video (recommended).** In Figma, build a prototype with Smart Animate, play it, and screen-record it (or export from a tool like Screen Studio). Save it as `assets/uiux/my-app.mp4`, then set:
   `media: { type: "video", src: "assets/uiux/my-app.mp4", poster: "assets/uiux/my-app-poster.webp" }`
   Keep each file under about 8 MB, 1080p or smaller. To shrink one with ffmpeg:
   `ffmpeg -i in.mov -vf scale=1600:-2 -c:v libx264 -crf 28 -an -movflags +faststart my-app.mp4`
2. **Live Figma prototype.** Figma → Share → Get embed code → copy the URL from `src="…"`, then set:
   `media: { type: "figma", src: "https://embed.figma.com/proto/…" }`
   Visitors can click through it themselves.
3. **Auto-scrolling web pages** (used by THE HOUSE). For long pages or tall screens, export each as a tall PNG/WebP and use `media: { type: "scroll", images: [...] }`. Each page scrolls top to bottom inside a phone window, then moves to the next. Click the phone to pause.
4. **Slideshow of screens** (used by DealSprint Pro and Chops). Export your screens as WebP or PNG into `assets/uiux/`. They slide and fade automatically with a progress bar:
   `media: { type: "frames", interval: 2800, images: ["assets/uiux/a.webp", "assets/uiux/b.webp"] }`

Also set `title`, `description`, and optionally `cover` (a card image). Until you do, the three cards show your placeholder colour blocks and a built-in demo animation.

## Editing text and images

- **Flyer captions** (`flyers.html`): each flyer says "Flyer title / Client or event." exactly as in your design. Search for those words in the file to replace them, or delete the two `<span>` lines to hide captions.
- **Flyers** are ordered as in your design. To swap one, replace `assets/img/<page>/NN.webp` (full size, about 1500 px) and `NN-thumb.webp` (about 720 px).
- **Social links** are in the footer of `index.html`. I assumed `instagram.com/Festusdesigns`, `x.com/Festusdesigns` and `linkedin.com/in/Festusdesigns`. Please check them.
- **Colours and fonts** are variables at the top of `assets/css/style.css`. The font is Plus Jakarta Sans, loaded from Google Fonts, so it needs an internet connection.

## Files

```
index.html, flyers.html, byd.html, technoville.html, bdli.html, brandings.html
assets/css/style.css
assets/js/main.js        menu, flyer lightbox, UI/UX viewer
assets/js/projects.js    ← your UI/UX projects
assets/img/…             optimised images from your designs
assets/uiux/             put your UI/UX videos and screens here
```
