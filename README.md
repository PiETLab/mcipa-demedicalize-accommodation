# mcipa-demedicalize-accommodation

> **⚠️ Prototype / Provisional** — public, in-progress prototype. Not an official policy or legal document.

MCIPA ActionForge pilot for demedicalizing accommodation: a public prototype for publishing, coordination, and issue-based action workflows.

## Run / Build / Deploy

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- [Git](https://git-scm.com/)

### First-time setup

```bash
# 1. Clone the repository
git clone https://github.com/PiETLab/mcipa-demedicalize-accommodation.git
cd mcipa-demedicalize-accommodation

# 2. Install Quartz (one-time, requires npx / npm)
npx quartz create   # only needed on first run in a new clone
```

### Local preview

```bash
npm run preview
# Opens a local dev server at http://localhost:8080
```

### Production build

```bash
npm run build
# Outputs static site to the ./public directory
```

### Deploy

Deployment is automated via GitHub Actions on every push to `main`.
See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) for details.

To manually trigger a deploy, use the **Actions** tab → **Deploy Quartz site to GitHub Pages** → **Run workflow**.

## Documentation

| Doc | Purpose |
|-----|---------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to edit and publish content |
| [docs/publishing-workflow.md](docs/publishing-workflow.md) | Edit → Commit → Push → Verify |
| [docs/naming-conventions.md](docs/naming-conventions.md) | File naming rules |
| [docs/troubleshooting.md](docs/troubleshooting.md) | Common problems and fixes |
| [docs/onboarding-handoff.md](docs/onboarding-handoff.md) | Onboarding checklist for Sabine |
| [docs/label-taxonomy.md](docs/label-taxonomy.md) | GitHub issue label definitions |
| [content/prototype-status.md](content/Policy%20and%20Admin/Prototype%20Status.md) | Current prototype status |

## Contributing / Issues

Please use the [issue templates](https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/new/choose) for bug reports, content updates, or site infrastructure problems.
