import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { login, saveTokens } from '../api'
import LoginUser from '../pages/LoginUser'

// mock react-router's navigate function and link component
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

// mock the API layer
vi.mock('../api', () => ({
    login: vi.fn(),
    saveTokens: vi.fn(),
}))

// TEST 1: successful login
test('allows a user to log in successfully', async () => {
    // mock a successful API response
    const fakeTokens = { accessToken: '123', refreshToken: '456' } as any
    vi.mocked(login).mockResolvedValue(fakeTokens)

    // render the page
    render(<LoginUser />)

    // find form controls
    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // simulate the user input
    await userEvent.type(emailInput, 'user@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    // verify it called the API with the correct credentials
    expect(login).toHaveBeenCalledWith('user@example.com', 'password123')
    expect(saveTokens).toHaveBeenCalledWith(fakeTokens)

    // check if it redirected the user to the dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
})

// TEST 2: failed login
test('displays an error message when the login API fails', async () => {
    // mock a failed response
    const errorMessage = 'Invalid email or password'
    vi.mocked(login).mockRejectedValue(new Error(errorMessage))

    // render the page
    render(<LoginUser />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    // simulate user input
    await userEvent.type(emailInput, 'wrong@example.com')
    await userEvent.type(passwordInput, 'wrong-password')
    await userEvent.click(submitButton)

    // verify it called the API with the wrong credentials
    expect(login).toHaveBeenCalledWith('wrong@example.com', 'wrong-password')

    // save tokens and navigate shouldn't be called on a failure
    expect(saveTokens).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()

    // the error message must appear visually on the screen
    const errorElement = screen.getByText(errorMessage)
    expect(errorElement).toBeDefined()
})
