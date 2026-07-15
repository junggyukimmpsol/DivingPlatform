import { File } from 'node:buffer'
import express from 'express'
import multer from 'multer'

const app = express()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
})

const PORT = process.env.PORT || 3000
const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1'

const requireProxyToken = (request, response, next) => {
  if (!process.env.PROXY_TOKEN) {
    next()
    return
  }

  const expected = `Bearer ${process.env.PROXY_TOKEN}`
  if (request.get('authorization') !== expected) {
    response.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}

app.get('/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/', (_request, response) => {
  response.json({
    ok: true,
    service: 'parks-local-diving-openai-image-proxy',
    endpoints: {
      health: '/health',
      enhance: 'POST /enhance',
    },
  })
})

const handleEnhance = async (request, response) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      response.status(500).json({ error: 'OPENAI_API_KEY is not configured on the proxy server.' })
      return
    }
    if (!request.file) {
      response.status(400).json({ error: 'image[] file is required.' })
      return
    }

    const imageModel = request.body.model || OPENAI_IMAGE_MODEL
    const formData = new FormData()
    formData.append('model', imageModel)
    formData.append('prompt', request.body.prompt || 'Enhance this underwater scuba diving photo naturally.')
    formData.append(
      'image[]',
      new File([request.file.buffer], request.file.originalname || 'underwater-photo.jpg', {
        type: request.file.mimetype || 'image/jpeg',
      }),
    )
    formData.append('output_format', request.body.output_format || 'jpeg')
    formData.append('quality', request.body.quality || 'medium')
    formData.append('size', request.body.size || 'auto')
    formData.append('output_compression', request.body.output_compression || '92')

    if (request.body.input_fidelity && !imageModel.startsWith('gpt-image-2')) {
      formData.append('input_fidelity', request.body.input_fidelity)
    }

    const openAiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    })

    const data = await openAiResponse.json()
    if (!openAiResponse.ok) {
      response.status(openAiResponse.status).json({
        error: data?.error?.message || 'OpenAI image edit request failed.',
        detail: data,
      })
      return
    }

    const b64Json = data?.data?.[0]?.b64_json
    if (!b64Json) {
      response.status(502).json({ error: 'OpenAI did not return an image.', detail: data })
      return
    }

    response.json({
      b64_json: b64Json,
      mimeType: 'image/jpeg',
    })
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

app.post('/enhance', requireProxyToken, upload.single('image[]'), handleEnhance)
app.post('/', requireProxyToken, upload.single('image[]'), handleEnhance)

app.listen(PORT, () => {
  console.log(`OpenAI image proxy listening on port ${PORT}`)
})
