---
layout: page
title: Bookshelf
permalink: /bookshelf/
---

<p class="shelf-hint" lang="en">Hover over a cover in the Completed or Half-Done, Kept shelves (or tap it, if you are on a phone) to read my one-line take on the book; the rest I haven't earned an opinion on yet. Most of them are jokes, so no offense to the authors, the saints, or Kant :)</p>
<p class="shelf-hint" lang="hi">'पूरी हो गईं' या 'आधी पढ़ीं, रखी हुई' वाली शेल्फ़ में किसी कवर पर माउस ले जाओ (फ़ोन पर हो तो टैप करो) और उस किताब पर मेरी एक लाइन की राय पढ़ो; बाक़ी किताबों पर राय देने का हक़ मैंने अभी कमाया नहीं है। राय अंग्रेज़ी में ही हैं और ज़्यादातर मज़ाक हैं, तो लेखकों, संतों और कांट से माफ़ी :)</p>

{% assign shelves = "reading:Currently Reading:अभी पढ़ रहा हूँ,want-to-read:Want to Read:पढ़नी हैं,half-done:Half-Done&#44; Kept:आधी पढ़ीं&#44; रखी हुई,completed:Completed:पूरी हो गईं" | split: "," %}
{% for shelf in shelves %}
{% assign parts = shelf | split: ":" %}{% assign label_en = parts[1] %}{% assign label_hi = parts[2] %}
{% assign books = site.data.books | where: "status", parts[0] %}
{% if books.size > 0 %}
<h2 class="shelf-heading">{% include t.html en=label_en hi=label_hi %}</h2>
<ul class="music-grid book-grid">
{% for book in books %}
  <li class="music-card">
    <div class="music-thumb-wrap">
      {% if book.thumbnail %}
      <img class="music-thumb" src="{{ book.thumbnail | relative_url }}" alt="{{ book.title | escape }} by {{ book.author | escape }}" loading="lazy">
      {% else %}
      <div class="music-thumb book-cover-blank"><span>{{ book.title | escape }}</span></div>
      {% endif %}
      {% if book.summary and book.summary != "" %}<p class="music-note book-note">{{ book.summary | escape }}</p>{% endif %}
    </div>
    {% if book.link %}<a class="book-link" href="{{ book.link | escape }}" title="{{ book.title | escape }}" target="_blank" rel="noopener">{{ book.title | escape }}</a>{% endif %}
  </li>
{% endfor %}
</ul>
{% endif %}
{% endfor %}
