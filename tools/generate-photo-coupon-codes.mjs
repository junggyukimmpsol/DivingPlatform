import { mkdirSync, writeFileSync } from 'node:fs'
import { randomBytes, randomUUID, createHash } from 'node:crypto'
import { join } from 'node:path'

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const getArg = (name, fallback = '') => {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : fallback
}

const count = Math.max(1, Number(getArg('count', '20')) || 20)
const label = getArg('label', 'kakao-tour-followup')
const expiresAt = getArg('expires', '')
const outputDir = getArg('out', '.coupon-codes')

const randomPart = (length) => {
  const bytes = randomBytes(length)
  let value = ''
  for (const byte of bytes) value += alphabet[byte % alphabet.length]
  return value
}

const normalizeCouponCode = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, '')
const hashCouponCode = (value) =>
  createHash('sha256').update(normalizeCouponCode(value)).digest('base64url')

const sqlString = (value) => {
  if (!value) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
mkdirSync(outputDir, { recursive: true })

const rows = []
const statements = []

for (let index = 0; index < count; index += 1) {
  const code = `PARKS-${randomPart(4)}-${randomPart(4)}`
  const hash = hashCouponCode(code)
  const id = randomUUID()
  rows.push([code, label, expiresAt].join(','))
  statements.push(
    `INSERT INTO photo_coupon_codes (id, code_hash, label, max_uses, expires_at) VALUES (${sqlString(id)}, ${sqlString(hash)}, ${sqlString(label)}, 1, ${sqlString(expiresAt)}) ON CONFLICT(code_hash) DO NOTHING;`,
  )
}

const csvPath = join(outputDir, `photo-coupon-codes-${timestamp}.csv`)
const sqlPath = join(outputDir, `photo-coupon-codes-${timestamp}.sql`)

writeFileSync(csvPath, `code,label,expires_at\n${rows.join('\n')}\n`)
writeFileSync(sqlPath, `${statements.join('\n')}\n`)

console.log(`Created ${count} coupon codes.`)
console.log(`CSV: ${csvPath}`)
console.log(`SQL: ${sqlPath}`)
console.log('')
console.log('Apply to Cloudflare D1:')
console.log(`npx wrangler d1 execute divingplatform-db --remote --file ${sqlPath}`)
