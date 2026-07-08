# File and Folder Naming Convention (Sabine)

## Purpose

Keep names predictable for publishing, links, and retrieval.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

## Core rules

1. Use lowercase only.
2. Use hyphens between words.
3. Keep names URL-safe.
4. Use ISO date format `YYYY-MM-DD` for dated files.

## Allowed characters

Use only:

- `a-z`
- `0-9`
- `-` (hyphen)

Avoid spaces, underscores, punctuation, emoji, and accented characters.

## What "URL-safe" means in practice

URL-safe means the name can appear in a web link without awkward encoding or broken paths.

Practical guidance:

- Use only lowercase letters, numbers, and hyphens.
- Do not use spaces (` `), underscores (`_`), or symbols such as `&`, `?`, `#`, `%`, `+`, `:`.
- Do not use accented or non-ASCII characters in file/folder names.

Examples:

- Good: `participant-feedback-2026.md`
- Good: `2026-07-01-session-notes.md`
- Avoid: `Participant Feedback 2026.md`
- Avoid: `session_notes.md`
- Avoid: `q&a-notes.md`

## Folder naming

Use short, descriptive, lowercase, hyphenated folder names.

Examples:

- `meeting-notes`
- `project-updates`
- `workshop-materials`

## File naming

For non-dated files:

- `short-topic-name.md`

Examples:

- `publishing-workflow-checklist.md`
- `accessibility-review-notes.md`

For dated files:

- `YYYY-MM-DD-short-topic-name.md`

Examples:

- `2026-07-01-workshop-planning.md`
- `2026-08-15-retrospective-notes.md`

## Quick validation checklist

- [ ] lowercase only
- [ ] words separated by hyphens
- [ ] no spaces or underscores
- [ ] only URL-safe characters
- [ ] dated files start with `YYYY-MM-DD`

## Correction rule

If a name violates this convention, rename it before commit.

## Related docs

- `pathways/path-sabine-execution-roadmap.md`
- `nodes/node-publishing-workflow-guide.md`
