---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
excerpt: "Coursework, observational analyses, scientific programming, and outreach projects from across my physics and astronomy training."
header:
  overlay_image: "/images/projects/AstroClubGroup.JPG"
  overlay_filter: 0.52
  og_image: "projects/AstroClubGroup.JPG"
---

{% assign projects = site.projects | sort: "order" %}

<section class="research-intro projects-intro" aria-labelledby="projects-overview-title">
  <div>
    <p class="eyebrow">Project portfolio</p>
    <h2 id="projects-overview-title">Practical work across astronomy, data analysis, and science communication.</h2>
    <p class="research-intro__lead">This collection brings together selected coursework, observational analyses, technical reports, programming exercises, and outreach activities. Open any project for its background, key results, and associated report, poster, code, or image collection.</p>
  </div>
  <div class="research-count" aria-label="{{ projects | size }} portfolio projects">
    <strong>{{ projects | size }}</strong>
    <span>Project entries</span>
  </div>
</section>

<section class="research-projects" aria-labelledby="projects-list-title">
  <div class="section-heading">
    <p class="eyebrow">Selected work</p>
    <h2 id="projects-list-title">Explore the portfolio</h2>
  </div>

  <div class="research-grid projects-grid">
    {% for project in projects %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<aside class="research-contact projects-contact" aria-labelledby="projects-contact-title">
  <div>
    <p class="eyebrow">More technical work</p>
    <h2 id="projects-contact-title">Browse the code</h2>
  </div>
  <p>Additional course exercises, analysis notebooks, and programming projects are available on my GitHub profile. <a class="text-link" href="https://github.com/JacobCT">Visit GitHub &rarr;</a></p>
</aside>
