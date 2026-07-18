# Submit Feedback

You do not need a GitHub account.

Your submission will be published as a public GitHub issue.

Do not include medical information, accommodation documentation, student numbers, confidential information, or other personal information.

Any name or pseudonym you provide will also be public.

<div class="feedback-notice" role="note">
  Review all details before submitting. Automatically captured passage context is shown below and can be cleared.
</div>

<form id="public-feedback-form" class="feedback-form" method="post" action="#" data-endpoint="" novalidate>
<fieldset class="feedback-mode-group">
<legend>What is your feedback about?</legend>
<label class="feedback-mode-option" for="mode-page">
<input id="mode-page" type="radio" name="feedbackMode" value="page" checked />
<span>The site or this page generally</span>
</label>
<label class="feedback-mode-option" for="mode-passage">
<input id="mode-passage" type="radio" name="feedbackMode" value="passage" />
<span>A particular passage</span>
</label>
</fieldset>

<div class="feedback-context-card" aria-live="polite">
<h2>Automatically Captured Passage Context</h2>
<p id="feedback-context-status">Waiting for passage context...</p>
<p id="feedback-context-missing" hidden>
Open this page from a passage-level feedback control to include passage context automatically.
</p>

<div id="feedback-context-section" class="feedback-context-preview" hidden>
<p><strong>Relevant page URL:</strong> <span id="feedback-page-url">Not provided</span></p>
<p><strong>Section:</strong> <span id="feedback-section-heading">Not provided</span></p>
<p><strong>Block ID:</strong> <span id="feedback-block-id">Not provided</span></p>
<p><strong>Anchored block link:</strong> <span id="feedback-block-url">Not provided</span></p>
<p><strong>Text-fragment URL:</strong> <span id="feedback-text-fragment-url">Not generated</span></p>
<p><strong>Selected passage:</strong></p>
<blockquote id="feedback-selected-text">Not provided</blockquote>
<div class="feedback-inline-actions">
<button id="clear-passage-context" type="button">Clear passage context</button>
</div>
</div>
</div>

<label for="field-display-name">Name or pseudonym (optional)</label>
<input id="field-display-name" name="displayName" type="text" maxlength="120" autocomplete="name" />

<label for="field-title">Brief title</label>
<input id="field-title" name="title" type="text" maxlength="180" required />

<label for="field-page-url-editable">Relevant page (optional or prefilled)</label>
<input id="field-page-url-editable" name="pageUrlUser" type="url" placeholder="https://..." />

<label for="field-section-heading-display">Section (read-only when prefilled)</label>
<input id="field-section-heading-display" name="sectionHeadingDisplay" type="text" readonly />

<label for="field-selected-passage-display">Selected passage (read-only when prefilled)</label>
<textarea id="field-selected-passage-display" name="selectedPassageDisplay" readonly></textarea>

<label for="field-feedback-comment">Feedback description</label>
<textarea id="field-feedback-comment" name="comment" maxlength="4000" required placeholder="Describe your feedback and suggested changes."></textarea>

<input name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;" />

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

<button id="feedback-submit-button" type="submit">Submit feedback</button>
<p id="feedback-submit-status" class="feedback-submit-status" aria-live="polite"></p>
<a id="feedback-created-issue-link" hidden rel="noopener noreferrer" target="_blank"></a>
</form>
