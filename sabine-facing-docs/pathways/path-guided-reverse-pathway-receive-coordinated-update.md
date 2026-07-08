# Pathway: Guided Reverse Pathway - Receive a Coordinated Update

## Purpose

Describe the rare, guided exception in which the Infrastructure Steward has made a coordinated repair or update in GitHub and the Content Operator needs to receive that change into the local Obsidian vault.

## Use this pathway when

- Melanie has made a coordinated repair or update in GitHub
- Sabine has been told to receive that update locally
- recovery or resync is needed after a guided intervention

## Important rule

This is not part of Sabine's normal routine editing workflow.
Use this pathway only when a Tier-Experienced maintainer has explicitly told Sabine to do so.

## Step sequence

1. Confirm that the reverse update is intentional and coordinated.
- Capture who made the update and why.

2. Stop routine editing until the update is received.
- Do not continue local edits while resync is in progress.

3. Follow maintainer guidance to receive the coordinated update.
- Use: [Authenticate Obsidian Git Plugin to Sync with GitHub.com](/sabine-facing-docs/nodes/node-configure-obsidian-git-connection-and-auth.md)

4. Verify the local vault now reflects the coordinated change.
- Open the affected files or notes.
- Confirm the updated state is visible locally.

5. Resume normal single-writer workflow.
- Return to edit -> commit -> push once the coordinated update has been received cleanly.

## Completion checklist

- [ ] Coordinated update was received locally
- [ ] No unresolved conflict or auth state remains
- [ ] Routine single-writer workflow can resume

## Escalate when

- pull/resync fails
- conflict indicators appear
- the local vault state is unclear after the update
- routine editing cannot safely resume

## Related pathways

- [Pathway: Tier-Intro Setup I](/sabine-facing-docs/pathways/path-tier-intro-setup-I.md)
- [Pathway: Add a New User - Auth and Access](/sabine-facing-docs/pathways/path-add-a-new-user-auth-and-access.md)
- [Pathway: Escalation - What It Is and How to Do It](/sabine-facing-docs/pathways/path-escalation-what-and-how.md)
