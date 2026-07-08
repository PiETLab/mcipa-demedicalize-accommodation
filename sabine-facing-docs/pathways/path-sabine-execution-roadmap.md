# Sabine Execution Roadmap (Tier-Intro)

## Purpose

This is the step-by-step operating roadmap Sabine should follow starting from her own new Obsidian vault.

For the modular pathway version, start with `index/00-start-here.md` and `pathways/path-tier-intro-initial-setup.md`.

## Preconditions

- Local vault root is `mcipa-demedicalize-accommodation-bootstrap`.
- Remote repository remains `mcipa-demedicalize-accommodation`.
- Melanie has provided directory configuration guidance.
- Tier-Experienced support contact is known.

## Stage A - One-time setup

1. Create a new dedicated Obsidian vault for this project named `mcipa-demedicalize-accommodation-bootstrap`.
2. Configure vault directories using Melanie's instructions.
3. Open the configured vault and confirm expected navigation/files render normally.
4. Install Obsidian Git plugin.
5. Configure Obsidian Git to connect to remote repository `mcipa-demedicalize-accommodation`.
6. Confirm plugin can access repository credentials.

### Directory configuration checklist (execute with Melanie)

- [ ] Confirm vault root folder name with Melanie.
- [ ] Create required top-level folders from Melanie's directory map.
- [ ] Confirm each top-level folder name matches exactly (case and spelling).
- [ ] Confirm naming rule: lowercase, hyphen-separated, URL-safe names.
- [ ] Confirm naming rule for dated files: `YYYY-MM-DD`.
- [ ] Place required starter notes in the instructed folders.
- [ ] Confirm no personal/mixed-project folders are included in this vault.

### First-file sanity checks

- [ ] Open one starter note and confirm title, frontmatter (if used), and links render correctly.
- [ ] Create one test note using naming rules and save it in the correct folder.
- [ ] Verify Obsidian graph/search can find both starter and test notes.
- [ ] Delete or archive the test note if Melanie says it should not remain.

Done when:
- vault opens cleanly
- directory layout matches configuration guidance
- plugin is available
- remote repository connection is configured
- no blocking auth prompt loop appears

## Stage B - First sync and test publish

1. Open a non-critical page and add a small test edit.
2. Commit with a clear message.
3. Push changes.
4. Confirm GitHub shows the commit.
5. Confirm public site reflects the update.

Done when:
- one complete Edit -> Commit -> Push -> Verify cycle succeeds

## Stage C - Routine operating workflow

Use this sequence for normal updates:

1. Open dedicated vault.
2. Edit content.
3. Commit in Obsidian Git.
4. Push.
5. Verify site update for important changes.

Exception:
If Melanie has made a coordinated repair or update that Sabine needs to receive, use the guided reverse pathway instead of treating pull as part of ordinary routine work.

Rule:
- Keep all MVP edits inside this dedicated vault.

## Stage D - Escalation triggers

Ask Tier-Experienced support when any of the following happens:

- repeated authentication prompts or failed push auth
- merge/conflict state you cannot resolve safely
- push succeeds but site does not update after expected delay
- uncertainty about whether a change belongs in MVP scope

## Stage E - Quick issue triage

1. Open issue tracker.
2. Apply relevant label(s) from agreed minimal label set.
3. Record clear next action and owner.
4. Escalate if issue affects publish reliability or onboarding flow.

## Daily close checklist

- [ ] All intended edits committed
- [ ] Push completed
- [ ] Critical pages spot-checked on public site
- [ ] Any blockers recorded for follow-up

## Related documents

- `00-README.md`
- `nodes/node-vault-setup-and-naming.md`
