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
  Obsidian note; run it with `--dry-run` first, add `--refresh` to recheck
  every link and remove books no longer in the note)
- `_data/music.yml` — music entries (`bin/add-songs` adds new ones from the
  Obsidian note; run it with `--dry-run` first, add `--refresh` to recheck
  every link and cover and remove songs no longer in the note)
- `_data/picks.yml` — picks entries

## Post reactions

The 👍 ❤️ 💡 buttons under each post talk to a small Cloudflare Worker in
`worker/`, which keeps the counts in a D1 database. The buttons stay hidden
while `reactions_url` in `_config.yml` is empty or the Worker can't be reached.

First deploy (needs a free Cloudflare account):

```
cd worker
npx wrangler login
npx wrangler d1 create reactions        # paste the printed database_id into wrangler.toml
npx wrangler d1 execute reactions --remote --file=schema.sql
npx wrangler deploy                     # prints the https://reactions.<you>.workers.dev URL
```

Then set `reactions_url` in `_config.yml` to that URL. Allowed sites are the
`ORIGINS` list at the top of `worker/index.js`; reactions from anywhere else
(including localhost) are refused, so local previews never change the real
counts. Counts are keyed by the post's URL, so changing a post's date or slug
starts it from zero.
