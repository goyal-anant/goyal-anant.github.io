---
layout: page
title: Rant
permalink: /rant/
---
{% assign reversed_rants = site.rants | reverse %}
{% include post-list.html posts=reversed_rants %}
