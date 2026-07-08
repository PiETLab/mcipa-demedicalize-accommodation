# Authenticate Obsidian Git Plugin to Sync with GitHub.com

## Purpose

Configure Obsidian Git to use the cloned repository and verify pull/auth works.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

## Preconditions

- Vault folder is already a cloned Git repository
- Obsidian Git plugin is installed and enabled
- GitHub repository access is confirmed via Github Desktop


There are three ways to accomplish authentication: OAuth, https+personalized access tokens (PAT), or SSH+ssh key.  

We will deal only with OAuth there
## Steps

no, need to do this instead

You were right not to trust the “magic.”

GitHub Desktop OAuth creates credentials for GitHub Desktop, but Obsidian Git is not necessarily using that credential. Obsidian Git relies on the Git credential helper available to the Git process it invokes. GitHub’s own docs point users to either GitHub CLI auth or a credential helper for command-line Git authentication.  

So the easier user-friendly workflow is probably:

1. Install GitHub CLI: `gh`
2. Run:

```bash
gh auth login
```

3. Choose GitHub.com, HTTPS, browser login, and say yes when asked to authenticate Git with GitHub credentials.
4. Then test:

```bash
git pull
git push
```

5. Then test Obsidian Git.

That gives you browser-based OAuth, but aimed at command-line Git, not just GitHub Desktop. This is likely the better “non-technical user” path than PATs or SSH.




### Part A
1. Open GitHub Desktop if it is not already open.
2. Choose menu item `GitHub Desktop` -> `Settings` -> `Accounts`
3. Determine your status 
	1. If you are already signed in, great!  Skip to Part B below.
	2. If not, then you will now authenticate
		1. Under GitHub.com, "Sign in to your GitHub.com account to access your repositories" choose `Sign into GitHub.com`
		2. This will trigger the dialog box `Sign in Using Your Browser` - choose `Continue with Browser`
		3. Your browser will open and you will see a dialog `Authorize GitHub Desktop`, you should go ahead and authorize access
		4. Authentication will take place and you will get returned back to GitHub Desktop.


GitHub Desktop’s sign-in should now function as a shared authentication layer for Obsidian Git plugin in your obsidian vault. 
### Part B
Now we will test the authenticated connection.

1. Open the cloned vault in Obsidian.
2. Open Obsidian Git plugin settings.
3. Look for the `Custom base path (Git repository path)` setting near the bottom.
	- Leave this field blank. The repository is already at the vault root.
	- If Obsidian shows a `Base path does not exist` notice, stop and fix the path before continuing.
4. Do not change the remote unless something is wrong. A proper clone already creates `origin` for the project repository.
5. Authenticate in Obsidian when Git prompts you. ==THIS PART IS NOT WELL TESTED==
	- Use the HTTPS/browser/system keychain sign-in flow.
	- This is not a CLI task.
	- If GitHub Desktop is already signed in on your machine, it may have cached credentials that Obsidian can reuse, but you do not need GitHub Desktop to complete this step.


==need to rethink this step of pull - vs push to test.  single-source model==
1. Run a pull from Obsidian Git.
   - If the pull succeeds, that is the practical confirmation that `origin` is set correctly.
   - If the pull fails with a missing or wrong remote error, escalate instead of guessing.

## Verify success

- pull succeeds without repo/auth errors
- `origin` points to the project repository
- remote remains correctly configured after pull
- repository content appears in vault

## Common failures

- repeated authentication prompts
- permission denied
- wrong or missing remote origin

## Escalate when

- auth issues persist after credential check
- remote configuration appears broken
- pull fails repeatedly

## Related modules

- [One-Time Clone Setup](node-one-time-clone-setup.md)
- [First Edit, Commit, Push, and Verify Site Update](node-first-edit-commit-push-verify.md)
- [New User Auth and Access Checklist](node-new-user-auth-and-access-checklist.md)
