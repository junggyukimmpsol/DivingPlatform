import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type DiverProfile = {
  phone: string
  certificationAgency: string
  certificationLevel: string
  hasCertificationImage: boolean
  heightCm: number | ''
  weightKg: number | ''
  footSizeMm: number | ''
  preferredSuitSize: string
  memo: string
}

export type AuthUser = {
  id: string
  email: string
  name: string
  emailVerified: boolean
  profile: DiverProfile
}

type RegisterResult = {
  user?: AuthUser
  needsEmailVerification?: boolean
  message?: string
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (formData: FormData) => Promise<RegisterResult>
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<string>
  updateProfile: (formData: FormData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const parseApiError = async (response: Response) => {
  try {
    const data = await response.json() as { detail?: string; error?: string }
    return data.detail ? `${data.error || '요청을 처리하지 못했습니다.'} ${data.detail}` : data.error || '요청을 처리하지 못했습니다.'
  } catch {
    return '요청을 처리하지 못했습니다.'
  }
}

const fetchWithTimeout = async (url: string, init: RequestInit, timeoutMs = 15000) => {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (caught) {
    if (caught instanceof DOMException && caught.name === 'AbortError') {
      throw new Error('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.')
    }
    throw caught
  } finally {
    window.clearTimeout(timeout)
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const response = await fetch('/api/auth/me', { credentials: 'include' })
    if (!response.ok) {
      setUser(null)
      return
    }

    const data = await response.json() as { user: AuthUser | null }
    setUser(data.user)
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false))
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetchWithTimeout('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error(await parseApiError(response))

    const data = await response.json() as { user: AuthUser }
    setUser(data.user)
  }, [])

  const register = useCallback(async (formData: FormData) => {
    const response = await fetchWithTimeout('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) throw new Error(await parseApiError(response))

    const data = await response.json() as RegisterResult
    if (data.user) setUser(data.user)
    return data
  }, [])

  const verifyEmail = useCallback(async (token: string) => {
    const response = await fetchWithTimeout('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token }),
    })

    if (!response.ok) throw new Error(await parseApiError(response))

    const data = await response.json() as { user: AuthUser }
    setUser(data.user)
  }, [])

  const resendVerification = useCallback(async (email: string) => {
    const response = await fetchWithTimeout('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })

    if (!response.ok) throw new Error(await parseApiError(response))

    const data = await response.json() as { message?: string }
    return data.message || '인증 메일을 다시 보냈습니다.'
  }, [])

  const updateProfile = useCallback(async (formData: FormData) => {
    const response = await fetchWithTimeout('/api/profile', {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) throw new Error(await parseApiError(response))

    const data = await response.json() as { user: AuthUser }
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, login, register, verifyEmail, resendVerification, updateProfile, logout, refreshUser }),
    [user, isLoading, login, register, verifyEmail, resendVerification, updateProfile, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
