# Pathway: Add a New User - Auth and Access

## Purpose

Guide a maintainer through onboarding a new user so Obsidian pull/push works on first handoff.

## Preconditions

- Maintainer has repository admin or owner access.
- New user has shared their GitHub username.
- New user can open the cloned vault in Obsidian.

## Step sequence

1. Confirm account and repository access setup.
- See: [GitHub Account Setup](/sabine-facing-docs/nodes/node-github-account-setup.md)

2. Run the maintainer auth/access readiness checklist.
- See: [New User Auth and Access Checklist](/sabine-facing-docs/nodes/node-new-user-auth-and-access-checklist.md)

3. Validate Obsidian Git configuration/auth with the user.
- See: [Configure Obsidian Git Connection and Auth](/sabine-facing-docs/nodes/node-configure-obsidian-git-connection-and-auth.md)

4. Complete one first publish-cycle proof.
- See: [First Edit, Commit, Push, and Verify Site Update](/sabine-facing-docs/nodes/node-first-edit-commit-push-verify.md)

## Completion checklist

- [ ] User can pull from Obsidian Git
- [ ] User can push from Obsidian Git
- [ ] Commit is visible in GitHub
- [ ] No unresolved auth or permission errors remain

## Escalate when

- 403 persists after PAT refresh and keychain cleanup
- user access appears blocked by org/repository policy
- user cannot complete the proof push

## Related pathways

- [Pathway: Tier-Intro Initial Setup](/sabine-facing-docs/pathways/path-tier-intro-setup-I.md)
- [Pathway: Melanie Dry Run Before Handoff](/sabine-facing-docs/pathways/path-melanie-dry-run.md)
