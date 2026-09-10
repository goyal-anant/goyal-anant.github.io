# Personal Site (goyal-anant.github.io) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a working Jekyll personal site with Home, Blog, Bookshelf, Rant, Projects, and About sections, a light/dark theme toggle, and a live clock — buildable via `bin/jekyll build` (see Task 1) and deployable as-is to GitHub Pages.

**Architecture:** Plain Jekyll (no theme gem), custom `_layouts`/`_includes`, hand-written SCSS compiled by Jekyll's built-in Sass support, two vanilla-JS files (theme toggle, clock). Two post-like collections (`_posts` for Blog, `_rants` for Rant) share one `post.html` layout and one `post-list.html` include. Bookshelf is data-driven from `_data/books.yml`, no per-book pages. Task 1 also adds a `bin/jekyll` wrapper working around a local Ruby 4.0.6 / `github-pages` gem (Jekyll 3.9.0, pinned `liquid = 4.0.3`) incompatibility — see Global Constraints.

**Tech Stack:** Ruby 4.0.6, Jekyll 3.9.0 (pinned by the `github-pages` gem — not the standalone 4.4.1 gem), Bundler, plain SCSS, vanilla JS. No frameworks, no build tooling beyond Jekyll itself.

**Spec:** `docs/superpowers/specs/2026-09-10-personal-site-design.md`

## Global Constraints

- No prebuilt theme gem (minima, etc.) — custom layouts/includes/SCSS only.
- `Gemfile` uses the `github-pages` gem; no plugins outside the GitHub Pages allowlist.
- No GitHub Actions workflow — GitHub Pages' native Jekyll build handles deployment.
- No comments system, analytics, search, or tagging/category taxonomy beyond bookshelf genre.
- No individual per-book pages — bookshelf is a flat list of spine entries.
- Nav is exactly 6 links, always in this order: Home / Blog / Bookshelf / Rant / Projects / About.
- Theme toggle defaults to `prefers-color-scheme` and persists the visitor's override via `localStorage`.
- The clock is client-side only (no server/build-time timestamp).
- `bin/jekyll build` (see Task 1) must succeed with no errors before any commit that touches build output.
- **Ruby/Liquid compat ruling (made during Task 1 review):** `github-pages` gem hard-pins `liquid = 4.0.3` exactly, whose render path calls `String#tainted?` — a method Ruby removed in 3.2+ (this machine runs Ruby 4.0.6). Running `bundle exec jekyll build`/`serve` directly crashes with `NoMethodError: undefined method 'tainted?'`, regardless of layouts/content. Fix: a local-only compat shim (`lib/taint_compat.rb`, restores `tainted?`/`taint`/`untaint` as no-ops) loaded via `RUBYOPT` through a wrapper script (`bin/jekyll`), created in Task 1. **From Task 1 onward, every step below that says `bin/jekyll build` or `bin/jekyll serve` must actually be run that way — never as raw `bundle exec jekyll`** — the wrapper forwards all args to `bundle exec jekyll` after setting `RUBYOPT`. Local-machine-only: GitHub Pages' real build server runs its own pinned environment independent of this repo's local Ruby, so production deploys are unaffected, and the shim has no effect on rendered output.

---

### Task 1: Project scaffold (Gemfile, config, gitignore, Ruby/Liquid compat wrapper)

**Files:**
- Create: `Gemfile`
- Create: `_config.yml`
- Create: `.gitignore`
- Create: `index.md` (temporary placeholder, replaced in Task 4)
- Create: `lib/taint_compat.rb` (Ruby 3.2+ / Liquid 4.0.3 compat shim — see Global Constraints)
- Create: `bin/jekyll` (wrapper: sets `RUBYOPT` to load the shim, then execs `bundle exec jekyll "$@"`)

**Interfaces:**
- Consumes: nothing (first task)
- Produces: working `bin/jekyll build` / `bin/jekyll serve` commands (use these, not raw `bundle exec jekyll`, from here on — see Global Constraints); `_config.yml` collections `posts` (built-in), `rants`, `projects`, each defaulted to layout `post` (posts/rants) or `page` (projects), plus an `exclude:` list keeping `docs/`, `lib/`, `bin/`, `.superpowers/` out of the generated site; site title available to later tasks as `site.title`

- [ ] **Step 1: Create `Gemfile`**

```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "csv"
gem "bigdecimal"
```

