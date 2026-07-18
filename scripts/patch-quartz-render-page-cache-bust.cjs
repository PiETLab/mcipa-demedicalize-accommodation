"use strict"

const fs = require("node:fs")
const path = require("node:path")

const targetPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "renderPage.tsx",
)

function fail(message) {
  throw new Error(`[patch-quartz-render-page-cache-bust] ${message}`)
}

if (!fs.existsSync(targetPath)) {
  fail(`Target file not found: ${targetPath}`)
}

let source = fs.readFileSync(targetPath, "utf8")

if (source.includes("withRuntimeVersion(joinSegments(baseDir, \"postscript.js\"))")) {
  console.log("Quartz renderPage.tsx already cache-busted.")
  process.exit(0)
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

fs.writeFileSync(targetPath, source)
console.log("Applied Quartz renderPage.tsx cache-busting patch.")
