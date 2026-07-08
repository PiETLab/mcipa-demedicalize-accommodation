# Pathway: Steady-State System Setup and Publishing Model

## Purpose

Explain how the system is set up in steady state and make the publishing model explicit.

## Use this pathway when

- you want to understand the overall operating model before editing
- you need a quick orientation for how local changes become website updates
- you need to know who does what in routine publishing

## Steady-state system map

1. Local editing environment: dedicated Obsidian vault.
2. Version control surface: GitHub repository (`main` as routine branch).
3. Deployment surface: GitHub Actions deploy workflow.
4. Public output: published website.

Canonical term used in this documentation:

- Build-and-Publish Step: the automated GitHub Actions step that converts source content to site output and publishes it.

In steady state, all routine content changes flow through this chain:

Local Obsidian edit -> commit/push to `main` -> Build-and-Publish Step -> public site update

## What is in the repository vs what is on the website

The GitHub repository is the source-of-truth workspace. It contains Markdown and other project files (configuration, workflow files, assets, and documentation).

The website is not served directly from raw Markdown files. A site-build utility inside the Build-and-Publish Step converts publishable source content into HTML files.

Practical meaning:

1. You normally edit source files (mainly Markdown), not HTML.
2. The Build-and-Publish Step generates HTML during deployment.
3. The generated HTML exists on GitHub's Pages/deployment side as published site output.
4. Even if you do not browse raw generated HTML files in routine work, that built output is what the website serves.

So the operating model is source edit -> Build-and-Publish Step -> published HTML site.

## Publishing model (clear contract)

1. Sabine is the routine single writer after handoff.
2. Melanie intervenes only for coordinated repairs, recovery, or exceptional updates.
3. Sabine remains merge-free in normal operations.
4. If push is rejected or conflict appears, stop and escalate to Melanie.

## Normal publish path

1. Edit content in the local Obsidian vault.
2. Commit with clear message.
3. Push to `main`.
4. Confirm commit appears in GitHub.
5. Confirm the Build-and-Publish Step runs and completes.
6. Confirm website reflects the change.

## Guided reverse path

If Melanie has made a coordinated repair or update that Sabine needs to receive locally, do not treat that as part of the normal publish path.

Use: [Pathway: Guided Reverse Pathway - Receive a Coordinated Update](/sabine-facing-docs/pathways/path-guided-reverse-pathway-receive-coordinated-update.md)

## GitHub web edit path

If a file is edited in GitHub web and committed to `main`, deployment still runs automatically.

1. Commit in GitHub web.
2. Build-and-Publish Step starts automatically.
3. Confirm workflow success.
4. Confirm website update.

## Verification checks

- repository reflects latest commit
- deploy workflow completes successfully
- website shows expected content change

## Common failure patterns

- push rejected because remote changed
- repeated authentication prompts in Obsidian Git
- workflow fails after push
- workflow succeeds but website appears stale

## Escalate when

- conflict/rejection requires merge handling
- auth friction persists
- deploy fails or website does not update after expected delay

## Related modules

- [Publishing Workflow Guide](/sabine-facing-docs/nodes/node-publishing-workflow-guide.md)
- [Connect Local Obsidian Vault to GitHub Repository](/sabine-facing-docs/nodes/node-connect-local-obsidian-to-github.md)
- [First Edit, Commit, Push, and Verify Site Update](/sabine-facing-docs/nodes/node-first-edit-commit-push-verify.md)
- [Pathway: Tier-Intro Initial Setup](/sabine-facing-docs/pathways/path-tier-intro-setup-I.md)
- [Pathway: Melanie Dry Run Before Handoff](/sabine-facing-docs/pathways/path-melanie-dry-run.md)
- [Pathway: Guided Reverse Pathway - Receive a Coordinated Update](/sabine-facing-docs/pathways/path-guided-reverse-pathway-receive-coordinated-update.md)
