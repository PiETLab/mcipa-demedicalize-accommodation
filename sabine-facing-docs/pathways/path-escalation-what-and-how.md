# Pathway: Escalation - What It Is and How to Do It

## Purpose

Explain escalation in practical terms and provide a repeatable escalation procedure for Tier-Intro workflow.

## What escalation means

Escalation means moving a problem from routine Tier-Intro handling to Tier-Experienced support when the task is blocked, risky, or infrastructure-related.

Escalation is not failure. It is the designed safety step that protects publishing reliability and avoids avoidable mistakes.

## When to escalate

Escalate when any of the following occurs:

- push is rejected due to remote update/non-fast-forward/conflict
- repeated authentication prompts or credential failures block progress
- Build-and-Publish Step fails
- site does not update after workflow completion and expected delay
- issue requires repository settings, permissions, templates, labels, or workflow changes
- you are unsure whether the task is within Tier-Intro scope

## Escalation information package (what to include)

Provide a short package so Tier-Experienced support can act quickly:

1. What you were trying to do (one sentence).
2. What happened instead.
3. Exact error text (copy/paste if possible).
4. Link to relevant commit, issue, or workflow run.
5. What you already tried.
6. Current status: blocked now / partially blocked / recovered.

## Escalation procedure (step-by-step)

1. Stop making additional changes that may increase conflict risk.
2. Capture evidence (error text, screenshots, links, timestamps).
3. Post escalation note to Melanie (or designated Tier-Experienced contact).
4. If relevant, open/update an issue and add clear escalation note.
5. Wait for Tier-Experienced guidance before retrying risky steps.
6. After resolution, record the outcome and any doc updates needed.

## Escalation message template

Use this template:

- Task attempted:
- Expected result:
- Actual result:
- Error text:
- Links/evidence:
- What I tried:
- Current block level:

## What not to do during escalation

- do not force-push
- do not attempt manual merge/conflict resolution as Tier-Intro
- do not change repository/deploy settings ad hoc
- do not remove evidence from issue/workflow history

## Closure after escalation

- confirm the blocking problem is resolved
- verify normal publish flow works again
- update relevant docs if process changed
- add short note so future escalations are faster

## Related modules

- [Pathway: Understanding Tier-Intro and Tier-Experienced](path-understanding-training-tiers-tier-intro.md)
- [Publishing Workflow Guide](node-publishing-workflow-guide.md)
- [Issue Handling Guide](node-issue-handling-guide.md)
- [Pathway: Tier-Intro Initial Setup](path-tier-intro-setup-I.md)
