# Pathway: Understanding Tier-Intro and Tier-Experienced (Tier-Intro Friendly)

## Purpose

Explain the two training tiers in plain language so Sabine can confidently know what to do and when to escalate.

## Why this matters

The system is designed so Tier-Intro users can do routine publishing safely without learning infrastructure administration.

## The two tiers in one sentence each

1. Tier-Intro: does routine content work and basic issue handling using prepared tools and guides.
2. Tier-Experienced: sets up, repairs, and maintains infrastructure when workflow or deployment problems occur.

## Tier-Intro scope (what you are expected to do)

You are expected to:

- open the project vault in Obsidian
- edit Markdown content
- commit and push with Obsidian Git plugin
- verify that website updates after automatic build-and-publish
- create and triage simple issues using agreed labels
- ask for help when sync/auth/build problems appear

## Tier-Intro non-goals (what you are not expected to do)

You are not expected to:

- use command line tools
- configure repository architecture or GitHub Actions
- edit Quartz infrastructure settings
- resolve merge conflicts manually
- troubleshoot deep authentication/keychain internals

If any of these are required, escalate to Tier-Experienced support.

## Tier-Experienced scope (what Melanie handles)

Tier-Experienced work includes:

- repository/infrastructure setup
- GitHub Actions and deployment troubleshooting
- permissions, templates, and labels configuration
- recovery/resync support when routine flow breaks
- documentation updates and workflow guardrails

## Practical decision rule: Do or escalate?

Use this quick test:

1. If it is a routine content edit, commit, push, or issue triage task: Tier-Intro does it.
2. If it requires repair, reconfiguration, merge resolution, or deployment debugging: escalate to Tier-Experienced.

## Common escalation triggers

Escalate to Tier-Experienced when:

- push is rejected and indicates conflict/non-fast-forward
- repeated authentication prompts block progress
- build-and-publish step fails
- website does not update after successful workflow completion
- you are unsure whether a step is infrastructure-related

## What success looks like for Tier-Intro

- routine edits can be published without merge handling
- problems are identified early and escalated with clear notes
- safe boundaries are maintained (no sensitive content in public channels)

## Related modules

- [Pathway: Tier-Intro Initial Setup](/sabine-facing-docs/pathways/path-tier-intro-setup-I.md)
- [Pathway: Steady-State System Setup and Publishing Model](/sabine-facing-docs/pathways/path-steady-state-system-setup-and-publishing-model.md)
- [Publishing Workflow Guide](/sabine-facing-docs/nodes/node-publishing-workflow-guide.md)
- [Issue Handling Guide](/sabine-facing-docs/nodes/node-issue-handling-guide.md)
