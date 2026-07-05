type D1Result<T> = {
  results?: T[]
  success: boolean
  meta: unknown
}

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement
  first: <T = unknown>() => Promise<T | null>
  run: () => Promise<D1Result<unknown>>
  all: <T = unknown>() => Promise<D1Result<T>>
}

type D1Database = {
  prepare: (query: string) => D1PreparedStatement
}

type R2Bucket = {
  put: (key: string, value: ReadableStream | ArrayBuffer | string, options?: { httpMetadata?: { contentType?: string } }) => Promise<unknown>
  get: (key: string) => Promise<{ body: ReadableStream | null; httpMetadata?: { contentType?: string } } | null>
}

type Env = {
  DB?: D1Database
  CERT_BUCKET?: R2Bucket
  AUTH_SECRET?: string
}

type UserRow = {
  id: string
  email: string
  name: string
  password_hash: string
  password_salt: string
}

type ProfileRow = {
  user_id: string
  phone: string | null
  certification_agency: string | null
  certification_level: string | null
  certification_image_key: string | null
  height_cm: number | null
  weight_kg: number | null
  foot_size_mm: number | null
  preferred_suit_size: string | null
  memo: string | null
}

const SESSION_COOKIE = 'diving_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30
const MAX_CERTIFICATE_IMAGE_BYTES = 2 * 1024 * 1024
const MAX_CERTIFICATE_IMAGE_MB = MAX_CERTIFICATE_IMAGE_BYTES / 1024 / 1024

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...init.headers,
    },
  })

const requireBindings = (env: Env) => {
  if (!env.DB || !env.CERT_BUCKET || !env.AUTH_SECRET) {
    return json(
      {
        error:
          'Cloudflare D1/R2/AUTH_SECRET 설정이 필요합니다. README_LOGIN_SETUP.md 안내대로 리소스를 연결해주세요.',
      },
      { status: 503 },
    )
  }

  return null
}

const textEncoder = new TextEncoder()

const toBase64Url = (bytes: ArrayBuffer | Uint8Array) => {
  const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let binary = ''
  source.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
}

const randomToken = (bytes = 32) => {
  const array = new Uint8Array(bytes)
  crypto.getRandomValues(array)
  return toBase64Url(array)
}

const hashPassword = async (password: string, salt = randomToken(16)) => {
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: textEncoder.encode(salt),
      iterations: 120000,
    },
    key,
    256,
  )

  return { hash: toBase64Url(bits), salt }
}

const verifyPassword = async (password: string, hash: string, salt: string) => {
  const next = await hashPassword(password, salt)
  return next.hash === hash
}

const signSession = async (userId: string, secret: string) => {
  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  }
  const encodedPayload = toBase64Url(textEncoder.encode(JSON.stringify(payload)))
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(encodedPayload))
  return `${encodedPayload}.${toBase64Url(signature)}`
}

const verifySession = async (token: string | null, secret: string) => {
  if (!token) return null
  const [encodedPayload, encodedSignature] = token.split('.')
  if (!encodedPayload || !encodedSignature) return null

  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(encodedPayload))
  if (toBase64Url(signature) !== encodedSignature) return null

  const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as {
    sub?: string
    exp?: number
  }

  if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
  return payload.sub
}

const getCookie = (request: Request, name: string) => {
  const cookie = request.headers.get('cookie') || ''
  return cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=')
}

const sessionCookie = (token: string) =>
  `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`

const clearSessionCookie = () =>
  `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`

const getCurrentUserId = async (request: Request, env: Env) =>
  verifySession(getCookie(request, SESSION_COOKIE) || null, env.AUTH_SECRET || '')

const sanitizeNumber = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== 'string') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const sanitizeText = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

const publicUser = (user: UserRow, profile: ProfileRow | null) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  profile: {
    phone: profile?.phone || '',
    certificationAgency: profile?.certification_agency || '',
    certificationLevel: profile?.certification_level || '',
    hasCertificationImage: Boolean(profile?.certification_image_key),
    heightCm: profile?.height_cm || '',
    weightKg: profile?.weight_kg || '',
    footSizeMm: profile?.foot_size_mm || '',
    preferredSuitSize: profile?.preferred_suit_size || '',
    memo: profile?.memo || '',
  },
})

const getUserWithProfile = async (env: Env, userId: string) => {
  const user = await env.DB!.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>()
  if (!user) return null
  const profile = await env
    .DB!.prepare('SELECT * FROM diver_profiles WHERE user_id = ?')
    .bind(userId)
    .first<ProfileRow>()

  return publicUser(user, profile)
}

