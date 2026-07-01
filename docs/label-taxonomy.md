# Label Taxonomy

This document defines the GitHub issue labels used in this repository.
Apply these labels when opening or triaging issues.

> **TODO:** Apply these labels in the GitHub UI under **Issues → Labels**.
> You can also import them via the [GitHub CLI](https://cli.github.com/) using `gh label create`.

## Labels

| Label | Color (hex) | Description |
|-------|-------------|-------------|
| `bug` | `#d73a4a` | Something isn't working correctly on the site |
| `content` | `#0075ca` | Content addition, correction, or update request |
| `site-infrastructure` | `#e4e669` | Build, deploy, GitHub Actions, or Quartz config issue |
| `documentation` | `#0052cc` | Improvement or addition to docs in this repository |
| `question` | `#d876e3` | Further information is requested |
| `wontfix` | `#ffffff` | This will not be worked on |
| `duplicate` | `#cfd3d7` | This issue or request already exists |
| `good first issue` | `#7057ff` | Good for newcomers or lightweight contributions |
| `help wanted` | `#008672` | Extra attention or outside help is welcome |
| `prototype` | `#fbca04` | Related to prototype-phase scaffolding or status |

## Notes

- `site-infrastructure` is required for the site infrastructure issue template (see `.github/ISSUE_TEMPLATE/site-infrastructure.yml`).
- Labels can be added/edited at: `https://github.com/PiETLab/mcipa-demedicalize-accommodation/labels`

## Quick setup (GitHub CLI)

```bash
gh label create "site-infrastructure" --color "e4e669" --description "Build, deploy, GitHub Actions, or Quartz config issue" --repo PiETLab/mcipa-demedicalize-accommodation
gh label create "content" --color "0075ca" --description "Content addition, correction, or update request" --repo PiETLab/mcipa-demedicalize-accommodation
gh label create "prototype" --color "fbca04" --description "Related to prototype-phase scaffolding or status" --repo PiETLab/mcipa-demedicalize-accommodation
```
