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
  </li>
{% endfor %}
</ul>
