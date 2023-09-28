---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: "/images/VLA_Cropped.jpg"
  og_image: "research/J2145_DMvar.png"
---

# Research

My research focuses on Pulsars and FRBs. In my projects I have used data from many important radio telescopes, such as Arecibo, CHIME, Effelsberg, and Greenbank in order to study different pulsars and their specific properties. I also simulate data and use this to predict properties which should be seen by these telescopes and help best determine how we should by observing certain pulsars. The majority of my work ihas been done in collaboration with the Nanohertz Observatory for Gravitational Waves (NANOGrav), in order to help them make the discovery of gravitational waves using Pulsar Timing Arrays.

Please feel free to contact me if you have any questions in regard to my research!
  

The following is a brief description of the research projects I have worked on.

### - Frequency Evolution Behaviour in Pulsars with the UBB Receiver
This project is the focus of my Masters thesis work at the Max Planck Institute for Radio Astronomy. The project involves using the novel Ultra-Broadband receiver, currently undergoing commissioning on the 100 meter Effelsberg Radio telescope. Because this receiver spans many GHz, the data we receive is contaminated with a lot of radio frequency interference (RFI). My work encompasses extensive signal processing to mitigate this RFI mostly on a statistical basis with the eventual goal to incorporate machine learning techniques before the end of the thesis. Simultaneously, I have also manually cleaned part of the data in order to conduct preliminary studies of the emission physics of pulsars. To arrive at a consistent theory which explains all observed emission features, phenomena such as moding, nulling, and profile evolution must be examined in the wide-band context. The UBB is capable of detecting radio emission in the frequency ranges from 1.3 GHz to 6 GHz, which makes it ideally suited for this task. As my thesis is still underway, there are likely many more topics we will explore. The presentation below is work that I presented at the compact objects session of the 2023 Annual Meeting of the German Astronomical Society in Berlin, Germany.

