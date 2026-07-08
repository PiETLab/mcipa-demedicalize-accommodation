# Start Here - Documentation Map

## Purpose

Provide a clear entry point into modular documentation.

## How this system is organized

- [pathways/](/sabine-facing-docs/pathways/) contains ordered step sequences for specific goals.
- [nodes/](/sabine-facing-docs/nodes/) contains self-contained modules for one task each.
- Foundational guides are now integrated into pathways and nodes.

## Pathways (what each one is for)

### Understanding - Content Operator (Sabine)


| Pathway                                                                                                                       | Primary audience                                               | What it is for                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Pathway: Steady-State System Setup and Publishing Model](/sabine-facing-docs/pathways/path-steady-state-system-setup-and-publishing-model.md) | Content Operator (Sabine) and Infrastructure Steward (Melanie) | System mental model for how source edits become website updates through the Build-and-Publish Step. |
| [Pathway: Understanding Tier-Intro and Tier-Experienced](/sabine-facing-docs/pathways/path-understanding-training-tiers-tier-intro.md)         | Content Operator (Sabine)                                      | Plain-language explanation of role boundaries, non-goals, and when to escalate.                     |
| 'commit-and-push' in two different ways                                                                                       |                                                                |                                                                                                     |

Useful supporting node:

- [Basic Git and Publishing Glossary](/sabine-facing-docs/nodes/node-basic-git-and-publishing-glossary.md)


### Doing - Content Operator (Sabine)

| Pathway                                                                                                                                 | Primary audience                                               | What it is for                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [Pathway: Tier-Intro Setup I](/sabine-facing-docs/pathways/path-tier-intro-setup-I.md)                                                                               | Content Operator (Sabine)                                      | Step-by-step first-time setup and first successful publish.                                               |
| [Pathway: Tier-Intro Setup II](/sabine-facing-docs/pathways/path-tier-intro-setup-II.md)                                                                             | Content Operator (Sabine)                                      | Step-by-step first-time setup and first successful publish.                                               |
| [Pathway: Guided Reverse Pathway - Receive a Coordinated Update](/sabine-facing-docs/pathways/path-guided-reverse-pathway-receive-coordinated-update.md) | Content Operator (Sabine) and Infrastructure Steward (Melanie) | Rare guided exception for receiving a coordinated repair or update from GitHub back into the local vault. |
| [Publishing workflow](/sabine-facing-docs/nodes/node-publishing-workflow-guide.md)                                                                                   | Content Operator (Sabine)                                      |                                                                                                           |
|                                                                                                                                         |                                                                |                                                                                                           |
| [Pathway: Escalation - What It Is and How to Do It](/sabine-facing-docs/pathways/path-escalation-what-and-how.md)                                        | Content Operator (Sabine)                                      | Practical escalation definition, triggers, and exact steps for handing off blocked/risky cases.           |



| **Setup** | **Editing Environment** | **Publishing Method** | **Authentication**                                   | **Complexity** | **Notes**                                                                            |
| --------- | ----------------------- | --------------------- | ---------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------ |
| I         | Obsidian                | GitHub Desktop        | OAuth                                                | Basic          | Edit in Obsidian, then publish through GitHub Desktop.                               |
| II        | Obsidian                | Obsidian Git plugin   | OAuth                                                | Moderate       | Slightly more convenient because publishing occurs directly from Obsidian.           |
| III       | Obsidian                | Obsidian Git plugin   | HTTPS + Personal Access Token (PAT) or SSH + SSH Key | Advanced       | More flexible and robust authentication options for direct publishing from Obsidian. |


### Doing - Infrastructure Steward (Melanie)


