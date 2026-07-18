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

Note: the live feedback page now uses a simplified page-level-only form on `content/Provide Feedback on the Advocacy Paper.md`, and the passage-specific UI is parked in the page source as a commented block for later restoration.
1. Consolidated the public feedback form onto `content/Provide Feedback on the Advocacy Paper.md`.
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
	- route detection includes only `/provide-feedback-on-the-advocacy-paper`,
	- mode toggling updates visible context region and hidden `feedbackType`,
	- direct-open fallback defaults to page-level mode,
	- passage-triggered navigation pre-fills page/section/passage display fields,
	- submit lifecycle includes disabled button while pending, status messaging, error handling, and optional created-issue link rendering.

### P1-09 Completion Check Results

Run date: 2026-07-17 to 2026-07-18 (local environment)

1. Direct form route is available and keyboard-usable: **PASS**
	- `/Provide-Feedback-on-the-Advocacy-Paper` returns 200 in preview and renders the full form.
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

- Configure the form by setting `data-endpoint` on `/Provide-Feedback-on-the-Advocacy-Paper` to the Worker URL.
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

1. Added a reusable issue-format module at `services/mcipa-feedback-worker/src/issue-format.cjs`.
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

## P1-15 Cloudflare Worker Implementation

Implementation summary:

1. Added a separate worker directory at `services/mcipa-feedback-worker/` with a dedicated `wrangler.toml` and TypeScript entrypoint.
2. The worker implements:
	- `POST` submission handling,
	- `OPTIONS` CORS preflight,
	- rejection of other methods,
	- exact origin checks for the production site and an explicit dev origin,
	- JSON content-type checking,
	- request-body size limits,
	- schema validation and field normalization,
	- honeypot handling,
	- server-side issue Markdown construction through the shared issue formatter,
	- fixed GitHub issue creation against `PiETLab/mcipa-demedicalize-accommodation`.
3. The worker refuses unsupported fields and validates that submitted page and fragment URLs use the expected MCIPA origin/path prefix.
4. The worker returns generic client errors, keeps logs free of secrets and personal text, and cannot act as a general-purpose GitHub issue proxy.
5. Added unit tests for valid page and passage submissions plus invalid origin, method, content-type, JSON, honeypot, page URL, body-size, and GitHub failure cases.


## P1-15 Completion Check Results

Run date: 2026-07-17 (local environment)

1. The worker compiles: **PASS**
	- `node --experimental-strip-types tests/public-feedback-worker.test.mjs` imported the TypeScript worker successfully.

2. Unit tests cover valid and invalid submissions: **PASS**
	- Added `tests/public-feedback-worker.test.mjs`.
	- Verified local run: `npm test` -> `Passage identifier tests passed.`, `Public issue format tests passed.`, and `Public feedback worker tests passed.`

3. No token or secret appears in source: **PASS**
	- The worker reads `env.GITHUB_TOKEN` only; no secret value is hard-coded.

4. The worker cannot be used as a general-purpose GitHub issue proxy: **PASS**
	- The target repository is fixed in code and unsupported form fields are rejected.

## P1-16 Cloudflare Secret Upload

Implementation summary:

1. The GitHub token was added to Cloudflare as the `GITHUB_TOKEN` secret using `npx wrangler secret put GITHUB_TOKEN`.
2. Wrangler created the `mcipa-feedback` Worker as part of the secret upload flow and stored the secret there successfully.
3. The token value itself was not written to source, documentation, or chat.

### P1-16 Completion Check Results

Run date: 2026-07-17 (local environment)

1. The Worker has a `GITHUB_TOKEN` secret: **PASS**
	- Wrangler reported `Success! Uploaded secret GITHUB_TOKEN`.

2. The secret is not present in source or chat: **PASS**
	- Only the secret name is documented; the token value is not recorded anywhere in the repository.

## P1-17 Local Worker Testing

Completion criteria status:

1. Automated validation and formatting tests pass: **PASS**
	- `npm test` passes in the local environment.
	- `wrangler dev --port 8787` starts successfully after the entrypoint was reduced to a default export only.
2. Failure responses do not expose internal details: **PASS**
	- Worker failures return generic bodies such as `Invalid submission.` and `Unable to process submission.`
	- Tests now assert those bodies for invalid input, GitHub failure, and unexpected runtime failure.
3. No live GitHub issues are created unintentionally: **PASS**
	- The local smoke check used `OPTIONS` only and did not create an issue.
	- Invalid submissions are rejected before the GitHub call is reached.

P1-17 completion result:

- Local worker testing is complete under the agreed criteria.

Operational note:

