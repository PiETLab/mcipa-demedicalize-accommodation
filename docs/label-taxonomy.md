# Design Note
## A Minimal Label Ontology for ActionForge
**Status:** Proposal  
**Audience:** ActionForge development team  
**Purpose:** Define a small, coherent label ontology for GitHub Issues that records information not already represented by GitHub itself.
# Motivation
GitHub already records a substantial amount of information about an issue, including:
- whether it is open or closed;
- who created it;
- when it was created or modified;
- who is assigned to it;
- its comments and deliberative history;
- related commits and pull requests;
- milestones and project-board placement.
The ActionForge label ontology should not duplicate these built-in features.
Its purpose is to represent only the additional information needed to interpret an issue as part of a collaborative governance process.
The ontology should answer no more than four questions:
1. **Where did this come from?**
2. **What object is it about?**
3. **What is it about?**
4. **What happened to it?** — if GitHub's open and closed states and the written decision record prove insufficient.
These questions correspond to four possible namespaces:
```text
source:
object:
topic:
decision:
```
Only the first two namespaces are currently implemented.
The `topic:` namespace may be introduced once recurring substantive categories are visible in actual contributions.
The `decision:` namespace should be introduced only if there is a demonstrated need for structured reporting that cannot be met through GitHub's open and closed states and written closing comments.
# Design principles
## 1. Represent only what GitHub cannot already answer
A label should not duplicate information already available through GitHub's issue model.
Labels such as the following are therefore generally unnecessary:
```text
open
closed
done
assigned
commented
```
GitHub already records these states and events.
The ontology should add information that would otherwise be absent or difficult to retrieve consistently.
## 2. One question per namespace
Each namespace should answer one distinct question.

| Namespace | Question |
|---|---|
| `source:` | Where did this issue come from? |
| `object:` | What object is the issue about? |
| `topic:` | What is the issue substantively about? |
| `decision:` | What happened to the proposal after review? |
Namespaces should remain orthogonal.
Good:
```text
source: public
object: passage
topic: accessibility
```
Poor:
```text
public-passage-accessibility-feedback
```
The first form permits each dimension to be searched, filtered, and revised independently.
## 3. Keep the ontology descriptive
Labels should describe identifiable characteristics of the issue rather than evaluate the value of the contribution.
Prefer:
```text
topic: governance
```
Avoid:
```text
important
good idea
interesting
low value
```
unless an evaluative label has a precise and documented operational meaning.
## 4. Keep each namespace small
Namespaces should contain only labels that support an actual workflow, reporting need, or research question.
Labels should not be created merely because they might be useful someday.
A new label should be added only when:
- multiple issues require the distinction;
- the distinction cannot be reliably inferred from existing GitHub data;
- the team can apply it consistently;
- it improves retrieval, governance, analysis, or public accountability.
## 5. Use exactly one label when the dimension is exclusive
Some namespaces should be mutually exclusive.
Every issue should normally have exactly one `source:` label because an issue should have one recorded pathway into the repository.
Every issue should normally have exactly one primary `object:` label when the feedback interface asks the contributor to choose between feedback on the paper as a whole and feedback on a specific passage.
Multiple `topic:` labels may be appropriate because a contribution can concern several substantive matters.
A future `decision:` namespace should normally contain no more than one final decision label.
# Current implementation
The following labels are currently implemented:

