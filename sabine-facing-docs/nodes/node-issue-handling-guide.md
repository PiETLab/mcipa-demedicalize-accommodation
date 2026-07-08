# Issue Handling Guide (Sabine)

## Purpose

Provide a simple routine for creating, triaging, and updating issues without disrupting publishing workflow.

## Audience

Content Operator (Sabine).

## Scope

Use this guide for routine issue handling in the project repository.
Escalate non-routine cases to Melanie.

## Minimum labels

Use the agreed minimal label set. At minimum, include:

- `site-infrastructure`

Reference: `nodes/node-minimum-issue-label-set.md` for the full five-label MVP set and exact usage.

Add additional labels only if they are already part of the agreed project label set.

## When to open an issue

Open an issue when:

- a site behavior problem is repeatable
- a content change request needs tracking
- a task cannot be completed in one session
- a workflow problem needs follow-up

Do not open duplicate issues for the same problem; update the existing issue instead.

## Issue creation template (routine)

1. Title: short, concrete, action-oriented.
2. Context: where the problem/request appears.
3. Expected behavior/outcome.
4. Actual behavior/current state.
5. Reproduction steps (if technical issue).
6. Evidence (links, screenshots, timestamps).
7. Proposed next action.

## Triage workflow

1. Check if similar issue already exists.
2. If duplicate, link and close/redirect.
3. Apply label(s).
4. Add a clear next action.
5. Set owner or escalation note.
6. Post a short status update.

## Priority guidance (simple)

- High: blocks publishing or breaks core site behavior.
- Medium: workflow friction or important content correctness issue.
- Low: improvement or non-blocking cleanup.

If unsure between levels, choose Medium and ask Melanie.

## Escalation triggers

Escalate to Melanie when:

- issue blocks routine publish path
- issue suggests merge/conflict risk for Sabine
- issue affects auth, deployment, or repository permissions
- issue scope is ambiguous or cross-cutting

## Comment update pattern

Use short update comments:

- status now
- what was tried
- next step
- who is blocked (if anyone)

## Closure checklist

- [ ] Outcome verified
- [ ] Relevant docs updated (if process changed)
- [ ] Issue comments summarize resolution
- [ ] Related issue links added (if applicable)

## Related docs

- `nodes/node-publishing-workflow-guide.md`
- `pathways/path-sabine-execution-roadmap.md`
- `pathways/path-escalation-what-and-how.md`
