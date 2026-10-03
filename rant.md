---
layout: page
title: Rant
published: false
permalink: /rant/
---
{% assign reversed_rants = site.rants | reverse %}
{% include post-list.html posts=reversed_rants %}
