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

type WorkerExecutionContext = {
  waitUntil: (promise: Promise<unknown>) => void
}

type Env = {
  DB?: D1Database
  CERT_BUCKET?: R2Bucket
  AUTH_SECRET?: string
  RESEND_API_KEY?: string
  EMAIL_FROM?: string
  ORDER_NOTIFICATION_EMAIL?: string
  PORTONE_STORE_ID?: string
  PORTONE_CHANNEL_KEY?: string
  PORTONE_API_SECRET?: string
  OPENAI_API_KEY?: string
  OPENAI_IMAGE_MODEL?: string
  OPENAI_IMAGE_PROXY_URL?: string
  OPENAI_IMAGE_PROXY_TOKEN?: string
}

type UserRow = {
  id: string
  email: string
  name: string
  password_hash: string
  password_salt: string
  email_verified_at: string | null
  email_verification_token_hash: string | null
  email_verification_expires_at: string | null
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

type OrderCartItem = {
  locationId?: string
  locationName?: string
  program?: string
  tourDate?: string
  guests?: number
  unitPriceKrw?: number
}

const SESSION_COOKIE = 'diving_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30
const MAX_CERTIFICATE_IMAGE_BYTES = 2 * 1024 * 1024
const MAX_CERTIFICATE_IMAGE_MB = MAX_CERTIFICATE_IMAGE_BYTES / 1024 / 1024
const EMAIL_VERIFICATION_MAX_AGE_MS = 1000 * 60 * 60 * 24
const PASSWORD_HASH_ITERATIONS = 100000
const FREE_PHOTO_CREDITS = 5
const MAX_ENHANCE_IMAGE_BYTES = 2 * 1024 * 1024
const MAX_ENHANCE_UPLOADS = 5
const DEFAULT_OPENAI_IMAGE_MODEL = 'gpt-image-1-mini'
const DEFAULT_ORDER_NOTIFICATION_EMAIL = 'parkdivers@gmail.com'

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

const requireEmailBindings = (env: Env) => {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    return json(
      {
        error:
          '이메일 인증 발송을 위해 RESEND_API_KEY와 EMAIL_FROM 설정이 필요합니다.',
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
      iterations: PASSWORD_HASH_ITERATIONS,
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

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value))
  return toBase64Url(digest)
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

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const formatKrw = (amount: number) => `${Math.round(amount).toLocaleString('ko-KR')}원`

const base64ToArrayBuffer = (value: string) => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes.buffer
}

const getAuthenticatedUserId = async (request: Request, env: Env) => {
  const userId = await getCurrentUserId(request, env)
  if (!userId) return null
  return userId
}

const publicUser = (user: UserRow, profile: ProfileRow | null) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  emailVerified: Boolean(user.email_verified_at),
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

const sendVerificationEmail = async (request: Request, env: Env, email: string, name: string, token: string) => {
  const origin = new URL(request.url).origin
  const verifyUrl = `${origin}/verify-email?token=${encodeURIComponent(token)}`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [email],
      subject: 'Parks Local Diving 이메일 인증',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2>이메일 인증을 완료해주세요</h2>
          <p>${name}님, Parks Local Diving 회원가입을 계속하려면 아래 버튼을 눌러 이메일을 인증해주세요.</p>
          <p>
            <a href="${verifyUrl}" style="display:inline-block;background:#fbbf24;color:#020617;padding:12px 18px;border-radius:8px;font-weight:700;text-decoration:none">
              이메일 인증하기
            </a>
          </p>
          <p style="font-size:13px;color:#64748b">이 링크는 24시간 동안 유효합니다.</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    return json({ error: '인증 메일 발송에 실패했습니다.', detail }, { status: 502 })
  }

  return null
}

