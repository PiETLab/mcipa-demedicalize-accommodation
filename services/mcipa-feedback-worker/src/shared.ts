import issueFormat from "./issue-format.cjs"

const { renderPublicIssue, LIMITS } = issueFormat as typeof import("./issue-format.cjs")

export const PRODUCTION_ORIGIN = "https://pietlab.github.io"
export const WORKER_ALLOWED_PATH_PREFIX = "/mcipa-demedicalize-accommodation/"
export const TARGET_REPOSITORY = "PiETLab/mcipa-demedicalize-accommodation"
export const MAX_REQUEST_BODY_BYTES = 32_768

const FORM_KEYS = new Set([
  "displayName",
  "name",
  "title",
  "feedbackMode",
  "feedbackType",
  "comment",
  "feedback",
  "pageTitle",
  "pageUrl",
  "pageUrlUser",
  "publishedBranch",
  "publishedCommit",
  "publishedCommitDate",
  "sectionHeading",
  "sectionHeadingDisplay",
  "blockId",
  "blockUrl",
  "textFragmentUrl",
  "quotedText",
  "selectedText",
  "selectedPassageDisplay",
  "fullBlockText",
  "startContext",
  "endContext",
  "website",
])

export interface WorkerEnv {
  GITHUB_TOKEN: string
  DEV_ORIGIN?: string
  GITHUB_API_BASE?: string
}

export interface NormalizedSubmission {
  feedbackType: "page" | "passage"
  title: string
  displayName?: string
  comment: string
  pageTitle?: string
  pageUrl?: string
  publishedBranch?: string
  publishedCommit?: string
  publishedCommitDate?: string
  sectionHeading?: string
  blockId?: string
  blockUrl?: string
  textFragmentUrl?: string
  quotedText?: string
  selectedText?: string
}

class SubmissionError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

function normalizeWhitespace(value: unknown) {
  return String(value ?? "").replace(/\r\n?/g, "\n").trim()
}

function collapseInlineWhitespace(value: unknown) {
  return normalizeWhitespace(value).replace(/\s+/g, " ")
}

function byteLength(value: string) {
  return new TextEncoder().encode(value).byteLength
}

function requireStringField(value: unknown, fieldName: string, limit: number) {
  const text = collapseInlineWhitespace(value)
  if (!text) {
    throw new SubmissionError(400, "missing_field", `Missing required field: ${fieldName}.`)
  }

  if (text.length > limit) {
    throw new SubmissionError(400, "field_too_long", `Field too long: ${fieldName}.`)
  }

  return text
}

function optionalInlineField(value: unknown, fieldName: string, limit: number) {
  const text = collapseInlineWhitespace(value)
  if (!text) {
    return undefined
  }

  if (text.length > limit) {
    throw new SubmissionError(400, "field_too_long", `Field too long: ${fieldName}.`)
  }

  return text
}

function optionalMultilineField(value: unknown, fieldName: string, limit: number) {
  const text = normalizeWhitespace(value)
  if (!text) {
    return undefined
  }

  if (text.length > limit) {
    throw new SubmissionError(400, "field_too_long", `Field too long: ${fieldName}.`)
  }

  return text
}

function allowedOrigins(env: Partial<WorkerEnv>) {
  const origins = new Set([PRODUCTION_ORIGIN])
  if (env.DEV_ORIGIN) {
    origins.add(env.DEV_ORIGIN)
  }
  return origins
}

function verifyAllowedOrigin(request: Request, env: Partial<WorkerEnv>) {
  const origin = request.headers.get("Origin")
  if (!origin || !allowedOrigins(env).has(origin)) {
    throw new SubmissionError(403, "forbidden_origin", "Request origin is not allowed.")
  }

  return origin
}

function verifyAllowedPageUrl(value: unknown, env: Partial<WorkerEnv>) {
  const text = collapseInlineWhitespace(value)
  if (!text) {
    return undefined
  }

  const url = new URL(text)
  if (url.protocol !== "https:" && !(env.DEV_ORIGIN && url.origin === env.DEV_ORIGIN)) {
    throw new SubmissionError(400, "invalid_page_url", "Page URL must use the expected origin.")
  }

  const permittedOrigins = allowedOrigins(env)
  if (!permittedOrigins.has(url.origin)) {
    throw new SubmissionError(400, "invalid_page_url", "Page URL must use the expected origin.")
  }

  if (!url.pathname.startsWith(WORKER_ALLOWED_PATH_PREFIX)) {
    throw new SubmissionError(400, "invalid_page_url", "Page URL must use the MCIPA path prefix.")
  }

  return `${url.origin}${url.pathname}${url.hash}`
}

