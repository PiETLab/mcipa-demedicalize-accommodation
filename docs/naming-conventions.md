# Naming Conventions

This document defines the file and folder naming rules for content in this repository.

## Rules

### 1. Lowercase

All file and folder names must be **lowercase**.

✅ `accommodation-process.md`
❌ `Accommodation-Process.md`
❌ `AccommodationProcess.md`

### 2. Hyphenated (no spaces or underscores)

Use **hyphens** (`-`) to separate words. No spaces, no underscores.

✅ `key-actors.md`
❌ `key actors.md`
❌ `key_actors.md`

### 3. URL-safe characters only

Use only letters, numbers, and hyphens. No special characters, accented letters, or punctuation in filenames.

✅ `tier-1-introduction.md`
❌ `tier–1–introduction.md` (em dashes)
❌ `tier 1 intro & overview.md`

### 4. Dated files: `YYYY-MM-DD` prefix

For files that are tied to a specific date (meeting notes, updates, announcements), use the ISO 8601 date as a prefix.

✅ `2024-06-01-stakeholder-meeting-notes.md`
✅ `2024-09-15-policy-update.md`
❌ `June-1-2024-meeting.md`
❌ `meeting-notes-latest.md` (ambiguous)

## Folder naming

The same rules apply to folder names: lowercase, hyphenated, URL-safe.

✅ `content/accommodation-process/`
❌ `content/Accommodation Process/`

## Examples

| Purpose | ✅ Good name | ❌ Bad name |
|---------|-------------|------------|
| Topic page | `accommodation-process.md` | `AccommodationProcess.md` |
| Meeting notes | `2024-06-01-meeting-notes.md` | `MeetingNotes-June2024.md` |
| Policy page | `tier-1-introduction.md` | `Tier_1_Intro.md` |
| Subfolder | `key-actors/` | `Key Actors/` |

## Why these rules matter

Quartz renders filenames as URLs. Spaces, uppercase, and special characters in filenames can break links, cause 404 errors, or make URLs hard to share.