const createVerificationToken = async (env: Env, userId: string) => {
  const token = randomToken(32)
  const tokenHash = await sha256(token)
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_MAX_AGE_MS).toISOString()

  await env
    .DB!.prepare(
      `UPDATE users
       SET email_verification_token_hash = ?,
           email_verification_expires_at = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
    .bind(tokenHash, expiresAt, userId)
    .run()

  return token
}

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
  const emailSetupError = requireEmailBindings(env)
  if (emailSetupError) return emailSetupError

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

  const verificationToken = await createVerificationToken(env, userId)
  const emailError = await sendVerificationEmail(request, env, email, name, verificationToken)
  if (emailError) return emailError

  return json(
    {
      needsEmailVerification: true,
      message: '가입 이메일로 인증 링크를 보냈습니다. 이메일 인증 후 로그인할 수 있습니다.',
    },
    {
      status: 201,
    },
  )
}

const handleVerifyEmail = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const body = (await request.json()) as { token?: string }
  const token = body.token?.trim()
  if (!token) return json({ error: '인증 토큰이 없습니다.' }, { status: 400 })

  const tokenHash = await sha256(token)
  const user = await env
    .DB!.prepare('SELECT * FROM users WHERE email_verification_token_hash = ?')
    .bind(tokenHash)
    .first<UserRow>()

  if (!user || !user.email_verification_expires_at) {
    return json({ error: '유효하지 않은 인증 링크입니다.' }, { status: 400 })
  }
  if (new Date(user.email_verification_expires_at).getTime() < Date.now()) {
    return json({ error: '인증 링크가 만료되었습니다. 다시 인증 메일을 요청해주세요.' }, { status: 400 })
  }

  await env
    .DB!.prepare(
      `UPDATE users
       SET email_verified_at = CURRENT_TIMESTAMP,
           email_verification_token_hash = NULL,
           email_verification_expires_at = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
    .bind(user.id)
    .run()

  const session = await signSession(user.id, env.AUTH_SECRET!)
  const verifiedUser = await getUserWithProfile(env, user.id)

  return json({ user: verifiedUser }, { headers: { 'set-cookie': sessionCookie(session) } })
}

