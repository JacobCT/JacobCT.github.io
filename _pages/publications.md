---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% assign publications = site.publications | sort: "date" | reverse %}

<section class="publications-intro" aria-labelledby="publications-intro-title">
  <div>
    <p class="eyebrow">Published work</p>
    <h2 id="publications-intro-title">Research articles and open resources</h2>
    <p class="publications-intro__lead">Journal articles and preprints in radio astronomy and gravitational-wave astrophysics, with direct access to publication records, preprints, software, and supporting data where available.</p>
  </div>
  <div class="publications-count" aria-label="Publication count">
    <strong>{{ publications | size }}</strong>
    <span>Publications</span>
  </div>
</section>

<div class="publications-list">
  {% for publication in publications %}
    {% include publication-card.html publication=publication %}
  {% endfor %}
</div>

{% if publications.size == 0 %}
  <p>No publications have been added yet.</p>
{% endif %}
