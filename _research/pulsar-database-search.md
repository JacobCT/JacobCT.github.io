---
title: "Improving Pulsar Database Search Algorithms"
permalink: /research/pulsar-database-search-algorithms/
research_group: "past"
order: 5
card_number: "05"
area: "Scientific computing"
summary: "Replacing a linear search through more than 20,000 Arecibo pointings with a coordinate-aware binary-search workflow."
teaser: "/images/research/AreciboCode.png"
teaser_alt: "Code and timing results from the Arecibo database search project"
topics:
  - Python
  - Bash
  - Arecibo
header:
  og_image: "research/AreciboCode.png"
---

<p class="research-project__lead">This undergraduate project turned a slow manual search through Arecibo drift-scan observations into a reproducible coordinate-based workflow.</p>

<div class="research-project__meta" aria-label="Project details">
  <div><span>Data set</span><strong>20,000+ pointings</strong></div>
  <div><span>Tools</span><strong>Python and Bash</strong></div>
  <div><span>Runtime</span><strong>13 hours to 54 minutes</strong></div>
</div>

## Overview

This was my first formal undergraduate research project at West Virginia University. It began as an analysis of the sensitivity of the Arecibo drift-scan survey, but much of the work shifted toward improving the software used to locate pulsars and relevant pointings in the survey database.

A source can appear in multiple pointings whose files are stored far apart, making a manual search impractical. Because the pointing directories encode right ascension and declination, we calculated the area covered by Arecibo's beam and identified the coordinates at which a target could have been observed. A binary-search algorithm could then efficiently locate the relevant files.

The previous linear search took about 13 hours to traverse the full database. The revised workflow reduced that runtime to approximately 54 minutes.

## Project resource

<a class="research-resource" href="{{ '/files/pdf/research/JacobCT_SymposiumOnlyPoster.pdf' | relative_url }}">
  <img src="{{ '/images/research/AreciboCode.png' | relative_url }}" alt="Arecibo drift-scan database search poster preview">
  <span>View the project poster <span aria-hidden="true">&rarr;</span></span>
</a>