const handleResendVerification = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError
  const emailSetupError = requireEmailBindings(env)
  if (emailSetupError) return emailSetupError

  const body = (await request.json()) as { email?: string }
  const email = body.email?.trim().toLowerCase()
  if (!email) return json({ error: '이메일을 입력해주세요.' }, { status: 400 })

  const user = await env.DB!.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>()
  if (!user) return json({ ok: true })
  if (user.email_verified_at) return json({ ok: true, message: '이미 인증된 이메일입니다.' })

  const verificationToken = await createVerificationToken(env, user.id)
  const emailError = await sendVerificationEmail(request, env, user.email, user.name, verificationToken)
  if (emailError) return emailError

  return json({ ok: true, message: '인증 메일을 다시 보냈습니다.' })
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
  if (!user.email_verified_at) {
    return json(
      {
        error: '이메일 인증이 필요합니다. 가입 시 받은 인증 메일을 확인해주세요.',
        needsEmailVerification: true,
      },
      { status: 403 },
    )
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

const handleOrderNotification = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError
  const emailSetupError = requireEmailBindings(env)
  if (emailSetupError) return emailSetupError

  const userId = await getCurrentUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const body = (await request.json()) as { items?: OrderCartItem[] }
  const items = Array.isArray(body.items) ? body.items : []
  if (items.length === 0) return json({ error: '장바구니에 담긴 상품이 없습니다.' }, { status: 400 })
  if (items.length > 20) return json({ error: '한 번에 요청 가능한 상품 수는 20개까지입니다.' }, { status: 400 })

  const normalizedItems = items.map((item) => ({
    locationName: String(item.locationName || '').trim(),
    program: String(item.program || '').trim(),
    tourDate: String(item.tourDate || '').trim(),
    guests: Number(item.guests || 0),
    unitPriceKrw: Number(item.unitPriceKrw || 0),
  }))

  if (
    normalizedItems.some(
      (item) =>
        !item.locationName ||
        !item.program ||
        !item.tourDate ||
        !Number.isInteger(item.guests) ||
        item.guests < 1 ||
        item.guests > 20 ||
        !Number.isFinite(item.unitPriceKrw) ||
        item.unitPriceKrw < 0,
    )
  ) {
    return json({ error: '예약 상품 정보가 올바르지 않습니다.' }, { status: 400 })
  }

  const user = await env.DB!.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>()
  if (!user) return json({ error: '회원 정보를 찾을 수 없습니다.' }, { status: 404 })

  const profile = await env
    .DB!.prepare('SELECT * FROM diver_profiles WHERE user_id = ?')
    .bind(userId)
    .first<ProfileRow>()

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.unitPriceKrw * item.guests, 0)
  const totalGuests = normalizedItems.reduce((sum, item) => sum + item.guests, 0)
  const rows = normalizedItems
    .map(
      (item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.locationName)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.program)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.tourDate)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${item.guests}명</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${formatKrw(item.unitPriceKrw * item.guests)}</td>
        </tr>
      `,
    )
    .join('')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [env.ORDER_NOTIFICATION_EMAIL || DEFAULT_ORDER_NOTIFICATION_EMAIL],
      subject: `[Parks Local Diving] ${user.name}님 예약 요청`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2>예약 요청이 도착했습니다</h2>
          <h3>회원 정보</h3>
          <ul>
            <li>이름: ${escapeHtml(user.name)}</li>
            <li>이메일: ${escapeHtml(user.email)}</li>
            <li>연락처: ${escapeHtml(profile?.phone || '미입력')}</li>
            <li>자격증: ${escapeHtml(profile?.certification_agency || '미입력')} / ${escapeHtml(profile?.certification_level || '미입력')}</li>
            <li>자격증 사진: ${profile?.certification_image_key ? '등록됨' : '미등록'}</li>
            <li>키: ${escapeHtml(profile?.height_cm || '미입력')} cm</li>
            <li>몸무게: ${escapeHtml(profile?.weight_kg || '미입력')} kg</li>
            <li>발 사이즈: ${escapeHtml(profile?.foot_size_mm || '미입력')} mm</li>
            <li>선호 수트 사이즈: ${escapeHtml(profile?.preferred_suit_size || '미입력')}</li>
            <li>메모: ${escapeHtml(profile?.memo || '미입력')}</li>
          </ul>
          <h3>구매 옵션</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="background:#f1f5f9">
                <th style="padding:10px;text-align:left">지역</th>
                <th style="padding:10px;text-align:left">상품</th>
                <th style="padding:10px;text-align:left">날짜</th>
                <th style="padding:10px;text-align:right">인원</th>
                <th style="padding:10px;text-align:right">금액</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="font-size:16px;font-weight:700">총 ${totalGuests}명 / ${formatKrw(totalAmount)}</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    return json({ error: '예약 요청 이메일 발송에 실패했습니다.', detail }, { status: 502 })
  }

  return json({ ok: true, message: '대표 이메일로 예약 요청을 보냈습니다.' })
}

const normalizeOrderItems = (items: OrderCartItem[]) => {
  const normalizedItems = items.map((item) => ({
    locationName: String(item.locationName || '').trim(),
    program: String(item.program || '').trim(),
    tourDate: String(item.tourDate || '').trim(),
    guests: Number(item.guests || 0),
    unitPriceKrw: Number(item.unitPriceKrw || 0),
  }))

  const invalid = normalizedItems.some(
    (item) =>
      !item.locationName ||
      !item.program ||
      !item.tourDate ||
      !Number.isInteger(item.guests) ||
      item.guests < 1 ||
      item.guests > 20 ||
      !Number.isFinite(item.unitPriceKrw) ||
      item.unitPriceKrw < 0,
  )

  return invalid ? null : normalizedItems
}

const sendPaidOrderEmail = async (
  env: Env,
  user: UserRow,
  profile: ProfileRow | null,
  items: ReturnType<typeof normalizeOrderItems>,
  paymentId: string,
  totalAmount: number,
) => {
  if (!items) return json({ error: '예약 상품 정보가 올바르지 않습니다.' }, { status: 400 })

  const totalGuests = items.reduce((sum, item) => sum + item.guests, 0)
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.locationName)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.program)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.tourDate)}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${item.guests}명</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">${formatKrw(item.unitPriceKrw * item.guests)}</td>
        </tr>
      `,
    )
    .join('')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [env.ORDER_NOTIFICATION_EMAIL || DEFAULT_ORDER_NOTIFICATION_EMAIL],
      subject: `[Parks Local Diving] ${user.name}님 결제 완료`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2>장바구니 결제가 완료되었습니다</h2>
          <p>결제번호: ${escapeHtml(paymentId)}</p>
          <h3>회원 정보</h3>
          <ul>
            <li>이름: ${escapeHtml(user.name)}</li>
            <li>이메일: ${escapeHtml(user.email)}</li>
            <li>연락처: ${escapeHtml(profile?.phone || '미입력')}</li>
            <li>자격증: ${escapeHtml(profile?.certification_agency || '미입력')} / ${escapeHtml(profile?.certification_level || '미입력')}</li>
            <li>자격증 사진: ${profile?.certification_image_key ? '등록됨' : '미등록'}</li>
            <li>키: ${escapeHtml(profile?.height_cm || '미입력')} cm</li>
            <li>몸무게: ${escapeHtml(profile?.weight_kg || '미입력')} kg</li>
            <li>발 사이즈: ${escapeHtml(profile?.foot_size_mm || '미입력')} mm</li>
            <li>선호 수트 사이즈: ${escapeHtml(profile?.preferred_suit_size || '미입력')}</li>
            <li>메모: ${escapeHtml(profile?.memo || '미입력')}</li>
          </ul>
          <h3>구매 옵션</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="background:#f1f5f9">
                <th style="padding:10px;text-align:left">지역</th>
                <th style="padding:10px;text-align:left">상품</th>
                <th style="padding:10px;text-align:left">날짜</th>
                <th style="padding:10px;text-align:right">인원</th>
                <th style="padding:10px;text-align:right">금액</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="font-size:16px;font-weight:700">총 ${totalGuests}명 / ${formatKrw(totalAmount)}</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    return json({ error: '결제 완료 이메일 발송에 실패했습니다.', detail }, { status: 502 })
  }

  return null
}

