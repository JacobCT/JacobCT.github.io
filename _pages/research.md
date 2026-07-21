---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
excerpt: "Projects spanning pulsar emission, propagation effects, fast radio bursts, scientific computing, and gravitational-wave astronomy."
header:
  overlay_image: "/images/VLA_Cropped.jpg"
  og_image: "research/J2145_DMvar.png"
---

{% assign projects = site.research | sort: "order" %}

<section class="research-intro" aria-labelledby="research-overview-title">
  <div>
    <p class="eyebrow">Research overview</p>
    <h2 id="research-overview-title">Studying compact objects through radio observations and data analysis.</h2>
    <p class="research-intro__lead">My work focuses on pulsars and fast radio bursts, including wide-band emission, dispersion-measure variations, signal simulations, and searches for new sources. These projects have used data from Arecibo, CHIME, Effelsberg, and the Green Bank Telescope, often in collaboration with the pulsar-timing community.</p>
  </div>
  <div class="research-count" aria-label="{{ projects | size }} research projects">
    <strong>{{ projects | size }}</strong>
    <span>Project areas</span>
  </div>
</section>

<section class="research-projects" aria-labelledby="research-projects-title">
  <div class="section-heading">
    <p class="eyebrow">Selected work</p>
    <h2 id="research-projects-title">Explore the projects</h2>
  </div>

  <div class="research-grid">
    {% for project in projects %}
      {% include research-card.html project=project %}
    {% endfor %}
  </div>
</section>

<aside class="research-contact" aria-labelledby="research-contact-title">
  <div>
    <p class="eyebrow">Questions or collaboration</p>
    <h2 id="research-contact-title">Interested in the work?</h2>
  </div>
  <p>I am always happy to discuss these projects, their methods, and related research ideas. <a class="text-link" href="mailto:{{ site.author.email }}">Get in touch &rarr;</a></p>
</aside>
