---
layout: page
title: Research
permalink: /research/
---
<ul class="post-list">
{% for project in site.research %}
  <li>
    <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
    {% if project.summary %}<span class="project-summary">{{ project.summary }}</span>{% endif %}
  </li>
{% endfor %}
</ul>