const handlePaymentConfig = async (_request: Request, env: Env) => {
  if (!env.PORTONE_STORE_ID || !env.PORTONE_CHANNEL_KEY) {
    return json({ error: 'PORTONE_STORE_ID와 PORTONE_CHANNEL_KEY 설정이 필요합니다.' }, { status: 503 })
  }

  return json({
    storeId: env.PORTONE_STORE_ID,
    channelKey: env.PORTONE_CHANNEL_KEY,
  })
}

const handlePaymentComplete = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError
  const emailSetupError = requireEmailBindings(env)
  if (emailSetupError) return emailSetupError
  if (!env.PORTONE_API_SECRET) return json({ error: 'PORTONE_API_SECRET 설정이 필요합니다.' }, { status: 503 })

  const userId = await getCurrentUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const body = (await request.json()) as { paymentId?: string; totalAmount?: number; items?: OrderCartItem[] }
  const paymentId = String(body.paymentId || '').trim()
  const items = Array.isArray(body.items) ? body.items : []
  if (!paymentId) return json({ error: '결제번호가 없습니다.' }, { status: 400 })
  if (items.length === 0) return json({ error: '장바구니에 담긴 상품이 없습니다.' }, { status: 400 })
  if (items.length > 20) return json({ error: '한 번에 결제 가능한 상품 수는 20개까지입니다.' }, { status: 400 })

  const normalizedItems = normalizeOrderItems(items)
  if (!normalizedItems) return json({ error: '예약 상품 정보가 올바르지 않습니다.' }, { status: 400 })

  const expectedAmount = normalizedItems.reduce((sum, item) => sum + item.unitPriceKrw * item.guests, 0)
  if (Number(body.totalAmount) !== expectedAmount) {
    return json({ error: '결제 요청 금액이 장바구니 금액과 일치하지 않습니다.' }, { status: 400 })
  }

  const paymentResponse = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      authorization: `PortOne ${env.PORTONE_API_SECRET}`,
    },
  })

  if (!paymentResponse.ok) {
    const detail = await paymentResponse.text()
    return json({ error: '포트원 결제 조회에 실패했습니다.', detail }, { status: 502 })
  }

  const payment = await paymentResponse.json() as {
    status?: string
    amount?: { total?: number; paid?: number }
    paidAmount?: number
    totalAmount?: number
  }
  const paidAmount = Number(payment.amount?.total ?? payment.amount?.paid ?? payment.paidAmount ?? payment.totalAmount ?? 0)
  if (payment.status !== 'PAID') return json({ error: '결제가 완료된 상태가 아닙니다.' }, { status: 400 })
  if (paidAmount !== expectedAmount) return json({ error: '실제 결제금액이 장바구니 금액과 일치하지 않습니다.' }, { status: 400 })

  const user = await env.DB!.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>()
  if (!user) return json({ error: '회원 정보를 찾을 수 없습니다.' }, { status: 404 })

  const profile = await env
    .DB!.prepare('SELECT * FROM diver_profiles WHERE user_id = ?')
    .bind(userId)
    .first<ProfileRow>()

  const emailError = await sendPaidOrderEmail(env, user, profile, normalizedItems, paymentId, expectedAmount)
  if (emailError) return emailError

  return json({ ok: true, message: '결제가 완료되었습니다. 예약 정보가 대표 이메일로 전송되었습니다.' })
}

