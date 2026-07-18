### Cloudflare account administration

#### Account

Purpose: Dedicated Cloudflare account used to host infrastructure for PiETLab projects, initially the MCIPA public feedback service.

Cloudflare account name: `mbaljko@icloud.com`  (==change this later==)

Initial service: MCIPA public feedback Cloudflare Worker

Worker name: `mcipa-feedback` [confirm after creation]

#### Account control

The Cloudflare account is currently controlled by the PiETLab Principal Investigator/project lead.

The account is registered using an alternate personal email address controlled by the project lead. This address is also currently used as the administrative email address for the `mcipa-dma-feedback-bot` GitHub service account.

The Cloudflare account uses credentials separate from the GitHub service account. The Cloudflare and GitHub passwords must not be shared or reused.

Cloudflare account credentials are stored securely in 1Password.

#### Account recovery

The email address associated with the Cloudflare account is controlled by the project lead and can receive account verification, security, and password-recovery messages.

Any two-factor authentication credentials and recovery codes configured for the Cloudflare account should be stored securely in 1Password with the Cloudflare account credentials.

#### Infrastructure ownership

The Cloudflare account is designated for PiETLab infrastructure rather than the project lead's unrelated personal Cloudflare services.

The MCIPA public feedback Worker will be deployed within this account.

The Worker will store the GitHub personal access token as a Cloudflare Worker secret named:

`GITHUB_TOKEN`

The GitHub token must not be stored in the Worker source code, the GitHub repository, Quartz content, documentation, or client-side JavaScript.

#### Administrative responsibility

The project lead is currently responsible for:

- administering the Cloudflare account;
- managing Cloudflare account security;
- deploying and maintaining the MCIPA feedback Worker;
- managing Worker secrets;
- replacing the `GITHUB_TOKEN` secret when the GitHub token is rotated;
- adding or removing future Cloudflare account administrators as required.

#### Change of project leadership or account responsibility

If responsibility for PiETLab or the MCIPA infrastructure changes, administrative control of the Cloudflare infrastructure must be transferred to the designated successor.

The transition should include:

1. ensuring the successor has appropriate administrative access to the Cloudflare account;
2. transferring or updating the account recovery arrangements;
3. updating the account email address if appropriate;
4. reconfiguring two-factor authentication and recovery mechanisms as appropriate;
5. reviewing all active Workers and other Cloudflare resources;
6. rotating the GitHub token used by the MCIPA Worker;
7. replacing the Worker's `GITHUB_TOKEN` secret;
8. verifying that the MCIPA public feedback system continues to create GitHub issues successfully;
9. removing the previous project lead's administrative access when the transition is complete.

If PiETLab later obtains a durable project-controlled or institutional functional email address, the Cloudflare account's administrative and recovery arrangements should be reviewed and migrated where appropriate.

#### Relationship to the GitHub service account

The Cloudflare account and GitHub service account have distinct functions:

- **Cloudflare account:** hosts and operates the MCIPA public feedback Worker.
- **`mcipa-dma-feedback-bot`:** acts as the GitHub identity under which public-form submissions are created as issues.
- **Cloudflare Worker:** receives validated submissions from the MCIPA website and uses the securely stored GitHub token to create issues through the GitHub service account.

The use of the same alternate email address for account administration does not make the Cloudflare and GitHub accounts the same identity. They retain separate credentials, authentication mechanisms, permissions, and operational roles.