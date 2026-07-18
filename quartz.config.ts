import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const TARGET_PAGE_KEYS = new Set([
  "advocacy-paper",
  "/advocacy-paper",
  "content/advocacy paper.md",
  "/content/advocacy paper.md",
  "advocacy paper.md",
])

const ELIGIBLE_TAGS = new Set(["p", "li", "blockquote", "table", "pre"])

function normalizeCandidate(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value
    .toLowerCase()
    .replace(/\\/g, "/")
    .replace(/%20/g, " ")
    .trim()

  return normalized.length > 0 ? normalized : null
}

function getFileCandidates(file: any): string[] {
  const candidates = [
    file?.data?.slug,
    file?.data?.filePath,
    file?.path,
    file?.history?.[0],
  ]

  return candidates
    .map(normalizeCandidate)
    .filter((candidate): candidate is string => candidate !== null)
}

function isTargetPage(file: any): boolean {
  const candidates = getFileCandidates(file)

  return candidates.some((candidate) => {
    if (TARGET_PAGE_KEYS.has(candidate)) {
      return true
    }

    return (
      candidate.endsWith("/advocacy-paper") ||
      candidate.endsWith("/advocacy paper.md") ||
      candidate.endsWith("/content/advocacy paper.md")
    )
  })
}

function stableHash(input: string): string {
  let hash = 5381

  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i)
    hash = hash >>> 0
  }

  return hash.toString(36)
}

function normalizeBlockText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim()
}

function nodeText(node: any): string {
  if (!node || typeof node !== "object") {
    return ""
  }

  if (node.type === "text" && typeof node.value === "string") {
    return node.value
  }

  if (Array.isArray(node.children)) {
    return node.children.map(nodeText).join(" ")
  }

  return ""
}

function walkElements(node: any, visitor: (element: any) => void): void {
  if (!node || typeof node !== "object") {
    return
  }

  if (node.type === "element") {
    visitor(node)
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walkElements(child, visitor)
    }
  }
}

const PassageIdentifierTransformer = () => ({
  name: "PassageIdentifierTransformer",
  htmlPlugins() {
    return [
      () => {
        return (tree: any, file: any) => {
          if (!isTargetPage(file)) {
            return
          }

          const pageKey = getFileCandidates(file)[0] ?? "advocacy-paper"
          const usedIds = new Set<string>()

          walkElements(tree, (element) => {
            const tagName = typeof element.tagName === "string" ? element.tagName : ""
            if (!ELIGIBLE_TAGS.has(tagName)) {
              return
            }

            const properties = (element.properties ??= {})
            const explicitId = typeof properties.id === "string" ? properties.id.trim() : ""

            if (explicitId.length > 0) {
              if (usedIds.has(explicitId)) {
                throw new Error(
                  `[passage-ids] duplicate explicit id '${explicitId}' on ${pageKey}. Resolve the duplicate and rebuild.`,
                )
              }

              usedIds.add(explicitId)

              properties["data-feedback-block"] = "true"
              return
            }

            const normalizedText = normalizeBlockText(nodeText(element))
            const basis = normalizedText.length > 0 ? normalizedText : tagName
            const fallbackBaseId = `feedback-block-${stableHash(`${pageKey}::${basis}`)}`

            let generatedId = fallbackBaseId
            let suffix = 2

            if (usedIds.has(generatedId)) {
              console.warn(
                `[passage-ids] fallback collision '${fallbackBaseId}' on ${pageKey}; applying numeric suffix.`,
              )
            }

            while (usedIds.has(generatedId)) {
              generatedId = `${fallbackBaseId}-${suffix}`
              suffix += 1
            }

            properties.id = generatedId
            properties["data-feedback-block"] = "true"
            usedIds.add(generatedId)
          })
        }
      },
    ]
  },
})

/**
 * Quartz 4 configuration for mcipa-demedicalize-accommodation.
 * Public prototype — provisional/in-progress framing is intentional.
 *
 * TODO: Update pageTitle, baseUrl, and analytics once a domain is confirmed.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "MCIPA · Demedicalize Accommodation (Prototype)",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null, // TODO: add analytics config if needed
    locale: "en-US",
    baseUrl: "pietlab.github.io/mcipa-demedicalize-accommodation", // TODO: update if custom domain
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a98c",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a98c",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      PassageIdentifierTransformer(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
