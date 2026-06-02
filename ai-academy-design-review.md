# AI Academy — Senior Design & UX Review

**Reviewer's framing:** companion to the code review. I went through this the way a design lead would: I looked at the committed screenshot, read the full design-token system, and read the markup for every primary surface (Home, Overview, Dashboard, Sidebar, Lesson) to judge the *information architecture*, the *navigation model*, the *design-system maturity*, and *accessibility* — not just "does it look nice." As before, this is written *to* you, so I explain the principle under each point, because the principle is the transferable part.

**One honesty note up front:** I could not render the live current build in my environment, so my *pixel-level* read leans on the committed `screenshot.png` plus the CSS tokens and the current component markup. The screenshot is **stale** — it shows an older 10-lesson, mostly-greyscale version, while your current code is Levels 0–5 with 40+ lessons and a far richer, more colorful redesign. So where I critique something visual that the markup/tokens suggest has already moved on (e.g. vibrancy), I flag it. The structural, IA, accessibility, and design-system findings are solid regardless, because those I read from the actual current source.

**Headline verdict:** the design is genuinely good — and like the code, it's well above "beginning stage." There is real *taste* here (the stated direction, "Apple Vision Pro depth + Duolingo polish + Khan Academy clarity," is exactly the right target for an AI course) and real *rigor* (contrast ratios documented in the code, reduced-motion handled universally *and* per-component, a 4px spacing scale, a per-level color system used consistently for wayfinding). Most of what follows is not "you got this wrong." It's "here is what's working and must be protected, here is where two design eras need to be consolidated into one, and here is the single information-architecture decision that will most affect whether this feels like a *platform*."

---

## 1. What's working (protect these)

I'm being specific so you know exactly what *not* to sand off in a redesign.

**The restraint is correct for an education product.** Your token file bakes in one rule repeatedly: *color and glow are for accents only, never behind body text; reading surfaces stay calm and high-contrast.* That is exactly right. The failure mode for "premium + colorful" edtech is decoration that fights legibility. You used color as a **wayfinding and energy** system (per-level hues, accent feature tiles, gradient hero text) while keeping the actual reading experience calm. That's the mark of someone who understands that in a *learning* product, comprehension beats spectacle. Principle: **decoration serves the content; the moment an effect competes with reading, it's a bug.**

**Accessibility is designed in, not bolted on.** This is rare even in shipped products:
- Contrast ratios are computed and written into the token comments (`--text-3: #6b7280 /* ~4.8:1 — meets WCAG AA */`). You *checked*.
- `prefers-reduced-motion` is handled twice: a universal `@media` override that neutralizes every keyframe, plus a documented instruction to gate decorative transition-motion per-component as defense-in-depth (because the universal rule only catches keyframe animations, not transition-driven transforms — you knew that distinction).
- The mobile drawer has a real focus trap (Tab cycles inside, Escape closes) and returns focus to the menu button on close, with a WCAG 2.4.3 citation in the code.
- ARIA is used correctly and sparingly: `aria-current="page"` on the active lesson, `aria-labelledby` tying section headings to their regions, `aria-hidden` on every decorative icon, `disabled` on locked nav items, and real accessible labels on icon-only and social buttons.

This is top-decile accessibility work. Principle: **accessibility is a design constraint you solve up front, like layout — not a checklist you bolt on before launch.**

**The information *scent* is strong.** A learner should always know where they are, what's done, and what's next, at a glance — and your sidebar delivers that: each lesson shows a clear status glyph (locked / done / current / available), earned stars, a "Code" badge where relevant, plus the running streak and overall progress bar at the top. Principle: **good navigation answers "where am I, what have I done, what's next" without the user having to click.**

**The Dashboard makes the next action obvious.** The single biggest UX win in any course product is collapsing "what do I do now?" into one tap. Your Dashboard leads with a hero "Continue / Start" card that drops the learner exactly where they left off, with the level and percent right there, and degrades to a celebratory "course complete" state. That's textbook. It also owns no state (pure `buildDashboardModel(progress)` selector), so it's correct for anonymous and signed-in users alike. Principle: **reduce decision cost — the primary screen should have one unmistakable next action.**

**The lesson experience is real instructional design.** The "I do / We do / You do" gradual-release flow with a phase stepper, the everyday-example callouts, the worked example, the hint ladder — this is a *pedagogy*, expressed in UI. Most "courses" are a video and a quiz. This is structured learning. Protect it.

