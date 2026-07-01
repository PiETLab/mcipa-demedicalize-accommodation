# Onboarding & Handoff Checklist — Sabine

> **Tier-Intro onboarding document** for the mcipa-demedicalize-accommodation repository.
> This checklist is for the primary maintainer (Sabine) taking over day-to-day operation of the site.

---

## Before handoff (maintainer / @mbaljko)

- [ ] Confirm Sabine has a GitHub account
- [ ] Add Sabine as a collaborator with **Write** access:
  `https://github.com/PiETLab/mcipa-demedicalize-accommodation/settings/access`
- [ ] Share the repository URL and site URL with Sabine
- [ ] Walk through the publishing workflow together (see [publishing-workflow.md](publishing-workflow.md))
- [ ] Confirm Sabine can push to `main` (test push with a small change)
- [ ] Share credentials / PAT setup instructions (see [troubleshooting.md](troubleshooting.md#authentication--push-friction))
- [ ] Review open issues and assign any relevant ones to Sabine
- [ ] Label taxonomy applied in GitHub UI (see [label-taxonomy.md](label-taxonomy.md))

---

## Day-one setup (Sabine)

- [ ] Accept the GitHub collaborator invitation (check your email)
- [ ] Clone the repository locally:
  ```bash
  git clone https://github.com/PiETLab/mcipa-demedicalize-accommodation.git
  cd mcipa-demedicalize-accommodation
  ```
- [ ] Set up Git credentials (PAT or SSH — see [troubleshooting.md](troubleshooting.md#authentication--push-friction))
- [ ] (Optional) Install Node.js v20+ for local preview: [https://nodejs.org/](https://nodejs.org/)
- [ ] Read [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ ] Read [docs/publishing-workflow.md](publishing-workflow.md)
- [ ] Read [docs/naming-conventions.md](naming-conventions.md)

---

## First edit (practice run)

- [ ] Open `content/prototype-status.md` in your editor
- [ ] Make a small, visible change (e.g. update the "Last updated" note or check off a completed item)
- [ ] Commit the change with a clear message
- [ ] Push to `main`
- [ ] Confirm the GitHub Actions workflow runs green
- [ ] Confirm the change appears on the live site

---

## Ongoing responsibilities

- Edit content files in `content/` as needed
- Follow naming conventions ([docs/naming-conventions.md](naming-conventions.md))
- Use GitHub Issues to track tasks and changes
- Verify the site after each push (Actions tab + live site)
- Update `content/prototype-status.md` as milestones are reached

---

## Key links

| Resource | URL |
|----------|-----|
| Repository | `https://github.com/PiETLab/mcipa-demedicalize-accommodation` |
| Live site | `https://pietlab.github.io/mcipa-demedicalize-accommodation/` |
| Actions (CI) | `https://github.com/PiETLab/mcipa-demedicalize-accommodation/actions` |
| Issues | `https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues` |
| Collaborator settings | `https://github.com/PiETLab/mcipa-demedicalize-accommodation/settings/access` |

---

## Escalation / help

If you get stuck:

1. Check [docs/troubleshooting.md](troubleshooting.md)
2. Open a [GitHub issue](https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/new/choose)
3. Contact @mbaljko directly on GitHub

---

*This checklist is part of the prototype scaffolding — update it as the handoff process evolves.*
