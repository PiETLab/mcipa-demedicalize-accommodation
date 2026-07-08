# One-Time Clone Setup

## Purpose

Create the local Git repository in the vault folder by cloning the remote repository.

## Audience

Content Operator (Sabine), with Infrastructure Steward (Melanie) support as needed.

## Why this method

Clone is the default method because it:

- creates `.git` correctly in one step
- sets `origin` automatically
- avoids common manual setup mistakes

## Preconditions

- Dedicated vault folder `mcipa-demedicalize-accommodation-bootstrap` exists inside the shared parent `Vaults` directory
- GitHub account access to the repository is confirmed
- Repository URL is known
- You can install GitHub Desktop or use Git CLI
- Tier-Experienced support is available if needed

## Steps


1. If GitHub Desktop is not installed, install it from `https://desktop.github.com/`.
2. Open GitHub Desktop and sign in.  (choose default values when you get initial dialogs)
3. Select `File` -> `Clone repository...`.
4. Under the `GitHub.com` tab, look under `Your Repositories`.  You should see one with the name `mcipa-demedicalize-accommodation/mcipa-demedicalize-accommodation`. Select it.  If you do not see it, escalate.
5. In the `Local Path` area, select the `Choose` button.
	1. At the top, there will be `Clone as`.  Leave that as `mcipa-demedicalize-accommodation-bootstrap`
	2. Choose the shared parent `Vaults` directory as the clone destination. Do not choose the vault folder itself.
	3. Then choose the `Select` button.
6. Click `Clone`
7. Confirm GitHub Desktop created a new folder named `mcipa-demedicalize-accommodation` inside the shared `Vaults` directory.
8. Confirm the cloned folder contains a hidden `.git` directory.
9. Now you can go to Obsidian and choose to open the folder `mcipa-demedicalize-accommodation` as a vault.  `File` -> `Open Vault` -> `Open Folder as Vault`

Note: cloning is meant to create a new repository folder in the chosen parent directory. Do not point the clone at an already-populated vault folder.

## Verify success

- look for the cloned folder, which will be subdirectory `Vaults/mcipa-demedicalize-accommodation/`
- cloned folder contains `.git`
- the folder `mcipa-demedicalize-accommodation/` opens in Obsidian without errors
- no existing vault files were overwritten; the repo was created as a new folder in the parent directory


## Escalate when

- clone fails due to auth/permission errors
- cloned folder name/path conflicts with existing folder
- repository URL is unclear

## Related modules

- [GitHub Account Setup](/sabine-facing-docs/nodes/node-github-account-setup.md)
- [Configure Obsidian Git Connection and Auth](/sabine-facing-docs/nodes/node-configure-obsidian-git-connection-and-auth.md)


## Alternatives
### Method B: Command line (CLI)

CLI is not required. Use either Method A (GitHub Desktop) or Method B (CLI).

1. Open terminal.
2. Navigate to the parent folder where the vault folder should live.
3. Run:
	`git clone <repository-url> mcipa-demedicalize-accommodation-bootstrap`
4. Confirm `.git` exists in `mcipa-demedicalize-accommodation-bootstrap`.
5. Open that cloned folder as the vault in Obsidian.