function verifyAllowedFragmentUrl(value: unknown, env: Partial<WorkerEnv>) {
  const text = collapseInlineWhitespace(value)
  if (!text) {
    return undefined
  }

  const url = new URL(text)
  const permittedOrigins = allowedOrigins(env)
  if (!permittedOrigins.has(url.origin)) {
    throw new SubmissionError(400, "invalid_fragment_url", "Selected-text link must use the expected origin.")
  }

  if (!url.pathname.startsWith(WORKER_ALLOWED_PATH_PREFIX)) {
    throw new SubmissionError(400, "invalid_fragment_url", "Selected-text link must use the MCIPA path prefix.")
  }

  return `${url.origin}${url.pathname}${url.hash}`
}

function normalizeFeedbackType(raw: unknown) {
  const candidate = collapseInlineWhitespace(raw).toLowerCase()
  if (candidate === "page") {
    return "page" as const
  }

  if (candidate === "passage" || candidate === "selection") {
    return "passage" as const
  }

  throw new SubmissionError(400, "invalid_feedback_type", "Feedback type is missing or invalid.")
}

function checkUnknownKeys(raw: Record<string, unknown>) {
  const unknownKeys = Object.keys(raw).filter((key) => !FORM_KEYS.has(key))
  if (unknownKeys.length > 0) {
    throw new SubmissionError(400, "unknown_fields", "Submission contains unsupported fields.")
  }
}

export function normalizeSubmission(raw: Record<string, unknown>, env: Partial<WorkerEnv>): NormalizedSubmission {
  checkUnknownKeys(raw)

  const feedbackType = normalizeFeedbackType(raw.feedbackType ?? raw.feedbackMode)
  const title = requireStringField(raw.title, "title", LIMITS.title)
  const displayName = optionalInlineField(raw.displayName ?? raw.name, "displayName", LIMITS.name)
  const comment = requireStringField(raw.comment ?? raw.feedback, "comment", LIMITS.feedback)

  const pageTitle = optionalInlineField(raw.pageTitle, "pageTitle", LIMITS.pageTitle)
  const publishedBranch = optionalInlineField(raw.publishedBranch, "publishedBranch", LIMITS.heading)
  const publishedCommit = optionalInlineField(raw.publishedCommit, "publishedCommit", LIMITS.heading)
  const publishedCommitDate = optionalInlineField(raw.publishedCommitDate, "publishedCommitDate", LIMITS.heading)
  const sectionHeading = optionalInlineField(raw.sectionHeading ?? raw.sectionHeadingDisplay, "sectionHeading", LIMITS.heading)
  const blockId = optionalInlineField(raw.blockId, "blockId", LIMITS.heading)
  const quotedText = optionalMultilineField(raw.quotedText ?? raw.selectedText ?? raw.selectedPassageDisplay, "quotedText", LIMITS.quote)
  const selectedText = optionalMultilineField(raw.selectedText ?? raw.selectedPassageDisplay, "selectedText", LIMITS.quote)
  const pageUrl = verifyAllowedPageUrl(raw.pageUrl ?? raw.pageUrlUser, env) ?? verifyAllowedPageUrl(raw.blockUrl, env)
  const blockUrl = verifyAllowedPageUrl(raw.blockUrl, env)
  const textFragmentUrl = verifyAllowedFragmentUrl(raw.textFragmentUrl, env)

  if (feedbackType === "passage") {
    if (!quotedText) {
      throw new SubmissionError(400, "missing_field", "Missing required field: quotedText.")
    }

    if (!pageUrl) {
      throw new SubmissionError(400, "missing_field", "Missing required field: pageUrl.")
    }

    if (!sectionHeading) {
      throw new SubmissionError(400, "missing_field", "Missing required field: sectionHeading.")
    }

    if (!blockId) {
      throw new SubmissionError(400, "missing_field", "Missing required field: blockId.")
    }
  }

  return {
    feedbackType,
    title,
    displayName,
    comment,
    pageTitle: pageTitle ?? undefined,
    pageUrl: pageUrl ?? undefined,
    publishedBranch: publishedBranch ?? undefined,
    publishedCommit: publishedCommit ?? undefined,
    publishedCommitDate: publishedCommitDate ?? undefined,
    sectionHeading: sectionHeading ?? undefined,
    blockId: blockId ?? undefined,
    blockUrl: blockUrl ?? undefined,
    textFragmentUrl: textFragmentUrl ?? undefined,
    quotedText: quotedText ?? undefined,
    selectedText: selectedText ?? undefined,
  }
}

