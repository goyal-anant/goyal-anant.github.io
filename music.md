---
layout: page
title: Music
permalink: /music/
---

<p class="shelf-hint">These are the songs I keep going back to: some for the lyrics, some for the voice, and some for reasons I can't put in words. It is a rough list and it will keep changing, the way taste does. Press a record to hear a preview and press it again to pause; to hear the full song, press its title. The music speaks for itself :)</p>

<p class="shelf-hint">If you don't know where to start, press 'Play all' below to hear every song on the page, or 'Play genre' next to a genre to hear only that one. Turn on the shuffle button next to 'Play all' and the page picks the order for you. To skip ahead in a song, drag the bar under it.</p>

<div class="music-bar">
  <button class="music-queue" type="button" data-queue="all" data-label="Play all" aria-pressed="false">Play all</button>
  <button class="music-bar-icon music-shuffle" type="button" aria-label="Shuffle" title="Shuffle" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h3.5c2 0 3.2 1 4.3 2.7l2.4 4.6c1.1 1.7 2.3 2.7 4.3 2.7H21M3 17h3.5c2 0 3.2-1 4.3-2.7m2.4-4.6c1.1-1.7 2.3-2.7 4.3-2.7H21M18 4l3 3-3 3M18 14l3 3-3 3"/></svg></button>
  <span class="music-bar-now" hidden>
    <button class="music-bar-title" type="button" title="Show this song"></button>
    <button class="music-bar-icon music-bar-pause" type="button" aria-label="Pause" title="Pause"><svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z"/></svg><svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button>
    <button class="music-bar-icon music-bar-skip" type="button" aria-label="Next song" title="Next song"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14l10-7zM16 5h3v14h-3z"/></svg></button>
    <button class="music-bar-icon music-bar-stop" type="button" aria-label="Stop" title="Stop"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"/></svg></button>
  </span>
</div>

{% assign genres = "sufi:Sufi &amp; Qawwali,ghazal:Ghazal,classical:Classical &amp; Semi-classical,film:Film,rock:Rock,pop-folk:Pop &amp; Folk,punjabi:Punjabi,indie:Indie &amp; Indi-pop,soul-reggae-blues:Soul&#44; Reggae &amp; Blues" | split: "," %}
{% for genre in genres %}
{% assign parts = genre | split: ":" %}
{% comment %}A song tagged with one word of a section ("reggae", "pop") goes in that section.{% endcomment %}
{% assign keys = parts[0] | split: "-" | push: parts[0] %}
{% assign tracks = site.data.music | where_exp: "t", "keys contains t.genre" | sort_natural: "title" %}
{% if tracks.size > 0 %}
<h2 class="shelf-heading"><span class="genre-name">{{ parts[1] }}</span> <button class="music-queue" type="button" data-queue="section" data-label="Play genre" aria-pressed="false">Play genre</button></h2>
<ul class="music-grid">
{% for track in tracks %}
  <li class="music-card">
    <button class="music-thumb-wrap vinyl music-play" type="button" data-preview-src="{{ track.previewUrl | escape }}"{% if track.extendedPreviewUrl %} data-extended-src="{{ track.extendedPreviewUrl | escape }}"{% endif %} aria-label="Play preview of {{ track.title | escape }}" aria-pressed="false">
      <img class="music-thumb" src="{{ track.thumbnail | relative_url }}" alt="" loading="lazy">
      <svg class="vinyl-icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7v10l8-5z"/></svg>
      <svg class="vinyl-icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h3v10H8zm5 0h3v10h-3z"/></svg>
    </button>
    <div class="music-info">
      <a class="music-title" href="{{ track.appleMusicUrl | escape }}" target="_blank" rel="noopener">{{ track.title | escape }}</a>
      <span class="music-artist">{{ track.artist | escape }}</span>
    </div>
  </li>
{% endfor %}
</ul>
{% endif %}
{% endfor %}
