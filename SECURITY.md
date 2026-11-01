# Security policy

## Supported versions

AStack is in public beta. Security fixes are released for the latest published version of each `@astack-tech/*` package only.

| Version            | Supported |
| ------------------ | --------- |
| Latest beta on npm | Yes       |
| Older releases     | No        |

## Reporting a vulnerability

Do not open a public issue for a security problem.

Report it privately through [GitHub private vulnerability reporting](https://github.com/astack-tech/astack/security/advisories/new). Include the affected package and version, steps to reproduce, and the impact you expect.

You can expect an acknowledgement within 7 days. We will tell you whether the report is accepted, work on a fix in a private advisory, and credit you in the advisory unless you ask us not to.

## Known limitations

`RLMAgent` in `@astack-tech/components` runs model-written JavaScript in a Node.js `vm` context. A `vm` context is not a security boundary. Use RLM only with trusted inputs, or isolate it in its own process or container. Reports that only restate this limitation are out of scope.
