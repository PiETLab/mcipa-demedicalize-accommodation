# Minimum Issue Label Set (Sabine)

## Purpose

Give a simple, stable label set for routine issue triage in MVP.
This guide defines the human triage taxonomy; repository label creation is a separate technical setup step.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

## Use these five labels

1. `site-infrastructure`
- Use when: issue affects Quartz build/deploy, GitHub Pages, workflows, repository plumbing.

2. `content`
- Use when: issue is a content edit, page change, wording fix, or new page request.

3. `accessibility`
- Use when: issue affects readability, structure, alt text, navigation, or inclusion.

4. `question`
- Use when: issue requests clarification before making a change.

5. `triage-needed`
- Use when: new issue has not yet been categorized.

## Routine triage sequence

1. Open or review issue.
2. Add `triage-needed` if not yet classified.
3. Add one primary type label from this set.
4. Remove `triage-needed` after classification.
5. Add a short next-step comment.

## Constraints for MVP

- Keep the set small; do not add extra labels unless Melanie asks.
- Always keep `site-infrastructure` available.
- If uncertain between labels, use `question` and escalate.

## Related docs

- `nodes/node-issue-handling-guide.md`
- `nodes/node-publishing-workflow-guide.md`
