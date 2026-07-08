# Vault Setup and Naming

## Purpose

Set up a clean, dedicated area for Obsidian vaults.
This step also establishes the parent directory that all vaults live in, which protects later clone and sync steps from folder-path mistakes.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

## Preconditions

- Obsidian is installed on your local machine.
- You are following the instructions below.
- You can create or open the local vault folder named `mcipa-demedicalize-accommodation-bootstrap`.

## Directory guidance

You can place the vault anywhere in principle, but use a stable, easy-to-find location.

Note: the path examples in this guide are shown in macOS style, but the same directory strategy works on Windows.

Recommended practice:

1. Use a Documents-area location.
2. If you manage multiple vaults, create one umbrella folder for all vaults.
3. When you create project vaults in the future, create them as subfolders inside that umbrella.


Suggested pattern:

- `Documents/Vaults/<project-vault-name>`

Example:

- `Documents/Vaults/mcipa-demedicalize-accommodation`

	(but do not create this vault yet)

## Instructions

1. Decide where all vaults will live and create the shared parent `Vaults` directory if it does not already exist.
2. Ensure there is **not** a project folder named `mcipa-demedicalize-accommodation-bootstrap` already there. If so, rename it or relocate it.

## Naming and usage rules

- Keep one dedicated project vault boundary.
- Do not change the vault location or vault name during normal workflow; this can break links, sync assumptions, and publishing steps.
- If a location/name change is unavoidable, consult Tier-Experienced support first and execute the change only with guided update steps.
- Treat the parent `Vaults` directory as part of the setup contract, not as an optional convenience.

## Verify success

- Vault opens cleanly in Obsidian.
- Vault folder name is exactly `mcipa-demedicalize-accommodation-bootstrap`.
- Fresh-vault baseline is preserved (no unexpected extra project folders/files added yet).
- No unrelated personal project content is mixed into this vault.

## Escalate when

- A folder named `mcipa-demedicalize-accommodation-bootstrap` already exists and you are unsure whether it is the cloned repository folder or a separate manually created vault.
- You cannot create the vault in the intended location because of permission/path errors.
- Obsidian cannot open the new vault cleanly.
- You believe the vault location or name must be changed after setup.

## Related modules

- [Pathway: Tier-Intro Initial Setup](path-tier-intro-setup-I.md)
- [Connect Local Obsidian Vault to GitHub Repository](node-connect-local-obsidian-to-github.md)
