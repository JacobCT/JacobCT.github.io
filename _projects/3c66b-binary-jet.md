---
title: "AGN, Jet & SMBHB Analytical Simulations"
permalink: /projects/3c66b-binary-jet/
card_url: /simulations/
card_cta: "Explore the simulations"
order: 0
area: "Interactive analytical models · 2026"
summary: "Explore active galactic nuclei, radio jets, and supermassive black hole binaries through interactive models of geometry, emission, and what an observer measures."
teaser: "/images/projects/smbhb-gravitational-waves.gif"
teaser_static: "/images/projects/smbhb-gravitational-waves.png"
teaser_alt: "Animation of two supermassive black holes orbiting one another, with a two-armed gravitational-wave pattern spreading outward"
topics:
  - Supermassive black holes
  - Radio jets
  - Interactive visualisation
header:
  og_image: "projects/3c66b-oblique.png"
---

<p class="research-project__lead">A collection of interactive analytical models exploring active galactic nuclei, radio jets, and supermassive black hole binaries, connecting physical assumptions to what an observer measures.</p>

<div class="research-project__meta" aria-label="Project details">
  <div><span>Subjects</span><strong>AGN, jets, and black hole binaries</strong></div>
  <div><span>Format</span><strong>Interactive analytical simulations</strong></div>
  <div><span>Models</span><strong>Geometry and radiative transfer</strong></div>
</div>

<div class="project-links">
  <a class="project-link" href="{{ '/simulations/' | relative_url }}">
    <span><strong>Explore the analytical simulations</strong><small>Choose a model of binary geometry or AGN jet emission</small></span>
    <span aria-hidden="true">&rarr;</span>
  </a>
</div>

<figure class="research-project__image">
  <a href="{{ '/simulations/' | relative_url }}"><img src="{{ '/images/projects/3c66b-oblique.png' | relative_url }}" alt="Oblique view of the binary and radio jet, with the 8.4 GHz and 2.3 GHz emission regions and their projections onto the sky plane" loading="lazy"></a>
  <figcaption>The simulation's oblique view connects the radio-core trajectories to their projections along the observer's line of sight.</figcaption>
</figure>

## From a binary orbit to radio-core motion

The [3C 66B binary simulation]({{ '/lab/3c66b/' | relative_url }}) illustrates the orbital-motion and jet-precession interpretation proposed by [Sudou et al. (2003)](https://arxiv.org/abs/astro-ph/0306103). The two observing frequencies trace emission regions at different distances along the jet. Their motion is projected onto the sky to produce ellipses in right ascension and declination, together with corresponding time traces.

The simulation includes an oblique view, a view along the line of sight, and a binary close-up. Adjustable parameters let you explore the orbital inclination, jet orientation, precession amplitude, core distances, and the separate contributions of orbital motion and jet precession. A tracing animation follows one full orbit, and the model coordinates can be downloaded as a CSV file.

## From jet emission to the apparent radio core

The separate [AGN jet emission and core-shift simulation]({{ '/lab/jet-core-shift/' | relative_url }}) follows synchrotron radio packets emitted along an absorbing conical jet at one selected observing frequency. Changing the frequency, plasma conditions, and viewing angle reveals how the apparent radio core shifts. An observer brightness strip, brightness and optical-depth profiles, and recent scientific references connect the emission model to its observables.

## Reading the model

Published ellipse fits are overlaid for comparison, while assumed three-dimensional parameters are identified in the controls. The geometry is illustrative: the paper does not uniquely determine the binary and jet configuration. The page also explains the frequency-dependent core shift and why the two radio-core ellipses can have different centers on the sky.
