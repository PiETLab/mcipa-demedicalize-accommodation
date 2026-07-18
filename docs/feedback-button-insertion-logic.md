# Feedback Button Insertion Logic

This document explains how the button text "Give feedback on this passage" gets inserted into rendered page content, and what governs where insertion is allowed.

## Overview

The insertion flow has two linked stages:

1. Build-time marking of eligible content blocks in the HTML Abstract Syntax Tree (AST).
2. Runtime DOM insertion of feedback buttons next to those marked blocks.

Only content from Advocacy Paper is targeted.

## Stage 1: Build-Time Block Marking

Source file:
- quartz.config.ts

Primary component:
- PassageIdentifierTransformer

What it does:
1. Determines whether the current file is the target page using isTargetPage().
2. Walks HTML elements in the transformed markdown tree.
3. Limits eligibility to specific element tags.
4. Ensures each eligible block has a stable id.
5. Adds data-feedback-block="true" to eligible blocks.

### Target-Page Scope Rule

isTargetPage() is the first and strongest gate.

It recognizes Advocacy Paper via normalized slug/path candidates and matching keys, including forms like:
- advocacy-paper
- advocacy paper.md
- content/advocacy paper.md
- path suffix variants ending in advocacy-paper or advocacy paper.md

If a page does not match this scope, no feedback-block markers are added, and no passage buttons are inserted later.

### How Markdown Becomes These Elements

Quartz first parses each markdown file into an internal syntax tree, then runs configured transformer plugins in sequence.

In this project, markdown parsing and normalization passes (including Obsidian-flavored and GitHub-flavored markdown handling) run before PassageIdentifierTransformer in quartz.config.ts.

By the time PassageIdentifierTransformer executes, markdown constructs are already represented as HTML-like element nodes in the tree, for example:
- paragraph markdown -> p
- list items -> li
- block quotes -> blockquote
- fenced code blocks -> pre
- markdown tables -> table

PassageIdentifierTransformer does not parse raw markdown text directly. It reads these element nodes, applies page/tag/id eligibility rules, and marks allowed nodes with data-feedback-block="true".

### Eligible HTML Tags

Only this tag is marked as a feedback leaf block:
- p

Headings are not feedback leaves.

List-like paragraph lines can participate in paragraph-like leaves, for example:
- numbered lines such as `1. ...`
- bullet-like lines such as `- ...`, `* ...`, `• ...`, or `· ...`

Runtime insertion collapses contiguous list-like paragraph runs into one paragraph-like leaf so one button is placed after the combined run.

### ID Assignment and Stability

For each eligible block:
- If an explicit id exists, it is preserved.
- If no id exists, a fallback id is generated as feedback-block-<hash> based on page key and normalized text.
- Fallback collisions are resolved deterministically with numeric suffixes.
- Duplicate explicit ids raise a build-time error.

This guarantees that marked blocks have an id anchor, which is required for passage metadata and URL building.

## Stage 2: Runtime DOM Insertion

Source file:
- quartz.layout.ts

Primary component:
- PassageFeedbackControls
- attachControls()

What it does on each run:
1. Selects blocks with the marker selector article [data-feedback-block="true"].
2. Removes previously inserted controls to avoid duplication.
3. Skips blocks without id.
4. Skips blocks inside nav, footer, or .page-footer.
5. Creates a wrapper div with class passage-feedback-control.
6. Creates a button with class passage-feedback-button and text "Give feedback on this passage".
7. Adds an aria-label based on a quote preview from the block text.
8. Inserts the wrapper:
- after the paragraph itself for plain paragraph leaves
- after the trailing list-like entity for paragraph-like leaves (contiguous list-like paragraph run)

### Reattachment Behavior

Buttons are inserted:
- on initial load
- after Quartz SPA route changes via the nav event

This keeps controls present after client-side navigation.

## What Governs Where Buttons Get Inserted

Button insertion is governed by the intersection of these rules:

1. Page scope gate (build time):
- The page must be identified as Advocacy Paper by isTargetPage().

2. Tag eligibility gate (build time):
- The element must be p.

2.5. Heading-parent gate (runtime):
- The paragraph leaf must resolve to a nearest levelled heading (h2-h6) inside the article.

3. Marker gate (build time to runtime bridge):
- The element must have data-feedback-block="true".

4. DOM scope gate (runtime):
- The element must be inside article.

5. Anchor gate (runtime):
- The element must have an id.

6. Exclusion gate (runtime):
- The element must not be inside nav, footer, or .page-footer.

7. Placement rule (runtime):
- For paragraph leaves, insertion target is immediately after the paragraph.
- For list-like paragraph runs, only the first paragraph in the run emits a control and insertion target is the end of that run.

Only when all of the above pass will the button be injected.

## Why This Design Exists

- Predictable placement: only explicitly eligible content blocks get controls.
- Accessibility and clarity: buttons are tied to paragraph leaves and paragraph-like content units.
- Stability: deterministic ids support durable references and feedback metadata.
- SPA resilience: controls reattach after client-side navigation.

## Related Files

- quartz.config.ts
- quartz.layout.ts
- content/Advocacy Paper.md
- docs/public-feedback-phase-1.md

## Quick Verification Checklist

1. Build succeeds: npm run build
2. Generated Advocacy page blocks contain data-feedback-block="true"
3. Rendered Advocacy page shows passage-feedback-control wrappers after eligible blocks
4. Non-target pages do not receive passage buttons
5. SPA navigation away and back still shows controls
