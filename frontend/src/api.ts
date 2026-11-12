// communication to the backend lives here
// for local dev: set VITE_USE_MOCK=true in frontend/.env to work without the Django backend running
const API: string = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK === 'true'

// TODO: need to confirm actual login and register paths with daniel
const LOGIN_PATH = '/account/token/'
const REGISTER_PATH = '/register/'  
const AUTH_SCHEME = 'Bearer'

// TODO: what the backend sends back after a successful login (i think? confirm with daniel)
// TODO: also need to know what errors look like and handle CORS
export interface AuthTokens {
    access: string
    refresh: string
}

// the app checks the token to know if someone is logged in, so the access token is saved under that name
export function saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('token', tokens.access)
    localStorage.setItem('refresh', tokens.refresh)
}

export function clearTokens(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
}

interface RequestOptions {
    method?: string
    body?: string
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

// fake backend for my development only
function mockRequest<T>(path: string, options: RequestOptions = {}): T {
    const body: { email?: string; password?: string } = options.body ? JSON.parse(options.body) : {}
    const users: Record<string, string> = JSON.parse(localStorage.getItem('mock_users') || '{}')
    const email = (body.email || '').trim().toLowerCase()

    if (path === REGISTER_PATH) {
        if (!email || (body.password || '').length < 8) {
            throw new Error('Enter an email and a password of at least 8 characters.')
        }
        if (users[email]) throw new Error('An account with that email already exists.')

        users[email] = body.password as string
        localStorage.setItem('mock_users', JSON.stringify(users))
        return { email } as T
    }

    if (path === LOGIN_PATH) {
        if (users[email] !== body.password) throw new Error('Incorrect email or password.')
        return { access: `mock-access-${email}`, refresh: `mock-refresh-${email}` } as T
    }

    throw new Error(`No mock for ${path}`)
}

// helper for turning whatever the backend sends back into one readable message
function getErrorMessage(data: unknown): string {
    if (typeof data === 'object' && data !== null) {
        const body = data as Record<string, unknown>
        if (typeof body.error === 'string') return body.error
        if (typeof body.detail === 'string') return body.detail

        for (const key of Object.keys(body)) {
            const value = body[key]
            if (typeof value === 'string') return value
            if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
        }
    }
    return 'Something went wrong.'
}

// real requests to Django
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (USE_MOCK) return mockRequest<T>(path, options)

    const token = localStorage.getItem('token')

    let res: Response
    try {
    res = await fetch(`${API}${path}`, {
        ...options,
        headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `${AUTH_SCHEME} ${token}` } : {}),
        },
    })
    } catch {
    // the request never reached the backend for some reason
    throw new Error("Can't reach the server. Is the backend running?")
    }

    const data: unknown = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(getErrorMessage(data))
    return data as T
}

// register only needs to succeed, so we don't rely on what it sends back
export const register = (email: string, password: string): Promise<void> =>
    request<unknown>(REGISTER_PATH, { method: 'POST', body: JSON.stringify({ email, password }) }).then(() => undefined)

export const login = (email: string, password: string): Promise<AuthTokens> =>
    request<AuthTokens>(LOGIN_PATH, { method: 'POST', body: JSON.stringify({ email, password }) })

export const program = (): Promise<ApiResponse<string>> =>
    request<ApiResponse<string>>("/programs/", { method: 'GET' })
