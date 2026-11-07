---
layout: home
title: Home
title_hi: होम
permalink: /
---
{% include t.html en="research, writing, music, books, and opinions." hi="रिसर्च, लेखन, म्यूज़िक, किताबें और राय।" %}

<figure class="home-art">
  <svg id="home-art" viewBox="0 0 544 627" role="img" aria-label="Abstract drawing: a maroon disc resting on a yellow brush stroke, a small indigo square, and an ink line that knots up and then runs straight to a dot" data-hi-aria-label="अमूर्त चित्र: पीले ब्रश स्ट्रोक पर टिका एक मैरून गोला, एक छोटा नीला वर्ग, और एक स्याही की रेखा जो उलझती है और फिर सीधी एक बिंदु तक जाती है"></svg>
</figure>
<script src="{{ '/assets/js/abstract-art.js' | relative_url }}"></script>
<script>drawAbstractArt(document.getElementById('home-art'), { animate: true });</script>
