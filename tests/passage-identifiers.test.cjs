const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")

const repoRoot = path.resolve(__dirname, "..")
const publicDir = path.join(repoRoot, "public")
const advocacyHtmlPath = path.join(publicDir, "Advocacy-Paper.html")
const eligibleTags = new Set(["p"])

function run(command) {
  execSync(command, {
    cwd: repoRoot,
    stdio: "pipe",
    encoding: "utf8",
  })
}

function listHtmlFiles(dir, collected = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      listHtmlFiles(fullPath, collected)
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      collected.push(fullPath)
    }
  }

  return collected
}

function getFeedbackElements(html) {
  const elements = []
  const tagWithMarker = /<([a-z0-9]+)\b([^>]*\bdata-feedback-block="true"[^>]*)>/gi
  let match

  while ((match = tagWithMarker.exec(html)) !== null) {
    const tag = match[1].toLowerCase()
    const attrs = match[2]
    const idMatch = attrs.match(/\bid="([^"]+)"/)

    elements.push({
      tag,
      id: idMatch ? idMatch[1] : null,
    })
  }

  return elements
}

function getFeedbackIds(html) {
  return getFeedbackElements(html)
    .map((item) => item.id)
    .filter((id) => typeof id === "string")
}

function readAdvocacyHtml() {
  return fs.readFileSync(advocacyHtmlPath, "utf8")
}


function runBuild() {
  run("npm run build")
}

function assertOnlyTargetPageHasMarkers() {
  const htmlFiles = listHtmlFiles(publicDir)
  const filesWithMarkers = htmlFiles.filter((file) => {
    const html = fs.readFileSync(file, "utf8")
    return html.includes('data-feedback-block="true"')
  })

  assert.equal(
    filesWithMarkers.length,
    1,
    `Expected markers in exactly one HTML file, found ${filesWithMarkers.length}.`,
  )

  assert.equal(
    path.basename(filesWithMarkers[0]),
    "Advocacy-Paper.html",
    "Expected markers only on Advocacy-Paper.html.",
  )
}

function assertEligibleBlocksHaveIdsAndTags(html) {
  const feedbackElements = getFeedbackElements(html)
  assert.ok(feedbackElements.length > 0, "Expected at least one feedback-marked block.")

  const missingIdCount = feedbackElements.filter((item) => !item.id).length
  assert.equal(missingIdCount, 0, `Expected no feedback-marked blocks without IDs, found ${missingIdCount}.`)

  const ineligibleTags = feedbackElements
    .map((item) => item.tag)
    .filter((tag) => !eligibleTags.has(tag))
  assert.equal(
    ineligibleTags.length,
    0,
    `Found feedback markers on ineligible tags: ${[...new Set(ineligibleTags)].join(", ")}`,
  )
}

function assertDifferentIdsExist(ids) {
  const uniqueIds = new Set(ids)
  assert.ok(uniqueIds.size > 1, "Expected multiple distinct feedback block IDs.")
}

function assertCollisionBehavior(ids) {
  const fallbackIds = ids.filter((id) => id.startsWith("feedback-block-"))
  assert.ok(fallbackIds.length > 0, "Expected at least one generated fallback ID.")

  const duplicates = fallbackIds.filter((id) => /-\d+$/.test(id))
  assert.ok(
    duplicates.length > 0,
    "Expected at least one suffixed fallback ID to confirm collision handling (for example -2).",
  )

  for (const id of duplicates) {
    const base = id.replace(/-\d+$/, "")
    assert.ok(
      fallbackIds.includes(base),
      `Expected suffixed fallback ID '${id}' to have base '${base}'.`,
    )
  }
}

function assertStableAcrossBuilds() {
  runBuild()
  const firstHtml = readAdvocacyHtml()
  const firstIds = getFeedbackIds(firstHtml)

  runBuild()
  const secondHtml = readAdvocacyHtml()
  const secondIds = getFeedbackIds(secondHtml)

  assert.deepEqual(
    secondIds,
    firstIds,
    "Expected feedback IDs to remain stable across unchanged builds.",
  )

  return secondHtml
}

function main() {
  const html = assertStableAcrossBuilds()
  const ids = getFeedbackIds(html)

  assertOnlyTargetPageHasMarkers()
  assertEligibleBlocksHaveIdsAndTags(html)
  assertDifferentIdsExist(ids)
  assertCollisionBehavior(ids)

  console.log("Passage identifier tests passed.")
}

main()
