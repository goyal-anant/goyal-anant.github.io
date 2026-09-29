---
layout: page
title: Bookshelf
permalink: /bookshelf/
---

<p class="shelf-hint">Hover over a cover in the Completed or Half-Done, Kept shelves (or tap it, if you are on a phone) to read my one-line take on the book; the rest I haven't earned an opinion on yet. Most of them are jokes, so no offense to the authors, the saints, or Kant :)</p>

{% assign shelves = "reading:Currently Reading,want-to-read:Want to Read,half-done:Half-Done&#44; Kept,completed:Completed" | split: "," %}
{% for shelf in shelves %}
{% assign parts = shelf | split: ":" %}
{% assign books = site.data.books | where: "status", parts[0] %}
{% if books.size > 0 %}
<h2 class="shelf-heading">{{ parts[1] }}</h2>
<ul class="music-grid book-grid">
{% for book in books %}
  <li class="music-card">
    <div class="music-thumb-wrap">
      {% if book.thumbnail %}
      <img class="music-thumb" src="{{ book.thumbnail | relative_url }}" alt="{{ book.title }} by {{ book.author }}" loading="lazy">
      {% else %}
      <div class="music-thumb book-cover-blank"><span>{{ book.title }}</span></div>
      {% endif %}
      {% if book.summary and book.summary != "" %}<p class="music-note book-note">{{ book.summary }}</p>{% endif %}
    </div>
    {% if book.link %}<a class="book-link" href="{{ book.link }}" title="{{ book.title }}" target="_blank" rel="noopener">{{ book.title }}</a>{% endif %}
  </li>
{% endfor %}
</ul>
{% endif %}
{% endfor %}

<p class="shelf-updated">Last updated: {{ site.time | date: "%-d %B %Y" }}</p>
