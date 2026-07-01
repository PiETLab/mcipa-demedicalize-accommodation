# Contributing to mcipa-demedicalize-accommodation

> **Prototype / Provisional** — this is a single-writer project in active development.
> Contributions are welcome, but the repository is primarily maintained by one person during this phase.

## Who this guide is for

This guide is written for the primary maintainer (and anyone handed off to) who edits content and manages the site day-to-day, with no assumed Git expertise beyond the basics.

## The short version

1. Edit Markdown files in the `content/` folder.
2. Commit your changes with a clear message.
3. Push to `main`.
4. The site rebuilds automatically (usually within 2–3 minutes).

See [docs/publishing-workflow.md](docs/publishing-workflow.md) for a step-by-step walkthrough.

## File naming rules

- Lowercase, hyphenated, URL-safe.
- Use `YYYY-MM-DD-` prefix for dated files (e.g. `2024-06-01-meeting-notes.md`).
- No spaces, no special characters.

Full rules: [docs/naming-conventions.md](docs/naming-conventions.md).

## Branch model

- One branch: `main`. All routine edits go directly to `main`.
- No pull requests required for content edits.
- For structural or infrastructure changes (new workflows, config changes), consider opening a PR for reviewability.

## Issue tracking

Use GitHub Issues in this repository:

- [Bug report](https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/new?template=bug-report.yml) — something is broken
- [Content update request](https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/new?template=content-update-request.yml) — request a content change
- [Site infrastructure issue](https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/new?template=site-infrastructure.yml) — build, deploy, or config problem

## Questions / help

Open an issue or see [docs/troubleshooting.md](docs/troubleshooting.md) for common problems.
