# Provide Feedback on the Advocacy Paper

Use this page to submit feedback on either the full page or a specific passage.

<div class="feedback-context-card" aria-live="polite">
	<h2>Passage Context</h2>
	<p id="feedback-context-status">Waiting for passage context...</p>
	<p id="feedback-context-missing" hidden>
		Open this page from a passage-level "Give feedback" button to include passage context automatically.
	</p>
	<div id="feedback-context-from-passage" hidden>
		<p><strong>Page title:</strong> <span id="feedback-page-title">Not provided</span></p>
		<p><strong>Page URL:</strong> <span id="feedback-page-url">Not provided</span></p>
		<p><strong>Nearest heading:</strong> <span id="feedback-section-heading">Not provided</span></p>
		<p><strong>Block ID:</strong> <span id="feedback-block-id">Not provided</span></p>
		<p><strong>Block URL:</strong> <span id="feedback-block-url">Not provided</span></p>
		<p><strong>Text-fragment URL:</strong> <span id="feedback-text-fragment-url">Not generated</span></p>
		<p><strong>Quoted text:</strong> <span id="feedback-quoted-text">Not provided</span></p>
		<p><strong>Selected text:</strong> <span id="feedback-selected-text">Not provided</span></p>
		<p><strong>Containing block text:</strong> <span id="feedback-full-block-text">Not provided</span></p>
		<p><strong>Start context:</strong> <span id="feedback-start-context">Not provided</span></p>
		<p><strong>End context:</strong> <span id="feedback-end-context">Not provided</span></p>
	</div>
</div>

<form class="feedback-form" method="post" action="#" novalidate>
	<input id="field-feedback-type" type="hidden" name="feedbackType" value="page" />
	<input id="field-page-title" type="hidden" name="pageTitle" value="" />
	<input id="field-page-url" type="hidden" name="pageUrl" value="" />
	<input id="field-section-heading" type="hidden" name="sectionHeading" value="" />
	<input id="field-block-id" type="hidden" name="blockId" value="" />
	<input id="field-block-url" type="hidden" name="blockUrl" value="" />
	<input id="field-text-fragment-url" type="hidden" name="textFragmentUrl" value="" />
	<input id="field-quoted-text" type="hidden" name="quotedText" value="" />
	<input id="field-selected-text" type="hidden" name="selectedText" value="" />
	<input id="field-full-block-text" type="hidden" name="fullBlockText" value="" />
	<input id="field-start-context" type="hidden" name="startContext" value="" />
	<input id="field-end-context" type="hidden" name="endContext" value="" />

	<label for="field-feedback-comment">Your feedback</label>
	<textarea
		id="field-feedback-comment"
		name="comment"
		maxlength="4000"
		required
		placeholder="Share what should change, why, and any suggested wording."
	></textarea>

	<button type="submit">Submit feedback (prototype)</button>
</form>