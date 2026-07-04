# Brevo + Confirm Email Setup

One-time dashboard configuration so Collabify sends confirmation and password-reset emails
through Brevo. All steps are in the Brevo and Supabase dashboards - no code changes needed.

## 1. Brevo: get SMTP credentials

1. Create a Brevo account (https://www.brevo.com) if you do not have one.
2. Verify a sender: **Senders, Domains & Dedicated IPs > Senders > Add a sender**. Use an email
   you control (e.g. `no-reply@yourdomain.com`). Verify it. For best deliverability, also
   authenticate the domain (SPF/DKIM) under **Domains**.
3. Get the SMTP key: **SMTP & API > SMTP**. Note:
   - **SMTP server:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Login:** the login shown there (looks like `xxxxxx@smtp-brevo.com`)
   - **Password:** click **Generate a new SMTP key** and copy it (shown once).

## 2. Supabase: point auth email at Brevo

**Project Settings > Authentication > SMTP Settings** - enable **Custom SMTP** and set:

| Field | Value |
| --- | --- |
| Sender email | your verified Brevo sender (e.g. `no-reply@yourdomain.com`) |
| Sender name | `Collabify` |
| Host | `smtp-relay.brevo.com` |
| Port | `587` |
| Username | your Brevo SMTP login (`xxxxxx@smtp-brevo.com`) |
| Password | the Brevo SMTP key from step 1 |

Save.

## 3. Supabase: enable email confirmation

**Authentication > Providers > Email** - turn **Confirm email** ON. Save.

(After this, new signups must click the emailed link before they can log in. The app already
handles this: Register shows a "Confirm your email" screen, and Login offers a resend.)

## 4. Supabase: URL configuration

**Authentication > URL Configuration**:

- **Site URL:** your app URL. For local dev use `http://localhost:5173`. After deploying to
  Vercel, set it to the production URL.
- **Redirect URLs (allow list):** add both of these (and the Vercel equivalents later):
  - `http://localhost:5173/**`
  - `http://localhost:5173/auth/callback`
  - `http://localhost:5173/reset-password`

These must be allowed or the confirmation and reset links will be rejected.

## 5. Paste the branded email templates

**Authentication > Email Templates**:

- **Confirm signup** - paste `supabase/email-templates/confirm-signup.html`.
- **Reset password** - paste `supabase/email-templates/reset-password.html`.

Keep the `{{ .ConfirmationURL }}` placeholders intact - Supabase fills them in.

## 6. Test end to end (needs a real inbox)

Confirmation cannot be tested with `@example.com` addresses. Use a real email:

1. Register a new student -> app shows "Confirm your email".
2. Open the email (via Brevo) and click the link -> lands on `/auth/callback` -> routes to
   `/student`.
3. Try logging in before confirming -> app shows "Please confirm your email" with a resend.
4. On the login page use **Forgot password?** (or Settings > Security) -> reset email arrives ->
   `/reset-password` -> set a new password.

## Notes

- Brevo free tier sends a limited number of emails per day - fine for development.
- If emails land in spam, complete domain authentication (SPF/DKIM) in Brevo.
- Deliverability and template rendering aside, all app-side flows are already wired.