| Label | Description |
|---|---|
| `duplicate` | This issue or pull request already exists |
| `spam` | Spam, abuse, or clearly inappropriate submissions |
| `source: public` | Submitted through the public ActionForge feedback interface |
| `source: facilitator` | Entered by a facilitator on behalf of a participant during an engagement activity |
| `source: internal` | Created by the project team for internal editorial, governance, or project work |
| `source: demo` | Created solely for demonstrations, presentations, or training |
| `object: entire-paper` | Feedback concerning the paper as a whole |
| `object: passage` | Feedback concerning a specific passage of text |
These labels support two of the four questions:
1. Where did this come from?
2. What object is it about?
The administrative labels `duplicate` and `spam` support repository maintenance rather than the substantive ontology.
# Source namespace
## Question answered
**Where did this issue come from?**
The source namespace records the pathway through which an issue entered the repository.
It does not identify the ultimate origin of every idea expressed in the issue. It records how the GitHub issue itself was created and introduced into the ActionForge process.
## Current labels
```text
source: public
source: facilitator
source: internal
source: demo
```
## Definitions
### `source: public`
Submitted directly through the public ActionForge feedback interface.
This label indicates that the contributor used the public submission mechanism without a facilitator entering the issue on their behalf.
### `source: facilitator`
Entered by a facilitator on behalf of a participant during an engagement activity.
This may include:
- workshops;
- interviews;
- focus groups;
- facilitated review sessions;
- accessibility-supported submission processes.
The label describes the submission pathway. It should not imply that the contribution is less independent, less authentic, or less valuable.
### `source: internal`
Created by a member of the project team for internal editorial, governance, or project work.
This distinguishes team-generated issues from participant submissions.
Examples include:
- an editorial concern identified by the authors;
- a governance question raised by the project team;
- an issue created to record an internal discussion;
- a change proposed during project maintenance.
### `source: demo`
Created solely for demonstrations, presentations, training, or testing.
Demo issues are intentionally artificial and should not be treated as participant contributions or included in analyses of substantive feedback.
## Application rule
Every issue should have exactly one `source:` label.
```text
source: public
```
or:
```text
source: facilitator
```
or:
```text
source: internal
```
or:
```text
source: demo
```
The categories are intended to be mutually exclusive at the issue level.
If a public participant makes a contribution during a facilitated event but submits it directly through the public form, the team should document a consistent rule for which feature takes precedence.
A reasonable rule is:
- use `source: public` when the participant directly submits the form;
- use `source: facilitator` when the facilitator enters or materially transcribes the contribution into the system.
# Object namespace
## Question answered
**What object is this issue about?**
The object namespace identifies the collaborative object toward which the feedback is directed.
For the current implementation, the paper is presented on a single webpage. The meaningful distinction is therefore not between different webpages, but between:
- the paper as a whole;
- a specific passage within the paper.
## Current labels
```text
object: entire-paper
object: passage
```
## Definitions
### `object: entire-paper`
Feedback concerning the paper as a whole.
Examples include comments about:
- the overall argument;
- the scope of the paper;
- its general framing;
- its organization as a complete work;
- omissions affecting the paper broadly;
- the relationship among multiple sections.
The label refers to the conceptual object—the entire paper—not merely to the fact that the paper currently appears on one webpage.
### `object: passage`
Feedback concerning a specific passage of text.
A passage may be:
- a sentence;
- a paragraph;
- a quotation;
- a small group of adjacent paragraphs;
- a specifically selected portion of the paper.
The relevant passage should also be recorded in the issue body through quoted text, an anchor, a URL fragment, or another durable reference.
## Application rule
Every public or facilitated feedback issue should normally receive exactly one of:
```text
object: entire-paper
```
or:
```text
object: passage
```
Additional object labels should not be introduced until the corresponding objects become distinct targets of collaboration.
For example, `object: page` should be added only if the project later presents the paper across multiple pages and contributors can meaningfully direct feedback toward one page as a distinct object.
Possible future objects might include:
```text
object: section
object: figure
object: table
object: workflow
object: platform
```
These should be introduced only when supported by an actual interface or governance need.
# Topic namespace
## Question answered
**What is this issue about?**
The topic namespace would classify the substantive concern raised by the issue.
Possible examples include:
```text
topic: accessibility
topic: governance
topic: evidence
topic: terminology
topic: framing
topic: editorial
```
This namespace is not yet implemented.
That deferral is intentional.
A topic vocabulary should emerge from the actual contribution corpus rather than being fully specified in advance. Creating topic labels before reviewing recurring patterns risks imposing the project team's conceptual categories on participant contributions.
## Recommended development process
The team should first review a meaningful set of genuine issues and ask:
- Which substantive concerns recur?
- Which distinctions would improve retrieval?
- Which distinctions matter for governance or reporting?
- Can different reviewers apply the categories consistently?
- Are participants' concerns being represented without being distorted?
A small initial topic vocabulary can then be created.
## Application rule
An issue may receive more than one `topic:` label when genuinely necessary.
For example:
```text
topic: accessibility
topic: governance
```
Multiple topics should not be added merely to maximize coverage. Labels should identify the issue's central substantive concerns.
The topic namespace should remain relatively small and should not attempt to encode every concept mentioned in the issue.
# Decision namespace
## Question answered
**What happened to the proposal after review?**
A decision namespace may eventually be useful for reporting governance outcomes.
Possible labels include:
```text
decision: accepted
decision: partially-accepted
decision: deferred
decision: not-accepted
```
This namespace is not currently implemented.
## Why decision labels are optional
GitHub already records whether an issue is open or closed.
A closing comment can record:
- what was decided;
- who made the decision;
- why the decision was made;
- what changes resulted;
- which commit or revision contains the change.
For the initial implementation, this may be sufficient.
A separate decision label should be introduced only if the project needs to filter or aggregate outcomes across many issues.
Examples of questions that might justify a decision namespace include:
- How many proposals were accepted?
- How many were partially incorporated?
- How many were deferred?
- How often did participant contributions result in document changes?
## Decision is not status
A decision label would describe the substantive disposition of a proposal.
It would not describe the issue's current workflow position.
For example, an issue might be closed because its proposal was:
```text
decision: accepted
```
or:
```text
decision: not-accepted
```
GitHub's closed state indicates that the process has concluded. The decision label explains the nature of that conclusion.
## Decision labels do not replace explanations
A decision label should never substitute for a written rationale.
For example, applying:
```text
decision: partially-accepted
```
should be accompanied by a closing comment explaining:
- which part was accepted;
- which part was not accepted;
- the reasoning behind the decision;
- any resulting change to the paper.
# Administrative labels
The current administrative labels are:
```text
duplicate
spam
```
These labels do not answer one of the four substantive questions.
They support repository administration and moderation.
## `duplicate`
Used when an issue substantially duplicates an existing issue.
Whenever possible, the duplicate issue should contain a reference to the earlier issue before it is closed.
The existence of a duplicate does not imply that the repeated concern is unimportant. Multiple similar submissions may themselves be analytically meaningful, even if governance work is consolidated into a single issue.
The team should therefore consider whether duplicate submissions should be retained and linked rather than deleted.
## `spam`
Used for spam, abuse, automated submissions, or clearly inappropriate content.
This label should not be used for:
- disagreement with the paper;
- poorly phrased feedback;
- criticism of the project;
- feedback the team considers mistaken;
- contributions that fall outside the project's expected framing.
The threshold for `spam` should remain narrow and administrative.
# Labels that should not currently exist
The ontology should not introduce separate namespaces for information already represented by GitHub.
## Status labels
Labels such as the following are not currently needed:
```text
status: received
status: under-review
status: incorporated
status: closed
```
GitHub already records open and closed state, issue activity, comments, assignments, and related changes.
A status namespace should be added only if the project develops a governance process containing meaningful intermediate states that cannot be represented through GitHub's existing features.
## Activity labels
Labels such as the following are also unnecessary at present:
```text
activity: clarify
activity: revise
activity: add
activity: discuss
```
The requested action can usually be expressed in the issue title or body.
An activity namespace should be added only if workload management or reporting requires structured filtering by requested action.
## Priority labels
Priority labels are not part of the governance ontology.
```text
priority: low
priority: medium
priority: high
```
If the project later requires operational prioritization, this information may be better represented through GitHub Projects, milestones, or project-specific fields.
Priority should never be treated as a measure of the worth of a participant's contribution.
## Software-development labels
Default GitHub labels such as the following should not be retained unless they serve a demonstrated project function:
```text
bug
documentation
enhancement
good first issue
help wanted
invalid
question
wontfix
```
These labels import assumptions from software-development workflows that do not necessarily fit collaborative document governance.
Labels such as `invalid` and `wontfix` are particularly inappropriate for participant contributions because they may appear dismissive and fail to communicate a governance rationale.
# Relationship to GitHub's built-in model
The label ontology should complement rather than reproduce GitHub's existing issue features.

