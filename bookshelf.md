---
layout: page
title: Bookshelf
permalink: /bookshelf/
---
<ul class="shelf">
{% for book in site.data.books %}
  <li>
    <a class="spine spine--{{ book.genre }}" href="{{ book.link | default: '#' }}"{% if book.link %} target="_blank" rel="noopener"{% endif %}>
      <span class="spine-title">{{ book.title }} &mdash; {{ book.author }}</span>
      <span class="genre-tag">{{ book.genre }}</span>
    </a>
  </li>
{% endfor %}
</ul>
