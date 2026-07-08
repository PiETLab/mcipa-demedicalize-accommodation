# New User Auth and Access Checklist

## Purpose

Provide a repeatable maintainer checklist to ensure a new user can authenticate and push from Obsidian without avoidable permission failures.

## Audience

Infrastructure Steward (Melanie), or any equivalent Tier-Experienced maintainer onboarding a new user.

## Preconditions

- New user has a GitHub account username.
- Target repository is known.
- User has completed clone setup and can open the vault in Obsidian.

## Checklist

1. Confirm the user account has repository write access.
2. Confirm the local remote uses HTTPS and points to the correct repository.
3. Have the user create a fine-grained PAT scoped to this repository.
4. Confirm PAT permissions include `Contents: Read and write`.
5. Remove or overwrite stale `github.com` credentials in macOS Keychain if needed.
6. In Obsidian, run Pull first, then a tiny test Commit and Push.
7. If Push returns 403, treat it as authorization/policy and escalate repository access checks.

## Verify success

- Pull succeeds in Obsidian.
- Push succeeds in Obsidian.
- Commit appears in GitHub repository history.

## Escalate when

- User cannot create a PAT scoped to the target repository.
- Push still returns 403 after token refresh and keychain cleanup.
- Repository/org permissions appear inconsistent with expected access.

## Related modules

- [Configure Obsidian Git Connection and Auth](/sabine-facing-docs/nodes/node-configure-obsidian-git-connection-and-auth.md)
- [GitHub Account Setup](/sabine-facing-docs/nodes/node-github-account-setup.md)
- [First Edit, Commit, Push, and Verify Site Update](/sabine-facing-docs/nodes/node-first-edit-commit-push-verify.md)