| Question | Representation |
|---|---|
| Is governance work still active? | Open or closed issue state |
| Who opened the GitHub issue? | Issue author |
| When was it submitted? | Issue creation timestamp |
| Who is responsible for responding? | Assignee |
| What discussion occurred? | Comments and issue timeline |
| What change resulted? | Linked commit or pull request |
| Which release or project phase includes it? | Milestone or project |
| Where did the contribution come from? | `source:` label |
| What collaborative object does it concern? | `object:` label |
| What is it substantively about? | `topic:` label |
| What was the final disposition? | Closing comment and, if necessary, `decision:` label |
# Example classifications
## Public feedback about a selected paragraph
```text
source: public
object: passage
```
A future topic classification might add:
```text
topic: accessibility
topic: governance
```
## Feedback entered by a facilitator about the whole paper
```text
source: facilitator
object: entire-paper
```
## An editorial issue created by the project team
```text
source: internal
object: passage
```
A future topic label might add:
```text
topic: editorial
```
## An issue created for an October demonstration
```text
source: demo
object: passage
```
## A repeated submission
```text
source: public
object: passage
duplicate
```
The duplicate issue should link to the issue in which the concern is being addressed.
# Public presentation
Participants should not be required to understand GitHub labels or namespace syntax.
The public interface should translate internal labels into plain language.
For example:

| Internal label | Participant-facing language |
|---|---|
| `source: public` | Submitted through the public feedback form |
| `source: facilitator` | Submitted with facilitator assistance |
| `object: entire-paper` | Feedback about the paper as a whole |
| `object: passage` | Feedback about a selected passage |
A future decision label might be presented as:

| Internal label | Participant-facing language |
|---|---|
| `decision: accepted` | This suggestion was accepted |
| `decision: partially-accepted` | This suggestion was accepted in part |
| `decision: deferred` | This suggestion will be considered later |
| `decision: not-accepted` | This suggestion was considered but not adopted |
The public interface should provide written explanations rather than relying on colour or internal label names.
# Colour scheme
Colour should visually group labels by namespace without carrying meaning independently.
The planned colour families are:

