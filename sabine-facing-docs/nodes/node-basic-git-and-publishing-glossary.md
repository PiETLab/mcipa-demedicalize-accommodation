# Basic Git and Publishing Glossary

## Purpose

Provide plain-language definitions for the core terms used in the MCIPA publishing workflow.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

## Core terms


commit-and-push
commit-and-sync

| Term                        | Plain-language meaning                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Obsidian vault              | The local project folder opened in Obsidian where content is edited.                                                                                             |
| Note                        | A Markdown file inside the vault.                                                                                                                                |
| Local working copy          | The project files on your own computer.                                                                                                                          |
| Repository                  | The GitHub project that stores the files, version history, and publishing workflow.                                                                              |
| GitHub                      | The website/service that hosts the repository.                                                                                                                   |
| Commit                      | A saved bundle of changes with a short message describing what changed.                                                                                          |
| Push                        | Send your committed local changes from your computer to GitHub.                                                                                                  |
| Pull                        | Bring changes from GitHub back down to your computer. In this MVP, this is usually a guided exception rather than a routine step.                                |
| Sync                        | A general word for making sure local and GitHub copies are aligned.                                                                                              |
| Main                        | The routine working branch used in this MVP.                                                                                                                     |
| Branch                      | A separate line of work in Git. The MVP avoids routine branch work for the Content Operator.                                                                     |
| Remote                      | The GitHub copy of the repository that your local vault connects to.                                                                                             |
| Origin                      | The default name for that connected GitHub remote.                                                                                                               |
| Obsidian Git plugin         | The Obsidian plugin that lets you commit and push from inside Obsidian.                                                                                          |
| Quartz                      | The site generator that turns Markdown content into a publishable website.                                                                                       |
| Build-and-Publish Step      | The automated GitHub Actions process that converts source files into website output and publishes it.                                                            |
| GitHub Actions              | GitHub's automation system that runs the build and publish workflow.                                                                                             |
| Public site                 | The website that readers see after Quartz builds and publishes the content.                                                                                      |
| Issue                       | A tracked item in GitHub for a problem, task, question, or request.                                                                                              |
| Label                       | A category marker applied to an issue.                                                                                                                           |
| Authentication              | Proving who you are so GitHub accepts your pull/push requests.                                                                                                   |
| Personal Access Token (PAT) | A GitHub token that can be used instead of a password for HTTPS authentication.                                                                                  |
| Merge conflict              | A situation where Git cannot automatically combine competing changes. In this MVP, the Content Operator should escalate instead of resolving conflicts manually. |
| Guided reverse pathway      | The rare, coordinated case where a change made in GitHub must be received back into the local vault.                                                             |

## Practical reminders

- `Commit` means save a bundle of changes locally with a message.
- `Push` means publish those committed changes to GitHub.
- `Pull` does not mean "start work" in this MVP; it is mainly for setup, repair, recovery, or coordinated updates.

## Related modules

- [Publishing Workflow Guide](node-publishing-workflow-guide.md)
- [Configure Obsidian Git Connection and Auth](node-configure-obsidian-git-connection-and-auth.md)
- [Have a Look Around Your New Obsidian Vault](node-look-around-your-new-obsidian-vault.md)
- [Issue Handling Guide](node-issue-handling-guide.md)