const ensurePhotoWallet = async (env: Env, userId: string) => {
  const existing = await env
    .DB!.prepare('SELECT user_id, total_credits, used_credits FROM photo_credit_wallets WHERE user_id = ?')
    .bind(userId)
    .first<{ user_id: string; total_credits: number; used_credits: number }>()

  if (existing) return existing

  await env
    .DB!.prepare('INSERT INTO photo_credit_wallets (user_id, total_credits, used_credits) VALUES (?, ?, 0)')
    .bind(userId, FREE_PHOTO_CREDITS)
    .run()

  return { user_id: userId, total_credits: FREE_PHOTO_CREDITS, used_credits: 0 }
}

const publicPhotoJob = (job: {
  id: string
  original_file_name: string
  status: string
  error_message: string | null
  created_at: string
  completed_at: string | null
}) => ({
  id: job.id,
  originalFileName: job.original_file_name,
  status: job.status,
  errorMessage: job.error_message || '',
  createdAt: job.created_at,
  completedAt: job.completed_at || '',
  downloadUrl: job.status === 'completed' ? `/api/photo-enhance/jobs/${job.id}/download` : '',
})

const listPhotoJobs = async (env: Env, userId: string) => {
  const response = await env
    .DB!.prepare(
      `SELECT id, original_file_name, status, error_message, created_at, completed_at
       FROM photo_enhancement_jobs
       WHERE user_id = ?
       ORDER BY created_at DESC`,
    )
    .bind(userId)
    .all<{
      id: string
      original_file_name: string
      status: string
      error_message: string | null
      created_at: string
      completed_at: string | null
    }>()

  return (response.results || []).map(publicPhotoJob)
}

const handlePhotoSummary = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const userId = await getAuthenticatedUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const wallet = await ensurePhotoWallet(env, userId)
  const jobs = await listPhotoJobs(env, userId)

  return json({
    wallet: {
      totalCredits: wallet.total_credits,
      usedCredits: wallet.used_credits,
      remainingCredits: Math.max(0, wallet.total_credits - wallet.used_credits),
    },
    jobs,
  })
}

