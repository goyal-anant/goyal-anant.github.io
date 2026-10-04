---
layout: page
title: Music
permalink: /music/
---

<p class="shelf-hint" lang="en">These are the songs I keep going back to: some for the lyrics, some for the voice, and some for reasons I can't put in words. It is a rough list and it will keep changing, the way taste does. Press a record to hear a preview and press it again to pause; to hear the full song, press its title. The music speaks for itself :)</p>
<p class="shelf-hint" lang="hi">ये वो गाने हैं जिन पर मैं बार-बार लौट आता हूँ: कुछ बोलों के लिए, कुछ आवाज़ के लिए, और कुछ ऐसी वजहों से जो मैं शब्दों में नहीं कह सकता। ये एक कच्ची लिस्ट है और बदलती रहेगी, जैसे पसंद बदलती है। किसी रिकॉर्ड को दबाओ तो प्रीव्यू सुनाई देगा, दोबारा दबाओ तो रुक जाएगा; पूरा गाना सुनना हो तो उसके नाम पर दबाओ। बाक़ी म्यूज़िक ख़ुद बोलता है :)</p>

<p class="shelf-hint" lang="en">If you don't know where to start, press 'Play all' below to hear every song on the page, or 'Play genre' next to a genre to hear only that one. Turn on the shuffle button next to 'Play all' and the page picks the order for you. To skip ahead in a song, drag the bar under it.</p>
<p class="shelf-hint" lang="hi">समझ न आए कहाँ से शुरू करें, तो नीचे 'सब चलाओ' दबाओ और पेज के सारे गाने सुनो, या किसी जॉनर के आगे 'इसे चलाओ' दबाओ और सिर्फ़ वही सुनो। 'सब चलाओ' के बगल वाला शफ़ल बटन ऑन कर दो तो क्रम पेज ख़ुद चुन लेगा। गाने में आगे जाना हो तो उसके नीचे वाली पट्टी खींचो।</p>

{% assign genres = "sufi:Sufi &amp; Qawwali:सूफ़ी और क़व्वाली,ghazal:Ghazal:ग़ज़ल,classical:Classical &amp; Semi-classical:शास्त्रीय और उप-शास्त्रीय,film:Film:फ़िल्मी,rock:Rock:रॉक,pop-folk:Pop &amp; Folk:पॉप और लोक,punjabi:Punjabi:पंजाबी,indie:Indie &amp; Indi-pop:इंडी और इंडी-पॉप,soul-reggae-blues:Soul&#44; Reggae &amp; Blues:सोल&#44; रेगे और ब्लूज़" | split: "," %}
<nav class="genre-nav" aria-label="Genres">
{% for genre in genres %}
{% assign parts = genre | split: ":" %}{% assign label_en = parts[1] %}{% assign label_hi = parts[2] %}
{% assign keys = parts[0] | split: "-" | push: parts[0] %}
{% assign tracks = site.data.music | where_exp: "t", "keys contains t.genre" %}
{% if tracks.size > 0 %}<a href="#{{ parts[0] }}">{% include t.html en=label_en hi=label_hi %}</a>{% endif %}
{% endfor %}
</nav>

<div class="music-bar">
  <button class="music-queue" type="button" data-queue="all" aria-pressed="false">{% include t.html en="Play all" hi="सब चलाओ" %}</button>
  <button class="music-bar-icon music-shuffle" type="button" aria-label="Shuffle" title="Shuffle" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h3.5c2 0 3.2 1 4.3 2.7l2.4 4.6c1.1 1.7 2.3 2.7 4.3 2.7H21M3 17h3.5c2 0 3.2-1 4.3-2.7m2.4-4.6c1.1-1.7 2.3-2.7 4.3-2.7H21M18 4l3 3-3 3M18 14l3 3-3 3"/></svg></button>
  <span class="music-bar-now" hidden>
    <button class="music-bar-title" type="button" title="Show this song"></button>
    <button class="music-bar-icon music-bar-pause" type="button" aria-label="Pause" title="Pause"><svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z"/></svg><svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button>
    <button class="music-bar-icon music-bar-skip" type="button" aria-label="Next song" title="Next song"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14l10-7zM16 5h3v14h-3z"/></svg></button>
    <button class="music-bar-icon music-bar-stop" type="button" aria-label="Stop" title="Stop"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1"/></svg></button>
  </span>
</div>

{% for genre in genres %}
{% assign parts = genre | split: ":" %}{% assign label_en = parts[1] %}{% assign label_hi = parts[2] %}
{% comment %}A song tagged with one word of a section ("reggae", "pop") goes in that section.{% endcomment %}
{% assign keys = parts[0] | split: "-" | push: parts[0] %}
{% assign tracks = site.data.music | where_exp: "t", "keys contains t.genre" | sort_natural: "title" %}
{% if tracks.size > 0 %}
<h2 class="shelf-heading" id="{{ parts[0] }}"><span class="genre-name">{% include t.html en=label_en hi=label_hi %}</span> <button class="music-queue" type="button" data-queue="section" aria-pressed="false"><span class="queue-idle">{% include t.html en="Play genre" hi="इसे चलाओ" %}</span><span class="queue-stop">{% include t.html en="Stop" hi="रोको" %}</span></button></h2>
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
