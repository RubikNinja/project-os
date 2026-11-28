# Project OS — release readiness (Preview 63)

## What is included
- Preview 63 frontend: 16 tiered achievements (including two hidden), private account-synced showcase, earned title, celebration preference, animation quality settings.
- Showcase migration: private settings table and authenticated RPCs; earned badge validation against the existing durable ledger. Apply after Preview 57 achievement migration in staging first.
- Existing environments and project functionality are preserved; no new theme or paid access restriction.

## Required before accepting customers

### 1. Staging and security
- Obtain the deployed Cloudflare Worker source, service worker (`sw.js`), full Supabase schema, RLS policies, grants, security-definer RPC definitions and storage policies. Do not supply private keys or provider secrets in chat or commit them to GitHub.
- Verify the Worker validates each Supabase JWT server-side (signature, issuer, audience and expiry); never trust browser-provided identity, role, usage count or subscription status. Enforce per-account quotas atomically, bound request body sizes, set provider timeouts, and restrict origins as appropriate. Browser currently sends a bearer token, but that does not prove server verification.
- Audit every table and RPC using two independent accounts plus an unauthenticated client. Test read, write, delete and guessed project IDs across owned projects and workspaces; manager, collaborator, removed member and archived project cases; task dependencies, subtasks, recurring tasks and lesson access. Confirm storage policies for deliverables and profile images. Test account switching during in-flight saves.
- Test achievement credits against repeated completion, archived tasks, deleted projects, client tampering and shared work; current ledger is owned-project scoped and captures eligible records when refreshed, not a complete event history. Showcase is private and is not a paid entitlement.
- Inspect the service worker for cache versioning and ensure authenticated API responses, tokens and project contents are not cached by the app shell. Verify sign-out clears account-scoped in-memory data. Guest data has different storage behavior and needs explicit import/ownership testing.
- Review all rendered user/AI text and links for XSS, dependency pinning and supply-chain exposure; the current app uses inline scripts and CDN dependencies. Test a restrictive CSP in report-only mode before enforcing it; inline code requires a migration strategy.
- Verify backups, restore procedure, error logging without private project contents, account deletion, data export and retention.

### 2. Billing design (not implemented)
- Decide free vs paid features, price, billing interval, trial and cancellation behavior. Keep current access unchanged until decisions are confirmed.
- Choose payment provider, create test products/prices, and keep secret keys and webhook signing secrets exclusively in server-side environment variables.
- Implement authenticated server endpoints for checkout and customer portal; derive user identity from verified JWT. Maintain a private subscription mapping keyed by user ID; only verified server-side webhook processing can change paid entitlement. Deduplicate webhook event IDs and handle out-of-order events by reconciling provider state.
- Test checkout success/failure, renewals, past-due status, cancellation, refunds, duplicate events, replay, account isolation and reconciliation. The client can display entitlement, but cannot grant it. Gate premium API actions in the Worker/database, not with hidden buttons. Ensure users can retrieve/export their work after cancellation.
- Do not enable live checkout until policy, pricing and tests are approved.

### 3. Public launch
- Replace or license recognizable third-party artwork/characters in the Bikini Bottom theme before commercial distribution. Original artwork does not automatically clear rights to recognizable characters or designs.
- Configure custom domain, HTTPS, auth redirect URLs, transactional email delivery and account recovery. Keep separate staging/production environments.
- Test on mobile Safari, Android Chrome and desktop browsers. Measure CPU, GPU, memory, power and frame timing with each environment; the Preview 63 frame cap is a mitigation, not measured performance certification.
- Publish privacy notice, terms, support contact, clear pricing/cancellation terms and AI-data disclosure. Test signup through first project completion, workspace invitation, template reuse and payment lifecycle.
- Invite a small beta cohort; resolve defects before public rollout.

## Validation status
Eight inline scripts passed Node syntax checks. Isolated Chromium tests with mocked RPCs exercised badge reveal, featured badge, title, celebration preference, animation interval, unlock threshold and account isolation. No live Supabase SQL execution, deployed Worker audit, actual payments, full end-to-end browser suite or performance benchmark was performed.
