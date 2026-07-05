export const MAX_CERTIFICATE_IMAGE_BYTES = 2 * 1024 * 1024
export const MAX_CERTIFICATE_IMAGE_MB = MAX_CERTIFICATE_IMAGE_BYTES / 1024 / 1024

export const getCertificateImageSizeError = (file: File | null) => {
  if (!file) return ''
  if (!file.type.startsWith('image/')) return '자격증 파일은 이미지 형식만 업로드할 수 있습니다.'
  if (file.size > MAX_CERTIFICATE_IMAGE_BYTES) {
    return `자격증 이미지는 ${MAX_CERTIFICATE_IMAGE_MB}MB 이하로 업로드해주세요.`
  }
  return ''
}
