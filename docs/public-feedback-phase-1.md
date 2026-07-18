# Public Feedback Phase 1

## Decision Record

1. The submission endpoint will be a Cloudflare Worker.
2. The Worker will create issues using a fine-grained GitHub token.
3. The token will belong to a dedicated service account rather than a personal account.
4. No email address or private contact field will be collected.
5. Every submitted field may appear in a public issue.
6. Page-level and passage-level submissions will use one form.
7. Passage-level feedback submissions will record all of the following:
	- Selected quotation.
	- Full containing block.
	- Page title.
	- Canonical page URL.
	- Nearest heading.
	- Stable or fallback block identifier.
	- Anchored block URL.
	- Text-fragment URL where one can be generated.
8. The issue will reproduce the quotation rather than relying only on a live link.
9. The first release will provide a block-level feedback control as the dependable interaction.
10. Selection-based commenting will be progressive enhancement.
11. The first release will use a honeypot and validation, but not Turnstile or substantial rate limiting.
12. Deployment and secret handling will require your approval.

## P1-04 Stable Passage Identifier Convention

### Explicit identifiers (author-controlled)

The Phase 1 explicit identifier syntax is an Obsidian-style block ID on a standalone line immediately after the target block:

```md
Students should be able to describe barriers without being required
to disclose a diagnosis.
^barrier-description-not-diagnosis
```

Conventions for explicit IDs:

- Pattern: `^[a-z0-9][a-z0-9_-]*$`
- Allowed characters: lowercase letters, digits, hyphens, underscores.
- Hyphens remain preferred for readability.
- The value should describe the idea, not paragraph order.
- The value must not include personal information.
- The value is intended to remain stable even if surrounding content moves.

HTML representation target:

- The rendered passage block should expose the same identifier as an anchor (for example `id="barrier-description-not-diagnosis"`).

### Automatic fallback identifiers

If no explicit ID is present for an eligible block, generate a deterministic fallback ID:

```text
feedback-block-<hash>
```

where `<hash>` is derived from:

```text
canonical page path + normalized block text
```

Recommended normalization input:

1. Use canonical page path without scheme/host, lowercase.
2. Extract visible block text content.
3. Normalize whitespace to single spaces and trim.
4. Hash with SHA-256 and take the first 8 hex characters.

Example output:

```text
feedback-block-a82f19c4
```

Notes:

- Fallback IDs do not depend on paragraph index/order alone.
- Fallback IDs may change when the block text changes.
- Quoted text in the GitHub issue remains the primary historical record.

### Collision handling

Collision policy is split by ID type:

1. Explicit-ID collision (same explicit ID appears more than once site-wide):
	- Treat as a build-time error and fail the build until resolved.
2. Fallback-ID collision (hash collision or normalization collision):
	- Keep the first occurrence as `feedback-block-<hash>`.
	- Assign deterministic suffixes to additional collisions in source order:
	  - `feedback-block-<hash>-2`
	  - `feedback-block-<hash>-3`
3. Explicit vs fallback conflict (fallback equals an existing explicit ID):
	- Preserve the explicit ID unchanged.
	- Suffix the fallback deterministically as above.

### Completion status for P1-04

- Explicit-ID convention documented.
- Fallback algorithm documented.
- Collision handling documented.

## P1-05 Build-Time Passage Identifier Scope and Rules

Approved implementation choices for Phase 1:

1. Implementation style:
	- Use an inline Quartz transformer in `quartz.config.ts`.
2. Scope boundary:
	- Assign passage identifiers only on `content/Advocacy Paper.md`.
	- Do not assign passage identifiers on any other page.
3. Collision behavior for fallback IDs:
	- Warn when a generated fallback collides.
	- Keep first as `feedback-block-<hash>`.
	- Suffix later collisions deterministically (`-2`, `-3`, ...).