- The local Worker smoke test is intentionally non-destructive. The only live request issued during P1-17 validation was a CORS preflight, which cannot create a GitHub issue.

## P1-18 Pre-Deployment Note

Before deployment, the working tree should be checked with `git status` and `git diff`, and the worker code should still satisfy the safety checks for secret handling, repository ownership, production origin, endpoint URLs, labels, and generic error logging.

It was checked, ok.

## P1-18 Deployment Result

Completion criteria status:

1. The Worker is deployed: **PASS**
	- Wrangler deployed the worker successfully.
2. Its URL is recorded: **PASS**
	- Live Worker URL: `https://mcipa-feedback.mcipa-feedback.workers.dev`
3. Unsupported requests return an appropriate error: **PASS**
	- A live `GET /submit-feedback` request now returns `405 Method Not Allowed` with the JSON body `{"error":"Method not allowed."}`.
4. No issue has yet been created unless intentionally tested: **PASS**
	- Deployment does not create issues by itself.

## P1-19 — Connect the Quartz form to the deployed Worker

Implementation summary:

1. The consolidated Quartz feedback form now submits to the deployed Cloudflare Worker through one shared public endpoint constant in `quartz.layout.ts`.
2. The form uses `POST` with JSON, shows a pending state during submission, and parses the Worker response for success and failure handling.
3. On success, the form shows a safe GitHub issue link using the server-returned URL and resets only after the issue link has been exposed.
4. On failure, the form keeps the user’s entered content intact so it can be corrected and resubmitted.

Decision: use one shared public constant in `quartz.layout.ts` for the production Worker endpoint.

Rationale:

- The endpoint is public, so it does not need secret handling.
- Centralizing the value avoids scattering the URL across the form submit handler, success UI, and failure UI.
- A single constant makes later endpoint changes easier to audit and update.

If a different production Worker endpoint approach is needed later, document all of the following in this section before changing it:

- what the new approach is;
- why it is preferred over the shared constant;
- which files will change;
- how the old endpoint wiring will be retired.

Accepted recommendation:

- Define the production Worker endpoint once in `quartz.layout.ts` as a single shared constant for the submission flow.
- Read that value from the form submit handler, success UI, and failure UI instead of duplicating the URL in multiple places.
- Keep the endpoint public but centralized so there is one obvious place to update it if the Worker URL ever changes.

### P1-19 Completion Check Results

Run date: 2026-07-17 (local environment)

1. The local Quartz site submits to the deployed Worker: **PASS**
	- The consolidated feedback page now POSTs JSON to `https://mcipa-feedback.mcipa-feedback.workers.dev/submit-feedback`.
	- The deployed worker accepts the local Quartz origin through the worker `DEV_ORIGIN` binding.
2. Successful responses display the created issue link: **PASS**
	- A successful local submission returned `https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/6` and rendered the `View created issue` link.
	- The link is opened safely with `target="_blank"` and `rel="noopener noreferrer"`.
3. Failed responses preserve the user’s feedback: **PASS**
	- The form keeps entered values on a non-OK response, and only resets after a confirmed success.
	- The status text reports the submission outcome without clearing the user’s text first.

## P1-20 — Add navigation and contextual entry points

Implementation summary:

1. Contextual entry points are implemented on eligible passages in `Advocacy-Paper` through:
	- block-level controls (`Give feedback on this passage`), and
	- selection-based controls (`Give feedback on selected text`).
2. Both contextual paths route to the consolidated feedback page:
	- `/Provide-Feedback-on-the-Advocacy-Paper`.
3. Passage-triggered entry points carry context in `sessionStorage` and prefill hidden form metadata on arrival.
4. Direct-open behavior on the feedback page remains page-level by default so feedback can be submitted without using passage controls.
5. A globally discoverable sitewide `Give feedback` link (for example in footer or top navigation) is not yet recorded as shipped in this phase log and remains a follow-up item.

### P1-20 Completion Check Results

Run date: 2026-07-17 to 2026-07-18 (local environment)

1. Visitors can find general feedback without selecting text: **PARTIAL**
	- The dedicated feedback route exists and works when opened directly.
	- A global discoverable entry point (footer/nav/page-meta link) is still pending.
2. Visitors can submit feedback about a particular block: **PASS**
	- Block controls render on eligible passages and navigate to the feedback form with context.
3. Visitors can submit feedback about selected text: **PASS**
	- Selection controls appear for valid in-block selections and submit through the same form flow.

## P1-21 — Run local accessibility and usability testing

Implementation scope for this pass:

