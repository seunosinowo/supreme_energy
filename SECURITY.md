# Security

Report suspected vulnerabilities privately to info@supreme-energy.com.ng.
Include reproduction steps and affected versions; do not publish credentials
or customer details in public issues.

No environment secrets are needed for this application. All `.env*` files are ignored
by Git, and environment files are excluded
from the Docker build context. `NEXT_PUBLIC_*` values are visible in client
bundles and must never contain secrets.

If a credential has ever been published, revoke or rotate it with its provider.
Ignoring or deleting a file cannot revoke a credential or erase existing Git
history. Coordinate any required history cleanup with repository maintainers.

Dependabot checks npm packages and GitHub Actions weekly. CI runs `npm audit`
and fails on high or critical findings. Investigate failures and update affected
packages; do not disable the check to obtain a green build.

Quote details remain in browser memory and in the downloaded PDF. The quote
builder does not transmit or persist requests. Treat downloaded estimates as
personal information. Any future email API needs server-side validation,
request-size limits, abuse prevention and private server-side credentials.
