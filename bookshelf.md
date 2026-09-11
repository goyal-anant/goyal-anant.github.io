---
layout: page
title: Bookshelf
permalink: /bookshelf/
---

{% assign reading = site.data.books | where: "status", "reading" %}
{% assign completed = site.data.books | where: "status", "completed" %}
{% assign want = site.data.books | where: "status", "want-to-read" %}

{% if reading.size > 0 %}
<h2 class="shelf-heading">Currently Reading</h2>
<ul class="shelf">
{% for book in reading %}
  <li>
    <a class="spine spine--{{ book.genre }}" href="{{ book.link | default: '#' }}"{% if book.link %} target="_blank" rel="noopener"{% endif %} style="--spine-w: {{ book.title | size | modulo: 5 | times: 4 | plus: 78 }}%; --spine-h: {{ book.author | size | modulo: 4 | times: 4 | plus: 44 }}px;">
      <span class="spine-title">{{ book.title }} &mdash; {{ book.author }}</span>
      <span class="genre-tag">{{ book.genre }}</span>
    </a>
  </li>
{% endfor %}
</ul>
{% endif %}

{% if completed.size > 0 %}
<h2 class="shelf-heading">Completed</h2>
<ul class="shelf">
{% for book in completed %}
  <li>
    <details class="spine-details">
      <summary class="spine spine--{{ book.genre }}" style="--spine-w: {{ book.title | size | modulo: 5 | times: 4 | plus: 78 }}%; --spine-h: {{ book.author | size | modulo: 4 | times: 4 | plus: 44 }}px;">
        <span class="spine-title">{{ book.title }} &mdash; {{ book.author }}</span>
        <span class="genre-tag">{{ book.genre }}</span>
      </summary>
      {% if book.summary and book.summary != "" %}
      <p class="spine-summary">{{ book.summary }}</p>
      {% else %}
      <p class="spine-summary spine-summary--empty">No takeaway written yet.</p>
      {% endif %}
    </details>
  </li>
{% endfor %}
</ul>
{% endif %}

{% if want.size > 0 %}
<h2 class="shelf-heading">Want to Read</h2>
<ul class="shelf">
{% for book in want %}
  <li>
    <a class="spine spine--{{ book.genre }}" href="{{ book.link | default: '#' }}"{% if book.link %} target="_blank" rel="noopener"{% endif %} style="--spine-w: {{ book.title | size | modulo: 5 | times: 4 | plus: 78 }}%; --spine-h: {{ book.author | size | modulo: 4 | times: 4 | plus: 44 }}px;">
      <span class="spine-title">{{ book.title }} &mdash; {{ book.author }}</span>
      <span class="genre-tag">{{ book.genre }}</span>
    </a>
  </li>
{% endfor %}
</ul>
{% endif %}