const handlePhotoUpload = async (request: Request, env: Env) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const userId = await getAuthenticatedUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const form = await request.formData()
  const marketingOptIn = form.get('marketingOptIn') === 'true' || form.get('marketingOptIn') === 'on'
  if (!marketingOptIn) {
    return json({ error: '무료 AI 사진 보정 티켓을 받으려면 광고성 이메일 수신에 동의해주세요.' }, { status: 400 })
  }

  const files = form.getAll('photos').filter((file): file is File => file instanceof File && file.size > 0)
  if (files.length === 0) return json({ error: '보정할 사진을 선택해주세요.' }, { status: 400 })
  if (files.length > MAX_ENHANCE_UPLOADS) {
    return json({ error: `한 번에 최대 ${MAX_ENHANCE_UPLOADS}장까지 업로드할 수 있습니다.` }, { status: 400 })
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return json({ error: '사진 파일만 업로드할 수 있습니다.' }, { status: 400 })
    }
    if (file.size > MAX_ENHANCE_IMAGE_BYTES) {
      return json({ error: '사진은 장당 2MB 이하로 업로드해주세요.' }, { status: 400 })
    }
  }

  const wallet = await ensurePhotoWallet(env, userId)
  const remaining = wallet.total_credits - wallet.used_credits
  if (remaining < files.length) {
    return json({ error: `남은 무료 보정 티켓은 ${remaining}장입니다.` }, { status: 400 })
  }

  await env
    .DB!.prepare(
      `UPDATE users
       SET marketing_opt_in_at = COALESCE(marketing_opt_in_at, CURRENT_TIMESTAMP),
           marketing_opt_in_source = 'photo_enhancement',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
    .bind(userId)
    .run()

  const createdJobs = []
  for (const file of files) {
    const jobId = crypto.randomUUID()
    const extension = file.type.split('/')[1] || 'jpg'
    const originalKey = `photo-enhance/${userId}/${jobId}/original.${extension}`

    await env.CERT_BUCKET!.put(originalKey, file.stream(), {
      httpMetadata: { contentType: file.type },
    })

    await env
      .DB!.prepare(
        `INSERT INTO photo_enhancement_jobs (
          id,
          user_id,
          original_image_key,
          original_file_name,
          original_mime_type,
          original_size_bytes,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, 'queued')`,
      )
      .bind(jobId, userId, originalKey, file.name || `photo-${createdJobs.length + 1}.${extension}`, file.type, file.size)
      .run()

    createdJobs.push(jobId)
  }

  await env
    .DB!.prepare(
      `UPDATE photo_credit_wallets
       SET used_credits = used_credits + ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
    )
    .bind(files.length, userId)
    .run()

  const nextWallet = await ensurePhotoWallet(env, userId)
  const jobs = await listPhotoJobs(env, userId)

  return json({
    wallet: {
      totalCredits: nextWallet.total_credits,
      usedCredits: nextWallet.used_credits,
      remainingCredits: Math.max(0, nextWallet.total_credits - nextWallet.used_credits),
    },
    jobs,
    createdJobIds: createdJobs,
  })
}

const extractJobId = (pathname: string, suffix: string) => {
  const prefix = '/api/photo-enhance/jobs/'
  if (!pathname.startsWith(prefix) || !pathname.endsWith(suffix)) return ''
  return pathname.slice(prefix.length, pathname.length - suffix.length)
}

