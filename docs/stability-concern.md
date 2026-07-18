# Stability Concern

This note records the current stability concerns in the passage-feedback implementation so they can be addressed later without re-deriving the reasoning.

## Current State

The current passage-feedback flow now includes the following in submitted GitHub issues:

1. The published page URL.
2. The passage identifier (`blockId`).
3. The anchored passage link (`blockUrl`).
4. The selected-text link (`textFragmentUrl`) when one can be generated safely.
5. The published page commit identifier.
6. The published page commit date.

The relevant implementation is split across:

- `quartz.config.ts`
- `quartz.layout.ts`
- `services/mcipa-feedback-worker/src/shared.ts`
- `services/mcipa-feedback-worker/src/issue-format.cjs`

## Main Stability Concern

The main concern is not the published page URL itself. The page URL is relatively stable as long as the published route remains:

- `https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper`

The concern is the stability of generated fallback fragment identifiers such as:

- `#feedback-block-10g75op`

These fallback ids are generated at build time from:

1. The page key.
2. The normalized block text.
3. Deterministic collision handling.

That means a generated fallback id can change if:

1. The passage text changes.
2. Nearby structure changes enough to affect normalization or collisions.
3. The build-time eligibility/normalization logic changes.

This is a build-output stability problem, not a direct branch-name or commit-hash problem.

## Important Clarification

The current code does **not** write generated ids back into the markdown source files.

`PassageIdentifierTransformer` in `quartz.config.ts` mutates the rendered HTML tree during build by assigning ids to eligible elements. It does not rewrite `content/Advocacy Paper.md`.

So there are two distinct layers:

1. Source markdown stability.
2. Rendered HTML anchor stability.

At present, only the rendered HTML layer receives generated fallback ids.

## What Is Stable Enough Right Now

The current system is useful for short-term tracing and review because maintainers can use:

1. The published page URL.
2. The anchored block URL.
3. The quoted passage text in the issue.
4. The commit identifier and commit date included in the issue body.

This is usually enough to find the relevant passage in the currently published site and to understand which published revision the feedback referred to.

## What Is Not Durable Enough Yet

The following should not be treated as archival-grade references:

1. Generated fallback passage ids.
2. Anchored links that depend on generated fallback ids.
3. Text-fragment links for long-term durability.

Text-fragment links are also intentionally conditional. They are only generated when the normalized text is short enough to be considered reliable. When the passage is longer, `textFragmentUrl` is omitted by design.

## Why The Current Approach Was Kept

The current design avoids automatic source-file rewriting.

Reasons:

1. Auto-injecting generated ids into markdown during build would create noisy file churn.
2. Generated fallback ids are implementation artifacts, not good human-authored reference labels.
3. A build step that rewrites source content would make authoring and review harder.

For now, the cleaner tradeoff is:

1. Keep source markdown clean.
2. Generate ids in rendered output.
3. Include enough context in GitHub issues to trace the passage operationally.

## Stronger Future Options

If durable passage references become important, the stronger options are:

1. Add explicit ids in source markdown for passages that need stable long-term references.
2. Preserve and prioritize those explicit ids during build.
3. Distinguish in issue metadata whether a passage id was explicit or generated.
4. Optionally include maintainer-facing source-location hints in the issue body.

The first option is the most important one. Explicit source-authored ids are much more stable than generated fallback ids.

## Current Deferred Decision

For the time being, leave the current build-time generated-id model in place.

Rationale:

1. It is operationally useful now.
2. It supports passage-level public feedback with low authoring overhead.
3. It does not yet provide fully durable passage citations.
4. Explicit source ids can be added later if the maintenance cost is justified.

## Follow-Up Questions For Later

When returning to this, evaluate:

1. Which passages actually require durable long-term identifiers?
2. Whether explicit ids should be added selectively or systematically.
3. Whether the GitHub issue body should state explicitly when a passage id is generated rather than source-authored.
4. Whether maintainers need a source-facing locator in addition to the published-page locator.