4. Heading handling (clarified):
	- In this context, "heading handling" means whether heading elements (`h1`-`h6`) should receive passage identifiers.
	- For Phase 1, headings do not receive passage identifiers.
	- Headings may still be used only as context metadata (for example, "nearest heading").

## P1-05 Completion Check Results

Run date: 2026-07-17 (local environment)

Completion criteria status:

1. Eligible content blocks have usable IDs: **PASS**
	- Local output check on `public/Advocacy-Paper.html` returned:
	  - `TOTAL=165`
	  - `MISSING_ID=0`
	- Interpretation: all feedback-marked blocks in the target page had usable IDs.

2. Existing anchors remain intact: **PASS**
	- Verified explicit anchor present in generated HTML:
	  - `<p id="test-1" data-feedback-block="true">...`

3. The Quartz site builds successfully: **PASS**
	- `npm run build` completed successfully.

4. Tests pass: **PASS**
	- Added `npm test` script in `package.json`.
	- Added integration harness at `tests/passage-identifiers.test.cjs`.
	- Verified local run: `npm test` -> `Passage identifier tests passed.`

Overall result:

- 4 of 4 completion criteria currently pass.

## P1-06 Accessible Block-Level Feedback Controls

Implementation summary:

1. Added a custom Quartz layout component that injects passage feedback controls.
2. Controls are attached to eligible blocks marked with `data-feedback-block="true"`.
3. Each control is a keyboard-focusable button with visible text:
	- `Give feedback on this passage`
4. Each button also includes contextual accessible naming:
	- `Give feedback on the passage beginning "..."`
5. Activation stores passage context in `sessionStorage` under `mcipa.feedbackContext` and navigates to:
	- `/Provide-Feedback-on-the-Advocacy-Paper`
6. Payload fields written to `sessionStorage`:
	- `feedbackType`
	- `pageTitle`
	- `pageUrl`
	- `sectionHeading`
	- `blockId`
	- `blockUrl`
	- `quotedText`
7. Controls are reattached after Quartz SPA navigation by listening to the `nav` event.

Operational notes:

- To ensure local `quartz.config.ts` and `quartz.layout.ts` changes are always active, project scripts now run `sync-quartz-config` before build/preview/sync/test.

### P1-06 Completion Check Results

Run date: 2026-07-17 (local environment)

1. Each eligible block has an accessible feedback control: **PASS**
	- Browser validation found `165` controls on `Advocacy-Paper`.
	- Controls are visible and focusable buttons.

2. Controls work after initial page load and Quartz client navigation: **PASS**
	- Browser validation confirmed `165` controls after SPA route change round-trip.

3. Activating a control opens the form with the correct block data: **PASS**
	- Navigation reached `/Provide-Feedback-on-the-Advocacy-Paper`.
	- `sessionStorage` payload includes all required fields (`feedbackType`, `pageTitle`, `pageUrl`, `sectionHeading`, `blockId`, `blockUrl`, `quotedText`).

### P1-06 Form Hydration Bridge (Prerequisite for P1-07)

Run date: 2026-07-17 (local environment)

1. Added a feedback form scaffold to `content/Provide Feedback on the Advocacy Paper.md` with:
	- context status messaging,
	- context display fields,
	- hidden fields for `feedbackType`, `pageTitle`, `pageUrl`, `sectionHeading`, `blockId`, `blockUrl`, and `quotedText`.
2. Added client-side hydration logic in `quartz.layout.ts` that:
	- detects the feedback page,
	- reads `mcipa.feedbackContext` from `sessionStorage`,
	- populates visible context and hidden fields,
	- preserves direct-open behavior when context is absent.
3. End-to-end validation: **PASS**
	- Clicking a passage feedback button on `Advocacy-Paper` navigates to the feedback page and hydrates expected fields.

## P1-07 Selection-Based Passage Feedback

Implementation summary:

1. Added progressive selection feedback behavior in `quartz.layout.ts` as part of the same client-side component that handles block-level controls.
2. When text is selected inside a valid feedback block, a small action button appears near the selection:
	- `Give feedback on selected text`
