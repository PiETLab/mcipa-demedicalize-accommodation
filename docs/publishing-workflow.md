# Publishing Workflow

This document describes the routine workflow for editing and publishing content changes.

## Overview

```
Edit → Commit → Push → Verify
```

## Step-by-step

### 1. Edit

Open the file you want to change in your editor (e.g. VS Code, Obsidian, or any text editor).

- Content files live in the `content/` folder.
- Files use Markdown (`.md`) format.
- See [naming-conventions.md](naming-conventions.md) for file naming rules.

**Tip:** To preview locally before publishing, run:
```bash
npm run preview
# Opens http://localhost:8080
```

### 2. Commit

After making your edits, commit the changes with a clear, short message.

**In VS Code (Source Control panel):**
1. Open the Source Control panel (`Ctrl+Shift+G` / `Cmd+Shift+G`).
2. Stage your changes (click `+` next to changed files).
3. Type a commit message, e.g. `Update prototype-status page`.
4. Click ✓ to commit.

**In Terminal:**
```bash
git add content/my-changed-file.md
git commit -m "Update my-changed-file: describe the change briefly"
```

**Commit message tips:**
- Keep it under 72 characters.
- Start with a verb: `Add`, `Update`, `Fix`, `Remove`.
- Be specific enough to understand in 6 months.

### 3. Push

Push your commit to GitHub to trigger the site rebuild.

**In VS Code:** Click the **Sync Changes** button (↑↓ icon in the Source Control panel).

**In Terminal:**
```bash
git push
```

### 4. Verify

1. Go to the **Actions** tab in the repository:
   `https://github.com/PiETLab/mcipa-demedicalize-accommodation/actions`
2. You should see a new workflow run starting (yellow dot = in progress, green = success, red = failed).
3. Once the workflow is green, visit the live site to confirm your changes appear.
   - Site URL: `https://pietlab.github.io/mcipa-demedicalize-accommodation/`
   - Allow 1–3 minutes for the build and cache to update.

## Troubleshooting

If something goes wrong, see [troubleshooting.md](troubleshooting.md).

## Summary cheatsheet

| Step | VS Code | Terminal |
|------|---------|----------|
| Stage | Click `+` next to file | `git add <file>` |
| Commit | Type message, click ✓ | `git commit -m "message"` |
| Push | Click Sync Changes | `git push` |
| Verify | Check Actions tab | `https://github.com/PiETLab/.../actions` |
