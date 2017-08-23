---
layout: page
title: Projects
permalink: /projects/
---

These are some of the more presentable projects I have. 

{% for project in site.data.projects %}
<div class="project-entry">
  <div class="project-name">{{ project.name }}</div>
  <div class="project-description">{{ project.description }}</div>
  <div class="project-links"><a href="{{ project.source }}">source code</a></div>
</div>
{% endfor %}
