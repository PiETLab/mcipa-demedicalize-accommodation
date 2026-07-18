const assert = require("node:assert/strict")
const path = require("node:path")

const { renderPublicIssue, LIMITS } = require(path.join(
  __dirname,
  "..",
  "services",
  "mcipa-feedback-worker",
  "src",
  "issue-format.cjs",
))

function countTopLevelHeadings(body) {
  return body.split("\n").filter((line) => line.startsWith("## ")).length
}

function testPassageIssueFormat() {
  const result = renderPublicIssue({
    feedbackType: "passage",
    title: "Clarify the section heading",
    displayName: "Anonymous contributor",
    pageTitle: "Executive Summary",
    pageUrl: "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper",
    publishedBranch: "main",
    publishedCommit: "abc123def456",
    publishedCommitDate: "2026-07-18",
    sectionHeading: "Executive Summary",
    blockId: "feedback-block-a82f19c4",
    blockUrl: "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper#feedback-block-a82f19c4",
    textFragmentUrl:
      "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper#:~:text=Quoted%20passage",
    quotedText: "Quoted passage here",
    comment: "Submitter's feedback here.",
  })

  assert.equal(result.title, "Clarify the section heading")
  assert.deepEqual(result.labels, ["public-submission", "passage-feedback"])
  assert.equal(
    result.body,
    [
      "## Selected passage",
      "",
      "> Quoted passage here",
      "",
      "## Feedback",
      "",
      "> Submitter's feedback here.",
      "",
      "## Passage location",
      "",
      "- Page: `Executive Summary`",
      "- Section: `Executive Summary`",
      "- Published page: `https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper`",
      "- Published page branch: `main`",
      "- Published page commit: `abc123def456`",
      "- Published page commit date: `2026-07-18`",
      "- Passage link: `https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper#feedback-block-a82f19c4`",
      "- Selected-text link: `https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper#:~:text=Quoted%20passage`",
      "- Passage identifier: `feedback-block-a82f19c4`",
      "",
      "## Submission information",
      "",
      "- Submitted by: `Anonymous contributor`",
      "- Submission type: `Passage-level feedback`",
      "- Submission route: `MCIPA public feedback form`",
      "",
      "> This issue was submitted through a public form. The submitter may not",
      "> have a GitHub account.",
    ].join("\n"),
  )
}

function testPageIssueFormatWithOmittedOptionalFields() {
  const result = renderPublicIssue({
    feedbackType: "page",
    title: "Site-wide accessibility note",
    comment: "Please add a clearer feedback route.",
  })

  assert.equal(result.title, "Site-wide accessibility note")
  assert.deepEqual(result.labels, ["public-submission", "page-feedback"])
  assert.equal(countTopLevelHeadings(result.body), 3)
  assert.ok(result.body.includes("- Page: `Site generally`"))
  assert.ok(result.body.includes("- Published page: `Not provided`"))
  assert.ok(result.body.includes("- Published page branch: `Not provided`"))
  assert.ok(result.body.includes("- Published page commit: `Not provided`"))
  assert.ok(result.body.includes("- Published page commit date: `Not provided`"))
  assert.ok(result.body.includes("> Please add a clearer feedback route."))
  assert.ok(result.body.includes("- Submitted by: `Anonymous`"))
}

function testMarkdownCannotBreakStructure() {
  const result = renderPublicIssue({
    feedbackType: "passage",
    title: "Injection attempt",
    pageTitle: "Executive Summary",
    pageUrl: "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper",
    sectionHeading: "Overview",
    blockId: "feedback-block-a82f19c4",
    quotedText: "Selected passage",
    comment: "## Hacked heading\n> nested quote\n- nested list\n[link](https://example.com)",
  })

  assert.equal(countTopLevelHeadings(result.body), 4)
  assert.ok(result.body.includes("> ## Hacked heading"))
  assert.ok(result.body.includes("> > nested quote"))
  assert.ok(result.body.includes("> - nested list"))
  assert.ok(result.body.includes("> [link](https://example.com)"))
  assert.ok(!result.body.includes("\n## Hacked heading\n"))
}

function testLengthCapsAreApplied() {
  const longValue = "x".repeat(LIMITS.title + 100)
  const result = renderPublicIssue({
    feedbackType: "page",
    title: longValue,
    comment: longValue,
    pageTitle: longValue,
    pageUrl: `https://example.com/${"a".repeat(LIMITS.url + 100)}`,
  })

  assert.ok(result.title.length <= LIMITS.title)
  assert.ok(result.body.length <= LIMITS.body)
  assert.ok(result.body.includes("…") || result.title.includes("…"))
}

function main() {
  testPassageIssueFormat()
  testPageIssueFormatWithOmittedOptionalFields()
  testMarkdownCannotBreakStructure()
  testLengthCapsAreApplied()

  console.log("Public issue format tests passed.")
}

main()