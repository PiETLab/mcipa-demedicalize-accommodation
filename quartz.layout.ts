import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { execSync } from "node:child_process"
import { explorerFilterFn, explorerMapFn, explorerOrder, explorerSortFn } from "./explorer-order"

const safeExplorerOrder = Array.isArray(explorerOrder) ? explorerOrder : []

function readGitMetadata(command: string) {
  try {
    return execSync(command, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim()
  } catch {
    return ""
  }
}

const PUBLIC_FEEDBACK_WORKER_ENDPOINT = "https://mcipa-feedback.mcipa-feedback.workers.dev/submit-feedback"
const PUBLISHED_BRANCH = readGitMetadata("git rev-parse --abbrev-ref HEAD")
const PUBLISHED_COMMIT_IDENTIFIER = readGitMetadata("git rev-parse --short=12 HEAD")
const PUBLISHED_COMMIT_DATE = readGitMetadata("git show -s --format=%cs HEAD")

const PassageFeedbackControls = () => {
  const FeedbackControls = () => null

  FeedbackControls.css = `
.passage-feedback-control {
  display: flex;
  justify-content: flex-end;
  margin: 0.35rem 0 0.9rem;
}

.passage-feedback-button {
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--dark);
  border-radius: 0.5rem;
  padding: 0.35rem 0.65rem;
  font: inherit;
  font-size: 0.86rem;
  line-height: 1.2;
  cursor: pointer;
}

.passage-feedback-button:hover,
.passage-feedback-button:focus-visible {
  border-color: var(--secondary);
  outline: 2px solid color-mix(in srgb, var(--secondary) 35%, transparent);
  outline-offset: 2px;
}

.passage-feedback-button:active {
  transform: translateY(1px);
}

.selection-feedback-action {
  position: fixed;
  z-index: 1200;
  border: 1px solid var(--secondary);
  background: var(--secondary);
  color: var(--light);
  border-radius: 0.5rem;
  padding: 0.35rem 0.65rem;
  font: inherit;
  font-size: 0.82rem;
  line-height: 1.2;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}

.selection-feedback-action[hidden] {
  display: none;
}

@media (max-width: 800px) {
  .passage-feedback-control {
    justify-content: stretch;
  }

  .passage-feedback-button {
    width: 100%;
  }
}
`

  FeedbackControls.afterDOMLoaded = `
(() => {
  if (window.__mcipaFeedbackControlsInitialized) {
    return
  }
  window.__mcipaFeedbackControlsInitialized = true

  const FORM_SLUG = "/Provide-Feedback/Provide-Segment-Feedback"
  const FEEDBACK_WORKER_ENDPOINT = "${PUBLIC_FEEDBACK_WORKER_ENDPOINT}"
  const STORAGE_KEY = "mcipa.feedbackContext"
  const STORAGE_SOURCE_KEY = "mcipa.feedbackContextSource"
  const CONTROL_SELECTOR = ".passage-feedback-control"
  const SELECTION_MAX_CHARS = 600
  const TEXT_FRAGMENT_MIN_CHARS = 4
  const TEXT_FRAGMENT_MAX_CHARS = 180
  const CANONICAL_SITE_BASE = "https://pietlab.github.io/mcipa-demedicalize-accommodation"

  let selectionAction = null
  let currentSelectionContext = null

  const cleanupExistingControls = () => {
    document.querySelectorAll(CONTROL_SELECTOR).forEach((node) => node.remove())
  }

  const buildAccessibleName = (quote) => {
    const compact = quote.replace(/\\s+/g, " ").trim()
    const preview = compact.slice(0, 80)
    if (preview.length === 0) {
      return "Give feedback on this passage"
    }

    const suffix = compact.length > 80 ? "..." : ""
    return 'Give feedback on the passage beginning "' + preview + suffix + '"'
  }

  const normalizeText = (text) => {
    return (text || "").replace(/\\s+/g, " ").trim()
  }

  const isListContainer = (element) => {
    if (!element || !element.tagName) {
      return false
    }

    const tag = element.tagName.toUpperCase()
    return tag === "UL" || tag === "OL" || tag === "DL"
  }

  const isListLikeParagraph = (element) => {
    if (!element || !element.tagName || element.tagName.toUpperCase() !== "P") {
      return false
    }

    const normalized = normalizeText(element.textContent || "")
    // Double-escape because this code is emitted as a runtime script string.
    return /^(?:\\d+[.)]|[\\-*•·])\\s+/.test(normalized)
  }

  const isHeadingElement = (element) => {
    if (!element || !element.tagName) {
      return false
    }

    return /^H[1-6]$/i.test(element.tagName)
  }

  const getSectionHeadingElement = (element) => {
    let cursor = element?.previousElementSibling || null

    while (cursor) {
      if (isHeadingElement(cursor)) {
        return cursor
      }
      cursor = cursor.previousElementSibling
    }

    return null
  }

  const getFirstListLikeSinceSectionHeading = (element) => {
    let first = null
    let cursor = element

    while (cursor && !isHeadingElement(cursor)) {
      if (isListLikeParagraph(cursor)) {
        first = cursor
      }
      cursor = cursor.previousElementSibling
    }

    return first
  }

  const hasAdditionalListLikeInSection = (start) => {
    if (!start) {
      return false
    }

    let cursor = start.nextElementSibling
    while (cursor && !isHeadingElement(cursor)) {
      if (isListLikeParagraph(cursor)) {
        return true
      }
      cursor = cursor.nextElementSibling
    }

    return false
  }

  const hasAdditionalContiguousListLike = (start) => {
    if (!start || !isListLikeParagraph(start)) {
      return false
    }

    let cursor = start.nextElementSibling
    while (cursor && isListLikeParagraph(cursor)) {
      if (isListLikeParagraph(cursor)) {
        return true
      }
      cursor = cursor.nextElementSibling
    }

    return false
  }

  const getContiguousListLikeRunEnd = (start) => {
    if (!start) {
      return start
    }

    let last = start
    let cursor = start.nextElementSibling
    while (cursor && isListLikeParagraph(cursor)) {
      last = cursor
      cursor = cursor.nextElementSibling
    }

    return last
  }

  const getContiguousListLikeRunStart = (element) => {
    if (!element || !isListLikeParagraph(element)) {
      return null
    }

    let start = element
    let cursor = element.previousElementSibling
    while (cursor && isListLikeParagraph(cursor)) {
      start = cursor
      cursor = cursor.previousElementSibling
    }

    return start
  }

  const isShortCodaParagraph = (element) => {
    if (!element || !element.tagName || element.tagName.toUpperCase() !== "P") {
      return false
    }

    if (isListLikeParagraph(element)) {
      return false
    }

    const text = normalizeText(element.textContent || "")
    if (text.length === 0 || text.length > 240) {
      return false
    }

    const sentenceCount = text
      .split(/[.!?]+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0).length

    return sentenceCount > 0 && sentenceCount <= 2
  }

  const getIntroParagraphForListLeaf = (element) => {
    if (!isListContainer(element)) {
      return null
    }

    const intro = element.previousElementSibling
    if (
      intro &&
      intro.tagName &&
      intro.tagName.toUpperCase() === "P" &&
      !isListLikeParagraph(intro) &&
      !isHeadingElement(intro)
    ) {
      return intro
    }

    return null
  }

  const getInsertionTarget = (block) => {
    if (!block || !block.tagName) {
      return block
    }

    if (isListContainer(block)) {
      return block
    }

    if (block.tagName.toUpperCase() !== "P") {
      return block
    }

    const firstListLike = getFirstListLikeSinceSectionHeading(block)
    if (firstListLike && firstListLike === block && hasAdditionalContiguousListLike(firstListLike)) {
      const listRunEnd = getContiguousListLikeRunEnd(block)
      const maybeCoda = listRunEnd?.nextElementSibling
      return isShortCodaParagraph(maybeCoda) ? maybeCoda : listRunEnd
    }

    let lastNodeInLeaf = block
    let cursor = block.nextElementSibling

    // A p-like leaf may include immediately trailing list-like paragraphs.
    while (cursor && isListLikeParagraph(cursor)) {
      lastNodeInLeaf = cursor
      cursor = cursor.nextElementSibling
    }

    return lastNodeInLeaf
  }

  const getLeafText = (block) => {
    if (!block) {
      return ""
    }

    const start = getLeafAnchorBlock(block)

    const end = getInsertionTarget(block)
    const chunks = []
    let cursor = start

    while (cursor) {
      const text = normalizeText(cursor.textContent || "")
      if (text.length > 0) {
        chunks.push(text)
      }

      if (cursor === end) {
        break
      }
      cursor = cursor.nextElementSibling
    }

    return chunks.join("\\n")
  }

  const getLeafAnchorBlock = (block) => {
    if (!block) {
      return block
    }

    if (isListContainer(block)) {
      return getIntroParagraphForListLeaf(block) || block
    }

    if (!isListLikeParagraph(block)) {
      return block
    }

    const listStart = getContiguousListLikeRunStart(block)
    if (!(listStart === block && hasAdditionalContiguousListLike(listStart))) {
      return block
    }

    const intro = block.previousElementSibling
    if (
      intro &&
      intro.tagName &&
      intro.tagName.toUpperCase() === "P" &&
      !isListLikeParagraph(intro) &&
      !isHeadingElement(intro)
    ) {
      return intro
    }

    return block
  }

  const shouldAttachForParagraphLeaf = (block) => {
    if (!block || !block.tagName || block.tagName.toUpperCase() !== "P") {
      return true
    }

    // If this paragraph immediately introduces a list leaf,
    // fold it into that leaf and let the list emit the control.
    if (!isListLikeParagraph(block)) {
      const next = block.nextElementSibling
      if (isListContainer(next)) {
        return false
      }

      // If this paragraph immediately introduces a multi-item list-set,
      // fold it into that same leaf and let the list-set anchor emit the control.
      if (isListLikeParagraph(next)) {
        const listStart = getContiguousListLikeRunStart(next)
        if (listStart === next && hasAdditionalContiguousListLike(listStart)) {
          return false
        }
      }

      // If this paragraph is a short coda immediately after a multi-item list-set,
      // fold it into the same leaf and let the list-set anchor emit the control.
      const previous = block.previousElementSibling
      if (isListLikeParagraph(previous)) {
        const listStart = getContiguousListLikeRunStart(previous)
        if (listStart && hasAdditionalContiguousListLike(listStart)) {
          const listRunEnd = getContiguousListLikeRunEnd(listStart)
          if (listRunEnd === previous && isShortCodaParagraph(block)) {
            return false
          }
        }
      }
    }

    const firstListLike = getFirstListLikeSinceSectionHeading(block)
    if (firstListLike && hasAdditionalContiguousListLike(firstListLike)) {
      return firstListLike === block
    }

    if (!isListLikeParagraph(block)) {
      return true
    }

    const prev = block.previousElementSibling
    return !isListLikeParagraph(prev)
  }

  const safeIssueUrl = (value) => {
    const candidate = (value || "").toString().trim()
    if (!candidate) {
      return ""
    }

    try {
      const parsed = new URL(candidate)
      if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") {
        return ""
      }

      return parsed.toString()
    } catch (error) {
      return ""
    }
  }

  const canonicalPageUrlFromLocation = () => {
    let path = window.location.pathname || "/"
    while (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1)
    }
    const safePath = path.startsWith("/") ? path : "/" + path
    return CANONICAL_SITE_BASE + safePath
  }

  const buildBlockLink = (canonicalPageUrl, blockId) => {
    if (!canonicalPageUrl || !blockId) {
      return ""
    }

    try {
      const parsed = new URL(canonicalPageUrl)
      parsed.hash = blockId
      return parsed.toString()
    } catch (error) {
      return ""
    }
  }

  const buildTextFragmentLink = (canonicalPageUrl, text) => {
    const clean = normalizeText(text)
    if (!clean) {
      return ""
    }

    if (clean.length < TEXT_FRAGMENT_MIN_CHARS || clean.length > TEXT_FRAGMENT_MAX_CHARS) {
      return ""
    }

    try {
      const parsed = new URL(canonicalPageUrl)
      parsed.hash = ":~:text=" + encodeURIComponent(clean)
      return parsed.toString()
    } catch (error) {
      return ""
    }
  }

  const getNearestHeadingText = (el) => {
    const article = el.closest("article")
    if (!article) return ""

    const headings = article.querySelectorAll("h2, h3, h4, h5, h6")
    let nearest = ""

    headings.forEach((heading) => {
      if (heading.offsetTop <= el.offsetTop) {
        nearest = heading.textContent?.trim() ?? ""
      }
    })

    return nearest
  }

  const getNearestHeadingAnchorId = (el) => {
    const article = el.closest("article")
    if (!article) return ""

    const headings = article.querySelectorAll("h2, h3, h4, h5, h6")
    let nearestId = ""

    headings.forEach((heading) => {
      if (heading.offsetTop <= el.offsetTop) {
        nearestId = heading.getAttribute("id") || ""
      }
    })

    return nearestId
  }

  const getHeadingLevel = (element) => {
    if (!element || !element.tagName) {
      return 0
    }

    const match = element.tagName.toUpperCase().match(/^H([1-6])$/)
    if (!match) {
      return 0
    }

    return Number.parseInt(match[1], 10)
  }

  const getHeadingChainText = (el) => {
    const article = el.closest("article")
    if (!article) {
      return ""
    }

    const headingNodes = article.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const chain = []

    headingNodes.forEach((heading) => {
      if (heading.offsetTop > el.offsetTop) {
        return
      }

      const level = getHeadingLevel(heading)
      const text = heading.textContent?.trim() ?? ""
      if (!level || !text) {
        return
      }

      while (chain.length > 0 && chain[chain.length - 1].level >= level) {
        chain.pop()
      }
      chain.push({ level, text })
    })

    const firstDocumentHeading = article.querySelector("h1")?.textContent?.trim() ?? ""
    if (chain.length > 1 && firstDocumentHeading && chain[0]?.text === firstDocumentHeading) {
      chain.shift()
    }

    return chain.map((item) => item.text).join(" > ")
  }

  const getSegmentContextForBlock = (targetBlock) => {
    const feedbackBlocks = Array.from(document.querySelectorAll("article [data-feedback-block=\\"true\\"]"))
    const attachable = feedbackBlocks.filter((block) => {
      if (!block.getAttribute("id")) return false
      if (block.closest("nav, footer, .page-footer")) return false
      return shouldAttachForParagraphLeaf(block)
    })

    const sectionKeyFor = (block) => {
      const chain = getHeadingChainText(block)
      if (chain) {
        return chain
      }
      return getNearestHeadingText(block)
    }

    const targetKey = sectionKeyFor(targetBlock)
    const matching = attachable.filter((block) => sectionKeyFor(block) === targetKey)
    const index = matching.findIndex((block) => block === targetBlock)

    return {
      headingChain: getHeadingChainText(targetBlock),
      segmentIndex: index >= 0 ? index + 1 : 0,
      segmentCount: matching.length,
    }
  }

  const getFeedbackBlockFromNode = (node) => {
    if (!node) return null
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement
    if (!element || !element.closest) return null
    return element.closest("article [data-feedback-block=\\"true\\"]")
  }

  const hideSelectionAction = () => {
    currentSelectionContext = null
    if (selectionAction) {
      selectionAction.hidden = true
    }
  }

  const buildSelectionContext = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return null
    }

    const selectedText = selection.toString()
    if (!selectedText || normalizeText(selectedText).length === 0) {
      return null
    }

    if (selectedText.length > SELECTION_MAX_CHARS) {
      return null
    }

    const range = selection.getRangeAt(0)
    const startBlock = getFeedbackBlockFromNode(range.startContainer)
    const endBlock = getFeedbackBlockFromNode(range.endContainer)

    if (!startBlock || !endBlock || startBlock !== endBlock) {
      return null
    }

    if (startBlock.closest("nav, footer, .page-footer")) {
      return null
    }

    const blockId = startBlock.getAttribute("id")
    if (!blockId) {
      return null
    }

    const fullBlockText = normalizeText(startBlock.textContent || "")
    const selectedCompact = normalizeText(selectedText)
    if (!fullBlockText || !selectedCompact) {
      return null
    }

    const selectedIndex = fullBlockText.indexOf(selectedCompact)
    const startContext = selectedIndex >= 0
      ? fullBlockText.slice(Math.max(0, selectedIndex - 120), selectedIndex)
      : ""
    const endContext = selectedIndex >= 0
      ? fullBlockText.slice(selectedIndex + selectedCompact.length, selectedIndex + selectedCompact.length + 120)
      : ""

    return {
      range,
      selectedText: selectedCompact,
      fullBlockText,
      startContext,
      endContext,
      blockId,
      blockElement: startBlock,
    }
  }

  const getSelectionAction = () => {
    if (selectionAction && document.body.contains(selectionAction)) {
      return selectionAction
    }

    selectionAction = document.createElement("button")
    selectionAction.type = "button"
    selectionAction.className = "selection-feedback-action"
    selectionAction.textContent = "Give feedback on selected text"
    selectionAction.hidden = true
    selectionAction.setAttribute("aria-label", "Give feedback on selected text")

    selectionAction.addEventListener("click", () => {
      if (!currentSelectionContext) {
        return
      }

      const block = currentSelectionContext.blockElement
      const anchorBlock = getLeafAnchorBlock(block)
      const blockId = anchorBlock?.getAttribute("id") || currentSelectionContext.blockId
      const reportedBlockId = currentSelectionContext.blockId
      const pageUrl = canonicalPageUrlFromLocation()
      const pageTitle = document.querySelector("article h1")?.textContent?.trim() || document.title
      const headingAnchorId = getNearestHeadingAnchorId(block)
      const blockUrl = buildBlockLink(pageUrl, headingAnchorId || blockId)
      const reportedBlockUrl = reportedBlockId !== blockId ? buildBlockLink(pageUrl, reportedBlockId) : ""
      const sectionHeading = getNearestHeadingText(block)
      const segmentContext = getSegmentContextForBlock(block)
      const textFragmentUrl = buildTextFragmentLink(pageUrl, currentSelectionContext.selectedText)

      const payload = {
        feedbackType: "selection",
        pageTitle,
        pageUrl,
        sectionHeading,
        blockId,
        blockUrl,
        reportedBlockId,
        reportedBlockUrl,
        headingChain: segmentContext.headingChain,
        segmentIndex: segmentContext.segmentIndex,
        segmentCount: segmentContext.segmentCount,
        textFragmentUrl,
        quotedText: currentSelectionContext.selectedText,
        selectedText: currentSelectionContext.selectedText,
        fullBlockText: currentSelectionContext.fullBlockText,
        startContext: currentSelectionContext.startContext,
        endContext: currentSelectionContext.endContext,
      }

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        sessionStorage.setItem(STORAGE_SOURCE_KEY, "interactive")
      } catch (error) {
        // If sessionStorage is unavailable, navigation still proceeds and the form can load without context.
      }

      hideSelectionAction()

      const targetUrl = new URL(FORM_SLUG, window.location.href)
      if (window.spaNavigate) {
        window.spaNavigate(targetUrl)
      } else {
        window.location.assign(targetUrl.toString())
      }
    })

    document.body.appendChild(selectionAction)
    return selectionAction
  }

  const showSelectionAction = (context) => {
    const action = getSelectionAction()
    const rect = context.range.getBoundingClientRect()
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      hideSelectionAction()
      return
    }

    const top = Math.max(10, rect.top + window.scrollY - 42)
    const left = Math.max(10, rect.left + window.scrollX)
    action.style.top = top + "px"
    action.style.left = left + "px"
    action.hidden = false
    currentSelectionContext = context
  }

  const refreshSelectionAction = () => {
    const context = buildSelectionContext()
    if (!context) {
      hideSelectionAction()
      return
    }

    showSelectionAction(context)
  }

  const attachControls = () => {
    const feedbackBlocks = Array.from(document.querySelectorAll("article [data-feedback-block=\\"true\\"]"))
    cleanupExistingControls()

    const attachableBlocks = feedbackBlocks.filter((block) => {
      const blockId = block.getAttribute("id")
      if (!blockId) return false

      if (!shouldAttachForParagraphLeaf(block)) {
        return false
      }

      if (block.closest("nav, footer, .page-footer")) {
        return false
      }

      const sectionHeading = getNearestHeadingText(block)
      if (!sectionHeading) {
        return false
      }

      return true
    })

    const sectionTotals = new Map()
    attachableBlocks.forEach((block) => {
      const sectionKey = getHeadingChainText(block) || getNearestHeadingText(block)
      sectionTotals.set(sectionKey, (sectionTotals.get(sectionKey) || 0) + 1)
    })

    const sectionSeen = new Map()

    attachableBlocks.forEach((block) => {
      const anchorBlock = getLeafAnchorBlock(block)
      const blockId = anchorBlock?.getAttribute("id") || block.getAttribute("id")
      const reportedBlockId = block.getAttribute("id")
      if (!blockId) return

      const leafText = getLeafText(block)
      const quotedText = leafText.slice(0, 1800)
      const sectionHeading = getNearestHeadingText(block)
      const headingChain = getHeadingChainText(block)
      const sectionKey = headingChain || sectionHeading
      const segmentIndex = (sectionSeen.get(sectionKey) || 0) + 1
      sectionSeen.set(sectionKey, segmentIndex)
      const segmentCount = sectionTotals.get(sectionKey) || 1

      const pageUrl = canonicalPageUrlFromLocation()
      const headingAnchorId = getNearestHeadingAnchorId(block)
      const blockUrl = buildBlockLink(pageUrl, headingAnchorId || blockId)
      const reportedBlockUrl = reportedBlockId && reportedBlockId !== blockId ? buildBlockLink(pageUrl, reportedBlockId) : ""
      const textFragmentUrl = buildTextFragmentLink(pageUrl, quotedText)
      const pageTitle = document.querySelector("article h1")?.textContent?.trim() || document.title

      const wrapper = document.createElement("div")
      wrapper.className = "passage-feedback-control"

      const button = document.createElement("button")
      button.type = "button"
      button.className = "passage-feedback-button"
      button.textContent = "Give feedback on this passage"
      button.setAttribute("aria-label", buildAccessibleName(quotedText))

      button.addEventListener("click", () => {
        const payload = {
          feedbackType: "passage",
          pageTitle,
          pageUrl,
          sectionHeading,
          blockId,
          blockUrl,
          reportedBlockId,
          reportedBlockUrl,
          headingChain,
          segmentIndex,
          segmentCount,
          textFragmentUrl,
          quotedText,
        }

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
          sessionStorage.setItem(STORAGE_SOURCE_KEY, "interactive")
        } catch (error) {
          // If sessionStorage is unavailable, navigation still proceeds and the form can load without context.
        }

        const targetUrl = new URL(FORM_SLUG, window.location.href)
        if (window.spaNavigate) {
          window.spaNavigate(targetUrl)
        } else {
          window.location.assign(targetUrl.toString())
        }
      })

      wrapper.appendChild(button)
      const insertionTarget = getInsertionTarget(block)
      insertionTarget.insertAdjacentElement("afterend", wrapper)
    })
  }

  attachControls()
  document.addEventListener("nav", attachControls)
  document.addEventListener("selectionchange", refreshSelectionAction)
  document.addEventListener("mouseup", refreshSelectionAction)
  document.addEventListener("keyup", refreshSelectionAction)

  if (window.addCleanup) {
    window.addCleanup(() => {
      cleanupExistingControls()
      hideSelectionAction()
    })
  }
})()
`

  return FeedbackControls
}

const FeedbackFormHydration = () => {
  const FeedbackHydration = () => null

  FeedbackHydration.css = `
.feedback-context-card {
  border: 1px solid var(--lightgray);
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 0 0 1rem;
  background: color-mix(in srgb, var(--light) 92%, var(--secondary) 8%);
}

.feedback-context-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.feedback-context-card p {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
}

.feedback-selected-text {
  margin-top: 0.5rem;
  padding: 0.7rem;
  border: 1px solid var(--lightgray);
  border-radius: 0.65rem;
  background: var(--light);
  white-space: pre-wrap;
}

.feedback-copy-action {
  margin-top: -0.15rem;
}

.feedback-copy-button {
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--dark);
}

.feedback-form .feedback-context-card + p {
  margin-top: 0 !important;
}

.feedback-form {
  display: grid;
  gap: 0.8rem;
}

.feedback-form > p {
  margin: 0;
}

.feedback-form label {
  font-weight: 600;
}

.feedback-form textarea {
  width: 100%;
  min-height: 10rem;
  resize: vertical;
  padding: 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--dark);
  font: inherit;
}

.feedback-form button {
  width: fit-content;
  border: 1px solid var(--secondary);
  background: var(--secondary);
  color: var(--light);
  border-radius: 0.5rem;
  padding: 0.45rem 0.8rem;
  font: inherit;
  cursor: pointer;
}

.feedback-mode-group {
  border: 1px solid var(--lightgray);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.feedback-mode-group legend {
  font-weight: 700;
  padding: 0 0.25rem;
}

.feedback-mode-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.35rem 0;
}

.feedback-notice {
  border-left: 4px solid var(--secondary);
  padding: 0.65rem 0.75rem;
  background: color-mix(in srgb, var(--light) 90%, var(--secondary) 10%);
}

.feedback-context-preview {
  border: 1px solid var(--lightgray);
  border-radius: 0.65rem;
  padding: 0.7rem;
  background: var(--light);
}

.feedback-context-preview blockquote {
  margin: 0;
  border-left: 3px solid var(--gray);
  padding-left: 0.7rem;
}

.feedback-inline-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.feedback-inline-actions button {
  border: 1px solid var(--gray);
  background: var(--light);
  color: var(--dark);
}

.feedback-submit-status {
  font-size: 0.92rem;
}

.feedback-submit-status.error {
  color: #b3261e;
}

.feedback-submit-status.success {
  color: #1e7d32;
}

.feedback-form button:disabled {
  opacity: 0.7;
  cursor: wait;
}
`

  FeedbackHydration.afterDOMLoaded = `
(() => {
  if (window.__mcipaFeedbackFormHydrationInitialized) {
    return
  }
  window.__mcipaFeedbackFormHydrationInitialized = true

  const STORAGE_KEY = "mcipa.feedbackContext";
  const STORAGE_SOURCE_KEY = "mcipa.feedbackContextSource";
  const FORM_PATHS = [
    "/provide-feedback/provide-feedback-on-the-advocacy-paper",
    "/provide-feedback/provide-paper-feedback",
    "/provide-feedback/provide-segment-feedback",
  ];
  const SEGMENT_FEEDBACK_PATH = "/provide-feedback/provide-segment-feedback";
  const FEEDBACK_WORKER_ENDPOINT = "${PUBLIC_FEEDBACK_WORKER_ENDPOINT}";
  let initializedForm = null;
  let isSubmitting = false;

  const safeIssueUrl = (value) => {
    const candidate = (value || "").toString().trim();
    if (!candidate) {
      return "";
    }

    try {
      const parsed = new URL(candidate);
      if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") {
        return "";
      }

      return parsed.toString();
    } catch (error) {
      return "";
    }
  };

  const normalizePath = (path) => {
    let normalized = path || "/";
    while (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  };

  const isFeedbackPage = () => {
    const current = normalizePath(window.location.pathname).toLowerCase();
    return FORM_PATHS.some((path) => {
      const normalizedPath = path.toLowerCase();
      return current === normalizedPath || current.endsWith(normalizedPath);
    });
  };

  const isSegmentFeedbackPage = () => {
    const current = normalizePath(window.location.pathname).toLowerCase();
    return current === SEGMENT_FEEDBACK_PATH || current.endsWith(SEGMENT_FEEDBACK_PATH);
  };

  const setStatus = (message, type) => {
    const status = document.querySelector("#feedback-submit-status");
    if (!status) return;
    status.textContent = message || "";
    status.classList.remove("error", "success");
    if (type) {
      status.classList.add(type);
    }
  };

  const toggleContextPreview = (mode) => {
    const contextSection = document.querySelector("#feedback-context-section") || document.querySelector("#feedback-context-from-passage");
    if (contextSection) {
      contextSection.hidden = mode !== "passage";
    }
  };

  const setMode = (mode) => {
    const modePage = document.querySelector("#mode-page");
    const modePassage = document.querySelector("#mode-passage");
    const fieldType = document.querySelector("#field-feedback-type");
    const fieldSection = document.querySelector("#field-section-heading-display");
    const fieldSelection = document.querySelector("#field-selected-passage-display");

    if (modePage && modePassage) {
      modePage.checked = mode === "page";
      modePassage.checked = mode === "passage";
    }

    if (fieldType) fieldType.value = mode;
    if (fieldSection) fieldSection.readOnly = true;
    if (fieldSelection) fieldSelection.readOnly = true;
    toggleContextPreview(mode);
  };

  const clearPassageContext = () => {
    setValue("#field-section-heading", "");
    setValue("#field-block-id", "");
    setValue("#field-block-url", "");
    setValue("#field-reported-block-id", "");
    setValue("#field-reported-block-url", "");
    setValue("#field-text-fragment-url", "");
    setValue("#field-quoted-text", "");
    setValue("#field-selected-text", "");
    setValue("#field-full-block-text", "");
    setValue("#field-start-context", "");
    setValue("#field-end-context", "");
    setValue("#field-section-heading-display", "");
    setValue("#field-selected-passage-display", "");
    setText("#feedback-section-heading", "");
    setText("#feedback-block-id", "");
    renderSelectedPassagePreview(null);
    setText("#feedback-feedback-type", "page");
    setMode("page");
    ensurePageLevelTitle();
  };

  const syncCopySegmentButton = (text) => {
    const copyBtn = document.querySelector("#copy-segment-to-feedback");
    if (!copyBtn) {
      return;
    }

    const normalizedText = (text || "").trim();
    const hasText = normalizedText.length > 0;
    copyBtn.dataset.copyText = normalizedText;
    copyBtn.hidden = !hasText;
    copyBtn.disabled = !hasText;
  };

  const escapeHtml = (value) => {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;")
  };

  const renderSelectedPassagePreview = (payload) => {
    const previewEl = document.querySelector("#feedback-selected-text");
    if (!previewEl) {
      return;
    }

    const headingChain = (payload?.headingChain || payload?.sectionHeading || "").toString().trim();
    const headingLine = headingChain.length > 0
      ? (headingChain.startsWith("§") ? headingChain : "§ " + headingChain)
      : "";
    const segmentIndex = Number.parseInt((payload?.segmentIndex || "0").toString(), 10);
    const segmentCount = Number.parseInt((payload?.segmentCount || "0").toString(), 10);
    const hasSegment = Number.isFinite(segmentIndex) && Number.isFinite(segmentCount) && segmentIndex > 0 && segmentCount > 0;
    const segmentLine = hasSegment ? "Segment " + segmentIndex + " of " + segmentCount : "";
    const chosenText = (payload?.selectedText || payload?.quotedText || "").toString().trim();

    const htmlLines = [];
    const plainLines = [];

    if (headingLine) {
      htmlLines.push("<strong>" + escapeHtml(headingLine) + "</strong>");
      plainLines.push(headingLine);
    }

    if (segmentLine) {
      htmlLines.push(escapeHtml(segmentLine));
      plainLines.push(segmentLine);
    }

    if (chosenText) {
      htmlLines.push(escapeHtml(chosenText));
      plainLines.push(chosenText);
    }

    if (htmlLines.length === 0) {
      previewEl.textContent = "Not provided";
      syncCopySegmentButton("");
      setValue("#field-selected-passage-display", "");
      setValue("#field-quoted-text", "");
      return;
    }

    const displayText = plainLines.join("\\n");
    previewEl.innerHTML = htmlLines.join("<br>");
    syncCopySegmentButton(displayText);
    setValue("#field-selected-passage-display", displayText);
    setValue("#field-quoted-text", displayText);
  };

  const bindFormInteractions = () => {
    if (!isFeedbackPage()) {
      return;
    }

    const form = document.querySelector("#public-feedback-form");
    if (!form) {
      return;
    }

    if (initializedForm === form) {
      return;
    }

    form.setAttribute("data-endpoint", FEEDBACK_WORKER_ENDPOINT)
    ensurePageLevelTitle()

    initializedForm = form;

    const modePage = document.querySelector("#mode-page");
    const modePassage = document.querySelector("#mode-passage");
    const clearBtn = document.querySelector("#clear-passage-context");
    const copyBtn = document.querySelector("#copy-segment-to-feedback");
    const commentField = document.querySelector("#field-feedback-comment");
    const submitBtn = document.querySelector("#feedback-submit-button");
    const issueLink = document.querySelector("#feedback-created-issue-link");

    modePage?.addEventListener("change", () => {
      if (modePage.checked) {
        setMode("page");
      }
    });

    modePassage?.addEventListener("change", () => {
      if (modePassage.checked) {
        setMode("passage");
      }
    });

    clearBtn?.addEventListener("click", () => {
      clearPassageContext();
      setStatus("Passage context cleared. Submission is now page-level.", null);
    });

    copyBtn?.addEventListener("click", () => {
      const chosenText = (
        copyBtn.dataset.copyText ||
        document.querySelector("#field-selected-passage-display")?.value ||
        document.querySelector("#field-selected-text")?.value ||
        ""
      ).trim();
      if (!chosenText || !commentField) {
        return;
      }

      const current = commentField.value.trim();
      if (!current) {
        commentField.value = chosenText;
      } else if (!current.includes(chosenText)) {
        commentField.value = current + "\\n\\n" + chosenText;
      }

      commentField.dispatchEvent(new Event("input", { bubbles: true }));
      commentField.focus();
      setStatus("Segment copied into feedback field.", null);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }

      isSubmitting = true;
      setStatus("Submitting feedback...", null);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }
      if (issueLink) {
        issueLink.hidden = true;
        issueLink.removeAttribute("href");
      }

      const formData = new FormData(form);
      const endpoint = (form.getAttribute("data-endpoint") || "").trim();

      try {
        if ((formData.get("website") || "").toString().trim().length > 0) {
          setStatus("Submission received.", "success");
          form.reset();
          clearPassageContext();
          return;
        }

        if (!endpoint) {
          throw new Error("Submission endpoint is not configured yet.");
        }

        const payload = Object.fromEntries(formData.entries());
        // Backward compatibility: older deployed workers reject unknown fields.
        // Keep reported-block metadata in the form/runtime, but omit from submit payload.
        delete payload.reportedBlockId;
        delete payload.reportedBlockUrl;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        let result = {};
        try {
          result = await response.json();
        } catch (error) {
          result = {};
        }

        if (!response.ok) {
          throw new Error(result.error || "Feedback submission failed.");
        }

        const issueUrl = safeIssueUrl(result.issueUrl || result.html_url || result.url || "");
        setStatus("Thanks, your feedback was received.", "success");
        if (issueUrl && issueLink) {
          issueLink.hidden = false;
          issueLink.href = issueUrl;
          issueLink.textContent = "View submitted feedback on github";
        }

        form.reset();
        clearPassageContext();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to submit feedback right now.";
        setStatus(message, "error");
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit feedback";
        }
      }
    });
  };

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = value && value.length > 0 ? value : "Not provided";
    }
  };

  const setValue = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) {
      el.value = value || "";
    }
  };

  const ensurePublishedBuildMetadata = () => {
    setValue("#field-published-branch", "${PUBLISHED_BRANCH}");
    setValue("#field-published-commit", "${PUBLISHED_COMMIT_IDENTIFIER}");
    setValue("#field-published-commit-date", "${PUBLISHED_COMMIT_DATE}");
  };

  const ensurePageLevelTitle = () => {
    const titleField = document.querySelector("#field-title");
    if (titleField && !titleField.value) {
      const pageTitle = document.querySelector("article h1")?.textContent?.trim() || document.title || "Feedback";
      titleField.value = "Feedback on " + pageTitle;
    }

    const pageUrlField = document.querySelector("#field-page-url");
    if (pageUrlField && !pageUrlField.value) {
      pageUrlField.value = "https://pietlab.github.io/mcipa-demedicalize-accommodation/Advocacy-Paper";
    }

    const pageTitleField = document.querySelector("#field-page-title");
    if (pageTitleField && !pageTitleField.value) {
      pageTitleField.value = "Advocacy Paper";
    }

    ensurePublishedBuildMetadata();
  };

  const hydrateFeedbackForm = () => {
    if (!isFeedbackPage()) {
      return;
    }

    const statusEl = document.querySelector("#feedback-context-status");
    const missingEl = document.querySelector("#feedback-context-missing");
    const fromPassageEl = document.querySelector("#feedback-context-from-passage");

    let payload = null;
    let payloadSource = "";
    try {
      payload = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      payloadSource = (sessionStorage.getItem(STORAGE_SOURCE_KEY) || "").toString();
    } catch (error) {
      payload = null;
      payloadSource = "";
    }

    if (!payload || typeof payload !== "object" || payloadSource !== "interactive") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_SOURCE_KEY);
      } catch (error) {
        // Ignore storage unavailability.
      }

      clearPassageContext();
      syncCopySegmentButton("");
      if (isSegmentFeedbackPage()) {
        if (statusEl) {
          statusEl.innerHTML = 'Select a segment from the <a href="../Advocacy-Paper">Adocacy Paper</a> for feedback.';
        }
        if (missingEl) missingEl.hidden = true;
      } else {
        if (statusEl) statusEl.textContent = "Ready to submit page-level feedback.";
        if (missingEl) missingEl.hidden = true;
      }
      if (fromPassageEl) fromPassageEl.hidden = true;
      ensurePageLevelTitle();
      bindFormInteractions();
      return;
    }

    // Treat passage context as one-time navigation state.
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_SOURCE_KEY);
    } catch (error) {
      // Ignore storage unavailability.
    }

    if (statusEl) statusEl.textContent = "";
    if (missingEl) missingEl.hidden = true;
    if (fromPassageEl) fromPassageEl.hidden = false;

    const chosenText = payload.selectedText || payload.quotedText || "";

    setValue("#field-feedback-type", payload.feedbackType || "passage");
    setValue("#field-title", payload.pageTitle ? "Feedback on passage from " + payload.pageTitle : "");
    setValue("#field-page-title", payload.pageTitle || "");
    setValue("#field-page-url", payload.pageUrl || "");
    setValue("#field-published-branch", "${PUBLISHED_BRANCH}");
    setValue("#field-published-commit", "${PUBLISHED_COMMIT_IDENTIFIER}");
    setValue("#field-published-commit-date", "${PUBLISHED_COMMIT_DATE}");
    setValue("#field-section-heading", payload.sectionHeading || "");
    setValue("#field-block-id", payload.blockId || "");
    setValue("#field-block-url", payload.blockUrl || "");
    setValue("#field-reported-block-id", payload.reportedBlockId || "");
    setValue("#field-reported-block-url", payload.reportedBlockUrl || "");
    setValue("#field-text-fragment-url", payload.textFragmentUrl || "");
    setValue("#field-quoted-text", payload.quotedText || "");
    setValue("#field-selected-text", payload.selectedText || "");
    setValue("#field-full-block-text", payload.fullBlockText || "");
    setValue("#field-start-context", payload.startContext || "");
    setValue("#field-end-context", payload.endContext || "");

    setValue("#field-page-url-editable", payload.pageUrl || "");
    setValue("#field-section-heading-display", payload.sectionHeading || "");
    setValue("#field-selected-passage-display", chosenText);

    setText("#feedback-feedback-type", payload.feedbackType || "passage");
    setText("#feedback-page-url", payload.pageUrl || "");
    setText("#feedback-section-heading", payload.sectionHeading || "");
    setText("#feedback-block-id", payload.blockId || "");
    renderSelectedPassagePreview(payload);

    ensurePageLevelTitle()
    bindFormInteractions();
  };

  hydrateFeedbackForm();
  document.addEventListener("nav", hydrateFeedbackForm);
})()
`

  return FeedbackHydration
}

const ExplorerHomeLink = () => {
  const ExplorerHome = () => null

  ExplorerHome.afterDOMLoaded = `
(() => {
  if (window.__mcipaExplorerHomeInitialized) {
    return
  }
  window.__mcipaExplorerHomeInitialized = true

  const HOME_LABEL = "Home"
  const FALLBACK_HOME_HREF = "."

  const resolveHomeHref = () => {
    const pageTitleLink = document.querySelector(".page-title a")
    const href = (pageTitleLink?.getAttribute("href") || "").trim()
    return href || FALLBACK_HOME_HREF
  }

  const buildHomeItem = (homeHref) => {
    const li = document.createElement("li")
    li.setAttribute("data-synthetic-home", "true")

    const link = document.createElement("a")
    link.href = homeHref
    link.textContent = HOME_LABEL

    li.appendChild(link)
    return li
  }

  const upsertHomeItem = (rootList) => {
    const homeHref = resolveHomeHref()
    const topLevelItems = Array.from(rootList.querySelectorAll(":scope > li"))
    const homeItems = topLevelItems.filter((item) => {
      if (item.getAttribute("data-synthetic-home") === "true") {
        return true
      }

      const directLink = item.querySelector(":scope > a")
      const label = (directLink?.textContent || "").trim().toLowerCase()
      return label === "home"
    })

    let homeItem = homeItems[0] || null
    if (!homeItem) {
      homeItem = buildHomeItem(homeHref)
    }

    const homeLink = homeItem.querySelector(":scope > a")
    if (homeLink) {
      homeLink.textContent = HOME_LABEL
      if (
        homeItem.getAttribute("data-synthetic-home") === "true" ||
        !(homeLink.getAttribute("href") || "").trim()
      ) {
        homeLink.setAttribute("href", homeHref)
      }
    }

    // Remove duplicate Home items created by prior renders.
    homeItems.slice(1).forEach((item) => item.remove())

    if (rootList.firstElementChild !== homeItem) {
      rootList.insertBefore(homeItem, rootList.firstElementChild)
    }
  }

  const ensureHomeLink = () => {
    document.querySelectorAll(".explorer").forEach((explorer) => {
      const rootList = explorer.querySelector("ul")
      if (!rootList) {
        return
      }

      upsertHomeItem(rootList)

      if (!rootList.__mcipaHomeObserver) {
        const observer = new MutationObserver(() => upsertHomeItem(rootList))
        observer.observe(rootList, { childList: true })
        rootList.__mcipaHomeObserver = observer
      }
    })
  }

  ensureHomeLink()
  requestAnimationFrame(ensureHomeLink)
  setTimeout(ensureHomeLink, 50)
  document.addEventListener("nav", ensureHomeLink)
})()
`

  return ExplorerHome
}

/**
 * Quartz 4 layout for mcipa-demedicalize-accommodation.
 * Default layout — adjust as content structure grows.
 */

// Components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [PassageFeedbackControls(), FeedbackFormHydration(), ExplorerHomeLink()],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/PiETLab/mcipa-demedicalize-accommodation",
    },
  }),
}

// Components for pages that display a single piece of content
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.Explorer({
        folderDefaultState: "open",
        order: [...safeExplorerOrder],
        filterFn: explorerFilterFn,
        mapFn: explorerMapFn,
        sortFn: explorerSortFn,
      }),
    ),
  ],
  right: [
    //Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// Components for pages that display lists of content (folders/tags)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(
      Component.Explorer({
        folderDefaultState: "open",
        order: [...safeExplorerOrder],
        filterFn: explorerFilterFn,
        mapFn: explorerMapFn,
        sortFn: explorerSortFn,
      }),
    ),
  ],
  right: [],
}
