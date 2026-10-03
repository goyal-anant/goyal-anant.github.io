---
layout: page
title: Picks
permalink: /picks/
---

<p class="shelf-hint">These are the things I use and would tell a friend to try, each with a line on why. It is a rough list and it will keep changing; whatever didn't survive goes to 'Ditched' at the bottom. Books and songs have their own pages: the <a href="{{ '/bookshelf/' | relative_url }}">bookshelf</a> and <a href="{{ '/music/' | relative_url }}">music</a>.</p>

{% assign sections = "watch:Watch,research:Research kit,apps:Mac apps,gadgets:Gadgets,ditched:Ditched" | split: "," %}
{% for section in sections %}
{% assign parts = section | split: ":" %}
{% assign picks = site.data.picks | where: "section", parts[0] %}
{% if picks.size > 0 %}
<h2 class="shelf-heading">{{ parts[1] }}</h2>
{% if parts[0] == "watch" %}
<p class="shelf-hint">Hover over a poster (or tap it, on a phone) for my take. The movies live on my <a href="https://boxd.it/6fyDr" target="_blank" rel="noopener">Letterboxd</a>.</p>
<ul class="music-grid book-grid watch-grid">
{% for pick in picks %}
  <li class="music-card">
    <div class="music-thumb-wrap">
      <img class="music-thumb" src="{{ pick.thumbnail | relative_url }}" alt="{{ pick.title | escape }} poster" loading="lazy">
      <p class="music-note book-note">{{ pick.note | escape }}</p>
    </div>
    <a class="book-link" href="{{ pick.link | escape }}" title="{{ pick.title | escape }}" target="_blank" rel="noopener">{{ pick.title | escape }}</a>
  </li>
{% endfor %}
</ul>
{% else %}
<ul class="post-list pick-list">
{% for pick in picks %}
  <li>
    {% if pick.link %}<a href="{{ pick.link | escape }}" target="_blank" rel="noopener">{{ pick.title | escape }}</a>{% else %}<span>{{ pick.title | escape }}</span>{% endif %}
    <span class="project-summary">{{ pick.note | escape }}</span>
  </li>
{% endfor %}
</ul>
{% endif %}
{% endif %}
{% endfor %}