const saveProfile = async (env: Env, userId: string, form: FormData) => {
  let certificateKey = sanitizeText(form.get('existingCertificationImageKey'))
  const image = form.get('certificationImage')

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith('image/')) {
      return json({ error: '자격증 파일은 이미지 형식만 업로드할 수 있습니다.' }, { status: 400 })
    }
    if (image.size > MAX_CERTIFICATE_IMAGE_BYTES) {
      return json({ error: `자격증 이미지는 ${MAX_CERTIFICATE_IMAGE_MB}MB 이하로 업로드해주세요.` }, { status: 400 })
    }

    const extension = image.type.split('/')[1] || 'jpg'
    certificateKey = `certificates/${userId}/${crypto.randomUUID()}.${extension}`
    await env.CERT_BUCKET!.put(certificateKey, image.stream(), {
      httpMetadata: { contentType: image.type },
    })
  }

  await env
    .DB!.prepare(
      `INSERT INTO diver_profiles (
        user_id,
        phone,
        certification_agency,
        certification_level,
        certification_image_key,
        height_cm,
        weight_kg,
        foot_size_mm,
        preferred_suit_size,
        memo,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        phone = excluded.phone,
        certification_agency = excluded.certification_agency,
        certification_level = excluded.certification_level,
        certification_image_key = COALESCE(excluded.certification_image_key, diver_profiles.certification_image_key),
        height_cm = excluded.height_cm,
        weight_kg = excluded.weight_kg,
        foot_size_mm = excluded.foot_size_mm,
        preferred_suit_size = excluded.preferred_suit_size,
        memo = excluded.memo,
        updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(
      userId,
      sanitizeText(form.get('phone')),
      sanitizeText(form.get('certificationAgency')),
      sanitizeText(form.get('certificationLevel')),
      certificateKey,
      sanitizeNumber(form.get('heightCm')),
      sanitizeNumber(form.get('weightKg')),
      sanitizeNumber(form.get('footSizeMm')),
      sanitizeText(form.get('preferredSuitSize')),
      sanitizeText(form.get('memo')),
    )
    .run()

  return null
}

const handleRegister = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const form = await request.formData()
  const email = sanitizeText(form.get('email'))?.toLowerCase()
  const password = sanitizeText(form.get('password'))
  const name = sanitizeText(form.get('name'))

  if (!email || !password || !name) {
    return json({ error: '이름, 이메일, 비밀번호를 입력해주세요.' }, { status: 400 })
  }
  if (password.length < 8) {
    return json({ error: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 })
  }

  const existing = await env.DB!.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) {
    return json({ error: '이미 가입된 이메일입니다.' }, { status: 409 })
  }

  const userId = crypto.randomUUID()
  const passwordHash = await hashPassword(password)

  await env
    .DB!.prepare(
      'INSERT INTO users (id, email, name, password_hash, password_salt) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(userId, email, name, passwordHash.hash, passwordHash.salt)
    .run()

  const profileError = await saveProfile(env, userId, form)
  if (profileError) return profileError

  const token = await signSession(userId, env.AUTH_SECRET!)
  const user = await getUserWithProfile(env, userId)

  return json(
    { user },
    {
      status: 201,
      headers: { 'set-cookie': sessionCookie(token) },
    },
  )
}

const handleLogin = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const body = (await request.json()) as { email?: string; password?: string }
  const email = body.email?.trim().toLowerCase()
  const password = body.password || ''
  if (!email || !password) {
    return json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  const user = await env.DB!.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>()
  if (!user || !(await verifyPassword(password, user.password_hash, user.password_salt))) {
    return json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  const token = await signSession(user.id, env.AUTH_SECRET!)
  const userWithProfile = await getUserWithProfile(env, user.id)

  return json({ user: userWithProfile }, { headers: { 'set-cookie': sessionCookie(token) } })
}

const handleMe = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const userId = await getCurrentUserId(request, env)
  if (!userId) return json({ user: null }, { status: 401 })

  const user = await getUserWithProfile(env, userId)
  return json({ user })
}

const handleProfileUpdate = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const userId = await getCurrentUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const form = await request.formData()
  const profileError = await saveProfile(env, userId, form)
  if (profileError) return profileError

  const user = await getUserWithProfile(env, userId)
  return json({ user })
}

const handleCertificate = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const userId = await getCurrentUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const profile = await env
    .DB!.prepare('SELECT certification_image_key FROM diver_profiles WHERE user_id = ?')
    .bind(userId)
    .first<{ certification_image_key: string | null }>()

  if (!profile?.certification_image_key) return json({ error: '등록된 자격증 이미지가 없습니다.' }, { status: 404 })

  const object = await env.CERT_BUCKET!.get(profile.certification_image_key)
  if (!object?.body) return json({ error: '자격증 이미지를 찾을 수 없습니다.' }, { status: 404 })

  return new Response(object.body, {
    headers: {
      'content-type': object.httpMetadata?.contentType || 'image/jpeg',
      'cache-control': 'private, max-age=60',
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 })
    }

    if (url.pathname === '/api/auth/register' && request.method === 'POST') {
      return handleRegister(request, env)
    }
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      return handleLogin(request, env)
    }
    if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
      return json({ ok: true }, { headers: { 'set-cookie': clearSessionCookie() } })
    }
    if (url.pathname === '/api/auth/me' && request.method === 'GET') {
      return handleMe(request, env)
    }
    if (url.pathname === '/api/profile' && request.method === 'PUT') {
      return handleProfileUpdate(request, env)
    }
    if (url.pathname === '/api/profile/certificate' && request.method === 'GET') {
      return handleCertificate(request, env)
    }

    return json({ error: 'Not found' }, { status: 404 })
  },
}