(`csv`/`bigdecimal` are Ruby stdlib gems that Ruby 3.4+ no longer bundles by default — `github-pages`'s pinned Jekyll 3.9.0 still needs them, so they must be explicit dependencies here.)

- [ ] **Step 2: Create `_config.yml`**

```yaml
title: Anant Goyal
description: "Writing, projects, and books."
url: "https://goyal-anant.github.io"
baseurl: ""

collections:
  rants:
    output: true
    permalink: /rant/:path/
  projects:
    output: true
    permalink: /projects/:path/

defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: post
  - scope:
      path: ""
      type: rants
    values:
      layout: post
  - scope:
      path: ""
      type: projects
    values:
      layout: page

permalink: /blog/:year/:month/:day/:title/
markdown: kramdown

exclude:
  - docs/
  - lib/
  - bin/
  - .superpowers/
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor/bundle/
  - vendor/cache/
  - vendor/gems/
  - vendor/ruby/
```

(The `exclude` list keeps Jekyll from trying to parse this repo's plan/spec docs, or its own tooling scripts, as site content — without it, Jekyll attempts to Liquid-render every `.md` file in the repo, including the plan file's own `{% include ... %}` code examples, and crashes on invalid syntax. Setting `exclude:` at all in `_config.yml` REPLACES Jekyll's built-in default exclude list rather than extending it — Jekyll does not merge this key — so the last 7 entries above (`Gemfile`, `Gemfile.lock`, `node_modules`, `vendor/bundle/`, `vendor/cache/`, `vendor/gems/`, `vendor/ruby/`) are Jekyll's own defaults, copied in explicitly so they aren't silently lost. Without them, `Gemfile`/`Gemfile.lock` leak into the generated `_site/` output.)

- [ ] **Step 3: Create `.gitignore`**

```
_site/
.jekyll-cache/
.bundle/
vendor/
.sass-cache/
```

- [ ] **Step 4: Create placeholder `index.md`**

```markdown
---
layout: page
title: Home
permalink: /
---
Scaffold placeholder — replaced in Task 4.
```

- [ ] **Step 5: Create `lib/taint_compat.rb`**

```ruby
# Ruby 3.2+ removed Object#taint/untaint/tainted? (deprecated since 2.7).
# The github-pages gem pins liquid = 4.0.3 exactly, and liquid 4.0.3's
# render path still calls String#tainted? internally, so it crashes on
# modern Ruby. Restore harmless no-op shims so that call site doesn't
# raise. Loaded via RUBYOPT before Bundler/Jekyll start (see bin/jekyll)
# so it applies regardless of Jekyll's plugin safe-mode. Local-build-only
# compatibility shim; has no effect on rendered site output.
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end

    def taint
      self
    end

    def untaint
      self
    end
  end
end
```

- [ ] **Step 6: Create `bin/jekyll`**

```bash
#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export RUBYOPT="${RUBYOPT:-} -r${root}/lib/taint_compat.rb"
exec bundle exec jekyll "$@"
```

Then: `chmod +x bin/jekyll`

- [ ] **Step 7: Install gems and verify a clean build**

Run: `bundle install`
Expected: completes with no errors, creates `Gemfile.lock`.

Run: `bin/jekyll build`
Expected: `Configuration file: _config.yml` then `done in <N> seconds.` with no `Liquid Exception` or `Error:` lines (a yellow `GitHub Metadata: ... 403 - API rate limit exceeded` warning may appear — that's a non-fatal network warning from the bundled `jekyll-github-metadata` plugin hitting GitHub's unauthenticated API rate limit, not a build failure; ignore it). Confirm `_site/index.html` was created and contains "Scaffold placeholder — replaced in Task 4."

- [ ] **Step 8: Commit**

```bash
git add Gemfile _config.yml .gitignore index.md lib/taint_compat.rb bin/jekyll
git commit -m "chore: scaffold jekyll project with Ruby/Liquid compat wrapper"
```

---

### Task 2: Base layout, nav, footer, theme toggle, color system

**Files:**
- Create: `_layouts/default.html`
- Create: `_layouts/page.html`
- Create: `_includes/nav.html`
- Create: `_includes/footer.html`
- Create: `_includes/theme-toggle.html`
- Create: `assets/css/main.scss`
- Create: `assets/js/theme.js`
- Modify: `about.md` (new file, used to verify the layout end-to-end)

**Interfaces:**
- Consumes: `site.title` (Task 1)
- Produces: `_layouts/default.html` (base layout all other layouts extend via `layout: default`), body class `layout-{{ page.layout }}`, CSS custom properties `--bg --fg --muted --link --accent`, `#theme-toggle` button id, `data-theme` attribute on `<html>`

- [ ] **Step 1: Create `_includes/nav.html`**

```html
<nav class="site-nav">
  <ul>
    <li><a href="{{ '/' | relative_url }}" {% if page.url == '/' %}class="active"{% endif %}>Home</a></li>
    <li><a href="{{ '/blog/' | relative_url }}" {% if page.url contains '/blog' %}class="active"{% endif %}>Blog</a></li>
    <li><a href="{{ '/bookshelf/' | relative_url }}" {% if page.url contains '/bookshelf' %}class="active"{% endif %}>Bookshelf</a></li>
    <li><a href="{{ '/rant/' | relative_url }}" {% if page.url contains '/rant' %}class="active"{% endif %}>Rant</a></li>
    <li><a href="{{ '/projects/' | relative_url }}" {% if page.url contains '/projects' %}class="active"{% endif %}>Projects</a></li>
    <li><a href="{{ '/about/' | relative_url }}" {% if page.url contains '/about' %}class="active"{% endif %}>About</a></li>
  </ul>
</nav>
```

- [ ] **Step 2: Create `_includes/footer.html`**

```html
<footer class="site-footer">
  <p>&copy; {{ site.time | date: '%Y' }} {{ site.title }}</p>
</footer>
```

- [ ] **Step 3: Create `_includes/theme-toggle.html`**

```html
<button id="theme-toggle" type="button" aria-label="Toggle color theme">&#9680;</button>
```

- [ ] **Step 4: Create `_layouts/default.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% if page.title %}{{ page.title }} &middot; {% endif %}{{ site.title }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
</head>
<body class="layout-{{ page.layout }}">
  <header class="site-header">
    <a class="site-mark" href="{{ '/' | relative_url }}">{{ site.title }}</a>
    {% include nav.html %}
    {% include theme-toggle.html %}
  </header>
  <main>
    {{ content }}
  </main>
  {% include footer.html %}
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</body>
</html>
```

- [ ] **Step 5: Create `_layouts/page.html`**

```html
---
layout: default
---
<article class="page">
  {% if page.title %}<h1>{{ page.title }}</h1>{% endif %}
  {{ content }}
</article>
```

- [ ] **Step 6: Create `assets/css/main.scss`**

```scss
---
---
:root {
  --bg: #ffffff;
  --fg: #1a1a1a;
  --muted: #6b6b6b;
  --link: #2b5dd6;
  --accent: #2b5dd6;
}

[data-theme="dark"] {
  --bg: #16181d;
  --fg: #e8e8e8;
  --muted: #9a9a9a;
  --link: #7aa6ff;
  --accent: #7aa6ff;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #16181d;
    --fg: #e8e8e8;
    --muted: #9a9a9a;
    --link: #7aa6ff;
    --accent: #7aa6ff;
  }
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }

.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  max-width: 720px;
  margin: 0 auto;
}

.site-mark { font-weight: 600; font-size: 1.1rem; color: var(--fg); }

.site-nav ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.site-nav a { color: var(--muted); }
.site-nav a.active { color: var(--fg); font-weight: 600; }

#theme-toggle {
  margin-left: auto;
  background: none;
  border: 1px solid var(--muted);
  border-radius: 999px;
  color: var(--fg);
  cursor: pointer;
  padding: 0.25rem 0.6rem;
}

main {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

.site-footer {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.layout-home .site-header {
  min-height: 70vh;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.75rem;
}
```

- [ ] **Step 7: Create `assets/js/theme.js`**

```js
(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });
})();
```

- [ ] **Step 8: Create `about.md` to exercise the layout**

```markdown
---
layout: page
title: About
permalink: /about/
---
Short bio placeholder. Real content coming soon.
```

- [ ] **Step 9: Build and verify**

Run: `bin/jekyll build`
Expected: `done in` with no errors.

Run: `grep -c 'class="site-nav"' _site/about/index.html`
Expected: `1`

Run: `grep -c 'id="theme-toggle"' _site/about/index.html`
Expected: `1`

Run: `grep -o 'blog\|bookshelf\|rant\|projects\|about' _site/about/index.html | sort -u`
Expected: all five of `about`, `blog`, `bookshelf`, `projects`, `rant` printed (confirms all 6 nav hrefs present, Home is `/` so has no keyword to grep).

- [ ] **Step 10: Commit**

```bash
git add _layouts _includes assets/css/main.scss assets/js/theme.js about.md
git commit -m "feat: base layout, nav, footer, theme toggle"
```

---

### Task 3: Live clock

**Files:**
- Create: `_includes/clock.html`
- Create: `assets/js/clock.js`
- Modify: `_layouts/default.html` (add clock include + script tag)

**Interfaces:**
- Consumes: `_layouts/default.html` header markup (Task 2)
- Produces: `#clock` element id, ticking text content, for any later layout to rely on its presence in the header

- [ ] **Step 1: Create `_includes/clock.html`**

```html
<span id="clock" class="clock"></span>
```

- [ ] **Step 2: Create `assets/js/clock.js`**

```js
(function () {
  var el;
  function tick() {
    if (!el) el = document.getElementById('clock');
    if (!el) return;
    var now = new Date();
    el.textContent = now.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) + ' · ' + now.toLocaleTimeString(undefined, {
      hour: 'numeric', minute: '2-digit'
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    tick();
    setInterval(tick, 1000);
  });
})();
```

- [ ] **Step 3: Wire into `_layouts/default.html`**

In the `<header class="site-header">` block, add the clock include right after the site mark link:

```html
    <a class="site-mark" href="{{ '/' | relative_url }}">{{ site.title }}</a>
    {% include clock.html %}
    {% include nav.html %}
```

Before `</body>`, add the clock script alongside the theme script:

```html
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
  <script src="{{ '/assets/js/clock.js' | relative_url }}"></script>
```

Add a `.clock` rule to `assets/css/main.scss` (append near `.site-mark`):

```scss
.clock { color: var(--muted); font-size: 0.85rem; }
```

- [ ] **Step 4: Build and verify markup is present**

Run: `bin/jekyll build && grep -c 'id="clock"' _site/about/index.html`
Expected: `1`

Run: `grep -c 'clock.js' _site/about/index.html`
Expected: `1`

- [ ] **Step 5: Verify it actually ticks (manual browser check)**

Run: `bin/jekyll serve --detach`
Then open `http://127.0.0.1:4000/about/` in a browser, confirm the clock shows today's real day/date/time and that the minute value updates after waiting (or observe via two screenshots ~65 seconds apart).
Run: `bin/jekyll serve --detach` process should then be stopped: find it with `pgrep -f jekyll` and `kill <pid>`, or note the PID printed by `--detach` and kill it directly.

- [ ] **Step 6: Commit**

```bash
git add _includes/clock.html assets/js/clock.js _layouts/default.html assets/css/main.scss
git commit -m "feat: live day/date/time clock in header"
```

---

### Task 4: Minimal home landing

**Files:**
- Create: `_layouts/home.html`
- Modify: `index.md` (replace Task 1 placeholder)
- Modify: `assets/css/main.scss` (home-specific spacing already added in Task 2; no change needed unless verification shows otherwise)

**Interfaces:**
- Consumes: `_layouts/default.html`, body class `layout-home` (Task 2)
- Produces: `/` route rendering the minimal sevko.io-style landing

- [ ] **Step 1: Create `_layouts/home.html`**

```html
---
layout: default
---
{{ content }}
```

- [ ] **Step 2: Replace `index.md`**

```markdown
---
layout: home
title: Home
permalink: /
---
Writing, projects, and books.
```

- [ ] **Step 3: Build and verify**

Run: `bin/jekyll build && grep -c 'layout-home' _site/index.html`
Expected: `1`

Run: `grep -c 'Writing, projects, and books.' _site/index.html`
Expected: `1`

- [ ] **Step 4: Manual visual check**

Run: `bin/jekyll serve --detach`, open `http://127.0.0.1:4000/`, confirm the header+nav block is vertically centered with generous whitespace above and below (no long hero paragraph). Stop the server (`pgrep -f jekyll` then `kill`).

- [ ] **Step 5: Commit**

```bash
git add _layouts/home.html index.md
git commit -m "feat: minimal centered home landing"
```

---

### Task 5: Blog (post layout, shared post-list include, blog index, placeholder post)

**Files:**
- Create: `_layouts/post.html`
- Create: `_includes/post-list.html`
- Create: `blog.md`
- Create: `_posts/2026-09-10-hello-world.md`
- Modify: `assets/css/main.scss` (append `.post-list` rules)

**Interfaces:**
- Consumes: `_layouts/default.html` (Task 2)
- Produces: `_includes/post-list.html` called as `{% include post-list.html posts=<array> %}` (Task 6 reuses this for Rant); `.post-list` and `.post-date` CSS classes

- [ ] **Step 1: Create `_layouts/post.html`**

```html
---
layout: default
---
<article class="post">
  <p class="post-date">{{ page.date | date: "%d %b %Y" }}</p>
  <h1>{{ page.title }}</h1>
  {{ content }}
</article>
```

- [ ] **Step 2: Create `_includes/post-list.html`**

```html
<ul class="post-list">
  {% for post in include.posts %}
  <li>
    <span class="post-date">{{ post.date | date: "%d %b %Y" }}</span>
    <span class="post-sep">&raquo;</span>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
  {% endfor %}
</ul>
```

- [ ] **Step 3: Create `blog.md`**

```markdown
---
layout: page
title: Blog
permalink: /blog/
---
{% include post-list.html posts=site.posts %}
```

- [ ] **Step 4: Create `_posts/2026-09-10-hello-world.md`**

```markdown
---
title: "Hello, world"
---
First post. Real content coming soon.
```

- [ ] **Step 5: Append post-list styles to `assets/css/main.scss`**

```scss
.post-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.post-list li {
  display: flex;
  gap: 0.75rem;
  padding: 0.35rem 0;
  font-size: 0.95rem;
  align-items: baseline;
}
.post-list .post-date {
  color: var(--muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
  white-space: nowrap;
}
.post-list .post-sep { color: var(--muted); }
```

- [ ] **Step 6: Build and verify**

Run: `bin/jekyll build && grep -c 'class="post-list"' _site/blog/index.html`
Expected: `1`

Run: `grep -c 'Hello, world' _site/blog/index.html`
Expected: `1`

Run: `ls _site/blog/2026/09/10/hello-world/index.html`
Expected: file exists (individual post page was generated)

Run: `grep -c 'class="post-date"' "_site/blog/2026/09/10/hello-world/index.html"`
Expected: `1`

- [ ] **Step 7: Commit**

```bash
git add _layouts/post.html _includes/post-list.html blog.md _posts assets/css/main.scss
git commit -m "feat: blog index and post layout"
```

---

### Task 6: Rant

**Files:**
- Create: `rant.md`
- Create: `_rants/2026-09-10-a-short-rant.md`

**Interfaces:**
- Consumes: `_includes/post-list.html`, `_layouts/post.html` (Task 5); `rants` collection config (Task 1)
- Produces: `/rant/` index page

- [ ] **Step 1: Create `rant.md`**

```markdown
---
layout: page
title: Rant
permalink: /rant/
---
{% include post-list.html posts=site.rants %}
```

- [ ] **Step 2: Create `_rants/2026-09-10-a-short-rant.md`**

```markdown
---
title: "A short rant about something"
date: 2026-09-10
---
Placeholder rant. Real opinions coming soon.
```

- [ ] **Step 3: Build and verify**

Run: `bin/jekyll build && grep -c 'class="post-list"' _site/rant/index.html`
Expected: `1`

Run: `grep -c 'A short rant about something' _site/rant/index.html`
Expected: `1`

Run: `ls _site/rant/a-short-rant/index.html`
Expected: file exists (permalink from `_config.yml`'s `rants` collection pattern `/rant/:path/`)

- [ ] **Step 4: Commit**

```bash
git add rant.md _rants
git commit -m "feat: rant section reusing blog post-list and layout"
```

---

### Task 7: Projects

**Files:**
- Create: `projects.md`
- Create: `_projects/sample-project.md`

**Interfaces:**
- Consumes: `_layouts/page.html` (Task 2); `projects` collection config (Task 1)
- Produces: `/projects/` index page

- [ ] **Step 1: Create `_projects/sample-project.md`**

```markdown
---
title: "Sample Project"
summary: "One-line description of the project."
link: "https://github.com/goyal-anant"
---
Placeholder project write-up. Real content coming soon.
```

- [ ] **Step 2: Create `projects.md`**

```markdown
---
layout: page
title: Projects
permalink: /projects/
---
<ul class="post-list">
{% for project in site.projects %}
  <li>
    <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
    {% if project.summary %}<span class="post-date">{{ project.summary }}</span>{% endif %}
  </li>
{% endfor %}
</ul>
```

- [ ] **Step 3: Build and verify**

Run: `bin/jekyll build && grep -c 'Sample Project' _site/projects/index.html`
Expected: `1`

Run: `ls _site/projects/sample-project/index.html`
Expected: file exists

- [ ] **Step 4: Commit**

```bash
git add projects.md _projects
git commit -m "feat: projects section"
```

---

### Task 8: Bookshelf

**Files:**
- Create: `_data/books.yml`
- Create: `bookshelf.md`
- Modify: `assets/css/main.scss` (append `.shelf`/`.spine` rules)

**Interfaces:**
- Consumes: `_layouts/page.html` (Task 2)
- Produces: `/bookshelf/` index page rendering `_data/books.yml` as colored spine bars

- [ ] **Step 1: Create `_data/books.yml`**

```yaml
- title: "Norwegian Wood"
  author: "Haruki Murakami"
  genre: fiction
  link: "https://www.goodreads.com/book/show/11297.Norwegian_Wood"
- title: "Sapiens"
  author: "Yuval Noah Harari"
  genre: nonfiction
  link: "https://www.goodreads.com/book/show/23692271-sapiens"
- title: "Project Hail Mary"
  author: "Andy Weir"
  genre: sci-fi
  link: "https://www.goodreads.com/book/show/54493401-project-hail-mary"
```

- [ ] **Step 2: Create `bookshelf.md`**

```markdown
---
layout: page
title: Bookshelf
permalink: /bookshelf/
---
<ul class="shelf">
{% for book in site.data.books %}
  <li>
    <a class="spine spine--{{ book.genre }}" href="{{ book.link | default: '#' }}"{% if book.link %} target="_blank" rel="noopener"{% endif %}>
      <span class="spine-title">{{ book.title }} &mdash; {{ book.author }}</span>
      <span class="genre-tag">{{ book.genre }}</span>
    </a>
  </li>
{% endfor %}
</ul>
```

- [ ] **Step 3: Append shelf/spine styles to `assets/css/main.scss`**

```scss
.shelf {
  list-style: none;
  margin: 0;
  padding: 0;
}
.spine {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 0.75rem 1rem;
  margin-top: -1px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
.spine:hover { filter: brightness(1.08); text-decoration: none; }
.spine .genre-tag {
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.85;
}
.spine--fiction { background: #7a1f3d; }
.spine--nonfiction { background: #1f4e79; }
.spine--sci-fi { background: #2f6b3a; }
```

- [ ] **Step 4: Build and verify**

Run: `bin/jekyll build && grep -c 'class="spine spine--fiction"' _site/bookshelf/index.html`
Expected: `1`

Run: `grep -c 'class="spine spine--nonfiction"' _site/bookshelf/index.html`
Expected: `1`

Run: `grep -c 'class="spine spine--sci-fi"' _site/bookshelf/index.html`
Expected: `1`

Run: `grep -c 'genre-tag' _site/bookshelf/index.html`
Expected: `3`

- [ ] **Step 5: Commit**

```bash
git add _data/books.yml bookshelf.md assets/css/main.scss
git commit -m "feat: bookshelf with genre-colored spine list"
```

---

### Task 9: About page content pass and full-site verification

**Files:**
- Modify: `about.md` (already created in Task 2 — confirm final copy)
- No other new files — this task is the acceptance gate for the whole plan

**Interfaces:**
- Consumes: every layout/include/page from Tasks 1-8
- Produces: nothing further downstream — terminal task

- [ ] **Step 1: Confirm `about.md` content (already correct from Task 2, verify it still reads)**

```markdown
---
layout: page
title: About
permalink: /about/
---
Short bio placeholder. Real content coming soon.
```

- [ ] **Step 2: Full clean build**

Run: `rm -rf _site .jekyll-cache && bin/jekyll build`
Expected: `done in` with zero `Error:`/`Liquid Exception` lines.

- [ ] **Step 3: Confirm every route exists**

Run:
```bash
for p in index blog/index rant/index bookshelf/index projects/index about/index; do
  test -f "_site/$p.html" && echo "OK  $p" || echo "MISSING  $p"
done
```
Expected: `OK` for all six.

- [ ] **Step 4: Manual browser walkthrough**

Run: `bin/jekyll serve --detach`. Visit `http://127.0.0.1:4000/` and click through all 6 nav links (Home, Blog, Bookshelf, Rant, Projects, About), confirm each loads and the nav highlights the current section. Click the theme toggle, confirm colors flip and the choice survives a page reload. Confirm the header clock is present and ticking on every page. Confirm the bookshelf shows 3 differently-colored spine bars. Then stop the server (`pgrep -f jekyll`, `kill <pid>`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: verify full site build and navigation"
```

---

## Deployment (not part of this plan's automatic steps)

This plan stops at a locally-verified, committed site. Pushing to `origin/main` and confirming the GitHub Pages source setting (`main` branch) are separate, user-confirmed actions — do not push automatically after finishing Task 9.