function logEvent(level: "info" | "warn" | "error", message: string, details: Record<string, unknown>) {
  const payload = JSON.stringify(details)
  console[level](`[mcipa-feedback-worker] ${message} ${payload}`)
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }
}

function jsonResponse(status: number, body: Record<string, unknown>, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  })
}

async function parseJsonBody(request: Request) {
  const declaredLength = request.headers.get("Content-Length")
  if (declaredLength && Number(declaredLength) > MAX_REQUEST_BODY_BYTES) {
    throw new SubmissionError(413, "body_too_large", "Submission body is too large.")
  }

  const text = await request.text()
  if (byteLength(text) > MAX_REQUEST_BODY_BYTES) {
    throw new SubmissionError(413, "body_too_large", "Submission body is too large.")
  }

  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new SubmissionError(400, "invalid_json", "Submission payload must be a JSON object.")
    }
    return parsed as Record<string, unknown>
  } catch (error) {
    if (error instanceof SubmissionError) {
      throw error
    }

    throw new SubmissionError(400, "invalid_json", "Submission payload must be valid JSON.")
  }
}

async function createGitHubIssue(submission: NormalizedSubmission, env: WorkerEnv, fetchImpl: typeof fetch) {
  const issue = renderPublicIssue(submission)
  const response = await fetchImpl(`https://api.github.com/repos/${TARGET_REPOSITORY}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "mcipa-feedback-worker",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
    }),
  })

  const text = await response.text()
  let parsed: Record<string, unknown> = {}
  try {
    parsed = text ? (JSON.parse(text) as Record<string, unknown>) : {}
  } catch {
    parsed = {}
  }

  if (!response.ok) {
    throw new SubmissionError(502, "github_request_failed", "Unable to create issue.")
  }

  const issueUrl =
    (typeof parsed.html_url === "string" && parsed.html_url) ||
    (typeof parsed.url === "string" && parsed.url) ||
    undefined

  return {
    issueUrl,
    issueNumber: typeof parsed.number === "number" ? parsed.number : undefined,
    title: issue.title,
    labels: issue.labels,
  }
}

function validateContentType(request: Request) {
  const contentType = request.headers.get("Content-Type") || ""
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    throw new SubmissionError(415, "unsupported_media_type", "Submission body must be JSON.")
  }
}

export async function handleFeedbackRequest(
  request: Request,
  env: WorkerEnv,
  options: { fetchImpl?: typeof fetch } = {},
) {
  const fetchImpl = options.fetchImpl ?? fetch
  let origin: string | undefined
  let commonHeaders: HeadersInit = {}

  try {
    origin = verifyAllowedOrigin(request, env)
    commonHeaders = corsHeaders(origin)

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: commonHeaders,
      })
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed." }), {
        status: 405,
        headers: {
          ...commonHeaders,
          Allow: "POST, OPTIONS",
          "Content-Type": "application/json; charset=utf-8",
        },
      })
    }

    validateContentType(request)
    const raw = await parseJsonBody(request)
    const honeypot = collapseInlineWhitespace(raw.website)
    if (honeypot) {
      logEvent("warn", "honeypot_filled", {
        origin,
        method: request.method,
      })

      throw new SubmissionError(400, "honeypot_detected", "Submission rejected.")
    }

    const normalized = normalizeSubmission(raw, env)
    const result = await createGitHubIssue(normalized, env, fetchImpl)

    logEvent("info", "issue_created", {
      origin,
      feedbackType: normalized.feedbackType,
      hasPageUrl: Boolean(normalized.pageUrl),
      hasBlockId: Boolean(normalized.blockId),
      issueNumber: result.issueNumber,
    })

    return jsonResponse(
      201,
      {
        issueUrl: result.issueUrl,
        html_url: result.issueUrl,
        url: result.issueUrl,
        number: result.issueNumber,
      },
      commonHeaders,
    )
  } catch (error) {
    if (error instanceof SubmissionError) {
      logEvent(error.status >= 500 ? "error" : "warn", error.code, {
        origin: origin ?? "<unavailable>",
        method: request.method,
        code: error.code,
        status: error.status,
      })

      return jsonResponse(error.status, { error: "Invalid submission." }, commonHeaders)
    }

    logEvent("error", "unexpected_error", {
      origin: origin ?? "<unavailable>",
      method: request.method,
    })

    return jsonResponse(500, { error: "Unable to process submission." }, commonHeaders)
  }
}
