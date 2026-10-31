# Portfolio Redesign Brief for Claude Code

> **For you (Taranjot), 3 minutes of setup**
>
> 1. Make sure the current site already runs: in your `portfolio-platform` folder, `npm run dev` should open it at `http://localhost:8888`.
> 2. Put this file in the project root as `REDESIGN_PROMPT.md`.
> 3. Copy your **transparent-background portrait** from the old repo (`public/assets/img/profilePic.png`, the one with no background) into the new project as `public/assets/img/profile.png`. The design depends on it. Also make sure your CV is at `public/assets/pdf/Taranjot-Singh-CV.pdf`.
> 4. Open the folder in VS Code, open the terminal, run `claude`, and paste this starter prompt:
>
> ```text
> Read REDESIGN_PROMPT.md completely. Then redesign the portfolio exactly as it describes, phase by phase. Stop at every CHECKPOINT and wait for me. Only touch the files the brief allows. Never ask me to paste secrets into this chat.
> ```
>
> 5. At each checkpoint Claude Code saves screenshots into a `design-review/` folder. Open them, tell Claude Code what you love or want changed, and it continues.
>
> **Long session?** This is a big job with natural stopping points. If you stop at a checkpoint, resume later with: `Read REDESIGN_PROMPT.md and continue from Phase N. Check design-review/ and git log to see what is already done.`
>
> **Not included:** the admin dashboard (`/admin/`) keeps its current look. Ask for a matching re-skin afterwards if you want one.

---

# Instructions for Claude Code (everything below is addressed to you)

## Part 1. Mission

### 1.1 Who this site is for

Taranjot puts the address of this site on his **LinkedIn profile**. The people who land here found his profile, got curious and clicked through because they want to **get to know him in depth**: classmates, mentors, hackathon and club people, readers of his posts, curious strangers. This is a **personal site, not a job-search page**. Expect many visitors to arrive from the LinkedIn mobile app's in-app browser, so a phone is the primary device and a laptop the second.

Every decision is made for the **viewer's experience**. A visit should feel like meeting a person, one curious scroll at a time, and by the last section the visitor should feel they know him: how he thinks, what he has built, what he cares about, and how to say hello.

**What this site must never be** (these rules cover copy, markup, metadata, images and animation):

- **No job-seeking or availability signals.** No "open to work" or "open to opportunities" chip, badge, banner or ribbon, no pulsing status dot, no "hire me" or "available for" call to action, and no such wording in `<meta>` tags, JSON-LD, the Open Graph image or microcopy.
- **No scoreboard.** The result figures inside the Experience bullets, above all those of the **Empower internship** (precision, lift, outreach and conversion numbers), are never turned into chips, cards, counters, side panels, captions or image text, and nothing like them appears near the portrait. They live only inside their own bullets, and all three roles get equal visual weight.
- **Nothing is addressed to recruiters** or hiring managers.

### 1.2 The concept: analytics-native, person-first

Redesign the **look, feel and interaction** of the site at `/` so that it feels like a hand-crafted, award-quality personal site rather than a clean template. The content, the contact form, the visitor tracking and the backend are already correct and are **frozen**. You are changing how it looks and behaves, not what it says (the only text edits are the few audience-driven ones listed in 2.3).

Taranjot studies data analytics and machine learning, so the design speaks that language through craft: confident display typography, monospaced numerals for years and counts, a living gradient atmosphere, glass panels and a dotted graph-paper grid. But the hero of the story is **him**: his face, the club he founded, the hackathons he mentors, the way he writes on LinkedIn, the chess and cricket he loves. Data is the accent; the person is the subject.

**The three promises** (every decision is checked against these):

1. **The five-second hello.** Within five seconds of landing from LinkedIn, on a phone or a laptop, the visitor sees a friendly face and the name, understands in one glance who he is (the identity chips and the one-line description), and feels a pull to keep scrolling. Nothing asks anything of them yet. Creativity must never slow this down.
2. **A visit worth finishing.** The page is a journey of chapters (1.3). Every section answers one question a curious visitor would have, has one signature moment that rewards attention, and makes the next section feel inevitable. Restraint is part of the craft: no effect is added just because it is possible.
3. **Fast, accessible, robust, in-app ready.** Smooth on a mid-range phone, working inside the LinkedIn in-app browser (7.7), usable by keyboard, readable at WCAG AA contrast in every theme and accent, and fully readable with JavaScript off or motion reduced.

### 1.3 The visitor's journey

The section order is fixed by the contract, so the storytelling comes from how each section is designed. Treat each one as a chapter that answers a question:

| Section | The visitor's question | What the design should make them see and feel |
|---|---|---|
| `home` | Who is this? | A warm welcome: face, name, three identity chips, the one-line description. |
| `about` | What is he like? | A bio that reads like a person talking, a second glimpse of his face, and the data-lifecycle strip that shows how he thinks. |
| `experience` | What has he been doing? | A scroll-drawn journey through three roles of equal weight, told in the words he wrote. |
| `projects` | What does he build? | Three cards with their own cover art that come alive on touch. |
| `skills` | What is in his toolkit? | Energy first (the marquee), then orderly groups. |
| `education` | Where did he learn? | Four calm cards, a path through the years. |
| `achievements` | What has he been recognised for? | Tabs that invite browsing, not a trophy wall. |
| `hobbies` | Who is he off the clock? | The most playful section: four tiny toys, generous space, the most personality on the page. |
| `contact` | How do I say hello? | A friendly, low-pressure form and his face once more. |

These questions guide the design and are **never shown on the page** (no new copy). Section subtitles stay the existing ones.

**Reference point.** The previous portfolio (the "old site") is the source of structural and interaction inspiration: its mobile bottom-sheet navigation, blob-framed portrait, single-hue theming with dark mode, accordion skills, tabbed timeline, carousel of projects and filled-style form inputs. Part 3 explains each pattern and how to elevate it. The old site's content, text, links and images must **not** be copied. You do not have the old repository; everything you need from it is described here.

## Part 2. Ground truth and the hard contract

### 2.1 What exists now

```text
portfolio-platform/
├── public/
│   ├── index.html            ← redesign (allowed)
│   ├── css/styles.css        ← redesign (allowed)
│   ├── js/main.js            ← rewrite (allowed)
│   ├── js/tracker.js         ← DO NOT TOUCH
│   ├── robots.txt            ← keep
│   ├── admin/                ← DO NOT TOUCH
│   └── assets/{img,pdf,favicon}/
├── netlify/, scripts/, netlify.toml, package.json, .env*   ← DO NOT TOUCH
```

Stack: static HTML, one stylesheet, vanilla JavaScript, served by Netlify. **No framework, no bundler, no build step, no new runtime dependencies.** That stays true.

**This brief overrides** the earlier rule "do not change the code" from `BUILD_GUIDE.md`, but only for the allowed files above plus new files you create under `public/` (fonts links, images, `404.html`, OG image) and the review folders in 2.4 (including one added line in `.gitignore`). Everything else stays exactly as it is.

### 2.2 The contract (all of this must still be true when you finish)

