# Login and Diver Profile Setup

This project now includes:

- Email/password signup and login
- Email verification before login
- HttpOnly cookie sessions
- Diver profile storage in Cloudflare D1
- Diving certification image storage in Cloudflare R2
- Profile fields for height, weight, foot size, suit size, license details, and memo
- Free AI underwater photo enhancement tickets and downloads

## 1. Create Cloudflare resources

Run these from the project root:

```bash
npx wrangler d1 create divingplatform-db
npx wrangler r2 bucket create divingplatform-certificates
```

The D1 command prints a `database_id`. Copy it.

## 2. Update wrangler.jsonc

Open `wrangler.jsonc`, uncomment the `d1_databases` and `r2_buckets` blocks, then replace:

```text
REPLACE_WITH_D1_DATABASE_ID
```

with the real D1 `database_id`.

## 3. Set the auth secret

Run:

```bash
npx wrangler secret put AUTH_SECRET
```

Paste a long random value. You can generate one with:

```bash
openssl rand -base64 48
```

## 4. Create the database tables

Run:

```bash
npx wrangler d1 execute divingplatform-db --remote --file=./schema.sql
```

If you already created the database before email verification was added, run:

```bash
npx wrangler d1 execute divingplatform-db --remote --file=./migration_email_verification.sql
```

If you already created the database before photo enhancement was added, run:

```bash
npx wrangler d1 execute divingplatform-db --remote --file=./migration_photo_enhancement.sql
```

## 5. Set email verification sender

This project sends verification emails through the Resend Email API.

Create a Resend API key and set it as a Worker secret:

```bash
npx wrangler secret put RESEND_API_KEY
```

Set the sender address as a Worker variable:

```bash
npx wrangler secret put EMAIL_FROM
```

Use a value like:

```text
Parks Local Diving <no-reply@your-domain.com>
```

For production, verify your sending domain in Resend first. Resend's API sends email with `POST /emails`, using `from`, `to`, `subject`, and `html` fields.

## 6. Set OpenAI API access for AI photo enhancement

The photo enhancement feature can call OpenAI directly from the Cloudflare Worker:

```bash
npx wrangler secret put OPENAI_API_KEY
```

The photo enhancement feature uses OpenAI image editing from the Worker. The key must only be stored as a Worker secret.

If the site shows this error:

```text
Country, region, or territory not supported
```

use the proxy in `openai-image-proxy/` instead. This happens when Cloudflare sends the OpenAI request through a region that OpenAI rejects.

Deploy `openai-image-proxy/` to Render, Railway, or Cloud Run in a supported region, then set:

```bash
npx wrangler secret put OPENAI_IMAGE_PROXY_URL
npx wrangler secret put OPENAI_IMAGE_PROXY_TOKEN
```

`OPENAI_IMAGE_PROXY_URL` should include the `/enhance` path, for example:

```text
https://your-openai-image-proxy.onrender.com/enhance
```

When the proxy URL is configured, the Worker will use the proxy instead of calling OpenAI directly.

## 7. Deploy

Run:

```bash
npm run build
npx wrangler deploy
```

## Important privacy note

The profile stores personal information and license images. Before collecting real customer data, add a privacy policy and consent text to the signup flow, limit staff access, and keep only the fields that are genuinely needed for tour and rental preparation.