| Namespace | Colour family |
|---|---|
| `source:` | Orange |
| `object:` | Purple |
| `topic:` | Green |
| `decision:` | Rose or brown |
| Administrative labels | Neutral grey |
Labels within a namespace should use related but distinguishable shades.
The current colours are temporary and will be updated separately.
Colour is supplementary. The namespace prefix and label text remain the authoritative indicators of meaning.
# Current minimal ontology
The currently implemented ontology is:
## Where did this come from?
```text
source: public
source: facilitator
source: internal
source: demo
```
## What object is it about?
```text
object: entire-paper
object: passage
```
## Administrative handling
```text
duplicate
spam
```
The following namespaces remain deferred:
```text
topic:
decision:
```
They should be implemented only when actual governance and reporting needs justify them.
# Summary
The ActionForge label ontology should record only information that GitHub cannot already answer adequately.
Its scope is limited to four questions:
1. **Where did this come from?**  
   Represented by `source:`.
2. **What object is it about?**  
   Represented by `object:`.
3. **What is it about?**  
   Potentially represented by `topic:` once recurring categories emerge.
4. **What happened to it?**  
   Recorded initially through GitHub's open or closed state and written closing comments, with a possible future `decision:` namespace if structured reporting becomes necessary.
The current implementation correctly focuses on the first two questions:
```text
source: public
source: facilitator
source: internal
source: demo
object: entire-paper
object: passage
```
The administrative labels `duplicate` and `spam` support maintenance and moderation but are not part of the substantive ontology.
This minimal design avoids importing unnecessary software-development concepts, reduces classification burden, and preserves the GitHub Issue as the primary collaborative object. Labels provide only the additional dimensions needed to interpret provenance, object, subject matter, and—if required later—governance outcome.
# Addendum: Relationship to GitHub Issue Types
GitHub provides two distinct mechanisms for classifying issues:
1. **Issue Types**
2. **Labels**
These mechanisms serve different purposes.
### GitHub Issue Types
GitHub Issue Types classify the **kind of work item** represented by an issue.
The default types include:
```text
Bug
Feature
Task
```
These are primarily intended for software-development workflows and GitHub Projects.
Issue Types answer a question such as:
> *What kind of work item is this?*

For a conventional software repository, that distinction is useful because bugs, features, and tasks often follow different workflows.
### Why ActionForge does not use Issue Types
ActionForge adopts a different conceptual model.
Within ActionForge, the **GitHub Issue itself is the first-class collaborative object**.
Every issue represents a contribution to a collaborative governance process.
The project therefore does not require distinctions such as:
```text
Bug
Feature
Task
```
Instead, ActionForge is concerned with questions that GitHub cannot otherwise answer consistently:
1. Where did this come from?
2. What object is it about?
3. What is it about?
4. What happened to it?
These questions are represented through the label ontology rather than through Issue Types.
Accordingly, the current ontology focuses on:
```text
source:
object:
```
with possible future additions:
```text
topic:
decision:
```
### Why not encode the ontology as Issue Types?
Issue Types are inherently **single-valued**: an issue has one type.
The ActionForge ontology is intentionally **multi-dimensional**.
For example, a single issue may simultaneously be:
```text
source: public
object: passage
topic: accessibility
topic: governance
```
These dimensions are independent and should remain independently searchable and extensible.
Representing them as Issue Types would collapse multiple orthogonal dimensions into a single classification, making the ontology less expressive and more difficult to extend.
### Future possibilities
GitHub permits repositories and organizations to define custom Issue Types.
If ActionForge later identifies a genuine need for distinguishing different classes of collaborative work—for example:
```text
Feedback
Proposal
Discussion
```
custom Issue Types may complement the ontology.
However, they should **not** replace the label namespaces.
Issue Types would answer:
> *What kind of collaborative work item is this?*

The label ontology answers:
- Where did it come from?
- What object does it concern?
- What is it substantively about?
- What decision was ultimately reached?
These are fundamentally different kinds of information.
### Design decision
The current ActionForge implementation intentionally ignores GitHub Issue Types.
The project instead adopts the following architecture:

| GitHub feature | ActionForge interpretation |
|----------------|----------------------------|
| Issue | Primary collaborative object |
| Issue body | Contribution and supporting context |
| Comments | Deliberation and governance discussion |
| Labels | Minimal metadata not otherwise represented by GitHub |
| Open / Closed | Whether governance work remains active |
This separation preserves a lightweight ontology while allowing ActionForge to benefit from GitHub's existing issue-management capabilities without importing software-development concepts that are not intrinsic to collaborative document governance.
