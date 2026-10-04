---
layout: page
title: Research
permalink: /research/
---
{% comment %} _data/publications.yml is kept newest first; projects follow the order of their newest paper there {% endcomment %}
<ul class="post-list">
{% assign seen = "" %}
{% for paper in site.data.publications %}{% for project in site.research %}{% if project.papers contains paper.id %}{% unless seen contains project.url %}{% assign seen = seen | append: project.url %}{% assign years = "" | split: "" %}{% for id in project.papers %}{% assign p = site.data.publications | where: "id", id | first %}{% assign years = years | push: p.year %}{% endfor %}{% assign years = years | sort %}{% assign k = "" | split: "" | push: years.last | push: years.first %}
  <li>
    <span class="post-date">{% if k[0] == k[1] %}{{ k[0] }}{% else %}{{ k[1] }}–{{ k[0] }}{% endif %}</span>
    <div class="project-text">
      <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
      {% if project.summary %}<span class="project-summary">{{ project.summary }}</span>{% endif %}
      {% if project.hero %}<a class="project-hero-link" href="{{ project.url | relative_url }}" tabindex="-1" aria-hidden="true">{% include {{ project.hero }} %}</a>{% endif %}
    </div>
  </li>
{% endunless %}{% endif %}{% endfor %}{% endfor %}
</ul>

## {% include t.html en="Publications" hi="पब्लिकेशन्स" %}

<ul class="paper-list">
{% for paper in site.data.publications %}{% include paper.html paper=paper %}{% endfor %}
</ul>
