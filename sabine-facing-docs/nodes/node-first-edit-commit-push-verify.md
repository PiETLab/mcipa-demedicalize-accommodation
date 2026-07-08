# First Edit and 'commit-and-push' Operation

## Purpose

Set up the basic method for 'commit-and-push' using the Github Desktop. 
Run one full publishing cycle from local Obsidian.  
Verify that site rebuild/deploy propagation works.

## Audience

Content Operator (Sabine) and Infrastructure Steward (Melanie).

## Preconditions

- Local vault is connected to repository
- `Github Desktop` is open and you are logged into your github account. 

## Steps

1. In your browser, open up [https://pietlab.github.io/mcipa-demedicalize-accommodation/](https://pietlab.github.io/mcipa-demedicalize-accommodation/)
2. In the file `contents/index.md`, make a small, non-critical modification (like adding a word somewhere).
3. Go to the Github Desktop app.  You should see a visualization of the change you made in a "before vs after" type of format (this is called the `diff`)
4. In the bottom left corner, there is an area like this.  You can type in a comment under Description (e.g., "I added one word to test things out"). Then click `Commit 1 file to main`.
   ![[/sabine-facing-docs/nodes/node-first-edit-commit-push-verify/IMG-20260702182426866.png]]
   
   This completes the first part of 'commit-and-push'.
   
5. The you will see something like this below.  You can click `Push origin`
   ![[/sabine-facing-docs/nodes/node-first-edit-commit-push-verify/IMG-20260702182552618.png]]
   
   This completes the second part of 'commit-and-push'.
   
6. The top ribbon may show some actions happening. When the operation is complete, you will see `There are nouncommitted changes in this repository`.
7. Behind the scenes on Github.com, a workflow will start automatically to update the website.
   You can watch the action happening at [https://github.com/PiETLab/mcipa-demedicalize-accommodation/actions](https://github.com/PiETLab/mcipa-demedicalize-accommodation/actions) if you like
8. Refresh the website to check that it reflects the change.  It will take approximately 60-90 seconds for the change to take effect.

## Verify success

- commit is visible in repository history
- deploy workflow completes successfully
- edited content appears on public site

## Common failures

- push rejected due to remote updates
- push denied with a 403 or `Permission denied` error because the signed-in user does not have write access to the repository
- push succeeds but deploy workflow fails
- deploy succeeds but site does not yet reflect changes
- a coordinated reverse update is needed before routine work can resume

## Escalate when

- push rejection/conflict appears
- push is denied with a 403 or permission error
- deploy fails or site remains stale after expected delay
- repository access may not have been granted to your GitHub account yet

## Related nodes

- `node-connect-local-obsidian-to-github.md`
- `../nodes/node-publishing-workflow-guide.md`
- `../pathways/path-guided-reverse-pathway-receive-coordinated-update.md`
