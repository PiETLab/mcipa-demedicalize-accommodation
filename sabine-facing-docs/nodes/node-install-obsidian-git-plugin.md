# Install Obsidian Git Plugin

## Purpose

Install the Obsidian Git plugin so that commit-and-push can be performed from inside Obsidian.

## Audience

Content Operator (Sabine).

## How it works

Obsidian Git runs Git commands against the currently opened vault folder.
In this workflow, that vault folder is the local working copy of the project repository.
Installing the plugin does not by itself initialize a Git repository.

## Preconditions

- Obsidian is installed and can open the cloned project vault.
- Internet connection is available.

## Steps

1. Open Obsidian.
2. Open Settings.
3. Go to Community plugins.
4. If Restricted mode is enabled, select `Turn on community plugins`.
5. If prompted with the backup warning, confirm and continue.
6. Browse plugins and search for Git.
7. Select Obsidian Git and install it.
8. Enable the plugin. 
9. Make a small edit to `content/index.md` for testing purposes.
10. Look in the bottom corner, you should see
    ![[/sabine-facing-docs/nodes/node-install-obsidian-git-plugin/IMG-20260702130226382.png]]

11. Open command pallete (Cmd+P)  or this icon on the vertical left ribbon
    ![[/sabine-facing-docs/nodes/node-install-obsidian-git-plugin/IMG-20260702192735781.png]]


12. Start typing `Git:commit` and select that command.
    You should see this 
    ![[/sabine-facing-docs/nodes/node-install-obsidian-git-plugin/IMG-20260702193133695.png]]

13. Now start typing `Git:push`.
    You should see this
    ![[/sabine-facing-docs/nodes/node-install-obsidian-git-plugin/IMG-20260702193223869.png]]


14. You can use `Git:commit-and-sync` as a short cut for these two steps.


These obsidian commands can now replace `Github Desktop`.  You can close that app now.


### Some Possible Warning


    ![[/sabine-facing-docs/nodes/node-install-obsidian-git-plugin/IMG-20260701224756687.png]]





## Verify success

- Obsidian Git appears in installed/enabled plugins.
- Git commands are available from Obsidian Git command palette entries.
- plugin remains enabled after closing/reopening Settings.

## Escalate when

- Community plugins cannot be enabled due to policy restrictions.
- Plugin install fails repeatedly.
- Plugin installs but does not load.

## Related modules

- [Connect Local Obsidian Vault to GitHub Repository](/sabine-facing-docs/nodes/node-connect-local-obsidian-to-github.md)
- [First Edit, Commit, Push, and Verify Site Update](/sabine-facing-docs/nodes/node-first-edit-commit-push-verify.md)
