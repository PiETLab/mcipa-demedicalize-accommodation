"use strict"

const LIMITS = Object.freeze({
  title: 180,
  feedback: 4000,
  quote: 1200,
  name: 120,
  pageTitle: 180,
  url: 500,
  heading: 180,
  commit: 64,
  date: 40,
  body: 20000,
})

function normalizeWhitespace(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
}

function squeezeSingleLine(value) {
  return normalizeWhitespace(value).replace(/\s+/g, " ")
}

function truncate(value, limit) {
  if (value.length <= limit) {
    return value
  }

  if (limit <= 1) {
    return value.slice(0, limit)
  }

  return `${value.slice(0, limit - 1).trimEnd()}…`
}

function sanitizeInline(value, limit, fallback = "Not provided") {
  const text = truncate(squeezeSingleLine(value), limit)
  return text.length > 0 ? text : fallback
}

function fenceFor(value) {
  const runs = String(value ?? "").match(/`+/g) || []
  const longest = runs.reduce((max, run) => Math.max(max, run.length), 0)
  return "`".repeat(longest + 1 || 1)
}

function renderInlineCode(value, limit, fallback = "Not provided") {
  const text = sanitizeInline(value, limit, fallback)
  const fence = fenceFor(text)
  return `${fence}${text}${fence}`
}

function renderQuotedBlock(value, limit) {
  const text = truncate(normalizeWhitespace(value), limit)
  const source = text.length > 0 ? text : "Not provided"
  return source
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n")
}

function renderBullet(label, value, limit, fallback = "Not provided") {
  return `- ${label}: ${renderInlineCode(value, limit, fallback)}`
}

function normalizeSubmissionType(feedbackType) {
  return feedbackType === "passage" || feedbackType === "selection"
    ? "Passage-level feedback"
    : "Page-level feedback"
}

function renderPublicIssue(input = {}) {
  const feedbackType = normalizeSubmissionType(input.feedbackType)
  const isPassage = feedbackType === "Passage-level feedback"
  const issueTitle = sanitizeInline(
    input.title || input.briefTitle || (isPassage ? input.pageTitle || "Passage feedback" : input.pageTitle || "Site generally"),
    LIMITS.title,
    isPassage ? "Passage feedback" : "Site generally",
  )

  const sections = []

  if (isPassage) {
    sections.push(
      "## Selected passage",
      "",
      renderQuotedBlock(input.quotedText || input.selectedText, LIMITS.quote),
      "",
      "## Feedback",
      "",
      renderQuotedBlock(input.comment || input.feedback, LIMITS.feedback),
      "",
      "## Passage location",
      "",
      renderBullet("Page", input.pageTitle, LIMITS.pageTitle, "Site generally"),
      renderBullet("Section", input.sectionHeading, LIMITS.heading),
      renderBullet("Published page", input.pageUrl || input.blockUrl, LIMITS.url),
      renderBullet("Published page branch", input.publishedBranch, LIMITS.heading),
      renderBullet("Published page commit", input.publishedCommit, LIMITS.commit),
      renderBullet("Published page commit date", input.publishedCommitDate, LIMITS.date),
      renderBullet("Passage link", input.blockUrl, LIMITS.url),
      renderBullet("Selected-text link", input.textFragmentUrl, LIMITS.url),
      renderBullet("Passage identifier", input.blockId, LIMITS.heading),
      "",
    )
  } else {
    sections.push(
      "## Feedback",
      "",
      renderQuotedBlock(input.comment || input.feedback, LIMITS.feedback),
      "",
      "## Page information",
      "",
      renderBullet("Page", input.pageTitle, LIMITS.pageTitle, "Site generally"),
      renderBullet("Published page", input.pageUrl, LIMITS.url),
      renderBullet("Published page branch", input.publishedBranch, LIMITS.heading),
      renderBullet("Published page commit", input.publishedCommit, LIMITS.commit),
      renderBullet("Published page commit date", input.publishedCommitDate, LIMITS.date),
      "",
    )
  }

  sections.push(
    "## Submission information",
    "",
    renderBullet("Submitted by", input.displayName || input.name, LIMITS.name, "Anonymous"),
    `- Submission type: ${renderInlineCode(feedbackType, LIMITS.pageTitle)}`,
    `- Submission route: ${renderInlineCode("MCIPA public feedback form", LIMITS.pageTitle)}`,
    "",
    "> This issue was submitted through a public form. The submitter may not",
    "> have a GitHub account.",
  )

  const body = truncate(sections.join("\n"), LIMITS.body)

  return {
    title: issueTitle,
    body,
    labels: isPassage
      ? ["public-submission", "passage-feedback"]
      : ["public-submission", "page-feedback"],
  }
}

module.exports = {
  LIMITS,
  renderPublicIssue,
}
