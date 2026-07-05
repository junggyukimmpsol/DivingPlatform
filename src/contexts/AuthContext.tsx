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
  profile: DiverProfile
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (formData: FormData) => Promise<void>
  updateProfile: (formData: FormData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const parseApiError = async (response: Response) => {
  try {
    const data = await response.json() as { error?: string }
    return data.error || '요청을 처리하지 못했습니다.'
  } catch {
    return '요청을 처리하지 못했습니다.'
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
    const response = await fetch('/api/auth/login', {
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
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) throw new Error(await parseApiError(response))

    const data = await response.json() as { user: AuthUser }
    setUser(data.user)
  }, [])

  const updateProfile = useCallback(async (formData: FormData) => {
    const response = await fetch('/api/profile', {
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
    () => ({ user, isLoading, login, register, updateProfile, logout, refreshUser }),
    [user, isLoading, login, register, updateProfile, logout, refreshUser],
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