- Run all feasible automated local checks (build, tests, generated HTML inspection, scripted interaction checks).
- Record manual-only checks that still require human assistive-technology and visual verification.

### P1-21 Local Check Results

Run date: 2026-07-17 to 2026-07-18 (local environment)

Automated checks completed:

1. Build and test pipeline: **PASS**
	- `npm run build` completed successfully.
	- `npm test` completed successfully (`passage-identifiers`, `public-issue-format`, and `public-feedback-worker` tests passed).

2. Duplicate IDs on generated target page: **PASS**
	- Duplicate `id` count on `public/Advocacy-Paper.html`: `0`.

3. Feedback-form status and label hooks in generated HTML: **PASS**
	- `public/Provide-Feedback-on-the-Advocacy-Paper.html` contains:
	  - labeled name field,
	  - labeled feedback textarea,
	  - status region `#feedback-submit-status` with `aria-live="polite"`,
	  - created-issue link element with safe new-tab attributes.

4. Touch/narrow viewport control availability: **PASS**
	- At mobile viewport width (`390px`), passage controls remain visible and sized for touch interaction.

5. Selection/copy behavior smoke test: **PASS (automated smoke check)**
	- Programmatic selection inside a feedback block did not trigger navigation by itself.
	- Synthetic copy event was not prevented (`defaultPrevented=false`).

6. Failed-submission recovery on feedback form: **PASS**
	- Forced endpoint failure (`ERR_CONNECTION_REFUSED`) preserved entered form values.
	- Error status was shown and fields remained editable for retry.

Issues found during this P1-21 run:

1. Public/private messaging clarity on active feedback page: **PARTIAL**
	- The page links to `Public Feedback Policy`, but the inline notice is minimal.
	- A direct, pre-submit plain-language warning that all submitted fields may become public should be made more explicit on-page.

Rerun update (same local test window):

1. Keyboard and selection contextual route mismatch: **RESOLVED**
	- Updated `FORM_SLUG` in `quartz.layout.ts` to `/Provide-Feedback-on-the-Advocacy-Paper`.
	- Re-validated both keyboard activation (Enter on passage control) and selection-action activation now route to the consolidated feedback page (no local `404`).

Manual checks still required (human-run):

1. Keyboard-only full flow with human navigation and focus visibility review.
2. Screen-reader checks (labels, announcement timing, and distinction between context vs editable feedback).
3. Touch interaction on physical device(s) to confirm no hover dependency in real use.
4. Reduced-motion and 200% zoom visual review (including floating control overlap on long text).

### P1-21 Completion Criteria Status (current)

1. There are no keyboard blockers: **PASS (automated/local flow check)**
	- Keyboard activation of passage controls now reaches `/Provide-Feedback-on-the-Advocacy-Paper` as expected.
2. Public/private messaging is unambiguous: **PARTIAL**
	- Policy is linked, but inline pre-submit public-data warning can be clearer.
3. Passage context is accurately captured: **PASS (automated/local flow check)**
	- Passage and selection controls route correctly to the feedback page and carry contextual entry behavior.
4. The form remains usable on narrow screens: **PASS (automated/local smoke)**
	- Feedback controls and form controls remained visible and interactive under mobile viewport dimensions.

## P1-21B Non-Local Accessibility Note

Use the deployed GitHub Pages site for WAVE-style non-local checks, and keep `main` as the source of truth until the feature branch is ready to merge.

What has been learned so far:

- The empty-button issue points to the Quartz header controls in `quartz.layout.ts`, especially the desktop/mobile explorer wiring and the icon-only control area.
- The low-contrast issue points to the Quartz theme tokens in `quartz.config.ts`, especially the light-mode gray and light color values used in the header/search area.

Why not switch GitHub Pages to the feature branch temporarily:

- It creates a second deployment target that can drift from `main`.
- It makes merge verification harder because the live site would no longer match the branch you actually intend to land.
- It risks mixing accessibility fixes with the production deployment path before the feature branch is reviewed.

Recommended workflow:

- Keep GitHub Pages rendering from `main`.
- Make the Quartz accessibility edits in the feature branch.
- Validate locally and, when needed, against the deployed `main` site.
- Merge the feature branch, then let GitHub Pages update naturally from `main`.

Checklist for the later Quartz pass:

1. Recheck the WAVE issues on the deployed `main` site.
2. Locate the exact layout and theme lines in `quartz.layout.ts` and `quartz.config.ts`.
3. Adjust the icon-only or unlabeled control that WAVE marks as the empty button.
4. Improve the header/search contrast if the theme tokens still produce low contrast.
5. Validate locally first, then confirm the deployed site again before merging.



