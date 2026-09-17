# Manually look up iTunes preview URLs instead of fetching live

The music page plays 30-second previews sourced from Apple's iTunes Search API. We look up each track's `previewUrl` and `appleMusicUrl` by hand once and commit them into `_data/music.yml`, rather than having client-side JS call the Search API on page load.

This keeps the site fully static with no runtime dependency, CORS surface, or rate limit to worry about, at the cost of needing a manual re-lookup if Apple ever rotates a preview URL. Acceptable given the curated, low-track-count nature of this page.
