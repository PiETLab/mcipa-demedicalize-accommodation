# Publishing Workflow Guide

## Purpose

Define the routine publishing workflow under the Single-Writer Model.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

Terminology used in this guide:

- Build-and-Publish Step: the automated GitHub Actions deploy process that converts source content and publishes the site.
- commit-and-push: the routine action of recording local changes with a commit message and publishing them to GitHub.

## Routine publish sequence

1. Open dedicated project vault.
2. Make intended edits.
3. Perform commit-and-push with a clear commit message.
4. Verify GitHub shows commit.
5. Verify public site update for important changes.


## Operating model

- The Content Operator (Sabine) is the routine publisher after handoff.
- The Infrastructure Steward (Melanie) intervenes only for coordinated repairs, recovery, or exceptional updates.
- Routine work stays on `main`.
- Workflow discipline is mandatory to keep the Content Operator merge-free in normal operations.

## Single-Writer Model

In the MVP's normal operating state, only the Content Operator performs routine edit -> commit-and-push work.

The Infrastructure Steward does not participate as a routine co-editor after handoff. When intervention is necessary, it is handled as an explicit exception and then the workflow returns to the single-writer pattern.

## Core sequencing rules

1. Start normal work from Sabine's local single-writer copy.
2. Do not begin with a pull as part of routine publishing.
3. If the Infrastructure Steward has made a coordinated repair or update, stop and use the guided reverse pathway before editing.
4. After finishing edits, perform commit-and-push promptly.
5. If commit-and-push is rejected because remote changed, stop and escalate to the Infrastructure Steward (do not resolve merge manually as the Content Operator).


## Coordination protocol

- Before a publish window, post a short status note (for example: "publishing now").
- After commit-and-push completes, post a completion note (for example: "commit-and-push complete").
- If urgent intervention is needed, the Infrastructure Steward coordinates sequence and file ownership.

## Content Operator Merge-Free Rule

The Content Operator should not perform manual merge or conflict-resolution steps during routine operations.
If a conflict/rejection occurs, capture the error text and escalate to the Infrastructure Steward.

## Escalation triggers

Escalate to the Infrastructure Steward when any of the following occurs:

- commit-and-push rejection due to non-fast-forward/remote updates
- merge/conflict indicators in Obsidian Git
- repeated auth prompts or credential failures
- successful commit-and-push but site not updated after expected delay

## Recovery Pattern (Infrastructure Steward-Led)

1. The Infrastructure Steward resolves any conflict state.
2. The Infrastructure Steward performs a clean commit-and-push to `main`.
3. The Content Operator follows the guided reverse pathway to receive the coordinated update.
4. The Content Operator resumes routine workflow.

## Quick checklist before commit-and-push

- [ ] No coordinated reverse update is pending
- [ ] No known concurrent publish in progress
- [ ] Commit message is clear and specific
- [ ] Ready to verify GitHub and site update

## Related docs

- `pathways/path-sabine-execution-roadmap.md`
- `nodes/node-vault-setup-and-naming.md`
- `pathways/path-steady-state-system-setup-and-publishing-model.md`
- `pathways/path-escalation-what-and-how.md`
- `pathways/path-guided-reverse-pathway-receive-coordinated-update.md`
