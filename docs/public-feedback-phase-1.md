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
