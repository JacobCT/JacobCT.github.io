---
title: "Optimal Frequency Channelization for Pulsar Dispersion Measurements"
permalink: /research/optimal-frequency-channelization/
research_group: "past"
order: 2
card_number: "02"
area: "Signal simulation"
summary: "Using simulated telescope data to determine how frequency resolution and signal-to-noise affect dispersion-measure precision."
teaser: "/images/research/DM_freq_pic.png"
teaser_alt: "Poster figure illustrating optimal frequency channelization"
topics:
  - Pulsar timing
  - Dispersion measure
  - Simulation
header:
  og_image: "research/DM_freq_pic.png"
---

<p class="research-project__lead">This project examines how the number of frequency channels used to process an observation changes the precision of a pulsar's measured dispersion measure.</p>

<div class="research-project__meta" aria-label="Project details">
  <div><span>Approach</span><strong>Simulated observations</strong></div>
  <div><span>Instruments</span><strong>GBT and Arecibo</strong></div>
  <div><span>Focus</span><strong>DM measurement precision</strong></div>
</div>

## Overview

Before pulsar observations are analysed, frequency channels are often combined, or “scrunched,” to reduce the data volume. Depending on the telescope, data may be reduced to powers of two up to 2,048 channels. The choice matters: more channels improve frequency resolution, but the signal-to-noise ratio in each channel decreases.

The goal is to find a balance that preserves enough resolution to measure dispersion accurately while keeping the signal bright enough for a reliable fit. The optimum is expected to vary with the telescope and pulsar because it depends on instrumental characteristics as well as the signal's brightness and profile shape.

For this work, observations are simulated from Green Bank Telescope and Arecibo data with the Pulsar Signal Simulator. The resulting measurements are used to test how channelization affects the uncertainty in dispersion measure.

## Project resource

The poster below was presented at the 2022 International Astronomical Union General Assembly in Busan, South Korea.

<a class="research-resource" href="{{ '/files/pdf/research/IAUGA_ePoster_JacobCardinalTremblay.pdf' | relative_url }}">
  <img src="{{ '/images/research/DM_freq_pic.png' | relative_url }}" alt="Optimal Frequency Channelization poster preview">
  <span>View the conference poster <span aria-hidden="true">&rarr;</span></span>
</a>