| Pathway                                                                                                                       | Primary audience           | What it is for                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| [Pathway: Add a New User - Auth and Access](/sabine-facing-docs/pathways/path-add-a-new-user-auth-and-access.md)                               | Infrastructure Steward (Melanie) | Repeatable maintainer flow to onboard a new user and verify Obsidian pull/push works.               |
| [Pathway: Melanie Dry Run Before Handoff](/sabine-facing-docs/pathways/path-melanie-dry-run.md)                                                | Infrastructure Steward (Melanie) | Emulate Sabine's flow to test instructions and capture friction before handoff.                     |



## Recommended entry points

### If you are the Content Operator (Sabine)

1. [Pathway: Tier-Intro Initial Setup](/sabine-facing-docs/pathways/path-tier-intro-setup-I.md)
2. [GitHub Account Setup](/sabine-facing-docs/nodes/node-github-account-setup.md) (if account setup is still pending)
3. [Pathway: Understanding Tier-Intro and Tier-Experienced](/sabine-facing-docs/pathways/path-understanding-training-tiers-tier-intro.md)
4. [Pathway: Escalation - What It Is and How to Do It](/sabine-facing-docs/pathways/path-escalation-what-and-how.md)
5. [Pathway: Guided Reverse Pathway - Receive a Coordinated Update](/sabine-facing-docs/pathways/path-guided-reverse-pathway-receive-coordinated-update.md) (only when told to do so)

### If you are the Infrastructure Steward (Melanie)

1. [Pathway: Melanie Dry Run Before Handoff](/sabine-facing-docs/pathways/path-melanie-dry-run.md)
2. [Pathway: Add a New User - Auth and Access](/sabine-facing-docs/pathways/path-add-a-new-user-auth-and-access.md)

### If you want system orientation (steady state)

1. [Pathway: Steady-State System Setup and Publishing Model](/sabine-facing-docs/pathways/path-steady-state-system-setup-and-publishing-model.md)
2. [Pathway: Guided Reverse Pathway - Receive a Coordinated Update](/sabine-facing-docs/pathways/path-guided-reverse-pathway-receive-coordinated-update.md)

## Core references

- [Minimum Issue Label Set](/sabine-facing-docs/nodes/node-minimum-issue-label-set.md)
- [Basic Git and Publishing Glossary](/sabine-facing-docs/nodes/node-basic-git-and-publishing-glossary.md)
- [File and Folder Naming Convention](/sabine-facing-docs/nodes/node-file-folder-naming-convention.md)
- [Install Obsidian Git Plugin](/sabine-facing-docs/nodes/node-install-obsidian-git-plugin.md)
- [One-Time Clone Setup](/sabine-facing-docs/nodes/node-one-time-clone-setup.md)
- [Configure Obsidian Git Connection and Auth](/sabine-facing-docs/nodes/node-configure-obsidian-git-connection-and-auth.md)
- [New User Auth and Access Checklist](/sabine-facing-docs/nodes/node-new-user-auth-and-access-checklist.md)
- [Publishing Workflow Guide](/sabine-facing-docs/nodes/node-publishing-workflow-guide.md)
- [Issue Handling Guide](/sabine-facing-docs/nodes/node-issue-handling-guide.md)

## Integrated foundational modules

The original 01-07 guides are now integrated as first-class modules:

- [Vault Setup and Naming](/sabine-facing-docs/nodes/node-vault-prep.md)
- [Pathway: Sabine Execution Roadmap](/sabine-facing-docs/pathways/path-sabine-execution-roadmap.md)
- [Publishing Workflow Guide](/sabine-facing-docs/nodes/node-publishing-workflow-guide.md)
- [Issue Handling Guide](/sabine-facing-docs/nodes/node-issue-handling-guide.md)
- [GitHub Account Setup](/sabine-facing-docs/nodes/node-github-account-setup.md)
- [Minimum Issue Label Set](/sabine-facing-docs/nodes/node-minimum-issue-label-set.md)
- [File and Folder Naming Convention](/sabine-facing-docs/nodes/node-file-folder-naming-convention.md)

## Rule

Pathways define sequence. Nodes define reusable task instructions.
If pathway and node wording differ, update the node and keep pathway short.
