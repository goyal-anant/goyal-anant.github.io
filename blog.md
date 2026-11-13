---
layout: page
title: Blog
title_hi: ब्लॉग
permalink: /blog/
---
{% comment %} parts of a series are listed through their cover {% endcomment %}
{% assign posts = site.posts | where_exp: "p", "p.part == nil" %}
{% include post-list.html posts=posts %}
