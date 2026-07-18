import { FileTrieNode } from "./quartz/util/fileTrie"

export const explorerOrder = ["filter", "map", "sort"] as const

export function explorerFilterFn(node: FileTrieNode): boolean {
  return node.slugSegment !== "tags"
}

export function explorerMapFn(node: FileTrieNode): void {
  // Keep labels human-readable if numbered prefixes are introduced later.
  node.displayName = node.displayName.replace(/^\d+[-_.\s]*/, "")
}

export function explorerSortFn(a: FileTrieNode, b: FileTrieNode): number {
  // IMPORTANT: Quartz serializes this function and executes it in the browser,
  // so all data it uses must be defined inside the function body.
  const explorerRank: Record<string, number> = {
    "index": 0,
    "advocacy-paper": 10,
    "policy-and-admin": 40,
    "policy-and-admin/prototype-status": 41,
    "policy-and-admin/public-feedback-policy": 42,
    "policy-and-admin/the-actionforge-project-concept": 43,
    "provide-feedback": 30,
    "provide-feedback/provide-paper-feedback": 31,
    "provide-feedback/provide-segment-feedback": 32,
    "july-22-virtual-gathering---how-to-guide": 20,
  }

  const aSlug = a.slug.replace(/\/index$/, "").toLowerCase()
  const bSlug = b.slug.replace(/\/index$/, "").toLowerCase()
  const aRank = Object.prototype.hasOwnProperty.call(explorerRank, aSlug)
    ? explorerRank[aSlug]
    : Number.MAX_SAFE_INTEGER
  const bRank = Object.prototype.hasOwnProperty.call(explorerRank, bSlug)
    ? explorerRank[bSlug]
    : Number.MAX_SAFE_INTEGER

  const rankDelta = aRank - bRank
  if (rankDelta !== 0) {
    return rankDelta
  }

  if (a.isFolder !== b.isFolder) {
    return a.isFolder ? -1 : 1
  }

  return a.displayName.localeCompare(b.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}