[![Wideband Observations of Pulsar Radio Emission](/images/research/TitlePageUBB.png "Wideband Observations of Pulsar Radio Emission")](https://docs.google.com/presentation/d/1W_YU1t0PZrDwPQFkpIiHPro_Ie6i_6Sk6rZZp-dyvMg/edit?usp=sharing)
*(Click on the image to open the file)*

### - Optimal Frequency Channelization for Pulsar Dispersion Measurements
I am currently finishing up this project, it is somewhat of a follow-up to the Pulsar Dispersion Measure project I worked on during the summer of 2020. Once observation data is taken, and before it is analyzed, it is important to determine the number of frequency channels with which to “scrunch” the data. Depending on the telescope, data are scrunched to powers of 2 all the way up to 2048. Because the number of frequency channels used can impact the uncertainty in the dispersion measure, it is important to choose what number of frequency channels is best. The higher the number of frequency channels we use, the better our resolution will be. However, this comes at a cost to the signal to noise ratio (SNR) which will decrease. In order to have a low error in DM we need to find the number of channels which has the highest resolution while at the same time being bright enough as to not affect the uncertainty. We expect the optimal number of frequency channels to change relative to the pulsar and the instrument used. This is because of many factors, such as the intrinsic characteristics of the telescope used, or even characteristics of the signal itself, such as the brightness or the shape of the signal produced by the pulsar. All data for this project is being simulated from GBT or Arecibo data using the Pulsar Signal Simulator, and a paper is currently being developed in the hopes that this work will be published soon. The poster below is work that I presented at the 2022 International Astronomers Union General Assembly in Busan, South Korea. 

[![Optimal Frequency Channelization](/images/research/DM_freq_pic.png "Optimal Frequency Channelization")](/files/pdf/research/IAUGA_ePoster_JacobCardinalTremblay.pdf)
*(Click on the image to open the file)*

### - Comprehensive Analysis of a Dense Sample of FRB 121102 Bursts
In this paper, we presented an analysis of a densely repeating sample of bursts from the first repeating fast radio burst, FRB 121102. We reanalysed the data used by Gourdji et al. (2019) and detected 93 additional bursts using our single-pulse search pipeline. Most of my contribution to this work was in the periodicity search. I used the Lomb-Scargle Periodicity algorithm to search the data for any trends which would show any signs of periodicity in the range of 100ms-1000s. However, no significant periodicity was detected in the LS search or any other of our search methods.

[![FRB 121102 Analysis](/images/research/FRB121102_Search.png "FRB 121102 Analysis")](https://arxiv.org/pdf/2107.05658.pdf)
*(Click on the image to open the file)*

### - Pulsar Dispersion Measure Variations with CHIME
This project was done under the Undergraduate Summer Research Program (SURP) at The University of Toronto. Under the supervision of Cherry Ng and James McKee, I worked to use the Canadian Hydrogen Mapping Experiment (CHIME) Telescope to evaluate trends in dispersion measure (DM) of pulsar timing array (PTA) pulsars. Most of the pulsars which we analysed were part of the NANOGrav dataset. We chose these pulsars, since the process of detecting gravitation waves from pulsar timing arrays must take into account variations in dispersion measure. This is because DM variations can contaminate the data used in gravitational wave analysis. In a very simplified way, we can basically describe dispersion measure as the amount of material between a pulsar and the earth. Normally, this value is consistent depending on the direction of the pulsar and its distance. However, there are some things which could affect dispersion measure. For example, events such as the pulsar's line of sight passing close to the sun, or if there are gas/plasma clouds which pass in front of the pulsar. One of the most important aspects of this project was the fact that we were able to use the CHIME telescope to make our observations. The CHIME telescope is able to make observations of a particular pulsar every single day, whereas typical NANOGrav observations are only made once every 3-4 weeks. This is particularly important for DM related projects, as variations in DM can occur in the timeframe of days to weeks. This means that typical NANOGrav observations are potentially missing interesting DM events, but with the efficacity of CHIME, we are able to study these events in close detail and possibly even pinpoint a cause. In the end, we were able to measure variations from 13 different pulsars in extreme detail. This included two pulsars which had variations due to passing near the line of sight to the sun, and a pulsar whose trends seem consistent with plasma lensing. The one downside with this project was that CHIME had not been online long enough to have enough data for long-term trends. As more time passes, and we can look at the trends in greater detail, we will be publishing these results.

[![Pulsar Dispersion Measure Variations with CHIME](/images/research/DMpic.png "Pulsar Dispersion Measure Variations with CHIME")](/files/pdf/research/JacobCT_SURPPoster.pdf)
*(Click on the image to open the file)*

### - Improving Pulsar Database Searching Algorithms
This was my first official research project as an undergraduate student at WVU. The initial goal of this project was to Analyse the sensitivity of the Arecibo drift scan. However, most of the work ended up shifting towards using BASH and Python to optimise a searching algorithm in order to go through drift-scan data from the Arecibo Telescope and find specific pulsars or pointings. Because the Arecibo drift scan has over 20,000 pointings, and a pulsar can potentially be found in multiple pointings whose files are not located near each other, it can be quite a hassle to go through each pointing manually and find data which includes the pulsar we are looking for. The pointing folders are named according to their right-ascention and declination. Therefore, in order to know which pointings contain the pulsar, we calculated the size of Arecibo's beam, and then determined all coordinated in which the pulsar could have been observed. Then we implemented the Binary Search algorithm which would then sort through all the files and rapidly tell us which files possibly contain the data we were looking for. In the end, in order to go through every single pointing, the previous linear search implementation would take about 13 hours whereas the binary search implementation we created reduced this time down to about 54 minutes.

[![An Analysis of the Sensitivity of the Arecibo Drift Scan Survey](/images/research/AreciboCode.png "An Analysis of the Sensitivity of the Arecibo Drift Scan Survey")](/files/pdf/research/JacobCT_SymposiumOnlyPoster.pdf)
*(Click on the image to open the file)*

### - Pulsar Searching
As it is the case for almost all undergraduates starting in pulsar research, I started out by analysing pulsar prepfold plots and looking for new pulsar candidates. I combed through the Arecibo drift scan database, and candidates from Fermi Gamma-Ray Sources. These visual plot evaluations were made in an effort to discover new millisecond pulsars to be used by NANOGrav in their pulsar timing array.


### - Previous research
#### Experimental Physics Research
During my work in experimental physics, I worked on multiple small projects, which included building a force sensor and computer program to analyse a gymnast’s landing for the Gymnastics Hall of Fame. A second project involved building circuits to control stepper-motors using LabView as an interface. Another task had been to analyzed smart-phone pixel arrangement to explain advantages of OLED displays. During this experimental research, I was also heavily involved in creating demos for outreach which included many areas of physics such as superconductors, lasers, electricity and magnetism, liquid nitrogen, amorphous metals, super-cooled cleaning, and photoluminescence.

