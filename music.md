---
layout: page
title: Music
permalink: /music/
---
<ul class="music-grid">
{% for track in site.data.music %}
  <li class="music-card">
    <div class="music-thumb-wrap">
      <img class="music-thumb" src="{{ track.thumbnail | relative_url }}" alt="{{ track.title }} cover">
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
