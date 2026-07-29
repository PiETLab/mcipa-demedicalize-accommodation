# Facilitator Submission Mode (Internal)

This note documents an intentionally low-visibility submission path for facilitators using the existing public feedback forms.

## Purpose

Allow a facilitator to submit through the same form UI while tagging the created GitHub issue as facilitator-originated.

## How to use

On either feedback form page:

- Fill out the form normally.
- Hold the **Shift** key while clicking **Submit feedback**.

When submitted this way, the request includes `submissionSource=facilitator`, and the issue label source is set to:

- `source: facilitator`

Normal submission behavior (without Shift) continues to use:

- `source: public`

Object labels are unchanged by this mode:

- Passage submission: `object: passage`
- Page-level submission: `object: entire-paper`

The success message also changes for confirmation:

- `Thanks, your feedback was received. (FACILITATOR MODE)`

## Implementation notes

- Front-end trigger: [quartz.layout.ts](/Users/mb/Documents/Vaults/mcipa-demedicalize-accommodation/quartz.layout.ts)
- Worker normalization and validation: [shared.ts](/Users/mb/Documents/Vaults/mcipa-demedicalize-accommodation/services/mcipa-feedback-worker/src/shared.ts)
- Issue label composition: [issue-format.cjs](/Users/mb/Documents/Vaults/mcipa-demedicalize-accommodation/services/mcipa-feedback-worker/src/issue-format.cjs)