**Per-level color as a consistent mental model.** L0 cyan → L1 electric → L2 indigo → L3 violet → L4 emerald → L5 pink, applied the same way in the sidebar, the home timeline, and the lesson chrome. A learner builds an unconscious map ("the green level is computer vision"). Principle: **a color system earns its keep when it means the same thing everywhere.**

---

## 2. Issues & opportunities, ranked

### 🔴 HIGH (information architecture) — Navigation has no memory or shareability

This is the design-side twin of the "no router" code finding, and it matters *more* for a learning product than for most apps, because learning happens across many sessions over weeks. Concretely, the missing URL layer breaks these specific UX moments:

- **A learner can't bookmark "where I was."** The Dashboard's Continue card mitigates this (genuinely good design instinct on your part), but it's a patch over a missing capability — the user is trusting your app to remember, instead of owning a URL they control.
- **Lessons can't be shared.** For a course that may run with cohorts, classmates, or a teacher, "here, do this lesson: `/learn/cv-build-cnn`" is a core expectation. Today every link is the homepage.
- **The browser Back button betrays the user.** People reflexively hit Back to "go up a level." In your app it leaves the course entirely. That's a small betrayal that erodes trust.
- **Refresh mid-lesson dumps them to Home.** Their *progress* is safe (localStorage/cloud — good), but their *place in the navigation* is lost.

**Fix:** add a client router and map real URLs to your views (`/`, `/dashboard`, `/learn`, `/learn/:lessonId`). Your data is already keyed by stable lesson IDs, so deep links nearly fall out for free. **Principle: in a multi-session product, the URL is the user's save point and their way to share — navigation that lives only in React state is navigation the user can't hold onto.**

### 🔴 HIGH (information architecture) — "Dashboard" vs "Overview" have overlapping purpose

You have two course-home surfaces and the boundary between them is fuzzy:
- **Dashboard** = personalized/dynamic (resume, momentum, recent wins, per-level cards).
- **Overview** = the full lesson catalog/grid (the screenshot).

For a *new* learner this reads as redundant — "which one is home?" — and the entry points reinforce the ambiguity: Home offers "Start the course" (→ Overview) *and* the Dashboard offers "Continue learning" (→ a lesson), so a user has to *learn your IA* before they can navigate it. That's cognitive overhead on the most important screens.

