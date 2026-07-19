# Provide Feedback on the Advocacy Paper

Use this page to submit feedback about the Advocacy Paper.  For information about how your feedback will be used, see the [[content/Policy and Admin/Public Feedback Policy|Public Feedback Policy]].

<!--<div class="feedback-notice" role="note">
  Fill out the form below to send feedback.
</div>-->

<form id="public-feedback-form" class="feedback-form" method="post" action="#" data-endpoint="" novalidate>

<label for="field-display-name">Name (optional, can be pseudonym)</label>
<input id="field-display-name" name="displayName" type="text" maxlength="120" autocomplete="name" />

<input id="field-title" name="title" type="hidden" value="" />

<label for="field-feedback-comment">Feedback</label>
<textarea id="field-feedback-comment" name="comment" maxlength="4000" required placeholder="Describe your feedback and suggested changes."></textarea>

<label for="field-website" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;">Leave this field blank</label>
<input id="field-website" name="website" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;" />

<input id="field-feedback-type" type="hidden" name="feedbackType" value="page" />
<input id="field-page-title" type="hidden" name="pageTitle" value="" />
<input id="field-page-url" type="hidden" name="pageUrl" value="" />
<input id="field-published-branch" type="hidden" name="publishedBranch" value="" />
<input id="field-published-commit" type="hidden" name="publishedCommit" value="" />
<input id="field-published-commit-date" type="hidden" name="publishedCommitDate" value="" />

<p id="feedback-submit-status" class="feedback-submit-status" aria-live="polite"></p>
<button id="feedback-submit-button" type="submit">Submit feedback</button>
<a id="feedback-created-issue-link" hidden rel="noopener noreferrer" target="_blank"></a>
</form>

<!--
Parked passage-level UI for later reintroduction:

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
<div id="feedback-context-from-passage" hidden>
<p><strong>Relevant page URL:</strong> <span id="feedback-page-url">Not provided</span></p>
<p><strong>Section:</strong> <span id="feedback-section-heading">Not provided</span></p>
<p><strong>Block ID:</strong> <span id="feedback-block-id">Not provided</span></p>
<p><strong>Anchored block link:</strong> <span id="feedback-block-url">Not provided</span></p>
<p><strong>Text-fragment URL:</strong> <span id="feedback-text-fragment-url">Not generated</span></p>
<p><strong>Selected passage:</strong></p>
<blockquote id="feedback-selected-text">Not provided</blockquote>
<p><strong>Quoted text:</strong> <span id="feedback-quoted-text">Not provided</span></p>
<p><strong>Containing block text:</strong> <span id="feedback-full-block-text">Not provided</span></p>
<p><strong>Start context:</strong> <span id="feedback-start-context">Not provided</span></p>
<p><strong>End context:</strong> <span id="feedback-end-context">Not provided</span></p>
<div class="feedback-inline-actions">
<button id="clear-passage-context" type="button">Clear passage context</button>
</div>
</div>
</div>

<label for="field-section-heading-display">Section (read-only when prefilled)</label>
<input id="field-section-heading-display" name="sectionHeadingDisplay" type="text" readonly />

<label for="field-selected-passage-display">Selected passage (read-only when prefilled)</label>
<textarea id="field-selected-passage-display" name="selectedPassageDisplay" readonly></textarea>
-->