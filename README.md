# goyal-anant.github.io

Anant Goyal's personal site, built with Jekyll.

## Setup

```
bundle install
```

## Running locally

```
bin/jekyll serve
```

Do **not** run `bundle exec jekyll serve` directly — this machine's Ruby needs
a compatibility shim (`lib/taint_compat.rb`) loaded first, and `bin/jekyll` is
a thin wrapper that sets that up via `RUBYOPT` before calling Jekyll.

## Content

- `_posts/` — blog posts
- `_rants/` — rants
- `_research/` — research
- `_data/books.yml` — bookshelf entries (`bin/add-books` syncs them with the
  Obsidian note; run it with `--dry-run` first)
- `_data/music.yml` — music entries (`bin/add-songs` adds new ones from the
  Obsidian note; run it with `--dry-run` first)
- `_data/picks.yml` — picks entries
