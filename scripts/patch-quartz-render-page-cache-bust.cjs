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

const tableOfContentsPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "TableOfContents.tsx",
)

const backlinksPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "Backlinks.tsx",
)

const pageListPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "PageList.tsx",
)

const searchStylePaths = [
  path.join(
    __dirname,
    "..",
    "node_modules",
    "@jackyzha0",
    "quartz",
    "quartz",
    "components",
    "styles",
    "Search.scss",
  ),
  path.join(
    __dirname,
    "..",
    "node_modules",
    "@jackyzha0",
    "quartz",
    "quartz",
    "components",
    "styles",
    "search.scss",
  ),
]

const clipboardStylePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "components",
  "styles",
  "clipboard.scss",
)

const baseStylePath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@jackyzha0",
  "quartz",
  "quartz",
  "styles",
  "base.scss",
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

function patchTableOfContentsHeadingLevel() {
  if (!fs.existsSync(tableOfContentsPath)) {
    fail(`Target file not found: ${tableOfContentsPath}`)
  }

  let source = fs.readFileSync(tableOfContentsPath, "utf8")

  if (source.includes("<h2>{i18n(cfg.locale).components.tableOfContents.title}</h2>")) {
    console.log("Quartz TableOfContents.tsx heading-level patch already applied.")
    return
  }

  const needle = "<h3>{i18n(cfg.locale).components.tableOfContents.title}</h3>"
  if (!source.includes(needle)) {
    fail("Could not find TableOfContents title heading anchor")
  }

  source = source.split(needle).join("<h2>{i18n(cfg.locale).components.tableOfContents.title}</h2>")
  fs.writeFileSync(tableOfContentsPath, source)
  console.log("Applied Quartz TableOfContents.tsx heading-level patch.")
}

function patchBacklinksHeadingLevel() {
  if (!fs.existsSync(backlinksPath)) {
    fail(`Target file not found: ${backlinksPath}`)
  }

  let source = fs.readFileSync(backlinksPath, "utf8")

  if (source.includes("<h2>{i18n(cfg.locale).components.backlinks.title}</h2>")) {
    console.log("Quartz Backlinks.tsx heading-level patch already applied.")
    return
  }

  const needle = "<h3>{i18n(cfg.locale).components.backlinks.title}</h3>"
  if (!source.includes(needle)) {
    fail("Could not find Backlinks title heading anchor")
  }

  source = source.replace(needle, "<h2>{i18n(cfg.locale).components.backlinks.title}</h2>")
  fs.writeFileSync(backlinksPath, source)
  console.log("Applied Quartz Backlinks.tsx heading-level patch.")
}

function patchPageListHeadingLevel() {
  if (!fs.existsSync(pageListPath)) {
    fail(`Target file not found: ${pageListPath}`)
  }

  let source = fs.readFileSync(pageListPath, "utf8")

  if (source.includes("<h2>\n                  <a href={resolveRelative(fileData.slug!, page.slug!)} class=\"internal\">")) {
    console.log("Quartz PageList.tsx heading-level patch already applied.")
    return
  }

  const openNeedle = "                <h3>"
  const closeNeedle = "                </h3>"
  if (!source.includes(openNeedle) || !source.includes(closeNeedle)) {
    fail("Could not find PageList item heading anchors")
  }

  source = source.replace(openNeedle, "                <h2>")
  source = source.replace(closeNeedle, "                </h2>")
  source = source.replace(".section h3 {", ".section h2 {")
  fs.writeFileSync(pageListPath, source)
  console.log("Applied Quartz PageList.tsx heading-level patch.")
}

function patchSearchContrast() {
  const searchStylePath = searchStylePaths.find((candidate) => fs.existsSync(candidate))
  if (!searchStylePath) {
    fail(
      `Target file not found: ${searchStylePaths
        .map((candidate) => path.basename(candidate))
        .join(" or ")}`,
    )
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

function patchClipboardContrast() {
  if (!fs.existsSync(clipboardStylePath)) {
    fail(`Target file not found: ${clipboardStylePath}`)
  }

  let source = fs.readFileSync(clipboardStylePath, "utf8")

  if (source.includes("color: var(--darkgray);")) {
    console.log("Quartz clipboard.scss contrast patch already applied.")
    return
  }

  const needle = "  color: var(--gray);"
  if (!source.includes(needle)) {
    fail("Could not find clipboard button text color rule")
  }

  source = source.replace(needle, "  color: var(--darkgray);")
  fs.writeFileSync(clipboardStylePath, source)
  console.log("Applied Quartz clipboard.scss contrast patch.")
}

function patchTaskListContrast() {
  if (!fs.existsSync(baseStylePath)) {
    fail(`Target file not found: ${baseStylePath}`)
  }

  let source = fs.readFileSync(baseStylePath, "utf8")

  if (source.includes('text-decoration-color: var(--darkgray);\n      color: var(--darkgray);')) {
    console.log("Quartz base.scss task-list contrast patch already applied.")
    return
  }

  const needle = 'text-decoration-color: var(--gray);\n      color: var(--gray);'
  if (!source.includes(needle)) {
    fail("Could not find completed task-list color rule")
  }

  source = source.replace(needle, 'text-decoration-color: var(--darkgray);\n      color: var(--darkgray);')
  fs.writeFileSync(baseStylePath, source)
  console.log("Applied Quartz base.scss task-list contrast patch.")
}

patchRenderPage()
patchExplorerAccessibility()
patchTableOfContentsHeadingLevel()
patchBacklinksHeadingLevel()
patchPageListHeadingLevel()
patchSearchContrast()
patchClipboardContrast()
patchTaskListContrast()
