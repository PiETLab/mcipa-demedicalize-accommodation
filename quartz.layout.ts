import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

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

  const FORM_SLUG = "Provide-Feedback-on-the-Advocacy-Paper"
  const STORAGE_KEY = "mcipa.feedbackContext"
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
    const compact = quote.replace(/\s+/g, " ").trim()
    const preview = compact.slice(0, 80)
    if (preview.length === 0) {
      return "Give feedback on this passage"
    }

    const suffix = compact.length > 80 ? "..." : ""
    return 'Give feedback on the passage beginning "' + preview + suffix + '"'
  }

  const normalizeText = (text) => {
    return (text || "").replace(/\s+/g, " ").trim()
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

    const headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6")
    let nearest = ""

    headings.forEach((heading) => {
      if (heading.offsetTop <= el.offsetTop) {
        nearest = heading.textContent?.trim() ?? ""
      }
    })

    return nearest
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
      const blockId = currentSelectionContext.blockId
      const pageUrl = canonicalPageUrlFromLocation()
      const pageTitle = document.querySelector("article h1")?.textContent?.trim() || document.title
      const blockUrl = buildBlockLink(pageUrl, blockId)
      const sectionHeading = getNearestHeadingText(block)
      const textFragmentUrl = buildTextFragmentLink(pageUrl, currentSelectionContext.selectedText)

      const payload = {
        feedbackType: "selection",
        pageTitle,
        pageUrl,
        sectionHeading,
        blockId,
        blockUrl,
        textFragmentUrl,
        quotedText: currentSelectionContext.selectedText,
        selectedText: currentSelectionContext.selectedText,
        fullBlockText: currentSelectionContext.fullBlockText,
        startContext: currentSelectionContext.startContext,
        endContext: currentSelectionContext.endContext,
      }

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
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
    const feedbackBlocks = document.querySelectorAll("article [data-feedback-block=\\"true\\"]")
    cleanupExistingControls()

    feedbackBlocks.forEach((block) => {
      const blockId = block.getAttribute("id")
      if (!blockId) return

      if (block.closest("nav, footer, .page-footer")) {
        return
      }

      const rawText = block.textContent?.trim() ?? ""
      const quotedText = rawText.replace(/\s+/g, " ").trim().slice(0, 1800)
      const sectionHeading = getNearestHeadingText(block)
      const pageUrl = canonicalPageUrlFromLocation()
      const blockUrl = buildBlockLink(pageUrl, blockId)
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
          textFragmentUrl,
          quotedText,
        }

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
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
      block.insertAdjacentElement("afterend", wrapper)
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

.feedback-form {
  display: grid;
  gap: 0.8rem;
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
`

  FeedbackHydration.afterDOMLoaded = `
(() => {
  if (window.__mcipaFeedbackFormHydrationInitialized) {
    return
  }
  window.__mcipaFeedbackFormHydrationInitialized = true

  const STORAGE_KEY = "mcipa.feedbackContext";
  const FORM_PATH = "/Provide-Feedback-on-the-Advocacy-Paper";

  const normalizePath = (path) => {
    let normalized = path || "/";
    while (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  };

  const isFeedbackPage = () => {
    return normalizePath(window.location.pathname).toLowerCase() === FORM_PATH.toLowerCase();
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

  const hydrateFeedbackForm = () => {
    if (!isFeedbackPage()) {
      return;
    }

    const statusEl = document.querySelector("#feedback-context-status");
    const missingEl = document.querySelector("#feedback-context-missing");
    const fromPassageEl = document.querySelector("#feedback-context-from-passage");

    let payload = null;
    try {
      payload = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      payload = null;
    }

    if (!payload || typeof payload !== "object") {
      if (statusEl) statusEl.textContent = "Context not found in this browser session.";
      if (missingEl) missingEl.hidden = false;
      if (fromPassageEl) fromPassageEl.hidden = true;
      return;
    }

    if (statusEl) statusEl.textContent = "Context loaded from selected passage.";
    if (missingEl) missingEl.hidden = true;
    if (fromPassageEl) fromPassageEl.hidden = false;

    setText("#feedback-page-title", payload.pageTitle || "");
    setText("#feedback-page-url", payload.pageUrl || "");
    setText("#feedback-section-heading", payload.sectionHeading || "");
    setText("#feedback-block-id", payload.blockId || "");
    setText("#feedback-block-url", payload.blockUrl || "");
    setText("#feedback-text-fragment-url", payload.textFragmentUrl || "Not generated");
    setText("#feedback-quoted-text", payload.quotedText || "");
    setText("#feedback-selected-text", payload.selectedText || "");
    setText("#feedback-full-block-text", payload.fullBlockText || "");
    setText("#feedback-start-context", payload.startContext || "");
    setText("#feedback-end-context", payload.endContext || "");

    setValue("#field-feedback-type", payload.feedbackType || "passage");
    setValue("#field-page-title", payload.pageTitle || "");
    setValue("#field-page-url", payload.pageUrl || "");
    setValue("#field-section-heading", payload.sectionHeading || "");
    setValue("#field-block-id", payload.blockId || "");
    setValue("#field-block-url", payload.blockUrl || "");
    setValue("#field-text-fragment-url", payload.textFragmentUrl || "");
    setValue("#field-quoted-text", payload.quotedText || "");
    setValue("#field-selected-text", payload.selectedText || "");
    setValue("#field-full-block-text", payload.fullBlockText || "");
    setValue("#field-start-context", payload.startContext || "");
    setValue("#field-end-context", payload.endContext || "");
  };

  hydrateFeedbackForm();
  document.addEventListener("nav", hydrateFeedbackForm);
})()
`

  return FeedbackHydration
}

/**
 * Quartz 4 layout for mcipa-demedicalize-accommodation.
 * Default layout — adjust as content structure grows.
 */

// Components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [PassageFeedbackControls(), FeedbackFormHydration()],
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
    Component.DesktopOnly(Component.Explorer()),
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
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