3. Selection validation rules implemented:
	- reject empty, collapsed, or whitespace-only selections,
	- reject selections longer than 600 characters,
	- reject selections spanning different feedback blocks,
	- reject selections outside eligible feedback blocks,
	- reject selections from navigation/footer/page chrome regions.
4. On selection action activation, payload stored in `sessionStorage` now includes:
	- `feedbackType=selection`
	- `selectedText` (exact selected text, normalized)
	- `fullBlockText`
	- `startContext`
	- `endContext`
	- plus existing context fields (`pageTitle`, `pageUrl`, `sectionHeading`, `blockId`, `blockUrl`, `quotedText`).
5. Feedback form page was extended to display and carry hidden fields for selection-specific data.

### P1-07 Completion Check Results

Run date: 2026-07-17 (local environment)

1. Users can comment on a sentence or phrase: **PASS**
	- Selecting text inside an eligible block shows the selection action.
	- Activating it navigates to `/Provide-Feedback-on-the-Advocacy-Paper` with `feedbackType=selection` and populated selection/context fields.

2. The feature does not interfere with ordinary copying: **PASS (smoke check)**
	- `copy` event is not canceled by the selection feature.

3. Block-level feedback still works without JavaScript selection support: **PASS**
	- Block-level `Give feedback on this passage` controls remain present and functional independent of selection state.

## P1-08 Durable Passage Links

Implementation summary:

1. Added canonical URL generation in `quartz.layout.ts` for passage submissions using:
	- `https://pietlab.github.io/mcipa-demedicalize-accommodation` + current page path.
2. Added anchored block link generation for passage and selection flows:
	- `blockUrl = canonicalPageUrl#blockId`
3. Added text-fragment link generation as enhancement when reliable:
	- generated only when normalized quoted/selected text length is between 4 and 180 characters,
	- omitted otherwise.
4. Added safe encoding for text-fragment payloads using `encodeURIComponent`.
5. Kept navigation target fixed to the known feedback page path (no user-controlled redirect).
6. Updated feedback page UI/fields to display captured destinations for verification:
	- block URL
	- text-fragment URL (or `Not generated`)
	- hidden field `textFragmentUrl` for form submission pipeline.

### P1-08 Completion Check Results

Run date: 2026-07-17 (local environment)

1. Block links scroll to the relevant block: **PASS**
	- Captured block URL format validated as canonical + block anchor.

2. Text-fragment links are included when valid: **PASS**
	- Block-level feedback with long passage text correctly omitted text-fragment URL (`Not generated`).
	- Selection feedback with short in-block text generated valid text-fragment URL containing `#:~:text=`.

3. Malformed or excessive selections are handled safely: **PASS**
	- Oversized selection (`851` chars) hid the selection action and did not produce a text-fragment submission path.

## P1-09 Public Feedback Form Page

Implementation summary:

1. Created a dedicated public route page at `/submit-feedback` using `content/submit-feedback.md`.
2. Added required public-safety notices near the top of the page:
	- no GitHub account required,
	- submission becomes a public issue,
	- no medical/confidential/personal identifiers,
	- any provided name is public.
3. Added explicit feedback scope question with two options:
	- site/page-level feedback,
	- passage-level feedback.
4. Added required fields and controls:
	- optional name/pseudonym,
	- brief title,
	- optional/editable relevant page URL,
	- read-only section field when prefilled,
	- read-only selected passage field when prefilled,
	- required feedback description,
	- hidden honeypot field.
5. Added a visible passage-context review card with a clear action:
	- `Clear passage context` resets hidden passage fields,
	- mode switches back to page-level,
	- user gets confirmation status text.
