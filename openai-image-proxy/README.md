# OpenAI Image Proxy

Cloudflare Workers can sometimes call OpenAI from an egress region that OpenAI rejects with:

```text
Country, region, or territory not supported
```

Deploy this tiny proxy to a supported region, then point the Cloudflare Worker to it.

## Deploy on Render

1. Push this repository to GitHub.
2. In Render, create a new Web Service from the same repository.
3. Set the root directory to:

```text
openai-image-proxy
```

4. Set:

```text
Build Command: npm install
Start Command: npm start
Region: Oregon or another supported US region
```

5. Add environment variables in Render:

```text
OPENAI_API_KEY=your OpenAI API key
PROXY_TOKEN=a long random value
OPENAI_IMAGE_MODEL=gpt-image-1-mini
```

Generate `PROXY_TOKEN` locally with:

```bash
openssl rand -base64 32
```

6. After deploy, test:

```text
https://your-render-service.onrender.com/health
```

It should return:

```json
{ "ok": true }
```

## Connect Cloudflare Worker

In the main project root, set these secrets:

```bash
npx wrangler secret put OPENAI_IMAGE_PROXY_URL
npx wrangler secret put OPENAI_IMAGE_PROXY_TOKEN
```

Use this value for `OPENAI_IMAGE_PROXY_URL`:

```text
https://your-render-service.onrender.com/enhance
```

Use the same `PROXY_TOKEN` value that you set in Render.

Then deploy again:

```bash
npm run build
npx wrangler deploy
```
