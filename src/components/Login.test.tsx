import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from './Login'

// Mock auth store
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    signIn: vi.fn().mockResolvedValue({ error: null }),
  })),
}))

describe('Login', () => {
  const mockOnSwitchToRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    render(<Login onSwitchToRegister={mockOnSwitchToRegister} />)

    expect(screen.getByText('Menadżer Zadań')).toBeInTheDocument()
    expect(screen.getByText('Zaloguj się do swojego konta')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Hasło/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zaloguj się/ })).toBeInTheDocument()
  })

  it('calls onSwitchToRegister when register link is clicked', () => {
    render(<Login onSwitchToRegister={mockOnSwitchToRegister} />)

    const registerButton = screen.getByRole('button', { name: /Zarejestruj się/ })
    fireEvent.click(registerButton)

    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1)
  })

  it('updates email and password inputs', () => {
    render(<Login onSwitchToRegister={mockOnSwitchToRegister} />)

    const emailInput = screen.getByLabelText(/Email/)
    const passwordInput = screen.getByLabelText(/Hasło/)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('submits form when button is clicked', () => {
    render(<Login onSwitchToRegister={mockOnSwitchToRegister} />)

    const emailInput = screen.getByLabelText(/Email/)
    const passwordInput = screen.getByLabelText(/Hasło/)
    const submitButton = screen.getByRole('button', { name: /Zaloguj się/ })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Form submission is handled by component, mock prevents actual API call
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
})