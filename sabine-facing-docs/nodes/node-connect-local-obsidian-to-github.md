==HAS THIS BEEN SUPPLANTED?==

# Connect Local Obsidian Vault to GitHub Repository

## Purpose

Connect the dedicated local Obsidian vault to the GitHub repository for pull/commit/push workflow.

This node is an overview that points to two smaller operational nodes.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

## Preconditions

- Dedicated project vault exists
- GitHub account exists and repository access is confirmed (see [GitHub Account Setup](/sabine-facing-docs/nodes/node-github-account-setup.md))
- Obsidian Git plugin is installed

## Sequence

1. Complete one-time local repository setup:
- [One-Time Clone Setup](/sabine-facing-docs/nodes/node-one-time-clone-setup.md)

2. Configure Obsidian Git connection/auth and run pull test:
- [Configure Obsidian Git Connection and Auth](/sabine-facing-docs/nodes/node-configure-obsidian-git-connection-and-auth.md)

## Verify success

- both related nodes are completed successfully
- pull succeeds without repository-not-found/auth errors
- repository content appears in local vault

## Common failures

- one-time clone setup not completed
- repeated authentication prompts
- permission denied when pulling
- wrong or missing remote origin

## Escalate when

- one-time clone setup is required and you are not sure how to do it safely
- pull/auth issues persist after configuration checks
- repository access appears missing

## Related nodes

- [One-Time Clone Setup](/sabine-facing-docs/nodes/node-one-time-clone-setup.md)
- [Configure Obsidian Git Connection and Auth](/sabine-facing-docs/nodes/node-configure-obsidian-git-connection-and-auth.md)
- [First Edit, Commit, Push, and Verify Site Update](/sabine-facing-docs/nodes/node-first-edit-commit-push-verify.md)
