# Site manual (no-Claude edition)

How to edit this site by hand — no AI assistant needed. This is a Jekyll
site, hosted at `goyal-anant.github.io`. GitHub Pages builds and deploys it
automatically on every push to `main`; there's no build step to run yourself.

## 1. Prerequisites

- Git installed, repo cloned locally.
- A terminal, and basic comfort running commands in it (`cd`, running a
  script, reading output).
- A text editor (anything — VS Code, TextEdit, vim).

## 2. Preview your changes locally

From the repo root:

```
bin/jekyll serve
```

Then open `http://localhost:4000` in a browser. Leave it running — it
rebuilds automatically when you save a file. Press `Ctrl+C` to stop it.

Do **not** run `bundle exec jekyll serve` directly — see the README for why.

## 3. Add / edit / remove a blog post

Posts live in `_posts/`.

**Add:** create a file named `_posts/YYYY-MM-DD-your-title.md` (the date
prefix is required — Jekyll uses it for the post's date and URL). Content:

```markdown
---
title: "Your Title"
---
Your post body in Markdown.
```

**Edit:** open the existing file in `_posts/`, change the front matter or
body, save.

**Remove:** delete the file.

## 4. Add / edit / remove a rant

Rants live in `_rants/`.

**Add:** create a file in `_rants/` — **the filename must NOT be
date-prefixed** (unlike posts). Put the date in the front matter instead:

```markdown
---
title: "Your Rant Title"
date: 2026-09-10
---
Your rant body in Markdown.
```

**Edit:** open the file, change front matter or body, save.

**Remove:** delete the file.

## 5. Add / edit / remove a research entry

Research entries live in `_research/`.

**Add:** create a file in `_research/`:

```markdown
---
title: "Research Title"
summary: "One-line description."
link: "https://github.com/you/repo"
---
Longer write-up in Markdown (optional — shown on the entry's own page,
not on the research listing).
```

`summary` and `link` are both optional but recommended — `summary` shows up
on the research listing page, `link` makes the entry title clickable.

**Edit:** open the file, change front matter or body, save.

**Remove:** delete the file.

## 6. Add / edit / remove a bookshelf entry

Books are data, not pages — they live in `_data/books.yml` as a flat list.

**Add:** append an entry:

```yaml
- title: "Book Title"
  author: "Author Name"
  genre: fiction
  link: "https://www.goodreads.com/book/show/..."
```

`genre` controls the spine color on the bookshelf page (CSS class
`spine--<genre>`) — check `assets/css/main.scss` for which genre values
already have a color defined. Using a new genre value works, it'll just
render with the default/unstyled spine color until you add CSS for it.

**Edit:** change the relevant fields on that entry.

**Remove:** delete the entry (the `-`-prefixed block) from the list.

## 6b. Add / edit / remove a music entry

Music entries are data, in `_data/music.yml` as a flat list.

**Add:** append an entry:

```yaml
- title: "Album or Track Title"
  artist: "Artist Name"
  thumbnail: "/assets/images/music/filename.jpg"
  note: "Why you like it."
```

Drop the cover image file in `assets/images/music/` first, then point
`thumbnail` at its path.

**Edit:** change the relevant fields on that entry.

**Remove:** delete the entry (the `-`-prefixed block) from the list.

## 7. Edit a static page

`about.md`, `index.md`, `blog.md`, `bookshelf.md`, `music.md`, `rant.md`, `research.md`
at the repo root are the site's fixed pages. Open the one you want, edit the
content below the `---` front matter block, save. Don't touch the front
matter (`layout`, `title`, `permalink`) unless you mean to change the page's
URL or template.

## 8. Add a new static page

1. Create `pagename.md` at the repo root:

   ```markdown
   ---
   layout: page
   title: Page Name
   permalink: /pagename/
   ---
   Your content in Markdown.
   ```

2. Add it to the nav menu — edit `_includes/nav.html` and add a line like:

   ```html
   <li><a href="{{ '/pagename/' | relative_url }}" {% if page.url contains '/pagename' %}class="active"{% endif %}>Page Name</a></li>
   ```

## 9. Add a new content-type section (like rants or research)

This mirrors how the rants and research sections were set up.

1. **Create the collection folder**: `_pagename/` (e.g. `_talks/`).

2. **Register the collection** in `_config.yml`, under `collections:`:

   ```yaml
   collections:
     pagename:
       output: true
       permalink: /pagename/:path/
   ```

3. **Set a default layout** for items in the collection, under `defaults:`:

   ```yaml
   defaults:
     - scope:
         path: ""
         type: pagename
       values:
         layout: post
   ```

   (Use `layout: post` if each item is a post-like write-up, like rants; use
   a different layout if it needs its own template.)

4. **Create items** in `_pagename/*.md` with whatever front matter fields
   you need (follow the rants/research examples above).

5. **Create a landing page** at the repo root, `pagename.md`, that lists
   the items — reuse the `post-list.html` include if it's a simple
   date+title list:

   ```markdown
   ---
   layout: page
   title: Page Name
   permalink: /pagename/
   ---
   {% include post-list.html posts=site.pagename %}
   ```

   Or write a custom loop (see `research.md` or `bookshelf.md` for examples
   with extra fields).

6. **Add a nav link** — same as step 2 in section 8.

Restart `bin/jekyll serve` after changing `_config.yml` (config changes
aren't picked up by the watcher).

## 10. Commit and deploy

```
git add <files you changed>
git commit -m "describe what you changed"
git push
```

That's it — no separate deploy command. GitHub Pages rebuilds the site
automatically whenever `main` is pushed.

## 11. Verify it's live

1. Go to the repo on GitHub → **Actions** tab (or **Settings → Pages**) and
   check the latest Pages build succeeded (usually takes under a minute).
2. Visit `https://goyal-anant.github.io` and hard-refresh
   (`Cmd+Shift+R` / `Ctrl+Shift+R`) to bypass any cached version.

If the build fails, the Actions tab shows the error log — check for YAML
syntax errors in front matter or `_config.yml` first, since those are the
most common break.
