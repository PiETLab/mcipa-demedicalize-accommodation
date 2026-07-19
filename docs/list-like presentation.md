# Design Note: Use Semantic Lists for List-Like Content

## Purpose

When writing Markdown for publication on the website, authors should use Markdown list syntax whenever the content represents a sequence or collection of related items.

This guidance improves accessibility, preserves document semantics, and ensures that the generated HTML accurately reflects the structure of the content.

## Why this matters

Screen readers and other assistive technologies rely on the underlying HTML structure—not just the visual appearance of the page.

A properly marked-up ordered (`<ol>`) or unordered (`<ul>`) list allows assistive technologies to announce information such as:

- that a list is beginning;
- how many items it contains; and
- the boundaries between individual items.

This makes the content easier to understand and navigate.

If a document instead consists of ordinary paragraphs that begin with manually typed numbers (for example, `1.` or `2.`), the generated HTML typically contains only paragraphs rather than list elements. Although the content may appear visually identical, the semantic structure is lost, and automated accessibility evaluations may correctly identify the content as "list-like" but not marked up as a list.

## Author Guidance

If the content can naturally be introduced with wording such as:

> "The following findings are..."

or

> "The recommendations are..."

then it should normally be written as a Markdown list.

For example:

```markdown
1. First finding.
2. Second finding.
3. Third finding.
```

rather than:

```markdown
1\. First finding.

2\. Second finding.

3\. Third finding.
```

Escaping the period (`1\.`) or otherwise preventing Markdown from recognizing a list changes only the parsing behavior. It does **not** improve accessibility and removes the semantic information that assistive technologies depend upon.

## Choosing Between Lists and Headings

Use a **list** when the items are:

- members of a single collection;
- recommendations, findings, principles, requirements, or steps;
- relatively concise; and
- intended to be read together.

Use **headings** instead when each item represents a substantial section containing multiple paragraphs, figures, tables, or subsections.

## Summary

Authors should not avoid Markdown list syntax merely to silence accessibility warnings or achieve a particular visual layout. If the content is conceptually a list, it should be authored as a semantic Markdown list so that the generated HTML contains the appropriate `<ol>` or `<ul>` elements.

Visual presentation should be controlled through CSS rather than by removing semantic HTML. If a different visual appearance is desired, authors should retain the semantic list in the Markdown and adjust the styling of the generated list using CSS.