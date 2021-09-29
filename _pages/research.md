---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
header:
  og_image: "research/J2145_DMvar.png"
---


  This is where I describe my research
 


{% include base_path %}

<div class="grid_wrapper">
{% assign ordered_pages = site.research | sort:"order_number" %}
  {% for post in ordered_pages %}
    {% include archive-single.html type="grid" %}
  {% endfor %}
</div>
