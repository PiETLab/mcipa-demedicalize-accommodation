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

const TEXT_FRAGMENT_MAX_CHARS = 180

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
  const text = truncate(
    normalizeWhitespace(value)
      // Accept escaped newline sequences and render as real line breaks.
      .replace(/\\r\\n|\\n|\\r/g, "\n"),
    limit,
  )
  const source = text.length > 0 ? text : "Not provided"
  return source
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n")
}

function renderBullet(label, value, limit, fallback = "Not provided") {
  return `- ${label}: ${renderInlineCode(value, limit, fallback)}`
}

function renderLinkBullet(label, value, limit, fallback = "Not provided", note = "") {
  const url = sanitizeInline(value, limit, "")
  if (!url) {
    const suffix = note ? ` (${note})` : ""
    return `- ${label}: ${fallback}${suffix}`
  }

  return `- ${label}: <${url}>`
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
    const selectedTextLength = normalizeWhitespace(input.selectedText || input.quotedText || "").length
    const secondaryBlockUrl = sanitizeInline(input.reportedBlockUrl, LIMITS.url, "")
    const hasSecondaryBlockUrl = Boolean(secondaryBlockUrl) && secondaryBlockUrl !== sanitizeInline(input.blockUrl, LIMITS.url, "")
    const missingFragmentNote =
      !input.textFragmentUrl && selectedTextLength > TEXT_FRAGMENT_MAX_CHARS
        ? `text segment length > ${TEXT_FRAGMENT_MAX_CHARS}`
        : ""

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
      renderLinkBullet("Published page", input.pageUrl || input.blockUrl, LIMITS.url),
      renderBullet("Published page branch", input.publishedBranch, LIMITS.heading),
      renderBullet("Published page commit", input.publishedCommit, LIMITS.commit),
      renderBullet("Published page commit date", input.publishedCommitDate, LIMITS.date),
      renderLinkBullet("Passage link", input.blockUrl, LIMITS.url),
      ...(hasSecondaryBlockUrl ? [renderLinkBullet("Passage link (reported block)", secondaryBlockUrl, LIMITS.url)] : []),
      renderLinkBullet("Selected-text link", input.textFragmentUrl, LIMITS.url, "Not provided", missingFragmentNote),
      renderBullet("Passage identifier", input.blockId, LIMITS.heading),
      ...(input.reportedBlockId && input.reportedBlockId !== input.blockId
        ? [renderBullet("Passage identifier (reported block)", input.reportedBlockId, LIMITS.heading)]
        : []),
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
      renderLinkBullet("Published page", input.pageUrl, LIMITS.url),
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
