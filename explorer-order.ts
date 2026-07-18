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
    "policy-and-admin": 20,
    "policy-and-admin/prototype-status": 21,
    "policy-and-admin/public-feedback-policy": 22,
    "policy-and-admin/the-actionforge-project-concept": 23,
    "provide-feedback-on-the-advocacy-paper": 30,
    "provide-segment-feedback": 31,
    "july-22-virtual-gathering---how-to-guide": 40,
  }

  if (a.isFolder !== b.isFolder) {
    return a.isFolder ? -1 : 1
  }

  const aSlug = a.slug.replace(/\/index$/, "")
  const bSlug = b.slug.replace(/\/index$/, "")
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

  return a.displayName.localeCompare(b.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}
