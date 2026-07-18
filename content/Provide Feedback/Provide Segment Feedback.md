# Provide Segment Feedback

Use this page to submit feedback about the Advocacy Paper.  For information about how your feedback will be used, see the [[content/Policy and Admin/Public Feedback Policy|Public Feedback Policy]].

<div class="feedback-notice" role="note">
  Provide feedback on the passage you selected below.
</div>
<form id="public-feedback-form" class="feedback-form" method="post" action="#" data-endpoint="" novalidate>
	
<div class="feedback-context-card" aria-live="polite">
  <p id="feedback-context-status">Waiting for passage context...</p>
  <p id="feedback-context-missing" hidden>
    Select a segment from the [[Advocacy Paper|Adocacy Paper]] for feedback.
  </p>
  <div id="feedback-context-from-passage" hidden>
    <!--Passage context is captured automatically from the button you used.-->
    <div id="feedback-selected-text" class="feedback-selected-text">Not provided</div>
  </div>
</div>

<div class="feedback-copy-action">
  <button id="copy-segment-to-feedback" class="feedback-copy-button" type="button" hidden>Copy segment to feedback field</button>
</div>

<label for="field-display-name">Name (optional, can be pseudonym)</label>
<input id="field-display-name" name="displayName" type="text" maxlength="120" autocomplete="name" />

<input id="field-title" name="title" type="hidden" value="" />

<label for="field-feedback-comment">Feedback</label>
<textarea id="field-feedback-comment" name="comment" maxlength="4000" required placeholder="Describe your feedback and suggested changes."></textarea>

<input name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;" />

<input id="field-feedback-type" type="hidden" name="feedbackType" value="passage" />
<input id="field-page-title" type="hidden" name="pageTitle" value="" />
<input id="field-page-url" type="hidden" name="pageUrl" value="" />
<input id="field-published-branch" type="hidden" name="publishedBranch" value="" />
<input id="field-published-commit" type="hidden" name="publishedCommit" value="" />
<input id="field-published-commit-date" type="hidden" name="publishedCommitDate" value="" />
<input id="field-section-heading" type="hidden" name="sectionHeading" value="" />
<input id="field-block-id" type="hidden" name="blockId" value="" />
<input id="field-block-url" type="hidden" name="blockUrl" value="" />
<input id="field-text-fragment-url" type="hidden" name="textFragmentUrl" value="" />
<input id="field-quoted-text" type="hidden" name="quotedText" value="" />
<input id="field-selected-text" type="hidden" name="selectedText" value="" />
<input id="field-full-block-text" type="hidden" name="fullBlockText" value="" />
<input id="field-start-context" type="hidden" name="startContext" value="" />
<input id="field-end-context" type="hidden" name="endContext" value="" />
<input id="field-section-heading-display" type="hidden" name="sectionHeadingDisplay" value="" />
<input id="field-selected-passage-display" type="hidden" name="selectedPassageDisplay" value="" />

<p id="feedback-submit-status" class="feedback-submit-status" aria-live="polite"></p>
<button id="feedback-submit-button" type="submit">Submit feedback</button>
<a id="feedback-created-issue-link" hidden rel="noopener noreferrer" target="_blank"></a>
</form>