const enhanceWithOpenAI = async (env: Env, imageBuffer: ArrayBuffer, mimeType: string) => {
  const prompt = [
    'Enhance this underwater scuba diving photo naturally.',
    'Correct blue or green color cast, improve contrast and clarity, reduce haze and noise, and restore natural skin tones.',
    'Keep the original people, faces, body shapes, gear, marine life, and scene unchanged.',
    'Do not add or remove objects. Do not make it look artificial. Return only the enhanced image.',
  ].join(' ')

  const formData = new FormData()
  formData.append('model', env.OPENAI_IMAGE_MODEL || DEFAULT_OPENAI_IMAGE_MODEL)
  formData.append('prompt', prompt)
  formData.append('image[]', new Blob([imageBuffer], { type: mimeType }), 'underwater-photo.jpg')
  formData.append('input_fidelity', 'low')
  formData.append('output_format', 'jpeg')
  formData.append('quality', 'low')
  formData.append('size', '1024x1024')

  if (env.OPENAI_IMAGE_PROXY_URL) {
    const proxyResponse = await fetch(env.OPENAI_IMAGE_PROXY_URL, {
      method: 'POST',
      headers: env.OPENAI_IMAGE_PROXY_TOKEN
        ? { authorization: `Bearer ${env.OPENAI_IMAGE_PROXY_TOKEN}` }
        : undefined,
      body: formData,
    })

    const proxyData = await proxyResponse.json().catch(() => ({})) as {
      b64_json?: string
      mimeType?: string
      error?: string
      detail?: string
    }

    if (!proxyResponse.ok) {
      throw new Error(proxyData.detail || proxyData.error || 'OpenAI 이미지 프록시 요청에 실패했습니다.')
    }
    if (!proxyData.b64_json) {
      throw new Error('OpenAI 이미지 프록시가 보정 이미지를 반환하지 않았습니다.')
    }

    return {
      buffer: base64ToArrayBuffer(proxyData.b64_json),
      mimeType: proxyData.mimeType || 'image/jpeg',
    }
  }

  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY 또는 OPENAI_IMAGE_PROXY_URL 설정이 필요합니다.')
  }

  const response = await fetch(
    'https://api.openai.com/v1/images/edits',
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: formData,
    },
  )

  const data = await response.json() as {
    data?: Array<{ b64_json?: string }>
    output_format?: 'png' | 'webp' | 'jpeg'
    error?: { message?: string }
  }

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI 사진 보정 요청에 실패했습니다.')
  }

  const b64Json = data.data?.[0]?.b64_json
  if (!b64Json) {
    throw new Error('OpenAI가 보정 이미지를 반환하지 않았습니다.')
  }

  const outputFormat = data.output_format || 'jpeg'
  return {
    buffer: base64ToArrayBuffer(b64Json),
    mimeType: `image/${outputFormat === 'jpeg' ? 'jpeg' : outputFormat}`,
  }
}

const processPhotoJob = async (env: Env, userId: string, jobId: string) => {
  const job = await env
    .DB!.prepare('SELECT * FROM photo_enhancement_jobs WHERE id = ? AND user_id = ?')
    .bind(jobId, userId)
    .first<{
      id: string
      original_image_key: string
      original_mime_type: string
    }>()

  if (!job) throw new Error('작업을 찾을 수 없습니다.')

  try {
    const original = await env.CERT_BUCKET!.get(job.original_image_key)
    if (!original?.body) throw new Error('원본 사진을 찾을 수 없습니다.')

    const originalBuffer = await new Response(original.body).arrayBuffer()
    const enhanced = await enhanceWithOpenAI(env, originalBuffer, job.original_mime_type || original.httpMetadata?.contentType || 'image/jpeg')
    const extension = enhanced.mimeType.includes('png') ? 'png' : enhanced.mimeType.includes('webp') ? 'webp' : 'jpg'
    const enhancedKey = `photo-enhance/${userId}/${jobId}/enhanced.${extension}`

    await env.CERT_BUCKET!.put(enhancedKey, enhanced.buffer, {
      httpMetadata: { contentType: enhanced.mimeType },
    })

    await env
      .DB!.prepare(
        `UPDATE photo_enhancement_jobs
         SET status = 'completed',
             enhanced_image_key = ?,
             enhanced_mime_type = ?,
             completed_at = CURRENT_TIMESTAMP,
             error_message = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?`,
      )
      .bind(enhancedKey, enhanced.mimeType, jobId, userId)
      .run()
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught)
    await env
      .DB!.prepare(
        `UPDATE photo_enhancement_jobs
         SET status = 'failed',
             error_message = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?`,
      )
      .bind(message, jobId, userId)
      .run()

    throw caught
  }
}