**Fix, pick one:**
1. **Merge** into a single "Home/Dashboard" that leads with the resume card and momentum, and presents the full curriculum as an expandable section or a secondary "All lessons" view. (This is what most modern course apps converge on, and it's the simpler mental model.)
2. **Or keep both but make the distinction unmistakable** in label and visual treatment — e.g. "My Progress" (dynamic) vs "Curriculum" (the map) — so the user instantly knows Dashboard = *me*, Overview = *the course*.

**Principle: every distinct screen in your IA must answer a distinct question. If a new user can't tell two screens apart in one sentence, you have one screen too many.** This is the single highest-leverage IA decision in the product.

### 🟠 MEDIUM (design system) — The breakpoint zoo

Across your CSS files there are roughly **sixteen different breakpoint values** — `380, 400, 440, 480, 560, 620, 640, 700, 760, 799, 800, 860, 900, 1024…` — with no shared scale. `799` and `800` both appear (almost certainly the same intent, written twice). There is no standard tablet breakpoint at `768`, the single most common device width. This is the classic signature of CSS that grew surface-by-surface: it *works*, but responsive behavior is inconsistent and fragile, and a layout bug can fall into the gap between two nearly-identical breakpoints.

**Fix:** define a **small, named breakpoint set** — e.g. `--bp-sm: 480px`, `--bp-md: 768px`, `--bp-lg: 1024px` — and use only those everywhere (PostCSS custom-media makes this clean: `@media (--bp-md)`). Three or four breakpoints handle 99% of layouts. **Principle: a responsive design needs a *system* of breakpoints, not a pile of one-off widths — fewer, named, and reused.** This is the biggest maintainability win available on the CSS side.

### 🟠 MEDIUM (design system) — Two token eras coexisting

There are effectively two design systems layered on top of each other:
- The **calm base** in `global.css`: `--shadow-xs/sm/md` (very subtle), the neutral palette, a cool cyan→indigo accent ramp.
- The **redesign layer** in `redesign-tokens.css`: dramatic `--elev-1..4` shadows with cool glow, glass tiers, vibrant accent families, gradients.

The redesign was added *on top of* the original rather than replacing it. The risk is visual inconsistency: one component reaches for the subtle `--shadow-sm`, the next for the glowy `--elev-3`, and surfaces end up speaking two different elevation languages on the same screen (some flat, some floating-glass). Same story for color — neutrals and the cool ramp live in `global.css`, the vibrant families in `redesign-tokens.css`.

**Fix:** consolidate to **one source of truth.** Decide on a single elevation language (I'd keep the richer `--elev-*` + glass for the premium feel, and delete or alias the old `--shadow-*`), one canonical color file, one type scale. Migrate components onto the survivors and remove the duplicates. **Principle: a design system's whole job is to be the single source of truth — the moment there are two ways to express "elevation," it has started to fail at that job.**

### 🟠 MEDIUM (visual) — The type scale is timid for a "premium" target

Your base headings step `h1 1.75rem (28px) → h2 1.2rem → h3 1.05rem`. The hero almost certainly overrides `h1` larger, but the *system's* steps are modest and the ratios between them are small, which reads as **flat hierarchy** — everything is "kind of big," nothing is *commanding*. "Clean" and "striking" are different things; right now you're firmly in clean. A premium edtech landing usually wants one genuinely large display size at the hero and more contrast between levels so the eye is led down the page.

**Fix:** adopt a deliberate **modular scale** (a ratio like 1.25 "major third" or 1.333 "perfect fourth") and let the hero display size be genuinely large (think 3–4rem on desktop). Keep body at 16/1.6 (that's right). **Principle: typographic *contrast* — not just size — is what creates hierarchy and the feeling of polish; a flat scale reads as flat design.** (Confirm against the live build, since the hero override may already address the top end.)

### 🟡 LOW (perception) — A wall of locks can feel like a gate, not a path

The Overview screenshot shows 9 of 10 lessons locked, each greyed with a lock icon on *both* the left status slot *and* the right edge. Two issues:
1. **The double lock glyph is redundant** — one lock communicates "locked"; two is visual noise.
2. For a *brand-new visitor still deciding whether to start*, a long column of greyed, double-locked rows can read as *gatekeeping* ("this is mostly forbidden to me") rather than *progression* ("look how much there is to unlock"). The chained-unlock model is pedagogically sound, but its *presentation* can demotivate at the exact moment you want to convert a visitor into a learner.

**Fix:** de-emphasize the locked state (subtler, still legible — you already show locked titles and concepts, which is good and *should* stay), drop the redundant second lock, and consider a small framing cue ("10 lessons · unlock as you go") that reframes locks as a journey rather than a barrier. **Principle: locked content should *invite* ("here's what's ahead") more than it *forbids* — gating is a mechanic, not a mood.**

### 🟡 LOW (credibility) — The committed screenshot is selling an old, weaker version of your work

`screenshot.png` (and likely the README that embeds it) shows the *previous* 10-lesson, mostly-greyscale design. Anyone evaluating this repo — a recruiter, a collaborator, a potential user landing on GitHub — sees a less impressive product than the one you actually built. That's a self-inflicted credibility cost.

**Fix:** regenerate the screenshot(s) against the current build, and show the *richer* surfaces — the 3D hero, the Dashboard, a real lesson with the phase stepper — not only the lesson grid. Ideally a small set (hero + dashboard + lesson) rather than one. **Principle: your shop window should display your *current* best work; a stale screenshot is the one design asset everyone sees first.**

### 🟡 LOW (mobile) — Validate top-bar density and touch targets at the smallest width

On mobile the top bar carries menu + brand + a Dashboard link + language switch + account menu. That's a lot of controls in a narrow bar. You *have* a `380px` breakpoint, so you've thought about it — this is a "go confirm on a real 360–390px device" item: nothing should wrap awkwardly, and every interactive target should be **≥44×44px** (Apple HIG / WCAG 2.5.5 touch-target guidance). **Principle: the smallest common phone width (~360px) is a first-class design target, not an afterthought.**

---

## 3. Navigation / IA recommendations (you emphasized this)

Pulling the through-line together, in priority order:

1. **Add routing with deep links** (the HIGH item) — bookmarkable, shareable, back/forward-safe, refresh-safe lesson URLs. This is the foundation everything else in the IA sits on.
2. **Resolve Dashboard vs Overview** (the other HIGH) — merge, or make the distinction unmistakable. Decide what your *one* home is.
3. **Strengthen the "you are here" signal on lessons.** You have a "Lesson X of Y" crumb — good; enrich it to tie back to the level/track ("Level 2 · Lesson 3 of 10") and make it a *link* back up to that level, so the lesson view participates in the hierarchy rather than being a dead end.
4. **Keep the chained-unlock model for beginners,** but consider (optional, pedagogy-dependent) whether more advanced learners can preview or "test out" of a level — strict linearity is great for novices and frustrating for the experienced. Not required; just a fork to be aware of as your audience widens.
5. **Keep the mobile drawer + focus trap** exactly as is — it's well done.
6. **Consider a global search / command palette** once the lesson count keeps growing (40+ already). "Jump to a lesson" becomes valuable past ~25 items. Not urgent, but it's where this is heading.

---

## 4. Design tooling & approach — keep / add / avoid

Parallel to the "languages" section of the code review.

**Keep:**
- **Plain CSS + design tokens.** Correct for this product — lightweight, fast, no runtime cost, full control. Don't let anyone talk you into a heavy approach.
- **Lucide icons.** Consistent, light, tree-shakeable. Good. (Nice touch hand-inlining the brand SVGs since Lucide dropped trademarked logos — no new dependency, no CDN.)
- **The per-level color system and the gradual-release lesson structure.** These are product-defining; protect them.

**Add (when the pain or scale justifies it):**
- **A named breakpoint convention** (PostCSS custom-media, or even just a documented set) — do this *soon*; it's the cheapest high-value cleanup (see MEDIUM).
- **One consolidated tokens file as the single source of truth** — and if you ever add a dark theme or a second brand, that's the moment to formalize tokens (Style Dictionary is the standard if it ever gets that serious; you almost certainly don't need it yet).
- **A states/component catalog** — a simple `/styleguide` route or Storybook. With 25+ activity components and growing, a visual catalog is how you *prevent* the two-eras drift from happening again: every component and every state (loading, empty, error, locked, done) visible on one page. This pays for itself fast on a component-heavy product.
- **A modular type scale** (see MEDIUM) — formalize the steps rather than hand-picking sizes.

**Avoid:**
- **A heavy UI component kit (MUI, Chakra, Ant).** It would *fight* your bespoke, tasteful system, drag in weight, and homogenize a look you've deliberately crafted. Your hand-rolled system is the right call and is *better* for this product's identity.
- **CSS-in-JS runtime libraries (styled-components / emotion).** Runtime cost and bundle weight to do what your static tokens already do. No.
- **Over-formalizing too early.** You don't need Figma-to-code pipelines, a design-ops process, or Style Dictionary yet. The right next steps are *consolidation* (one token source, named breakpoints, a styleguide route), not new machinery.
- **Redesigning the visual language.** It's good. The work here is *tightening and unifying* what exists and fixing the IA — not restyling.

---

## 5. Prioritized action list

1. **Resolve the Dashboard-vs-Overview IA** (HIGH, design-led). Decide your one "home." This is a thinking task more than a coding one — do it first because routing and labeling depend on the answer. (~half a day of decision + design)
2. **Add routing with deep-linkable lessons** (HIGH; pairs with the code review's router item). (~1–2 days)
3. **Consolidate to named breakpoints** (MEDIUM). Define 3–4, migrate, delete the rest. (~half a day)
4. **Consolidate the two token eras** — one elevation language, one color file, one type scale (MEDIUM). (~1 day, incremental)
5. **Adopt a modular type scale + a larger hero display size** (MEDIUM, visual). (~half a day; confirm against live build first)
6. **De-emphasize the locked state and drop the redundant second lock glyph** (LOW). (~1–2 hrs)
7. **Regenerate the screenshots** to show the current, richer UI (LOW but high credibility-per-minute). (~30 min)
8. **Stand up a `/styleguide` route** as you keep adding activities (ongoing, preventive). (~half a day to start)

Nothing here is "the design is bad." It isn't — it's tasteful, accessible, and pedagogically thoughtful, which is the hard part to get right and the part you nailed. The work above is the difference between a strong, cohesive *product* and a great-looking app that's quietly running two design systems and one ambiguous menu. Fix the IA, unify the tokens, and this reads as a genuine platform.

---

*Reviewed from the committed screenshot, the full token system, and the current markup for Home / Overview / Dashboard / Sidebar / Lesson. Pixel-level visual notes (type-scale weight, locked-wall perception) are informed inferences I'd confirm against the live build. Happy to go deeper on any one thread next — a concrete IA proposal for merging Dashboard/Overview, a named-breakpoint + token-consolidation plan, or a modular type scale with exact sizes.*
