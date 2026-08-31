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
    <p class="publications-intro__lead">Journal articles and preprints in radio astronomy and gravitational-wave astrophysics.</p>
    <p class="publications-intro__press-link"><a class="text-link" href="#press-section-title">See selected features in the press <span aria-hidden="true">&darr;</span></a></p>
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

<section class="press-section" aria-labelledby="press-section-title">
  <div class="press-section__heading">
    <p class="eyebrow">Press &amp; recognition</p>
    <h2 id="press-section-title">Selected features</h2>
    <p>Research coverage and profiles highlighting my work in gravitational-wave astronomy and earlier pulsar research.</p>
  </div>

  <div class="press-grid">
    <article class="press-card">
      <a class="press-card__visual" href="https://aasnova.org/2026/03/18/a-search-for-a-supermassive-black-hole-binary/" target="_blank" rel="noopener noreferrer" aria-label="Read A Search for a Supermassive Black Hole Binary on AAS Nova">
        <img src="{{ '/images/press/aas-nova-3c66b.jpg' | relative_url }}" alt="Simulation visualization of a supermassive black-hole binary" loading="lazy">
      </a>
      <div class="press-card__body">
        <p class="press-card__meta"><span>AAS Nova</span><time datetime="2026-03-18">18 March 2026</time></p>
        <h3><a href="https://aasnova.org/2026/03/18/a-search-for-a-supermassive-black-hole-binary/" target="_blank" rel="noopener noreferrer">A Search for a Supermassive Black Hole Binary</a></h3>
        <p>A feature on my first-author multimessenger search for the proposed binary in 3C 66B, combining PPTA DR3 with electromagnetic constraints.</p>
        <a class="press-card__link" href="https://aasnova.org/2026/03/18/a-search-for-a-supermassive-black-hole-binary/" target="_blank" rel="noopener noreferrer">Read the feature <span aria-hidden="true">&rarr;</span></a>
      </div>
    </article>

    <article class="press-card">
      <a class="press-card__visual press-card__visual--contain" href="https://gwac.wvu.edu/blog/news-events/2020/05/18/jacob-cardinal-tremblay-wins-endowed-physics-scholarship" target="_blank" rel="noopener noreferrer" aria-label="Read Jacob Cardinal Tremblay Wins Endowed Physics Scholarship on the WVU website">
        <img src="{{ '/images/press/wvu-logo.png' | relative_url }}" alt="West Virginia University Flying WV logo" loading="lazy">
      </a>
      <div class="press-card__body">
        <p class="press-card__meta"><span>WVU Center for Gravitational Waves and Cosmology</span><time datetime="2020-05-18">18 May 2020</time></p>
        <h3><a href="https://gwac.wvu.edu/blog/news-events/2020/05/18/jacob-cardinal-tremblay-wins-endowed-physics-scholarship" target="_blank" rel="noopener noreferrer">Jacob Cardinal Tremblay Wins Endowed Physics Scholarship</a></h3>
        <p>A profile recognizing the Ratna and Vaman Naik Endowed Physics Scholarship and highlighting my undergraduate pulsar research.</p>
        <a class="press-card__link" href="https://gwac.wvu.edu/blog/news-events/2020/05/18/jacob-cardinal-tremblay-wins-endowed-physics-scholarship" target="_blank" rel="noopener noreferrer">Read the article <span aria-hidden="true">&rarr;</span></a>
      </div>
    </article>
  </div>
</section>
