# Troubleshooting

Common problems and how to fix them.

---

## Authentication / push friction

### Problem: Git asks for a password every time I push

**Cause:** Git is not caching your credentials, or you are using HTTPS without a credential helper.

**Fix options:**

1. **Use a Personal Access Token (PAT) with credential caching:**
   ```bash
   git config --global credential.helper store
   # Then push once and enter your GitHub username + PAT when prompted
   # (Do NOT use your GitHub password — use a PAT)
   ```
   Generate a PAT at: `https://github.com/settings/tokens`
   Scopes needed: `repo` (full control of private repositories)

2. **Use SSH instead of HTTPS:**
   - Generate an SSH key: `ssh-keygen -t ed25519 -C "your@email.com"`
   - Add the public key to GitHub: `https://github.com/settings/keys`
   - Change your remote URL:
     ```bash
     git remote set-url origin git@github.com:PiETLab/mcipa-demedicalize-accommodation.git
     ```

3. **VS Code:** Use the [GitHub Pull Requests and Issues extension](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) to authenticate once via the browser.

---

### Problem: `git push` fails with "Permission denied" or "403 Forbidden"

**Cause:** Your credentials don't have write access to the repository, or your PAT has expired.

**Fix:**
1. Confirm you are a collaborator with write access.
2. Generate a new PAT and re-authenticate (see above).
3. If using SSH, ensure your SSH key is added to GitHub.

---

## Push failures

### Problem: `git push` fails with "rejected — non-fast-forward"

**Cause:** Someone else (or a workflow) pushed to `main` after your last pull.

**Fix:**
```bash
git pull --rebase
git push
```
This replays your local commits on top of the latest remote commits.

---

### Problem: `git push` fails with "remote: Repository not found"

**Cause:** Wrong remote URL or repository renamed.

**Fix:**
```bash
git remote -v   # check current remote URL
git remote set-url origin https://github.com/PiETLab/mcipa-demedicalize-accommodation.git
```

---

## Site update delays

### Problem: I pushed, the Actions workflow went green, but the site hasn't updated

**Possible causes and fixes:**

1. **Browser cache:** Hard-refresh the page (`Ctrl+Shift+R` / `Cmd+Shift+R`) or open in an incognito window.

2. **GitHub Pages cache:** GitHub Pages can take 1–5 minutes to serve new content. Wait and refresh.

3. **CDN propagation:** Rarely, cached content takes up to 10 minutes to clear globally. Wait and try again.

4. **Wrong page URL:** Make sure you are visiting the correct URL for the updated page.

---

### Problem: The Actions workflow failed (red ✗)

**Fix:**
1. Go to the **Actions** tab: `https://github.com/PiETLab/mcipa-demedicalize-accommodation/actions`
2. Click the failed run → click the failed job → read the error message.
3. Common causes:
   - **Quartz build error:** A Markdown file has invalid frontmatter (check for unclosed `---` blocks or special characters in the `title:` field).
   - **Node version mismatch:** Ensure `package.json` engines field matches the workflow Node version.
   - **Missing file reference:** A wikilink (`[[page]]`) points to a file that doesn't exist.
4. Fix the issue, commit, and push again.
5. If stuck, open a [site infrastructure issue](https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/new?template=site-infrastructure.yml).

---

## Quartz / local preview

### Problem: `npm run preview` fails with "command not found: npx"

**Fix:** Install Node.js (v20+) from [https://nodejs.org/](https://nodejs.org/).

---

### Problem: Local preview shows a blank page or 404

**Fix:**
1. Check that `content/index.md` exists.
2. Run `npx quartz build` first, then `npx quartz build --serve`.
3. Check the terminal for Quartz error output.

---

## Still stuck?

Open a [site infrastructure issue](https://github.com/PiETLab/mcipa-demedicalize-accommodation/issues/new?template=site-infrastructure.yml) with the error message and workflow run URL.
