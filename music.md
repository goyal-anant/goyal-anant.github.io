---
layout: page
title: Music
permalink: /music/
---

<p class="shelf-hint">These are the songs I keep going back to: some for the lyrics, some for the voice, and some for reasons I can't put in words. It is a rough list and it will keep changing, the way taste does. Press play under a cover for a preview, or the note icon to hear the full song; the music speaks for itself :)</p>

<p class="shelf-hint">If you don't know where to start, press 'Shuffle all' below and let the page pick for you, or press 'Play all' next to a genre to hear all of its songs, top to bottom. To skip ahead in a song, drag the bar under it.</p>

<p><button class="music-queue" type="button" data-queue="shuffle" data-label="Shuffle all" aria-pressed="false">Shuffle all</button></p>

{% assign genres = "sufi:Sufi &amp; Qawwali,ghazal:Ghazal,classical:Classical &amp; Semi-classical,film:Film,rock:Rock,pop-folk:Pop &amp; Folk,punjabi:Punjabi,indie:Indie &amp; Indi-pop,soul-reggae-blues:Soul&#44; Reggae &amp; Blues" | split: "," %}
{% for genre in genres %}
{% assign parts = genre | split: ":" %}
{% comment %}A song tagged with one word of a section ("reggae", "pop") goes in that section.{% endcomment %}
{% assign keys = parts[0] | split: "-" | push: parts[0] %}
{% assign tracks = site.data.music | where_exp: "t", "keys contains t.genre" | sort_natural: "title" %}
{% if tracks.size > 0 %}
<h2 class="shelf-heading"><span class="genre-name">{{ parts[1] }}</span> <button class="music-queue" type="button" data-queue="section" data-label="Play all" aria-pressed="false">Play all</button></h2>
<ul class="music-grid">
{% for track in tracks %}
  <li class="music-card">
    <div class="music-thumb-wrap">
      <img class="music-thumb" src="{{ track.thumbnail | relative_url }}" alt="{{ track.title | escape }} cover" loading="lazy">
    </div>
    <div class="music-info">
      <span class="music-title">{{ track.title | escape }}</span>
      <span class="music-artist">{{ track.artist | escape }}</span>
    </div>
    {% if track.previewUrl and track.appleMusicUrl %}
    <div class="music-controls">
      <button class="music-play" type="button" data-preview-src="{{ track.previewUrl | escape }}"{% if track.extendedPreviewUrl %} data-extended-src="{{ track.extendedPreviewUrl | escape }}"{% endif %} aria-label="Play preview of {{ track.title | escape }}" aria-pressed="false">
        <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        <svg class="icon-vinyl" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <circle class="vinyl-groove" cx="12" cy="12" r="6.5"/>
          <circle class="vinyl-groove" cx="12" cy="12" r="4"/>
          <circle class="vinyl-label" cx="12" cy="12" r="1.6"/>
        </svg>
      </button>
      <a class="music-apple-link" href="{{ track.appleMusicUrl | escape }}" target="_blank" rel="noopener" aria-label="Listen to {{ track.title | escape }} on Apple Music">
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
