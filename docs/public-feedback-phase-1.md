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

- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Allowed characters: lowercase letters, digits, hyphens.
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
