### GitHub service account administration

#### Service account

GitHub username: `mcipa-dma-feedback-bot`

Purpose: Dedicated service account used by the MCIPA public feedback system to create GitHub issues in `PiETLab/mcipa-demedicalize-accommodation`.

Repository access: Outside collaborator with Triage access to `PiETLab/mcipa-demedicalize-accommodation`.

#### Account control

The service account is currently controlled by the PiETLab Principal Investigator/project lead.

The account credentials and two-factor authentication credentials are stored in the designated 1Password account.

#### Account recovery

GitHub two-factor authentication recovery codes are stored securely in 1Password with the service account credentials.

The email address currently associated with the account is controlled by the project lead. This may later be changed to a project-controlled email address to improve continuity.

#### Token management

The service account uses a GitHub personal access token (classic) with the `public_repo` scope for the MCIPA public feedback service.

The service account itself has only Triage access to the MCIPA repository.

The project lead is currently authorized to create, rotate, and revoke the token.

The token used by the production service is stored as a Cloudflare Worker secret and must not be stored in the source repository, documentation, or application code.

A backup copy of the token is currently stored securely in 1Password.

The token expiration date is: 2027-07-17

The token should be rotated before its expiration date and immediately if compromise is suspected.

#### Change of project leadership or account responsibility

If responsibility for MCIPA or PiETLab changes, control of the service account must be transferred to the designated successor.

The transition should include:

1. transferring access to the service account credentials and recovery information;
2. changing the account's primary email address to an address controlled by the successor or project;
3. reconfiguring two-factor authentication as appropriate;
4. generating new GitHub recovery codes and invalidating the previous codes;
5. revoking the existing GitHub personal access token;
6. generating a new token under the successor's administrative control;
7. replacing the `GITHUB_TOKEN` secret in the Cloudflare Worker;
8. verifying that the public feedback system can still create issues;
9. removing the previous project lead's access to the service account and credentials.

Where possible, the service account should eventually use a project-controlled email address and shared institutional credential-management arrangements rather than credentials tied exclusively to an individual.