| Area | Requirement |
|---|---|
| Section anchors | These ids exist on `<section>` elements, in this order: `home`, `about`, `experience`, `projects`, `skills`, `education`, `achievements`, `hobbies`, `contact`. |
| Contact form | `<form id="contactForm">` with fields named exactly `name`, `email`, `subject`, `message`, plus the honeypot input named `website` (class `hp`, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`, kept off-screen with `position:absolute; left:-9999px`, **not** `display:none`). Limits: name max 80, email max 120, subject max 120, message max 3000. |
| Form behaviour | On submit: `preventDefault`, disable the submit button while sending, send `POST /.netlify/functions/contact` with JSON of all form fields **plus `elapsed`** (milliseconds since page load; the server silently drops submissions under 1500 ms). A response `{ok:true}` resets the form and shows exactly `Thanks! Your message has been sent.`; a failure shows the server's `error` string, or `Could not send. Please email me directly.` when none. The status element is `id="formStatus"`, has `role="status"` and `aria-live="polite"`, and gets class `ok` or `err`. |
| Server rules to mirror in the browser | name at least 2 characters, a valid email, message at least 10 characters. Client validation is a courtesy; the server stays the authority. |
| Tracking | `js/tracker.js` is loaded as a classic script **before** `main.js` and is never modified. Do not rename its storage keys (`pf_visitor_id`, `pf_session`) and do not add any other tracking, analytics or third-party scripts. |
| Privacy line | The footer keeps this sentence: `This site uses a first-party identifier to count visits.` |
| Smoke test | `npm run smoke` must still pass 12 of 12. It looks for the text `Get in Touch` in `/` and `Admin login` in `/admin/`. So the contact heading keeps the words **Get in Touch**. |
| Assets | The CV stays at `assets/pdf/Taranjot-Singh-CV.pdf` (linked with the `download` attribute). The favicon files and `site.webmanifest` keep their paths. The portrait is supplied by the user as `assets/img/profile.png` (a 1.4 MB transparent cutout); you create optimised WebP versions, point the page at those, and move the original to `design-source/` (see Part 7.4). |
| Theme persistence | `localStorage` key `theme` holds `dark` or `light`; `<html data-theme="...">` is the switch. Default to the OS preference when nothing is stored. |
| Honest content | See 2.3. |

### 2.3 Content freeze

- Every factual statement, number, date, name, link and bullet in the current `index.html` stays **word for word**. You may re-structure, re-order within a section for better layout, and visually emphasise parts. You may not rewrite, shorten, "improve" or add claims.
- Never invent: metrics, testimonials, logos, client names, project links, screenshots of products, certificates, or social proof. If something looks empty (the KPMG project has no link), design the empty state gracefully instead of filling it.
- **Allowed new text** is limited to interface microcopy: aria-labels, tooltips, `Skip to content`, `Copy email`, `Copied`, `Back to top`, `More`, `Close`, tab names that already exist as headings, `Scroll`, counters' captions that repeat an existing label, and error messages for form validation. Appendix A lists which existing numbers may be shown as design elements and which may not.
- Contact details currently shown (email, phone, location, LinkedIn) stay as they are.

**Audience-driven edits (the only changes allowed to existing copy).** Because this site is for LinkedIn visitors and not for a job search, make exactly these edits and nothing else. List them in your Phase 6 report, word for word, so Taranjot can veto any of them.

| Where | Current text | Replace with |
|---|---|---|
| Hero lead paragraph | `PGDM candidate in Big Data Analytics at Goa Institute of Management. I turn messy data into machine-learning models and clear business insight, and I'm looking for data science and analytics roles.` | `PGDM candidate in Big Data Analytics at Goa Institute of Management. I turn messy data into machine-learning models and clear business insight.` (only the job-seeking clause is removed) |
| Contact subtitle | `Open to data science and analytics opportunities` | `Questions, ideas or just a hello are always welcome.` |
| Form placeholders | subject: `Role or opportunity`; email: `you@company.com` | subject: `What is this about?`; email: `you@example.com` |

### 2.4 Working files you may create

- `design-review/` (screenshots and notes for the user). Add it to `.gitignore`.
- `design-source/` (the original full-size `profile.png` moved out of `public/` after you create optimised versions). Not served to the public.
- Throw-away test scripts live **outside** the repository (in a temporary directory) so `package.json` and `node_modules` stay unchanged.

## Part 3. What to learn from the old site

The old site is a well-organised, friendly template: app-like navigation, a blob-framed portrait, one-hue theming, and interactive sections. Its weakness is polish and ambition: a narrow 768 px column, flat equal cards with a generic shadow, no entrance or scroll motion, no visual rhythm between sections, and external dependencies (an icon-font CDN, a carousel library). Keep its **ideas**, rebuild each one at a much higher level, and do not port its code.

| Old pattern (what it actually did) | Keep as DNA | Elevate to |
|---|---|---|
| **Desktop nav:** a full-width fixed bar, logo left, text links right, theme icon, a shadow appearing after 80 px of scroll. | A persistent, quiet nav that gains presence on scroll. | A floating glass **pill** centred at the top with a sliding active-indicator, accent picker, theme toggle and a Contact call-to-action, plus a thin scroll-progress line. |
| **Mobile nav:** below 768 px the bar moves to the **bottom** of the screen; an "apps" icon slides up a rounded-top sheet (about 0.4 s) with a three-column grid of icon-over-label links and a close button; tapping a link closes it. | Thumb-reachable, app-like navigation. This is the best idea in the old site. | A floating glass **tab bar** (Home, About, Experience, Projects, Contact, More) with a sliding active bubble, and a proper **bottom sheet** for "More" with drag handle, backdrop, focus trap, Escape and swipe-down to close, safe-area padding, and the accent picker and CV link inside it. |
| **Scroll-spy:** the current section's link turns accent colour. **Scroll-up button** appears after about 560 px. | Both behaviours. | Scroll-spy via IntersectionObserver driving a sliding indicator and `aria-current`; the scroll-up button becomes a circular **progress ring** that fills as you scroll. |
| **Theme system:** one hue variable (250, purple) in HSL generates every tint; the comment lists alternates (green 142, blue 230, pink 340); dark mode overrides a handful of variables; sun/moon icon swap; choice saved. | One variable drives the whole palette, and the visitor can switch light/dark. | **OKLCH** tokens (even perceived lightness across hues, validated contrast) with **four accent presets** the visitor can pick (Part 4.2), saved in `localStorage`, plus a circular-reveal theme transition. |
| **Hero:** three-column grid: a vertical rail of social icons, the SVG **blob** with the portrait masked inside, then the text with the name in accent colour; a "Scroll Down" mouse cue; "Contact Me" button. | The blob-framed portrait, the social rail, the accent-coloured name, the scroll cue. | A cutout portrait whose head **pops out** of a living gradient blob, floating glass **identity chips**, a rotating role line, count-up stat strip, aurora background (Part 5.2). |
| **About:** portrait, three paragraphs, three counters (years, projects, internships), a "Download CV" button. | Short bio beside a few anchoring facts and a CV button. | A **bento grid**: bio with a second portrait, "beyond coursework", and a four-step data-lifecycle strip (Part 5.3). |
| **Skills:** accordion cards, one open at a time; each header has an icon, a title, a subtitle and a chevron that rotates 180 degrees. | The accordion with one-open-at-a-time on small screens. | A two-row **marquee** of skills for energy plus six group cards: fully open grid on desktop, the old accordion behaviour below 640 px (Part 5.7). |
| **Qualifications:** three icon tabs (Education, Experience, Awards) that switch content; an alternating two-column timeline with a dot and a hairline between entries. | Tabs for dense credential lists; a timeline with dot and line. | A **scroll-drawn timeline** for Experience and Education; accessible **tabs** with a sliding underline for Awards, Certifications and Leadership (Part 5.4, 5.8). |
| **Services and Hobbies:** icon cards with a "View More" link opening a centred modal containing a tick-list; fade in 0.3 s. | Icon-led cards. | Icon tiles with a unique micro-animation each. **No modals**: there is no extra content to hide, so do not invent any (Part 5.9). |
| **Projects:** Swiper carousel (arrows, bullets, keyboard, mouse wheel) of a picture, title, text and outlined Demo / Code buttons. | Browsable cards with clear actions. | Cards with generated **SVG cover art**, spotlight hover, quiet detail rows; a native scroll-snap carousel on phones, a grid on desktop. No library (Part 5.5). |
| **Contact:** an icon list (phone, email, location) beside a form with **filled** inputs: tinted background, small accent label above, accent underline; SweetAlert popup after sending. | Filled-style inputs, icon-labelled details. | Floating labels, live validation, character counter, loading state, animated success panel, copy-to-clipboard for the email (Part 5.10). |
| **Footer:** a solid accent-coloured band (near-black in dark mode) with name, three links and social icons, centred copyright. | A confident closing band. | An oversized gradient wordmark, link columns, back-to-top (Part 5.11). |
| **Small details:** styled scrollbar, smooth scrolling, arrow icons that nudge right on hover. | All three. | Keep, using theme tokens. |

**Do not carry over:** any text from the old site ("Full Stack Developer", services, volunteering items, the old project names), its images other than the user's own portrait, its social links, the Google Sheets form script, SweetAlert, Swiper, the Unicons CDN, or its CSS hacks (negative margins, fixed heights).

## Part 4. Design system

Build the system first (Phase 1), then the pages from it. Nothing in the pages should use a raw colour, size or duration; everything comes from a token.

### 4.1 Look and feel in one paragraph

Deep ink backgrounds with a slow-moving aurora of violet and teal light, a faint dotted graph-paper grid that fades toward the edges, translucent glass panels with fine borders, big confident display type, monospaced numerals for years, counts and labels, and soft accent glows under the things that matter (primary button, portrait, the card in view). The light theme is the same design in daylight: pearl white, tinted washes, deeper accent, the same glass. Both themes are first-class: design and screenshot both for every component.

### 4.2 Colour tokens (validated)

OKLCH gives every accent preset the same perceived lightness, so contrast stays predictable when the visitor changes accent. The values below were checked against WCAG AA for all four presets in both themes (lowest ratio 5.1:1 on light, 7.4:1 on dark; text on background, text on surface, muted text, accent text, secondary accent, and button label on accent). **If you change any lightness or chroma value, re-run a contrast check.**

```css
:root {
  /* Accent preset: Aurora (default). Presets below override only these two. */
  --hue: 255;
  --hue2: 190;

  /* Light theme (the :root default) */
  --bg:        oklch(0.985 0.006 var(--hue));
  --surface:   oklch(1 0 0);
  --surface-2: oklch(0.965 0.012 var(--hue));
  --line:      oklch(0.7 0.04 var(--hue) / 0.35);
  --text:      oklch(0.21 0.03 var(--hue));
  --muted:     oklch(0.46 0.03 var(--hue));
  --accent:    oklch(0.52 0.21 var(--hue));
  --accent-2:  oklch(0.50 0.12 var(--hue2));
  --on-accent: oklch(1 0 0);
  --glass:     oklch(1 0 0 / 0.62);
  color-scheme: light;
}

[data-theme="dark"] {
  --bg:        oklch(0.155 0.025 var(--hue));
  --surface:   oklch(0.205 0.03 var(--hue));
  --surface-2: oklch(0.25 0.035 var(--hue));
  --line:      oklch(0.4 0.05 var(--hue) / 0.45);
  --text:      oklch(0.96 0.01 var(--hue));
  --muted:     oklch(0.76 0.03 var(--hue));
  --accent:    oklch(0.76 0.15 var(--hue));
  --accent-2:  oklch(0.80 0.13 var(--hue2));
  --on-accent: oklch(0.15 0.03 var(--hue));
  --glass:     oklch(0.22 0.03 var(--hue) / 0.55);
  color-scheme: dark;
}

/* Accent presets, selected with <html data-accent="..."> and saved in localStorage key "accent" */
[data-accent="ocean"]  { --hue: 225; --hue2: 165; }
[data-accent="ember"]  { --hue: 35;  --hue2: 345; }
[data-accent="orchid"] { --hue: 330; --hue2: 265; }
```

Preset names shown to the user (as accessible labels on the swatches): **Aurora** (violet to teal, default, a nod to the old site's purple), **Ocean**, **Ember**, **Orchid**.

Derived tokens you add yourself (not validated, never used for body text): gradients (`linear-gradient(100deg, var(--accent), var(--accent-2))`), glow (`color-mix(in oklch, var(--accent) 40%, transparent)`), hover tints, a success green for the form's success state (`#34d399`; never used as a pulsing status dot) and an error red that passes 4.5:1 on both themes.

Rules:

- Body text is `--text`; secondary text is `--muted`; never lower the contrast of text for style.
- Text on glass must still pass 4.5:1. Glass alpha stays at 0.55 or more, and aurora blobs behind content stay at or below 0.55 opacity (dark) and 0.28 (light). Verify by sampling pixels behind text in screenshots.
- Gradient text (name, big numbers) is decoration on large type only (24 px or larger); the same words must also be readable if the gradient fails.
- Colour is never the only carrier of meaning (active nav item has a shape change as well, errors have text and icon).

### 4.3 Typography

| Role | Family | Use |
|---|---|---|
| Display | **Bricolage Grotesque** (600 to 800) | Name, section titles, big numbers, wordmark |
| Body | **Plus Jakarta Sans** (400 to 700) | Paragraphs, UI, buttons |
| Mono | **JetBrains Mono** (500 to 700) | Dates, counts, eyebrow labels, tags, counters |

Load with one Google Fonts stylesheet plus `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`, `display=swap`, only the weights above:

```text
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=JetBrains+Mono:wght@500..700&family=Plus+Jakarta+Sans:wght@400..700&display=swap
```

Confirm on the user's machine that this URL returns CSS (HTTP 200). If it does not, keep the family names and fall back to the stacks below; the design must still look good with fallbacks.

Fallback stacks: Display `"Bricolage Grotesque", "Segoe UI Variable Display", system-ui, sans-serif`; Body `"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif`; Mono `"JetBrains Mono", ui-monospace, "SF Mono", Consolas, monospace`.

Fluid scale (use `clamp()`; adjust by eye, keep the ratios):

| Token | Size | Notes |
|---|---|---|
| `--fs-display` | `clamp(2.6rem, 1.4rem + 5.4vw, 5.25rem)` | Hero name; line-height 1.02; letter-spacing -0.035em; weight 800 |
| `--fs-h2` | `clamp(2rem, 1.4rem + 2.6vw, 3.25rem)` | Section titles; letter-spacing -0.03em |
| `--fs-h3` | `clamp(1.15rem, 1.05rem + 0.5vw, 1.4rem)` | Card titles |
| `--fs-body` | `clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)` | Line-height 1.7; max line length 65ch |
| `--fs-small` | `0.875rem` | Meta text |
| `--fs-label` | `0.75rem` mono, uppercase, letter-spacing 0.06em | Eyebrows, tags, dates |

Numerals in counters and dates use mono with `font-variant-numeric: tabular-nums` so counters do not jitter.

### 4.4 Layout, space, shape

- Container: `width: min(1180px, 100% - 2 * clamp(1.25rem, 4vw, 2.5rem))`, centred. (The old site's 768 px column felt cramped; use the width.)
- Section rhythm: vertical padding `clamp(4.5rem, 3rem + 6vw, 8rem)`. Alternate subtle backgrounds (plain, then a faint `--surface-2` wash with a soft top and bottom fade) so sections read as chapters.
- Section header component (use everywhere): a mono index and eyebrow (`01 / About`), the h2 title, a one-line subtitle in `--muted` (the existing subtitles), and a short gradient underline that draws in on reveal.
- Spacing scale on a 4 px base: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Radius: 12 (inputs, chips), 20 (cards), 28 (large panels and sheets), 999 (pills and buttons where noted).
- Elevation: layered soft shadows tinted by the accent, never pure black, never heavy. In light theme keep them very light.
- Glass recipe: `background: var(--glass); backdrop-filter: blur(16px) saturate(1.4); border: 1px solid var(--line);` plus a fallback inside `@supports not (backdrop-filter: blur(1px))` that uses `--surface` at 0.94 alpha.
- Breakpoints: 640 (phone to large phone), **1024 (navigation switches between tab bar and floating pill)**, 1280. Design mobile first.
- z-index scale: atmosphere -1, content 1, nav 50, sheet backdrop 80, sheet 90, toast 100, scroll-progress 110.

### 4.5 Iconography

One consistent family: **inline SVG sprite** (a hidden `<svg>` with `<symbol>` entries, referenced with `<use>`), 24 px grid, 1.75 px stroke, round caps and joins, `currentColor`. No icon fonts, no CDN. Needed icons: home, user, briefcase, folder (or layers), sparkles (or cpu), graduation-cap, trophy, heart (or smile), mail, phone, map-pin, linkedin, github, download, arrow-right, arrow-up-right, arrow-up, sun, moon, palette, grid (for More), check, copy, send, x, chevron-down, menu. Prefer copying the paths from the `lucide-static` package (ISC licence) using a one-off temporary install outside the repo; if the network is unavailable, draw them by hand in the same style. Decorative icons get `aria-hidden="true"`; icon-only buttons get an `aria-label`.

### 4.6 Atmosphere (the "living background")

A single fixed, non-interactive layer behind everything (`position: fixed; inset: 0; z-index: -1; pointer-events: none`):

1. **Aurora:** three large soft blobs (accent, accent-2, and a third at `hue + 60`) made with `radial-gradient(closest-side, colour, transparent)` shapes, **not** `filter: blur()` (blur on large layers is expensive on phones). Each drifts slowly with a `transform` animation of 24 to 36 seconds. Lower opacity in light theme.
2. **Graph-paper dots:** a repeating radial-gradient dot grid (about 26 px pitch, `--line` colour) masked with a radial gradient so it fades toward the edges. It is strongest behind the hero.
3. **Grain:** an inline SVG `feTurbulence` noise as a data URI at 3 to 5 percent opacity over the page, to remove gradient banding and add tactility.

Everything in this layer stops (static) under `prefers-reduced-motion`.

### 4.7 Motion tokens

```css
:root {
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-1: 150ms;  /* hover, press */
  --dur-2: 280ms;  /* small transitions */
  --dur-3: 480ms;  /* panels, sheets */
  --dur-4: 760ms;  /* reveals */
}
```

Animate only `transform`, `opacity` and (for the accordion) `grid-template-rows`. Never animate `width`, `height`, `top`, `left` or `box-shadow` in loops. Part 6 has the behaviour rules.

## Part 5. Page architecture and components

Priority tags: **[MUST]** is required for the redesign to count as done. **[SHOULD]** is expected unless it hurts performance, accessibility or clarity (then skip it and say so in the final report). **[STRETCH]** only if everything else is polished.

### 5.0 Document skeleton [MUST]

Order inside `<body>`: skip link, hidden SVG icon sprite, atmosphere layer, scroll-progress bar, `<header>` (top bar, desktop pill, mobile tab bar, "More" sheet), `<main>` with the nine sections in contract order, `<footer>`, back-to-top button, toast live region, then `js/tracker.js` and `js/main.js` (in that order).

In `<head>` (in this order): charset, viewport, title and description (unchanged), Open Graph and Twitter-card tags, `theme-color` metas, favicon links (unchanged), font preconnect and stylesheet, `css/styles.css`, a `<link rel="preload" as="image" imagesrcset="..." fetchpriority="high">` for the hero portrait, and the tiny **inline theme gate** from Appendix B (S2) so the correct theme and accent are set before first paint (no flash of the wrong theme). The gate also adds class `js` to `<html>`; hidden-until-revealed styles are only ever written under `.js` so the page is fully visible without JavaScript.

Use real landmarks (`header`, `nav` with `aria-label`, `main`, `footer`), one `<h1>`, then `h2` per section and `h3` per card. Every `<img>` has `alt`, `width` and `height`; only the hero portrait is eager, everything else lazy.

### 5.1 Navigation [MUST]

**Desktop, 1024 px and up: the floating glass pill.**

- Centred, `top: 14px`, height about 56 px, glass recipe, fully rounded, soft accent-tinted shadow. Contents left to right: gradient monogram **TS** (links to `#home`), the same links as today (About, Experience, Projects, Skills, Education, Achievements), an accent-picker button, the theme toggle, and **Contact** as an accent-filled call-to-action inside the pill. Hobbies is reachable from the footer and the mobile sheet.
- **Sliding active indicator:** one soft accent-tinted pill behind the links that glides to the active link (JS measures `offsetLeft` and `offsetWidth`; the indicator may transition `width` because it is a single tiny element). Active state is also a shape change, plus `aria-current="location"`.
- **Scroll-spy** with IntersectionObserver on the nine sections (the old site's behaviour, done without scroll listeners).
- After 24 px of scroll the pill tightens slightly and its shadow strengthens (the old site's "shadow after scroll").
- **Scroll-progress line:** a 3 px gradient bar fixed to the top of the viewport, `transform: scaleX(var(--scroll))`, updated in `requestAnimationFrame`.
- **Accent picker:** a palette-icon button opens a small glass popover containing four swatches as a `role="radiogroup"` (Aurora, Ocean, Ember, Orchid) with visible selected state; choosing sets `data-accent` on `<html>` and saves `localStorage.accent`. Escape and outside-click close it; focus returns to the button.
- **Theme toggle:** sun and moon icons morph or cross-fade; the switch uses the circular-reveal View Transition in Appendix B (S4) with an instant fallback.

**Mobile and tablet, below 1024 px: the old site's best idea, rebuilt.**

- A slim transparent **top bar**: monogram on the left, theme toggle on the right (44 px targets).
- A floating glass **tab bar** fixed to the bottom, inset 12 px from the edges plus `env(safe-area-inset-bottom)`, radius 24, with six slots: **Home, About, Experience, Projects, Contact, More**. Icon above a 10 to 11 px label. The active tab has a sliding bubble. If "Experience" cannot fit at 320 px, shorten that one label to "Work". Give `<body>` bottom padding for the bar's height plus safe area so the bar never covers content or the footer.
- **More** opens a **bottom sheet**: rounded top (28 px), drag handle, dimmed blurred backdrop, a three-column grid of icon tiles (Skills, Education, Achievements, Hobbies), then the accent picker row, then a **Download CV** button, and a close button. Behaviour: slides up with `transform` over `--dur-3` and `--ease-out`; `role="dialog"`, `aria-modal="true"`, labelled; focus moves into the sheet and is trapped; Escape, backdrop tap, close button and a downward swipe all close it; tapping a link closes it and scrolls to the section; focus returns to the More button; the page behind is `inert` (or `aria-hidden` if `inert` is unsupported) and does not scroll.
- While a form field is focused on a phone, hide the tab bar (so the on-screen keyboard does not push it over the form) and show it again on blur. **[SHOULD]**

### 5.2 Hero [MUST]

Layout: two columns on desktop (text about 7/12, portrait stage about 5/12), single column on mobile.

Left column, top to bottom:

1. **Location chip:** a quiet glass pill with a map-pin icon and the existing text `Goa, India` (word for word from the Contact details) in mono capitals. No dot, no pulsing, no colour that signals a status.
2. **H1:** `Hi, I'm Taranjot Singh` at `--fs-display`; the name has the accent-to-accent-2 gradient and a single light sweep on load (once, not looping).
3. **Role line:** the HTML contains the full static phrase `Data Analytics & Machine Learning`. With JavaScript and motion allowed, enhance it into a rotator that cycles through three phrases taken from the existing copy: **Data Analytics**, **Machine Learning**, **Business Insight** (word-swap with a short slide and fade, about 2.6 s each, container width reserved so nothing shifts). Screen readers get the static phrase; the rotating spans are `aria-hidden`. Under reduced motion show the static phrase.
4. **Lead paragraph:** the existing text with the one edit in 2.3, `--muted`, max 52 characters wide.
5. **Buttons:** primary **Contact me** (gradient, accent glow, arrow that nudges on hover, magnetic pull on desktop with a fine pointer, 6 px maximum) and secondary **Download CV** (glass, download icon, `download` attribute). Both at least 48 px tall. Download CV is a quiet secondary action: it must never be the loudest thing on the screen.
6. **Socials:** LinkedIn, GitHub, Email as 44 px glass icon buttons with `aria-label`s and tooltips. **[STRETCH]** On screens 1280 px and wider, a thin vertical social rail at the left edge, echoing the old site.
7. **Scroll cue** (desktop only, hides after 80 px of scroll): a mouse outline with a moving wheel dot and the word "Scroll", linking to `#about`.

Right column, the **portrait stage** (a square-ish box, `max-width: 520px`, `aspect-ratio: 1 / 1.12`):

- **Blob:** the old site's blob silhouette (path in Appendix C) filled with a gradient from `--accent` through a mid-tone to `--accent-2`, with a soft accent drop-shadow. **[SHOULD]** Morph it slowly between two or three hand-authored variants with identical path commands, or, if that is fiddly, keep the shape and slowly rotate and breathe the gradient. Static under reduced motion.
- **Dashed orbit ring** around the blob rotating once per 40 s (`transform` only).
- **Portrait:** the optimised cutout, centred on the bottom of the stage, **taller than the blob so the head and turban pop out above it** (this depth is the signature of the hero). The photo's own frame cuts off the shoulders at the left, right and bottom, so you must hide those hard edges with a feathered mask. This composite mask was tested and works:

  ```css
  .portrait {
    -webkit-mask-image:
      linear-gradient(to bottom, #000 80%, transparent 99%),
      linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%);
    -webkit-mask-composite: source-in;
            mask-image:
      linear-gradient(to bottom, #000 80%, transparent 99%),
      linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%);
            mask-composite: intersect;
  }
  ```

  If the supplied image turns out to be opaque (no alpha channel), do not pop it out: crop it into the blob with `object-fit: cover` and `clip-path`, and say so in your report.
- **Identity chips** (glass pills, each a small line icon and a short label copied word for word from the existing text; Appendix A.3): `Founder, Hack Unicorn Club`, `LinkedIn Content Creator`, `Goa Institute of Management`. They float around the stage with an offset 6 s bob (transform only) and are the **only** floating elements around the portrait: they say who he is, never a result. **They must never cover the face.** Keep the central 40 percent of the portrait's width and the top 55 percent of its height clear. On phones, do not overlay chips at all: show them as a tidy centred stack of small pills beneath the portrait (three short rows is fine).
- **Pointer parallax** (desktop with a fine pointer only): the portrait, blob and chips shift and tilt by a few degrees at different depths following the pointer, eased; off for touch and reduced motion. **[SHOULD]**
- On phones the stage is compact, and sized from the viewport height so short screens still fit (for example a stage width of `clamp(190px, 29svh, 240px)`; the portrait pops out taller than the stage, about 240 to 290 px). Order: portrait, the three chips, the location chip, the headline, the role line, the lead, the buttons. In a prototype this order showed the face, chips, headline and role line above the tab bar at 390 x 680 (the viewport size to plan for inside LinkedIn's in-app browser, with its own toolbars) and also the primary button at 390 x 844. Keep to that: the **face, the chips, the headline and the role line** must be visible at 390 x 680, and the primary button at 390 x 844. If that proves impossible, shrink the stage first; only as a last resort put the text first and the portrait below (the face is part of the welcome).

**Stats strip** below the hero: four glass cards (3 Internships, 3 Projects, 14K+ Students impacted, 16K+ LinkedIn followers; exactly the current numbers and labels) with mono numerals that **count up** the first time they are 60 percent visible (Appendix B, S3). Final values are in the HTML, so no-JavaScript and reduced-motion users see the real numbers. Two columns on phones. Keep the strip visually quiet (compact, no glow): context for the visitor, not a scoreboard.

### 5.3 About [MUST]

A **bento grid** (12 columns on desktop, one column on phones). Keep both existing paragraphs whole; do not split or reword sentences.

- **Tile A (wide):** the first paragraph, set larger. Underline the phrases "SQL and Python" and "machine learning" with a drawn gradient highlight. **[SHOULD]** A small second portrait (the same optimised file, masked into a circle or a mini blob) sits beside the paragraph so the visitor sees a face while reading about him.
- **Tile B:** the second paragraph ("Beyond coursework...") with three small icon chips: Hack Unicorn Club, Smart India Hackathon, 16,000+ LinkedIn audience (all words already in that paragraph).
- **Tile C (full width):** a **data-lifecycle strip** built from the first paragraph's own words: Data curation, Feature engineering, Machine learning, Decisions for business teams. Four nodes joined by a line that draws itself when revealed, with a small travelling dot.
- **Tile D:** actions: **Contact me** (primary), LinkedIn and GitHub links, and Download CV as a quiet text link.

### 5.4 Experience [MUST]

Two columns on desktop (timeline about 8/12, sticky journey panel about 4/12), one column on phones. The section reads as a **story in three chapters**, newest first, in the words Taranjot wrote.

- **Timeline:** a vertical track with a **scroll-drawn progress line** (Appendix B, S7: a CSS variable `--p` from 0 to 1 sets the filled height) and a node for each role; the node of the card nearest the viewport centre glows.
- **Cards** (glass, radius 20, lift on hover): a gradient monogram badge (E, M, T), the role as `h3`, the company and location line, the dates as a mono pill, then **all existing bullets in full, always visible** (a visitor who clicked through wants the whole story; never collapse them). Bullets get small gradient tick markers. **All three cards are identical in size, border and emphasis:** no featured card, no key-result chips, no highlighted figures. The numbers stay ordinary text inside their bullets.
- **Journey panel** **[SHOULD]** (desktop only, `position: sticky`): one large mono year (2026, 2025, 2024, taken from the dates of the card currently in view) with that card's existing company name as a small caption, cross-fading as the visitor scrolls, and three small dots showing which chapter is current. It is decorative (`aria-hidden`) because the information is in the cards.

### 5.5 Projects [MUST]

Three cards, each with **generated SVG cover art** (no screenshots exist, and none may be invented). Hand-author each as inline SVG, `aria-hidden`, 3 to 5 KB, in the theme's accent colours:

| Project | Cover motif |
|---|---|
| Bank Customer Churn Prediction | Two curves, "retained" and "churned", diverging over a faint grid, with a dotted funnel and a few scattered dots |
| Tandarust | A heartbeat line passing through a glowing ring with small arcs suggesting body motion |
| Behavioural Insights Engine | A cluster of translucent topic bubbles in accent and accent-2, joined by thin lines, with a small sentiment gradient bar |

Card anatomy: cover (16:10), mono meta line (the existing "2025 · End-to-end ML pipeline" text etc.), `h3`, description unchanged, a **quiet detail row** in mono, no larger than the tag chips, using numbers already in the text (Churn: 92% accuracy, 76% recall; Tandarust: 97.4% accuracy, 12,000+ exercises; KPMG project: none, show its tags only), tag chips, and the existing "View code" link (the KPMG card has no link and gets none).

Interaction: on hover or keyboard focus the card lifts, a **pointer spotlight** (a radial highlight following the cursor through `--mx` and `--my`) lights the surface, and the cover art animates (lines draw, bubbles drift). Tilt of at most 4 degrees on fine pointers only.

Layout: three equal columns from 1024 px. Below 1024 px a **native scroll-snap carousel** (the old site's Swiper idea without the library): cards about 82 vw wide (maximum 360 px) so the next card peeks, `scroll-snap-type: x mandatory`, a dot indicator synced with IntersectionObserver, and previous/next buttons from 768 px up. The scroll region is focusable with an `aria-label`.

### 5.6 Global widgets [MUST unless marked]

- **Skip link** ("Skip to content"), visible on focus.
- **Back-to-top** button appearing after 560 px of scroll (the old site's threshold), drawn as a circular **progress ring** that fills with page progress; on mobile it sits above the tab bar.
- **Toast** live region (`role="status"`), used for "Copied".
- **Cursor glow** **[SHOULD]**: on fine pointers with motion allowed, a very soft accent radial gradient (about 360 px) follows the pointer with easing, behind content. Never replace or hide the real cursor.
- **Scrollbar** (a thin one, styled with theme tokens, as in the old site), `::selection` in an accent tint, and a visible focus ring everywhere (`:focus-visible`, 2 px accent outline with 2 px offset).
- **Anchors:** `scroll-padding-top` large enough to clear the pill (about 96 px) so section titles are never hidden; `scroll-behavior: smooth` only when motion is allowed.

### 5.7 Skills [MUST]

- **Marquee [SHOULD]:** two rows of skill chips drifting in opposite directions (about 40 s per loop), edges masked to fade, **paused on hover and keyboard focus**. Each row's duplicated second half is `aria-hidden`. Under reduced motion it becomes a static wrapped list.
- **Six group cards** with their existing headings (Programming, Machine Learning, Analytics & BI, Cloud & Databases, Web & Dev Tools, AI & Productivity), a line icon each, and every existing chip, unchanged. Desktop: a 3 by 2 grid, each card with a hover glow. **Below 640 px: the old site's accordion**, one open at a time, header with icon, title and a chevron that rotates 180 degrees, first group open by default; animate height with the `grid-template-rows` technique in Appendix B (S5); use real `<button aria-expanded aria-controls>`. Without JavaScript every card is open.

### 5.8 Education and Achievements [MUST]

- **Education:** a 2 by 2 grid of cards (one column on phones) instead of the table, in the same order. Each card: programme as `h3`, institution, years as a mono pill, and the score or distinction as a highlighted mono badge (the exact existing text, for example `5.78 / 8 CGPA`). A thin accent line draws across the top of each card on reveal.
- **Achievements:** the old site's tab idea, done properly. Three tabs, **Awards, Certifications, Leadership & Volunteering**, as an accessible tablist (`role="tablist"`, `tab`, `tabpanel`, roving `tabindex`, Left, Right, Home and End keys) with a **sliding underline** and a small count badge computed from the DOM. Awards is the default tab. Each item is a glass row: mono year tag, title, one-line description (all existing text). The panel change is a short fade and slide (`--dur-2`). On phones the tablist scrolls horizontally if needed. Without JavaScript all three panels show stacked with their headings.

### 5.9 Hobbies [MUST]

Four icon tiles (2 by 2 on phones): Startups & Business, Cricket, Chess, Punjabi Music, with their existing text. Each has a gradient icon disc and its own small **CSS-only** micro-animation on hover and, on touch screens, once on reveal: growing bars (startups), a bouncing ball with a turning seam (cricket), a tilting piece over two flipping squares (chess), a dancing equaliser (music). Simple geometric SVG in the shared icon style. **No modals and no extra copy.** This is the most personal section: give it the most generous spacing and playfulness on the page, because it is where a visitor meets the person behind the profile. On touch screens, tapping a tile replays its micro-animation.

### 5.10 Contact [MUST]

The heading keeps the words **Get in Touch** (the smoke test needs them) and the subtitle as edited in 2.3.

- **Left panel:** the email as a large display-font link with a **Copy** button (Clipboard API with a fallback; shows the toast "Copied"), then icon rows for phone (`tel:` link), location, LinkedIn and GitHub (all existing details). **[SHOULD]** Show the portrait once more as a small circular avatar (the same optimised file) above the email, so the visitor says hello to a face. No availability dot, no status badge.
- **Form card (glass):** keep every field, name, limit and the honeypot from the contract. Use **floating labels on filled-style inputs** (the old site's tinted fields with an accent underline), keeping the current placeholder texts (with the two placeholder edits in 2.3). Inline validation using exactly the server's wording: `Please enter your name.`, `Please enter a valid email address.`, `Please write a message of at least 10 characters.`, shown on blur and on submit with text and icon (not colour alone). A live character counter on the message (mono, `0 / 3000`). Add `autocomplete="name"` and `autocomplete="email"`.
- **Submit button:** gradient, send icon, shows a spinner and disables while sending (the existing `Sending...` status text stays in `#formStatus`). On success the card shows an animated success panel (a checkmark drawing itself) **and** `#formStatus` carries exactly `Thanks! Your message has been sent.`; include a "Send another message" button. On failure the card gives a short shake (not under reduced motion) and `#formStatus` shows the error text.
- The submit logic itself (JSON body, `elapsed`, response handling) follows the contract in 2.2 exactly.

### 5.11 Footer [MUST]

A confident closing band: an oversized **gradient wordmark** "Taranjot Singh" in the display face (large enough to feel like a poster, clipped gently at the bottom), a row linking to every section including Hobbies, LinkedIn, GitHub and Email icons, a Back to top link, then `© <current year> Taranjot Singh. All rights reserved.` and the privacy sentence from the contract. The year is filled by JavaScript with a static fallback in the HTML.

### 5.12 Extras

- **`404.html`** **[SHOULD]** in the same design (headline, short friendly line, a button home). Netlify serves `public/404.html` automatically.
- **Open Graph image** **[SHOULD]** `public/assets/img/og-image.png`, 1200 x 630: render an HTML template with the name, the role line `Data Analytics & Machine Learning` and the portrait on the aurora background (no numbers and no availability text; keep the name large and the face clear, because LinkedIn shows this image when the address is pasted into a post or message), screenshot it, and reference it in `og:image` and `twitter:image`. These need an absolute URL: ask the user for the final site address at the Phase 4 checkpoint and keep it in one place; if unknown, finish everything else and tell the user the one line to change.
- **Structured data** **[SHOULD]**: a small JSON-LD `Person` block (`name`, `description` taken from the hero lead as edited in 2.3, `knowsAbout` Data Analytics and Machine Learning, `alumniOf` the Goa Institute of Management, `sameAs` LinkedIn and GitHub; no `jobTitle` and no hiring-related fields). Do **not** put the email address or phone number in it.
- **`site.webmanifest`** **[SHOULD]**: give it a `name`, `short_name`, and `theme_color` and `background_color` matching the dark `--bg`; keep the icon paths.
- **`theme-color` metas** for light and dark; update dynamically when the visitor toggles the theme **[SHOULD]**.

## Part 6. Motion and interaction rules

1. **Motion explains or rewards; it never just decorates.** One signature idea per section. If the hero feels busy or drops frames, remove loops in this order: blob morph, ring rotation, chip bobbing.
2. **Reveal system:** elements marked `.reveal` fade and rise 24 px once, staggered 70 ms apart through a `--i` variable, triggered by IntersectionObserver (Appendix B, S3). Section titles draw their gradient underline; cards stagger. Nothing re-animates on scroll back.
3. **Looping animations** (aurora drift, ring, chip bob, marquee, equaliser) use only `transform` and `opacity`, are slow, and **pause when off-screen** (toggle `animation-play-state` with IntersectionObserver) and when the tab is hidden.
4. **Pointer effects** (parallax, tilt, magnetic buttons, spotlight, cursor glow) run only under `@media (hover: hover) and (pointer: fine)`. Every hover effect has a `:focus-visible` equivalent. Tap targets are at least 44 by 44 px.
5. **Reduced motion** (`prefers-reduced-motion: reduce`): no transitions or animations beyond instant state changes; aurora, ring, blob and marquee static; role rotator static; counters show final values; no parallax, tilt, magnetic effect, cursor glow, shake or View Transition; `scroll-behavior: auto`. The page must look finished, not broken, in this mode.
6. **No scroll-jacking, no scroll-snapped full pages, no preloader or splash screen, no autoplaying media, no custom cursor replacement.**
7. `content-visibility: auto` with `contain-intrinsic-size` on below-the-fold sections is welcome **[SHOULD]**; if it breaks the sticky journey panel or anchor offsets, drop it.

## Part 7. Engineering and quality rules

### 7.1 Structure

- `public/css/styles.css`: one file, organised with cascade layers in this order: `@layer reset, tokens, base, layout, components, sections, utilities, motion;`. Target no more than about 60 KB unminified.
- `public/js/main.js`: vanilla, loaded after `tracker.js` as `<script type="module" src="js/main.js">` (or a single IIFE if you prefer). Target no more than about 35 KB unminified. **Initialise every feature independently**: wrap each `init` in `try/catch` and `console.warn` on failure, so one broken feature never stops the form or the navigation.
- For `elapsed`, use `performance.now()` (milliseconds since the page started loading), which satisfies the server's 1500 ms rule and is accurate even though the module runs deferred.
- Naming: clear semantic class names; no framework utility soup. Comment the *why* of anything non-obvious. No dead code, no leftover debug logging.

### 7.2 Browser support and progressive enhancement

Last two versions of Chrome, Edge, Safari (iOS 16 and up) and Firefox. Feature-detect with `@supports` or JavaScript for: `backdrop-filter` (solid fallback), `oklch()` and `color-mix()` (provide a hex fallback block for the default Aurora palette), `mask-composite` (fall back to the bottom-only fade), View Transitions (instant theme switch), `inert` (fall back to `aria-hidden`). The page must be **complete and readable with JavaScript disabled** (all content visible, anchors working, accordion and tabs expanded); add a `<noscript>` line near the form: "The contact form needs JavaScript. Please email me directly."

### 7.3 Accessibility (WCAG 2.2 AA)

Keyboard reaches and operates everything in a logical order; focus is always visible; the sheet traps focus and returns it; tabs follow the ARIA tabs pattern; accordion uses buttons with `aria-expanded`; decorative SVG and duplicated marquee text are hidden from assistive tech; headings are in order; link text is meaningful; form errors are associated with fields (`aria-describedby`, `aria-invalid`); status messages use live regions; colour is never the only signal; text spacing and 200 percent zoom do not break layouts.

### 7.4 Images

Create `public/assets/img/profile-640.webp` and `profile-960.webp` from the supplied `profile.png`, **keeping the alpha channel**, quality about 82 (an 800 px wide WebP of this photo is about 40 KB; the original PNG is 1.4 MB). Use `srcset`, `sizes`, `width` and `height`, `fetchpriority="high"` and no lazy loading for the hero portrait. Use `sharp` through a temporary install outside the repository, or Python Pillow. Then move the original `profile.png` into `design-source/`. If the file is missing, build the stage with a gradient monogram "TS" instead and tell the user.

### 7.5 Performance budgets

On mobile with simulated slow 4G: Lighthouse **Performance 90 or more, Accessibility 95 or more, Best Practices 95 or more, SEO 95 or more**; LCP element (the portrait or headline) under about 2.5 s; cumulative layout shift under 0.05; first-load transfer without fonts under about 400 KB. If Lighthouse cannot run on this machine, say so and measure what you can (resource sizes, console, layout shifts through a `PerformanceObserver`).

### 7.6 Safety, privacy, git

- No third-party scripts, no inline event handlers, no new network calls other than the Google Fonts stylesheet. External links that open a new tab use `rel="noopener"`.
- If the folder is a git repository, work on a new branch `design-refresh` and commit at the end of each phase (never push, never touch remotes). If it is not a repository, first copy `public/` to `design-source/public-before-redesign/`.
- Keep the site working after every phase; never leave it half-converted between checkpoints.

### 7.7 Made for the LinkedIn in-app browser

Many visitors will open the link inside the LinkedIn app's built-in browser, which you cannot test directly. Assume the stricter case and build defensively. Each item must hold, and the simulation in Phase 5 proves it as far as it can.

- **Shorter, changing viewport.** The app's own toolbars take space and can collapse while the visitor scrolls. Size the hero with `min-height: 100svh` (a `100vh` declaration first as the fallback), never rely on `100vh` alone, and never assume the safe-area insets are non-zero: the fixed tab bar must look right when `env(safe-area-inset-bottom)` is 0.
- **Storage can be blocked.** Every `localStorage` and `sessionStorage` call, including the inline theme gate, is wrapped in `try/catch`. With all storage throwing, the page still renders, the theme follows the OS preference, and nothing breaks.
- **Browser APIs can be missing or denied.** Feature-detect `navigator.clipboard` (Copy falls back to `execCommand('copy')`; if that also fails, select the address text so it can be copied by hand and show no "Copied" toast), `document.startViewTransition` (instant theme change), `navigator.share` (never required) and `IntersectionObserver` (if absent, reveal everything at once).
- **Links can behave differently.** The CV link keeps its `download` attribute (contract) but must also work as a plain link that opens the PDF. External links keep `target="_blank" rel="noopener"`; nothing relies on `window.open` or pop-ups.
- **Touch first.** Nothing important depends on hover; every pointer effect either has a touch or keyboard equivalent or is purely decorative.
- **Link preview.** When the address is pasted into a LinkedIn post or message, the preview comes from the Open Graph tags and image (5.12). Include `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (absolute, 1200 x 630) and `og:image:alt`.

## Part 8. Phases and checkpoints

Keep a task list (one task per phase). Mark a phase done only after its checks pass. At every **CHECKPOINT**, save screenshots to `design-review/<phase>/`, summarise in a few lines what changed and what you want the user to look at, then **stop and wait**.

**Phase 0. Preflight and baseline**

1. Confirm you are in the right folder (`package.json` named `portfolio-platform`, `public/index.html` present).
2. Create the safety branch or copy (7.6).
3. Check the assets: does `public/assets/img/profile.png` exist, does it have an alpha channel, how large is it; does `public/assets/pdf/Taranjot-Singh-CV.pdf` exist? Report anything missing.
4. Read `public/index.html`, `css/styles.css`, `js/main.js` and `js/tracker.js`. Write back a short paragraph restating the contract in 2.2 in your own words so the user can see you understood it.
5. Start `npm run dev` and run `npm run smoke` for a baseline (12 of 12 expected; the database checks need the user's `.env`).
6. Set up the temporary browser-test tooling **outside the repository** (Playwright in a temp folder). Ask before downloading browser binaries. Take "before" screenshots at 1440 wide and 390 wide into `design-review/00-before/`.

**CHECKPOINT 0:** report the baseline and the asset status. Wait for "go".

**Phase 1. Foundations**

Tokens (4.2), fonts (4.3), base styles and layers, icon sprite (4.5), atmosphere (4.6), motion tokens (4.7), utility classes, the reveal infrastructure, the inline theme gate in `<head>`, and the optimised portrait images (7.4). Build `design-review/style-tile.html` (outside `public/`, linking `../public/css/styles.css`) showing: colour swatches for all four presets in both themes, the type scale, buttons, chips, a glass card, the icon set and the section-header component.

**CHECKPOINT 1:** screenshots of the style tile in light and dark. Ask the user: is Aurora the right default accent, and do the fonts feel right?

**Phase 2. The shell**

Navigation in both modes including the bottom sheet and accent picker (5.1), the hero with stage, chips and stats strip (5.2), the footer (5.11) and the global widgets (5.6). Rewrite `main.js` with only the shell's behaviour plus the unchanged contact logic. Sections below the hero may still be in their old markup, so keep their old CSS rules in a clearly marked `/* LEGACY: delete in Phase 3 */` block at the end of `styles.css` so nothing looks broken between checkpoints.

**CHECKPOINT 2 (the direction check):** screenshots of the top of the page and the footer at 1440 and 390 wide, light and dark, plus one animated sequence description. This is where the user approves the look before you build everything else. Be ready to adjust colour, type, density and hero composition.

**Phase 3. Sections**

About (5.3), Experience with the journey panel (5.4), Projects with cover art and carousel (5.5), Skills (5.7), Education and Achievements (5.8), Hobbies (5.9), Contact with the form (5.10), `404.html`. Commit after each section. When the last section is converted, **delete the legacy CSS block and confirm nothing changed visually**. After the Contact section, verify the form end to end against the contract (use mocked network routes in the browser test so you do not create real messages or emails).

**CHECKPOINT 3:** full-page screenshots at 1440 and 390, light and dark. Ask for any section the user wants pushed further.

**Phase 4. Motion and polish**

Reveal choreography, counters, role rotator, parallax, magnetic buttons, spotlight, cursor glow, the circular theme transition, pausing off-screen loops, a complete reduced-motion pass, the OG image, JSON-LD, manifest and `theme-color` (5.12). **Ask the user for the final site address** for the absolute `og:image` URL.

**CHECKPOINT 4:** ask the user to review on a real phone (the site is reachable on the local network at `http://<computer-ip>:8888` while `npm run dev` runs, if the firewall allows) and in both themes, and, once a preview address exists, by opening the link inside the LinkedIn app.

**Phase 5. Quality assurance**

Run everything in the matrix below, fix what fails, and re-run until clean.

| Check | How |
|---|---|
| Viewports | 320x640, 360x740, 390x844, 390x680, 768x1024, 1024x768, 1280x800, 1440x900, 1920x1080: no horizontal scroll, nothing clipped, nothing overlapping; at 390x844 the hero face, headline and primary button are visible above the tab bar, at 390x680 the face, chips, headline and role line are |
| Themes and accents | Aurora in light and dark at every viewport; Ocean, Ember and Orchid in both themes at 1440 and 390 |
| Console | Zero errors and zero warnings on load, scroll and every interaction |
| Anchors and ids | Every `#anchor` resolves; no duplicate ids; every `<img>` has `alt`, `width`, `height` |
| Accessibility | axe-core (or equivalent): zero serious or critical issues; full keyboard pass including the sheet, tabs, accordion, accent popover and form; visible focus everywhere |
| Contrast | Sample pixels behind text on glass surfaces in light and dark; every text pair at least 4.5:1 (3:1 for large text) |
| Reduced motion | Emulate it: nothing animates, content complete |
| No JavaScript | Disable it: all content visible, anchors work, nothing broken |
| In-app browser simulation | Chromium with an iPhone profile (touch, 390x680), a throttled network, and an init script that makes `localStorage` and `sessionStorage` throw and deletes `navigator.clipboard`, `navigator.share` and `document.startViewTransition`: the page renders fully, the theme follows the OS, navigation, the sheet, tabs, accordion and form still work, and the console shows no uncaught errors |
| Language scan | Search the built `index.html`, `404.html`, `styles.css`, `main.js`, the OG image template, the manifest and the JSON-LD (case-insensitive) for `open to`, `looking for`, `seeking`, `hire`, `recruit`, `available for` and `opportunit`. The only acceptable hit is `real-time opportunity data` inside the existing Empower bullet. Report the result |
| Figure scan | Each Experience figure (`1.1M+`, `495,595`, `98.3%`, `59.5%`, `74% F1`, `13x`, `64%`, `79.8%`, `91.47%`, `143.74%`, `26.82%`, `37.20%`, `41.79%`, `15.5%`) appears in `index.html` only inside its own existing bullet and in no other file or element |
| Tracking | With `?track=1` exactly one `POST /.netlify/functions/track` per browser session and none on a reload; none on localhost without the flag; none with Do Not Track; `tracker.js` unchanged (`git diff` or checksum) |
| Contact form | Mocked routes: success (exact message, form reset), server error (error text shown), 429, network failure, honeypot present and off-screen, `elapsed` greater than 1500 in the payload, client validation messages match the server's |
| Smoke test | `npm run smoke` passes 12 of 12 |
| Syntax | `node --check` on every file in `public/js/` |
| Contract | Re-read 2.2 line by line and tick each row |
| Lighthouse | Targets in 7.5 (or state why it could not run) |
| Self-review | Score the page 1 to 5 on: first impression (the five-second hello), hierarchy (squint test), consistency of spacing and radius, restraint, delight, warmth (does it feel like meeting a person?). Fix every score below 4 |

**Phase 6. Report**

Give the user a concise handover: what changed, a list of the signature ideas per section, the files created and changed, the scores from the QA matrix, anything you skipped and why, how to change the default accent or turn a flourish off (name the exact CSS variable or function), and what the user still has to do (add the final site address to the OG tags if not given, replace the CV PDF if it changes, and, after deploying, paste the address into LinkedIn's Post Inspector to refresh the link preview and then add the address to the LinkedIn profile).

Also report (1) the audience-driven text edits from 2.3, exactly as applied, so Taranjot can veto any of them, and (2) where the page still feels thin on personality, as **suggestions only** (for example a short personal story, a favourite quote, a photo from a hackathon). Never write that content yourself.

## Part 9. Taste rules (what not to do)

- No lorem ipsum, stock photography, fake logos, fake testimonials, invented metrics or invented links.
- No job-seeking language or availability signals (pulsing status dots, "open to" badges, hire-me buttons), no scoreboard of results, nothing aimed at recruiters.
- No centred-everything layouts, rainbow gradients, neon on black, or emoji used as icons.
- No more than one dominant accent at a time; the secondary accent is a supporting tint.
- No text over busy imagery without a scrim; no gradient text on small type.
- No effect that hides content until hover; no information available only through animation.
- No layout shift when fonts, images or the rotator load.
- Do not copy the old site's wording, code, or layout hacks.
- If a flourish does not improve clarity or delight in the screenshot review, cut it.

## Part 10. Definition of done

- [ ] Contract in 2.2 fully intact; `tracker.js`, admin, backend, scripts and config files unchanged.
- [ ] All content word for word except the audience-driven edits in 2.3; no invented claims.
- [ ] No job-seeking wording or availability signal anywhere, and no Experience figure outside its own bullet (the language scan and figure scan in Phase 5 are clean).
- [ ] Both themes and all four accents look finished and pass contrast.
- [ ] Navigation works as a floating pill on desktop and as a tab bar with bottom sheet on mobile.
- [ ] Hero passes the five-second hello on a phone (including 390 x 680) and a laptop; the identity chips never cover the face.
- [ ] The in-app browser simulation (7.7) passes.
- [ ] Every section has its signature element from Part 5 (or a reported reason for skipping a SHOULD item).
- [ ] Contact form verified end to end (mocked); `npm run smoke` is 12 of 12.
- [ ] Reduced-motion and no-JavaScript modes verified.
- [ ] Performance, accessibility and best-practice targets met or honestly reported.
- [ ] Phase 6 report delivered; `design-review/` and `design-source/` are not part of the deployed site.

## Appendix A. Words and numbers you may use

### A.1 Numbers that may be design elements

Every number below already appears in the current `index.html`. Before using any number as a design element, search the original text; if it is not there, do not use it.

| Where | Value | Source in current copy |
|---|---|---|
| Hero stats strip (quiet, count-up) | `3` Internships, `3` Projects, `14K+` Students impacted, `16K+` LinkedIn followers | Current hero stats |
| Projects, quiet detail row | Churn: `92%` accuracy, `76%` recall. Tandarust: `97.4%` accuracy, `12,000+` exercises. KPMG project: none | Project descriptions |
| Experience journey panel | the years `2026`, `2025`, `2024` | Start dates of the three roles |
| Achievements tabs | the item count of each tab, computed from the DOM | The lists themselves |
| Section headers | mono indices `01` to `09` | Structural, not content |

### A.2 Numbers that must not be design elements

Every figure inside the three Experience cards (the figures from Empower GBS India, Metvy Net and To-Let Globe, for example `1.1M+`, `495,595`, `98.3%`, `59.5%`, `74% F1`, `13x`, `64%`, `79.8%`, `91.47%`, `143.74%`, `26.82%`, `37.20%`, `41.79%`, `15.5%`) stays exactly where it is, as ordinary text inside its own bullet. None of them becomes a chip, counter, panel, caption, tooltip, cover-art label, JSON-LD value, meta tag or image text. This keeps the visit about the person, not a scoreboard.

### A.3 Identity labels (hero chips, location chip and About chips)

All labels are copied word for word from existing text.

| Where | Label | Already appears as |
|---|---|---|
| Hero identity chip | `Founder, Hack Unicorn Club` | Leadership & Volunteering item heading |
| Hero identity chip | `LinkedIn Content Creator` | Leadership & Volunteering item heading |
| Hero identity chip | `Goa Institute of Management` | Hero lead and Education |
| Hero location chip | `Goa, India` | Contact details |
| About, tile B chips | `Hack Unicorn Club`, `Smart India Hackathon`, `16,000+ LinkedIn audience` | The "Beyond coursework" paragraph |

### A.4 Interface microcopy you may add

`Skip to content`, `More`, `Close`, `Menu`, `Scroll`, `Copy`, `Copied`, `Back to top`, `Send another message`, `Sending...` (already used), `Accent colour`, the four preset names `Aurora`, `Ocean`, `Ember`, `Orchid`, theme toggle labels (`Switch to dark theme`, `Switch to light theme`), the three form validation messages in 5.10, `The contact form needs JavaScript. Please email me directly.`, and the 404 page's few lines. The only other text changes are the audience-driven edits in 2.3. Anything else is content and stays frozen.

## Appendix B. Reference snippets (tested)

These were run in headless Chromium and behave as described. They are **reference implementations**: adapt names, hooks and tokens to your structure. The element ids used in them (`r0`, `c1`, `themeBtn`, `acc`, `tl`) are placeholders from the test page.

### S2. Inline theme and accent gate (goes in `<head>`, before the stylesheet)

Applies the saved or OS theme and the saved accent before first paint, and marks the page as JavaScript-capable so "hidden until revealed" styles can be scoped to `.js`.

```html
<script>
(function(){var d=document.documentElement,t=null,a=null;d.classList.add('js');
try{t=localStorage.getItem('theme');a=localStorage.getItem('accent')}catch(e){} /* storage may be blocked: fall through to the OS preference */
d.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(a)d.dataset.accent=a})();
</script>
```

### S3. Reveal on scroll and count-up numbers

```css
/* S3 reveal */
.js .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s var(--ease-out),transform .7s var(--ease-out);transition-delay:calc(var(--i,0)*70ms)}
.js .reveal.is-in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.js .reveal{opacity:1;transform:none;transition:none}}
```

```js
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* S3a: reveal once */
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
/* S3b: count-up; final text is already in the HTML, so no-JS and reduced-motion show the real value */
function countUp(el){const end=+el.dataset.count,suf=el.dataset.suffix||'';if(reduce){el.textContent=end+suf;return}
 const t0=performance.now(),dur=1200;(function tick(t){const p=Math.min(1,(t-t0)/dur),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(tick)})(t0)}
const cio=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target)}}),{threshold:.6});
document.querySelectorAll('.count').forEach(el=>cio.observe(el));
```

In the markup: `<span class="count" data-count="14" data-suffix="K+">14K+</span>`. The final value is already in the HTML, so no-JavaScript and reduced-motion visitors see the real number. Give counters `font-variant-numeric: tabular-nums` so digits do not jitter.

### S4. Circular-reveal theme switch (View Transitions, instant fallback)

```css
/* S4 view transition */
::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
::view-transition-new(root){animation:vt .7s var(--ease-out) both}
@keyframes vt{from{clip-path:circle(0 at var(--vt-x,50%) var(--vt-y,50%))}to{clip-path:circle(150vmax at var(--vt-x,50%) var(--vt-y,50%))}}
```

```js
/* S4 */
const root=document.documentElement;
function setTheme(next,x,y){const apply=()=>{root.dataset.theme=next;try{localStorage.setItem('theme',next)}catch(e){}};
 if(!document.startViewTransition||reduce){apply();return}
 root.style.setProperty('--vt-x',x+'px');root.style.setProperty('--vt-y',y+'px');document.startViewTransition(apply)}
themeBtn.addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();setTheme(root.dataset.theme==='dark'?'light':'dark',r.left+r.width/2,r.top+r.height/2)});
```

### S5. Smooth accordion without animating height

```css
/* S5 accordion */
.acc__body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s var(--ease-out)}
.acc__body>div{overflow:hidden}
.acc.is-open .acc__body{grid-template-rows:1fr}
```

```js
/* S5 */
accBtn.addEventListener('click',()=>{const open=acc.classList.toggle('is-open');accBtn.setAttribute('aria-expanded',open)});
```

### S7. Scroll-drawn timeline line

```css
/* S7 timeline */
.tl{position:relative;padding-left:30px;margin-top:80vh;margin-bottom:80vh}
.tl::before{content:"";position:absolute;left:8px;top:0;width:2px;height:calc(var(--p,0)*100%);background:linear-gradient(#7c5cff,#2dd4bf)}
.tl>div{height:200px}
```

```js
/* S7 */
const tl=document.getElementById('tl');let ticking=false;
function upd(){const r=tl.getBoundingClientRect(),mid=innerHeight*.6;tl.style.setProperty('--p',Math.min(1,Math.max(0,(mid-r.top)/r.height)).toFixed(3));ticking=false}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});upd();
```

## Appendix C. The old site's blob silhouette

The path below (viewBox `0 0 200 187`) is the blob outline used in the old site's hero. Use it as the base shape of the portrait stage and, if you morph it, author variants with the same number and type of path commands.

```text
M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 165.547 130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 129.362C2.45775 97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 -0.149132 97.9666 0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z
```
