# Prototype Status

**Status page updated:** 2026-11-02  
**Last remote-system verification:** 2026-10-06  
**Release snapshot:** [`actionforge-pilot-follow-up-1`](https://github.com/PiETLab/mcipa-demedicalize-accommodation/tree/actionforge-pilot-follow-up-1)

ActionForge is a prototype workflow for collaboratively reviewing and maintaining public documents. It combines versioned Markdown content, GitHub, Quartz web publishing, contextual feedback controls, a Cloudflare Worker, and structured GitHub issues.

## Implemented and verified

The 2026-10-06 remote verification established that:

- the public site, advocacy paper, Public Feedback Policy, and Prototype Status page were reachable;
- page-level feedback was available;
- passage-level feedback controls and selected-text feedback were active;
- feedback could retain document context, including quotation, page and passage links, headings, and publication metadata;
- the feedback service created structured GitHub issues through a dedicated service account;
- issue records included source and object labels; and
- authorized facilitation could be identified through a facilitator source label.

The workflow supports feedback without requiring contributors to navigate the project repository directly.

## Public-feedback boundary

Feedback submitted through ActionForge may become a public GitHub issue. Do not submit medical, accommodation, student, confidential, or other identifying information. Read the [[Public Feedback Policy]] before contributing.

## What this prototype does not yet establish

ActionForge is undergoing ongoing evaluation for usability, assistive-technology accessibility, long-term reliability, sustained adoption, or governance quality. It does not provide private case management, routine multi-author Git collaboration, complex permission controls, large-scale moderation, or offline-first work.

The project has not yet completed an end-to-end failure-recovery check to confirm whether entered feedback is preserved if a submission fails.

## Next work

Current development priorities are:

1. add an inline public-data warning at the submission decision point;
2. test failure recovery without creating a public issue;
3. improve document navigation and feedback-lifecycle visibility;
4. conduct independent usability and accessibility evaluation; and
5. develop visible governance records for review responsibility, decisions, revisions, and contributor follow-through.