---
layout: page
title: Projects
permalink: /projects/
---
<ul class="post-list">
{% for project in site.projects %}
  <li>
    <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
    {% if project.summary %}<span class="project-summary">{{ project.summary }}</span>{% endif %}
  </li>
{% endfor %}
</ul>
