import assert from "node:assert/strict"
import {
  handleFeedbackRequest,
  MAX_REQUEST_BODY_BYTES,
  PRODUCTION_ORIGIN,
  TARGET_REPOSITORY,
  WORKER_ALLOWED_PATH_PREFIX,
} from "../services/mcipa-feedback-worker/src/shared.ts"

const env = {
  GITHUB_TOKEN: "test-token",
  DEV_ORIGIN: "http://localhost:8080",
}

function jsonRequest(body, { method = "POST", origin = PRODUCTION_ORIGIN, contentType = "application/json" } = {}) {
  return new Request("https://worker.example/submit-feedback", {
    method,
    headers: {
      Origin: origin,
      "Content-Type": contentType,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

function textRequest(body, { method = "POST", origin = PRODUCTION_ORIGIN, contentType = "text/plain" } = {}) {
  return new Request("https://worker.example/submit-feedback", {
    method,
    headers: {
      Origin: origin,
      "Content-Type": contentType,
    },
    body,
  })
}

async function assertGenericFailure(response, expectedStatus) {
  assert.equal(response.status, expectedStatus)
  const payload = await response.json()
  assert.equal(payload.error, "Invalid submission.")
}

async function testValidPassageSubmission() {
  const githubCalls = []
  const fetchImpl = async (url, init) => {
    githubCalls.push({ url, init })
    return new Response(JSON.stringify({ html_url: "https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/123", number: 123 }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  }

  const response = await handleFeedbackRequest(
    jsonRequest({
      feedbackType: "passage",
      title: "Clarify this paragraph",
      displayName: "Anonymous contributor",
      comment: "Please make this wording clearer.",
      pageTitle: "Executive Summary",
      pageUrl: "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper",
      sectionHeading: "Executive Summary",
      blockId: "feedback-block-a82f19c4",
      blockUrl: "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper#feedback-block-a82f19c4",
      textFragmentUrl: "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper#:~:text=Quoted%20passage",
      quotedText: "Quoted passage here",
      selectedText: "Quoted passage here",
      website: "",
    }),
    env,
    { fetchImpl },
  )

  assert.equal(response.status, 201)
  const payload = await response.json()
  assert.equal(payload.issueUrl, "https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/123")
  assert.equal(githubCalls.length, 1)
  assert.equal(githubCalls[0].url, `https://api.github.com/repos/${TARGET_REPOSITORY}/issues`)
  assert.equal(githubCalls[0].init.method, "POST")
  assert.equal(githubCalls[0].init.headers.Authorization, "Bearer test-token")

  const issueBody = JSON.parse(githubCalls[0].init.body)
  assert.equal(issueBody.title, "Clarify this paragraph")
  assert.deepEqual(issueBody.labels, ["public-submission", "passage-feedback"])
  assert.ok(issueBody.body.includes("## Selected passage"))
  assert.ok(issueBody.body.includes("## Passage location"))
}

async function testValidPageSubmission() {
  const fetchImpl = async () => new Response(JSON.stringify({ url: "https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/124" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  })

  const response = await handleFeedbackRequest(
    jsonRequest({
      feedbackMode: "page",
      title: "Site-level note",
      displayName: "Anon",
      comment: "Please add a clearer navigation link.",
      pageTitle: "Site generally",
      pageUrlUser: "https://pietlab.github.io/mcipa-demedicalize-accommodation/submit-feedback",
      website: "",
    }),
    env,
    { fetchImpl },
  )

  assert.equal(response.status, 201)
  const payload = await response.json()
  assert.equal(payload.html_url, "https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/124")
}

async function testPreflightAndMethodRejection() {
  const optionsResponse = await handleFeedbackRequest(
    jsonRequest({}, { method: "OPTIONS" }),
    env,
  )
  assert.equal(optionsResponse.status, 204)

  const getResponse = await handleFeedbackRequest(
    new Request("https://worker.example/submit-feedback", {
      method: "GET",
      headers: { Origin: PRODUCTION_ORIGIN },
    }),
    env,
  )
  assert.equal(getResponse.status, 405)
}

async function testRejectsInvalidInputs() {
  await assertGenericFailure(
    await handleFeedbackRequest(jsonRequest({ title: "x", feedbackType: "page", comment: "y" }, { origin: "https://example.com" }), env),
    403,
  )

  await assertGenericFailure(await handleFeedbackRequest(textRequest("{}"), env), 415)

  await assertGenericFailure(
    await handleFeedbackRequest(
    new Request("https://worker.example/submit-feedback", {
      method: "POST",
      headers: { Origin: PRODUCTION_ORIGIN, "Content-Type": "application/json" },
      body: "{not-json",
    }),
    env,
  ),
    400,
  )

  await assertGenericFailure(
    await handleFeedbackRequest(jsonRequest({ title: "x", feedbackType: "page", comment: "y", website: "bot@example.com" }), env),
    400,
  )
}

async function testValidatesPageUrlAndBodySize() {
  await assertGenericFailure(
    await handleFeedbackRequest(
      jsonRequest({
      feedbackType: "passage",
      title: "x",
      comment: "y",
      pageTitle: "Executive Summary",
      pageUrl: "https://evil.example/mcipa-demedicalize-accommodation/Advocacy-Paper",
      sectionHeading: "Overview",
      blockId: "feedback-block-a82f19c4",
      quotedText: "Quoted passage",
      }),
      env,
      {
        fetchImpl: async () => {
          throw new Error("should not be called")
        },
      },
    ),
    400,
  )

  const tooLargePayload = "x".repeat(MAX_REQUEST_BODY_BYTES + 10)
  await assertGenericFailure(
    await handleFeedbackRequest(
    new Request("https://worker.example/submit-feedback", {
      method: "POST",
      headers: {
        Origin: PRODUCTION_ORIGIN,
        "Content-Type": "application/json",
        "Content-Length": String(MAX_REQUEST_BODY_BYTES + 10),
      },
      body: JSON.stringify({ title: tooLargePayload, feedbackType: "page", comment: "y" }),
    }),
    env,
  ),
    413,
  )

  assert.ok(WORKER_ALLOWED_PATH_PREFIX.startsWith("/mcipa-demedicalize-accommodation"))
}

async function testGithubFailureIsGeneric() {
  let fetchCount = 0
  const response = await handleFeedbackRequest(
    jsonRequest({
      feedbackType: "page",
      title: "Site-level note",
      comment: "Please add a clearer navigation link.",
    }),
    env,
    {
      fetchImpl: async () => {
        fetchCount += 1
        return new Response(JSON.stringify({ message: "rate limited" }), { status: 403 })
      },
    },
  )

  assert.equal(fetchCount, 1)
  assert.equal(response.status, 502)
  const payload = await response.json()
  assert.equal(payload.error, "Invalid submission.")
}

async function testUnexpectedFailuresStayGeneric() {
  const response = await handleFeedbackRequest(
    jsonRequest({
      feedbackType: "page",
      title: "Site-level note",
      comment: "Please add a clearer navigation link.",
    }),
    env,
    {
      fetchImpl: async () => {
        throw new Error("boom: internal details")
      },
    },
  )

  assert.equal(response.status, 500)
  const payload = await response.json()
  assert.equal(payload.error, "Unable to process submission.")
}

async function main() {
  await testValidPassageSubmission()
  await testValidPageSubmission()
  await testPreflightAndMethodRejection()
  await testRejectsInvalidInputs()
  await testValidatesPageUrlAndBodySize()
  await testGithubFailureIsGeneric()
  await testUnexpectedFailuresStayGeneric()
  console.log("Public feedback worker tests passed.")
}

main()