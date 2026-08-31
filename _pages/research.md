---
layout: archive
classes: research-page
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: "/images/VLA_Cropped.jpg"
  og_image: "research/J2145_DMvar.png"
---

{% assign projects = site.research | sort: "order" %}
{% assign current_projects = projects | where: "research_group", "current" %}
{% assign collaboration_projects = projects | where: "research_group", "collaboration" %}
{% assign past_projects = projects | where: "research_group", "past" %}

<section class="research-intro research-intro--with-portrait" aria-labelledby="research-overview-title">
  <div>
    <p class="eyebrow">Research overview</p>
    <h2 id="research-overview-title">The hunt has started!</h2>
    <p class="research-intro__lead">I believe that the first confirmed detection of continuous gravitational waves with pulsar timing arrays will result from a targeted search. My research therefore focuses on developing and improving multimessenger techniques for individual supermassive black-hole binaries. Achieving such a detection will require advances on several fronts: higher-quality pulsar timing data; enhanced search techniques; more frequent, comprehensive, and precise electromagnetic observations of candidate binaries; and improved source modelling that connects electromagnetic observables directly to gravitational-wave parameters. Through my work, I aim to make significant advances in each of these areas and help establish a robust pathway toward the first detection of an individual continuous gravitational-wave source.
    <!-- My research spans targeted and all-sky gravitational-wave searches, electromagnetic observations, and statistical inference to test candidate supermassive black-hole binaries and develop them as cosmological probes. I also work on pulsar observations and machine-learning approaches to radio-frequency interference.</p> -->
    </p>
  </div>
  <div class="research-intro__visual">
    <img src="{{ '/images/site/greenbank-telescope-evening.jpg' | relative_url }}" alt="The Green Bank Telescope beneath a pink evening sky">
    <div class="research-count research-intro__count" aria-label="{{ projects | size }} research projects">
      <strong>{{ projects | size }}</strong>
      <span>Research projects</span>
    </div>
  </div>
</section>

<section class="research-section" aria-labelledby="current-research-title">
  <div class="section-heading research-section__heading">
    <div>
      <p class="eyebrow">Current research</p>
      <h2 id="current-research-title">Nanohertz gravitational waves</h2>
    </div>
    <p class="research-section__lede">My current research centres on the search for individual supermassive black-hole binaries in the nanohertz gravitational-wave band. I combine pulsar-timing-array data with electromagnetic observations to test proposed binary candidates, constrain their physical properties, and determine whether independent data sets tell a consistent story. This includes my first-author multimessenger study of 3C 66B, the development of posterior-tension tests for challenging candidate systems, and work on targeted standard sirens as a new route to measuring the expansion of the Universe. I also contributed the frequentist component of the PPTA DR3 all-sky continuous-wave search, where we can search our entire dataset for any signal. Alongside this gravitational-wave programme, I am developing machine-learning methods to identify radio-frequency interference and improve the reliability of the pulsar observations on which precision timing depends.</p>
  </div>
  <div class="research-grid">
    {% for project in current_projects %}
      {% include research-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section class="research-section" aria-labelledby="collaboration-research-title">
  <div class="section-heading research-section__heading">
    <div>
      <p class="eyebrow">Collaboration research</p>
      <h2 id="collaboration-research-title">PPTA, IPTA, and LISA collaboration</h2>
    </div>
    <p class="research-section__lede">Pulsar-timing-array science is built on long observing campaigns, careful data validation, and close collaboration across a wide range of expertise. Within the Parkes Pulsar Timing Array, I contribute to this broader programme primarily by performing pulsar observations and by reviewing analyses and manuscripts. Collaboration projects that I have directly contributed to include: testing whether PTAs can constrain extremely massive binaries at cosmic dawn, searching for eccentric binaries in OJ 287 and nearby galaxy clusters, looking for anisotropy in the gravitational-wave background, and improving timing through frequency- and phase-resolved polarimetric templates. Although I do not lead the central analyses in these papers, the observational and review work helps ensure that the underlying data products and scientific conclusions are robust. As a member of the International Pulsar Timing Array, I actively participate in the Gravitational Wave Analysis Working Group and plan to contribute to the analysis of IPTA DR3, especially the continuous gravitational wave searches. I am also a LISA community member. I follow the mission's scientific development closely, and continually look for opportunities to connect PTA and LISA science through shared questions in multimessenger astronomy, source modelling, and massive-black-hole evolution.</p>
  </div>
  <div class="research-grid research-grid--compact">
    {% for project in collaboration_projects %}
      {% include research-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section class="research-section" aria-labelledby="past-research-title">
  <div class="section-heading research-section__heading">
    <div>
      <p class="eyebrow">Past research</p>
      <h2 id="past-research-title">Pulsars, fast radio bursts, and scientific computing</h2>
    </div>
    <p class="research-section__lede">My earlier research established the observational, computational, and statistical foundation for my current work in pulsar timing and gravitational-wave astronomy. During my MSc, I used Effelsberg's ultra-broadband receiver to study how pulsar emission evolves across 1.3–6 GHz while developing statistical approaches to mitigate radio-frequency interference. My work on the repeating source FRB 121102 included a search for periodic structure in a dense sample of burst arrival times, contributing to a substantially expanded burst catalogue. Other projects examined short-timescale dispersion-measure variations with CHIME, the effect of frequency channelisation on dispersion measurements, and practical searches for pulsar candidates in Arecibo and Fermi data. I also developed faster coordinate-aware tools for searching large observational databases and gained experience with experimental instrumentation, control software, and public science demonstrations. Collectively, these projects taught me how telescope data move from acquisition and cleaning through statistical analysis to physical interpretation.</p>
  </div>
  <div class="research-grid">
    {% for project in past_projects %}
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
