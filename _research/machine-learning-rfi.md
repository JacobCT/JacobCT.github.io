---
title: "Machine Learning for RFI Mitigation"
permalink: /research/machine-learning-rfi/
research_group: "current"
order: 5
card_number: "05"
area: "Side project · Pulsar data quality"
year: 2025–present
status: "Ongoing"
role: "Co-lead with Jędrzej Jawor"
summary: "Training statistical classifiers on EPTA observations to identify radio-frequency interference in pulsar timing array data."
teaser: "/images/research/rfi-poster-discussion.jpg"
teaser_alt: "Jacob Cardinal Tremblay and Serena Valtolina discussing a machine-learning RFI poster"
topics:
  - Machine learning
  - RFI mitigation
  - EPTA
header:
  og_image: "research/rfi-poster-discussion.jpg"
---

<p class="research-project__lead">In this ongoing side project with Jędrzej Jawor, I am investigating whether machine-learning classifiers can identify radio-frequency interference from summary statistics and raw pulsar data. We aim to produce a machine learning model which can outperform current RFI mitigation algorithms.</p>

<div class="research-project__meta" aria-label="Project details">
  <div><span>Status</span><strong>Ongoing side project</strong></div>
  <div><span>Data</span><strong>EPTA · Effelsberg</strong></div>
  <div><span>Scale</span><strong>≈6 million channels</strong></div>
</div>

## From channel statistics to cleaner observations

The current classifier was evaluated on 74 Effelsberg observations of PSR J1643−1224, spanning roughly six million frequency channels. On this test set, it reached 94.06% accuracy, 90.62% precision, 99.17% recall, and an F1 score of 94.70%.

Initial timing tests are slightly more consistent after automated cleaning. The model does not yet generalise equally well to every backend—particularly ultra-broadband data—so the next steps include hyperparameter optimisation, alternative classifiers, and training across more pulsars and observing systems.

<div class="research-contribution"><strong>Current focus:</strong> improving generalisation while testing whether better RFI classification produces measurably more precise and reliable pulsar arrival times.</div>

<a class="research-resource research-resource--poster-preview" href="{{ '/files/pdf/research/machine-learning-rfi-poster.pdf' | relative_url }}">
  <img src="{{ '/images/research/machine-learning-rfi-poster-preview.png' | relative_url }}" alt="Preview of the Machine Learning for RFI Mitigation project poster" loading="lazy">
  <span>View the full project poster (PDF) <span aria-hidden="true">&rarr;</span></span>
</a>
