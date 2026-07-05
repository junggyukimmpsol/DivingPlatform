# Login and Diver Profile Setup

This project now includes:

- Email/password signup and login
- HttpOnly cookie sessions
- Diver profile storage in Cloudflare D1
- Diving certification image storage in Cloudflare R2
- Profile fields for height, weight, foot size, suit size, license details, and memo

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

## 5. Deploy

Run:

```bash
npm run build
npx wrangler deploy
```

## Important privacy note

The profile stores personal information and license images. Before collecting real customer data, add a privacy policy and consent text to the signup flow, limit staff access, and keep only the fields that are genuinely needed for tour and rental preparation.
