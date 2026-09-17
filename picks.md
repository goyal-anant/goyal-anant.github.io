---
layout: page
title: Picks
permalink: /picks/
---
{% assign groups = site.data.picks | group_by: "type" %}
{% for group in groups %}
<h2 class="shelf-heading">{{ group.name | capitalize }}</h2>
<ul class="post-list">
{% for pick in group.items %}
  <li>
    <a href="{{ pick.link }}" target="_blank" rel="noopener">{{ pick.title }}</a>
    {% if pick.note %}<span class="project-summary">{{ pick.note }}</span>{% endif %}
  </li>
{% endfor %}
</ul>
{% endfor %}