const handlePhotoProcess = async (request: Request, env: Env, jobId: string, ctx: WorkerExecutionContext) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const userId = await getAuthenticatedUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })
  if (!jobId) return json({ error: '작업 ID가 없습니다.' }, { status: 400 })

  const job = await env
    .DB!.prepare('SELECT * FROM photo_enhancement_jobs WHERE id = ? AND user_id = ?')
    .bind(jobId, userId)
    .first<{
      id: string
      original_image_key: string
      original_mime_type: string
      status: string
    }>()

  if (!job) return json({ error: '작업을 찾을 수 없습니다.' }, { status: 404 })
  if (job.status === 'completed') return handlePhotoSummary(request, env)
  if (job.status === 'processing') return handlePhotoSummary(request, env)

  await env
    .DB!.prepare(
      `UPDATE photo_enhancement_jobs
       SET status = 'processing',
           error_message = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
    )
    .bind(jobId, userId)
    .run()

  ctx.waitUntil(processPhotoJob(env, userId, jobId).catch((caught) => console.error(caught)))

  return handlePhotoSummary(request, env)
}

const handlePhotoDownload = async (request: Request, env: Env, jobId: string) => {
  const setupError = requireBindings(env)
  if (setupError) return setupError

  const userId = await getAuthenticatedUserId(request, env)
  if (!userId) return json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const job = await env
    .DB!.prepare(
      `SELECT enhanced_image_key, enhanced_mime_type, original_file_name, status
       FROM photo_enhancement_jobs
       WHERE id = ? AND user_id = ?`,
    )
    .bind(jobId, userId)
    .first<{
      enhanced_image_key: string | null
      enhanced_mime_type: string | null
      original_file_name: string
      status: string
    }>()

  if (!job) return json({ error: '작업을 찾을 수 없습니다.' }, { status: 404 })
  if (job.status !== 'completed' || !job.enhanced_image_key) {
    return json({ error: '아직 보정이 완료되지 않았습니다.' }, { status: 400 })
  }

  const object = await env.CERT_BUCKET!.get(job.enhanced_image_key)
  if (!object?.body) return json({ error: '보정 사진을 찾을 수 없습니다.' }, { status: 404 })

  const safeName = job.original_file_name.replace(/[^\w.\-가-힣]/g, '_')
  return new Response(object.body, {
    headers: {
      'content-type': job.enhanced_mime_type || object.httpMetadata?.contentType || 'image/jpeg',
      'content-disposition': `attachment; filename="enhanced-${safeName}"`,
      'cache-control': 'private, max-age=60',
    },
  })
}

export default {
  async fetch(request: Request, env: Env, ctx: WorkerExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url)

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204 })
      }

      if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        return handleRegister(request, env)
      }
      if (url.pathname === '/api/auth/verify-email' && request.method === 'POST') {
        return handleVerifyEmail(request, env)
      }
      if (url.pathname === '/api/auth/resend-verification' && request.method === 'POST') {
        return handleResendVerification(request, env)
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
      if (url.pathname === '/api/orders/notify' && request.method === 'POST') {
        return handleOrderNotification(request, env)
      }
      if (url.pathname === '/api/payments/config' && request.method === 'GET') {
        return handlePaymentConfig(request, env)
      }
      if (url.pathname === '/api/payments/complete' && request.method === 'POST') {
        return handlePaymentComplete(request, env)
      }
      if (url.pathname === '/api/photo-enhance/summary' && request.method === 'GET') {
        return handlePhotoSummary(request, env)
      }
      if (url.pathname === '/api/photo-enhance/jobs' && request.method === 'POST') {
        return handlePhotoUpload(request, env)
      }

      const processJobId = extractJobId(url.pathname, '/process')
      if (processJobId && request.method === 'POST') {
        return handlePhotoProcess(request, env, processJobId, ctx)
      }

      const downloadJobId = extractJobId(url.pathname, '/download')
      if (downloadJobId && request.method === 'GET') {
        return handlePhotoDownload(request, env, downloadJobId)
      }

      return json({ error: 'Not found' }, { status: 404 })
    } catch (caught) {
      console.error(caught)
      return json(
        {
          error: '서버 처리 중 오류가 발생했습니다.',
          detail: caught instanceof Error ? caught.message : String(caught),
        },
        { status: 500 },
      )
    }
  },
}
