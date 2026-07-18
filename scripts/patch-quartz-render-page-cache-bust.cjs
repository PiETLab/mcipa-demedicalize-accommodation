"use strict"

const fs = require("node:fs")
const path = require("node:path")

const renderPagePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "renderPage.tsx",
)

const explorerPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "Explorer.tsx",
)

const searchStylePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "styles",
  "Search.scss",
)

function fail(message) {
  throw new Error(`[patch-quartz-render-page-cache-bust] ${message}`)
}

function patchRenderPage() {
  if (!fs.existsSync(renderPagePath)) {
    fail(`Target file not found: ${renderPagePath}`)
  }

  let source = fs.readFileSync(renderPagePath, "utf8")

  if (source.includes("withRuntimeVersion(joinSegments(baseDir, \"postscript.js\"))")) {
    console.log("Quartz renderPage.tsx already cache-busted.")
    return
  }

  const functionAnchor = "export function pageResources(\n  baseDir: FullSlug | RelativeURL,\n  staticResources: StaticResources,\n): StaticResources {\n"

  if (!source.includes(functionAnchor)) {
    fail("Could not find pageResources function anchor")
  }

  const runtimeVersionBlock = [
    "export function pageResources(",
    "  baseDir: FullSlug | RelativeURL,",
    "  staticResources: StaticResources,",
    "): StaticResources {",
    "  const runtimeAssetVersion =",
    "    process.env.QUARTZ_RUNTIME_VERSION ??",
    "    process.env.GITHUB_SHA?.slice(0, 12) ??",
    "    Date.now().toString(36)",
    "  const withRuntimeVersion = (assetPath: string) =>",
    "    `${assetPath}?v=${encodeURIComponent(runtimeAssetVersion)}`",
    "",
  ].join("\n")

  source = source.replace(functionAnchor, runtimeVersionBlock)

  const beforeScriptNeedle = '        src: joinSegments(baseDir, "prescript.js"),'
  if (!source.includes(beforeScriptNeedle)) {
    fail("Could not find prescript.js source line")
  }
  source = source.replace(
    beforeScriptNeedle,
    '        src: withRuntimeVersion(joinSegments(baseDir, "prescript.js")),'
  )

  const afterScriptNeedle = '    src: joinSegments(baseDir, "postscript.js"),'
  if (!source.includes(afterScriptNeedle)) {
    fail("Could not find postscript.js source line")
  }
  source = source.replace(
    afterScriptNeedle,
    '    src: withRuntimeVersion(joinSegments(baseDir, "postscript.js")),'
  )

  fs.writeFileSync(renderPagePath, source)
  console.log("Applied Quartz renderPage.tsx cache-busting patch.")
}

function patchExplorerAccessibility() {
  if (!fs.existsSync(explorerPath)) {
    fail(`Target file not found: ${explorerPath}`)
  }

  let source = fs.readFileSync(explorerPath, "utf8")

  if (source.includes('aria-label="Toggle explorer navigation"')) {
    console.log("Quartz Explorer.tsx mobile toggle already has aria-label.")
    return
  }

  const mobileToggleNeedle = [
    "          data-mobile={true}",
    "          aria-controls={id}",
    "        >",
  ].join("\n")

  if (!source.includes(mobileToggleNeedle)) {
    fail("Could not find Explorer mobile toggle button anchor")
  }

  source = source.replace(
    mobileToggleNeedle,
    [
      "          data-mobile={true}",
      "          aria-controls={id}",
      '          aria-label="Toggle explorer navigation"',
      "        >",
    ].join("\n"),
  )

  fs.writeFileSync(explorerPath, source)
  console.log("Applied Quartz Explorer.tsx accessibility patch.")
}

function patchSearchContrast() {
  if (!fs.existsSync(searchStylePath)) {
    fail(`Target file not found: ${searchStylePath}`)
  }

  let source = fs.readFileSync(searchStylePath, "utf8")

  if (source.includes("color: var(--darkgray);")) {
    console.log("Quartz Search.scss contrast patch already applied.")
    return
  }

  const needle = "      color: var(--gray);"
  if (!source.includes(needle)) {
    fail("Could not find Search button text color rule")
  }

  source = source.replace(needle, "      color: var(--darkgray);")
  fs.writeFileSync(searchStylePath, source)
  console.log("Applied Quartz Search.scss contrast patch.")
}

patchRenderPage()
patchExplorerAccessibility()
patchSearchContrast()
