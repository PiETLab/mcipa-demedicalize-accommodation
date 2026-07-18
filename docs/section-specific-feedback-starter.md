# Section-Specific Feedback Starter

This page is the restart point for reintroducing section- or passage-specific feedback later.

Current state:

- The live feedback page is simplified to page-level feedback only.
- The hidden worker payload still supports passage-specific metadata.
- The passage-specific UI is parked in an HTML comment in `content/Provide Feedback on the Advocacy Paper.md`.

## Current live page

The live feedback page is:

- `content/Provide Feedback on the Advocacy Paper.md`
- route: `/Provide-Feedback-on-the-Advocacy-Paper`

The current visible UI includes only:

- name or pseudonym
- hidden title auto-filled by script
- feedback description
- submit button

The current hidden Worker fields still filled by Quartz are:

- `feedbackType`
- `title`
- `pageTitle`
- `pageUrl`
- `displayName`
- `comment`
- `website`

For page-level feedback, the script now assumes:

- page title: `Advocacy Paper`
- page URL: `https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper`
- issue title: `Feedback on Provide Feedback on the Advocacy Paper`

## Parked section-specific UI

The commented block in `content/Provide Feedback on the Advocacy Paper.md` contains the starter markup for the later restore:

- `feedbackMode` radio group for page vs passage
- passage context status text
- passage context notice
- passage context container
- clear passage context button
- read-only passage display fields

It currently includes these older passage-specific display fields:

- `feedback-page-title`
- `feedback-page-url`
- `feedback-section-heading`
- `feedback-block-id`
- `feedback-block-url`
- `feedback-text-fragment-url`
- `feedback-selected-text`
- `feedback-quoted-text`
- `feedback-full-block-text`
- `feedback-start-context`
- `feedback-end-context`
- `field-section-heading-display`
- `field-selected-passage-display`

## Quartz layout touchpoints

The page behavior is controlled in `quartz.layout.ts`.

Useful anchors when restoring section-specific feedback:

- `PUBLIC_FEEDBACK_WORKER_ENDPOINT`
- `ensurePageLevelTitle()`
- `bindFormInteractions()`
- `hydrateFeedbackForm()`
- `setMode()`
- `clearPassageContext()`
- `toggleContextPreview()`

The current script already has the main plumbing for the later restore:

- form endpoint assignment
- status message handling
- hidden title generation
- hidden page URL generation
- safe issue URL handling
- success reset logic

## Worker expectations

The worker still accepts the richer passage payload, so section-specific feedback can be restored without changing the server contract.

Relevant worker fields currently supported:

- `displayName`
- `name`
- `title`
- `feedbackMode`
- `feedbackType`
- `comment`
- `feedback`
- `pageTitle`
- `pageUrl`
- `pageUrlUser`
- `sectionHeading`
- `sectionHeadingDisplay`
- `blockId`
- `blockUrl`
- `textFragmentUrl`
- `quotedText`
- `selectedText`
- `selectedPassageDisplay`
- `fullBlockText`
- `startContext`
- `endContext`
- `website`

For passage-level submissions, the worker still requires:

- `quotedText`
- `pageUrl`
- `sectionHeading`
- `blockId`

## Suggested restore path

When you are ready to add section-specific feedback back in:

1. Un-comment the parked passage-specific UI in `content/Provide Feedback on the Advocacy Paper.md`.
2. Restore the mode switch and passage context display in `quartz.layout.ts`.
3. Reintroduce the passage selection/capture helpers if needed.
4. Keep the page-level default behavior intact.
5. Re-test a page-level submission and a passage-level submission.

## Notes to preserve

- Keep the page-level form simple by default.
- Keep the page URL hidden and auto-filled unless a later UX decision says otherwise.
- Keep the worker endpoint in one place.
- Keep the issue link sanitization in place.
- If passage-specific UI returns, re-check that the worker still receives all required passage fields.
