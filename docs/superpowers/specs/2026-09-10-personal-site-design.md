# Personal site (goyal-anant.github.io) — design

## Purpose

Personal Jekyll site, equal weight blog + portfolio/about. Hosted on GitHub
Pages under `goyal-anant.github.io`.

## Reference / aesthetic (revised)

Comfortable, uncluttered, content-first — in the spirit of lenpaul.github.io,
sevko.io, and facaiy.com: generous whitespace, plain sans-serif type, simple
blue-link lists, no heavy chrome or decoration. No big bold hero headline —
that idea (michaelmonteleone.net-style) is dropped.

Per-section style borrowings:
- **Landing page** — minimal like sevko.io: vertically/horizontally centered
  small block (name/mark + nav list), lots of surrounding whitespace, no
  hero copy.
- **Blog list** — like thenumb.at: flat list, one row per post, date on the
  left in a muted/monospace style, a small separator (e.g. `»`), post title
  as a plain link.
- **Bookshelf** — like reetlago.github.io: each book rendered as a colored
  horizontal "spine" bar (title on the bar, a small rotated category/genre
  tag on the right edge), stacked with a slight overlap.
- **Date/time** — like chrislaco.com: a live-updating "Day, Month DD, YYYY
  H:MM AM/PM" clock, placed in the site header under the name/mark.
- **Overall comfort** — like lenpaul.github.io and facaiy.com: roomy line
  height and margins, simple top nav, no dense chrome.

## Architecture

Plain Jekyll, no prebuilt theme gem. Custom `_layouts` + `_includes`,
hand-written SCSS. Uses the `github-pages` gem so GitHub Pages builds
directly on push to `main` — no GitHub Actions workflow needed.

## Structure

```
_config.yml
_layouts/
  default.html   — shared <head>, nav include, clock include, footer include
  home.html      — minimal centered landing (sevko.io style)
  post.html      — single blog or rant entry
  page.html      — generic page (about, blog index, rant index, projects index)
_includes/
  nav.html       — Home / Blog / Bookshelf / Rant / Projects / About,
                    current-page highlighted
  clock.html     — live day/date/time text, updated client-side every second
  footer.html
  theme-toggle.html
_posts/          — blog posts (thenumb.at-style list on blog.md)
  one placeholder post
_rants/          — collection, short opinion posts, same list style as blog
  one placeholder rant
_projects/       — collection
  one placeholder project
_data/
  books.yml      — bookshelf entries: title, author, genre, link (optional)
assets/
  css/main.scss  — custom properties for color tokens, prefers-color-scheme
                    media query sets default, toggle overrides + persists;
                    .spine styles for the bookshelf list
  js/theme.js    — ~15 lines: read localStorage, else prefers-color-scheme;
                    toggle button flips value, writes localStorage, updates
                    a data-theme attribute on <html>
  js/clock.js    — ~10 lines: render current day/date/time into the clock
                    include, tick every second via setInterval
index.md    — Home (minimal landing)
blog.md     — lists _posts, thenumb.at-style rows
rant.md     — lists _rants, same row style as blog
bookshelf.md — renders _data/books.yml as spine bars
projects.md — lists _projects collection
about.md
```

## Nav

6 links in the header on every page: Home / Blog / Bookshelf / Rant /
Projects / About. Current page gets a highlighted/active state.

## Theming

CSS custom properties define light and dark palettes. `prefers-color-scheme`
media query sets the default. A small toggle button in the nav/footer lets
the visitor override; choice persists via `localStorage`. No JS framework —
plain CSS + vanilla JS.

## Live clock

A small vanilla-JS clock (`assets/js/clock.js`) renders the current day,
date, and time (e.g. "Thursday, September 10, 2026 6:38 PM") into the
`clock.html` include in the site header, ticking every second. Client-side
only — no server/build-time timestamp.

## Bookshelf

Books live in `_data/books.yml` (title, author, genre, optional external
link — e.g. Goodreads). `bookshelf.md` loops over them and renders each as a
colored "spine" bar (color keyed off genre), stacked with overlap, styled
after reetlago.github.io. No individual per-book pages — entries link out
externally if a link is given, otherwise are static text.

## Rant

A lightweight second post collection (`_rants`) for short opinion pieces,
separate from the main blog so the two streams don't mix. Same list styling
as the blog index (thenumb.at-style rows) — no separate visual treatment
requested.

## Content

Placeholder content everywhere at scaffold time (landing copy, one blog
post, one rant, one project, 2-3 sample books, about blurb) — real content
filled in afterward by the site owner.

## Deployment

Push to `main`. GitHub Pages repo setting: source = `main` branch, Jekyll
build (via `github-pages` gem, no custom plugins outside the GH Pages
allowlist, so no Actions workflow required).

## Testing

- `bundle exec jekyll build` succeeds clean (no warnings/errors) before any
  push.
- `bundle exec jekyll serve` locally: manually check all 6 nav destinations
  render, nav links work and highlight the current page, the theme toggle
  flips and persists across reload, the clock ticks, and the bookshelf
  spines render with distinct colors per genre.

## Non-goals

- No comments system, analytics, search, or tagging/category taxonomy
  beyond bookshelf genre.
- No CI/Actions pipeline — GitHub Pages' native Jekyll build is sufficient.
- No CMS or headless editing flow — content is edited as markdown/YAML
  files directly in the repo.
- No individual per-book pages/reviews — bookshelf is a flat list of spines.
