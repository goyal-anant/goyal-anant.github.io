---
layout: page
title: Music
permalink: /music/
---

<p class="shelf-hint">These are the songs I keep going back to: some for the lyrics, some for the voice, and some for reasons I can't put in words. It is a rough list and it will keep changing, the way taste does. Press play on a cover for a 30-second preview, or the note icon to hear the full song on Apple Music. If I have something to say about a song, hover over it (or tap, on a phone) to read it; for the rest, the music speaks for itself :)</p>

{% assign genres = "sufi:Sufi &amp; Qawwali,ghazal:Ghazal,hindi-film:Hindi Film,rock:Rock,pop-folk:Pop &amp; Folk,punjabi:Punjabi,indie:Indie &amp; Indi-pop,soul-reggae-blues:Soul&#44; Reggae &amp; Blues" | split: "," %}
{% for genre in genres %}
{% assign parts = genre | split: ":" %}
{% assign tracks = site.data.music | where: "genre", parts[0] %}
{% if tracks.size > 0 %}
<h2 class="shelf-heading">{{ parts[1] }}</h2>
<ul class="music-grid">
{% for track in tracks %}
  <li class="music-card">
    <div class="music-thumb-wrap">
      <img class="music-thumb" src="{{ track.thumbnail | relative_url }}" alt="{{ track.title }} cover" loading="lazy">
      {% if track.note %}<p class="music-note">{{ track.note }}</p>{% endif %}
    </div>
    <div class="music-info">
      <span class="music-title">{{ track.title }}</span>
      <span class="music-artist">{{ track.artist }}</span>
    </div>
    {% if track.previewUrl and track.appleMusicUrl %}
    <div class="music-controls">
      <button class="music-play" type="button" data-preview-src="{{ track.previewUrl }}" aria-label="Play preview of {{ track.title }}" aria-pressed="false">
        <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        <svg class="icon-vinyl" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <circle class="vinyl-groove" cx="12" cy="12" r="6.5"/>
          <circle class="vinyl-groove" cx="12" cy="12" r="4"/>
          <circle class="vinyl-label" cx="12" cy="12" r="1.6"/>
        </svg>
      </button>
      <a class="music-apple-link" href="{{ track.appleMusicUrl }}" target="_blank" rel="noopener" aria-label="Listen to {{ track.title }} on Apple Music">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17V6.5l10-2v10.5M9 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>
      </a>
    </div>
    {% endif %}
  </li>
{% endfor %}
</ul>
{% endif %}
{% endfor %}

<p class="shelf-updated">Last updated: {{ site.time | date: "%-d %B %Y" }}</p>