6. Extended form hydration behavior in `quartz.layout.ts` to support P1-09 UX:
	- route detection includes `/submit-feedback` (with backward compatibility for older form slug),
	- mode toggling updates visible context region and hidden `feedbackType`,
	- direct-open fallback defaults to page-level mode,
	- passage-triggered navigation pre-fills page/section/passage display fields,
	- submit lifecycle includes disabled button while pending, status messaging, error handling, and optional created-issue link rendering.

### P1-09 Completion Check Results

Run date: 2026-07-17 to 2026-07-18 (local environment)

1. Direct form route is available and keyboard-usable: **PASS**
	- `/submit-feedback` returns 200 in preview and renders the full form.
	- Core controls (`mode-page`, `mode-passage`, title, comment, submit) are present.

2. Both page-level and passage-level modes work: **PASS**
	- Passage-triggered navigation hydrates section and selected passage context.
	- Clearing context switches mode back to page-level and updates status text.

3. Context review and clear interaction works: **PASS**
	- Context card now renders as live DOM (not escaped code),
	- `Clear passage context` button remains interactive,
	- mode radio state transitions to page-level after clear.

4. Submit lifecycle behavior is implemented: **PASS (endpoint-pending)**
	- Submit button enters pending state then recovers on failure.
	- Missing endpoint currently yields explicit error message (`Submission endpoint is not configured yet.`).
	- Success path supports optional issue link display when backend returns a URL.

### Operator Note

- Configure the form by setting `data-endpoint` on `/submit-feedback` to the Worker URL.
- Expected success response JSON shape:
	```json
	{
	  "issueUrl": "https://github.com/.../issues/123",
	  "html_url": "https://github.com/.../issues/123",
	  "url": "https://github.com/.../issues/123"
	}
	```
- The page accepts the first available URL field and uses it to show the created-issue link.

## P1-10 Public Issue Format

Implementation summary:

1. Added a reusable issue-format module at `services/mcipa-feedback-worker/src/issue-format.js`.
2. The formatter now returns a single issue object with:
	- `title`
	- `body`
	- `labels`
3. Passage-level bodies render the requested sections:
	- selected passage,
	- feedback,
	- passage location,
	- submission information.
4. Page-level bodies render the requested sections:
	- feedback,
	- page information,
	- submission information.
5. All dynamic values are treated as untrusted and rendered through length-limited, structure-preserving helpers so they cannot create headings or break the issue layout.
6. Optional fields fall back to readable placeholders such as `Not provided`, `Anonymous`, and `Site generally`.

### P1-10 Completion Check Results

Run date: 2026-07-17 (local environment)

1. Examples for both issue types are approved: **PASS**
	- The formatter produces legible page-level and passage-level issue bodies matching the agreed structure.

2. Issue bodies remain legible when fields are omitted: **PASS**
	- Missing page metadata renders readable placeholders without collapsing the structure.

3. User-supplied Markdown cannot break the administrative structure: **PASS**
	- Dynamic values are rendered as quoted or code-formatted literals, and injected headings remain inside quoted content.

4. Tests pass: **PASS**
	- Added `tests/public-issue-format.test.cjs`.
	- Verified local run: `npm test` -> `Passage identifier tests passed.` and `Public issue format tests passed.`

## P1-14 Cloudflare Account and Wrangler Authentication

Implementation summary:

1. The Cloudflare account for the MCIPA feedback Worker is the PiETLab-controlled account registered under `mbaljko@icloud.com`.
2. The account owner and maintenance responsibility are documented in:
	- `docs/Cloudflare account administration.md`
3. Wrangler authentication was completed successfully with `npx wrangler login`.
4. The OAuth flow was approved against the intended Cloudflare account, and the login finished without storing any secret in the repository.

### P1-14 Completion Check Results

Run date: 2026-07-17 (local environment)

1. Wrangler is authenticated to the intended account: **PASS**
	- `wrangler login` completed successfully.

2. The account owner and maintenance responsibility are documented: **PASS**
	- The Cloudflare account administration note records ownership, recovery, and administrative responsibility.
