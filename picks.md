---
layout: page
title: Picks
title_hi: पसंद
permalink: /picks/
---

<p class="shelf-hint" lang="en">These are the things I use and would tell a friend to try, each with a line on why. It is a rough list and it will keep changing; whatever didn't survive goes to 'Ditched' at the bottom. Books and songs have their own pages: the <a href="{{ '/bookshelf/' | relative_url }}">bookshelf</a> and <a href="{{ '/music/' | relative_url }}">music</a>.</p>
<p class="shelf-hint" lang="hi">ये वो चीज़ें हैं जो मैं इस्तेमाल करता हूँ और किसी दोस्त को भी आज़माने को कहूँगा, हर एक के साथ एक लाइन कि क्यों। ये एक कच्ची लिस्ट है और बदलती रहेगी; जो टिक नहीं पाया वो नीचे 'छोड़ दिए' में चला जाता है। किताबों और गानों के अपने पेज हैं: <a href="{{ '/bookshelf/' | relative_url }}">किताबें</a> और <a href="{{ '/music/' | relative_url }}">म्यूज़िक</a>।</p>

{% assign sections = "watch:Watch:देखने लायक,research:Research kit:रिसर्च का सामान,apps:Mac apps:Mac ऐप्स,gadgets:Gadgets:गैजेट्स,ditched:Ditched:छोड़ दिए" | split: "," %}
{% for section in sections %}
{% assign parts = section | split: ":" %}{% assign label_en = parts[1] %}{% assign label_hi = parts[2] %}
{% assign picks = site.data.picks | where: "section", parts[0] %}
{% if picks.size > 0 %}
<h2 class="shelf-heading">{% include t.html en=label_en hi=label_hi %}</h2>
{% if parts[0] == "watch" %}
<p class="shelf-hint" lang="en">Hover over a poster (or tap it, on a phone) for my take. The movies live on my <a href="https://boxd.it/6fyDr" target="_blank" rel="noopener">Letterboxd</a>.</p>
<p class="shelf-hint" lang="hi">मेरी राय पढ़नी हो तो पोस्टर पर माउस ले जाओ (फ़ोन पर टैप करो)। फ़िल्मों की पूरी लिस्ट मेरे <a href="https://boxd.it/6fyDr" target="_blank" rel="noopener">Letterboxd</a> पर है।</p>
<ul class="music-grid book-grid watch-grid">
{% for pick in picks %}
  <li class="music-card">
    <div class="music-thumb-wrap">
      <img class="music-thumb" src="{{ pick.thumbnail | relative_url }}" alt="{{ pick.title | escape }} poster" data-hi-alt="{{ pick.title | escape }} का पोस्टर" loading="lazy">
      <p class="music-note book-note">{% assign note_en = pick.note | escape %}{% assign note_hi = pick.note_hi | escape %}{% include t.html en=note_en hi=note_hi %}</p>
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
    <span class="project-summary">{% assign note_en = pick.note | escape %}{% assign note_hi = pick.note_hi | escape %}{% include t.html en=note_en hi=note_hi %}</span>
  </li>
{% endfor %}
</ul>
{% endif %}
{% endif %}
{% endfor %}
