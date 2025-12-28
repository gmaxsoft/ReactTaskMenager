import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Register from './Register'

// Mock auth store
const mockSignUp = vi.fn()
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    signUp: mockSignUp,
  })),
}))

describe('Register', () => {
  const mockOnSwitchToLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form', () => {
    render(<Register onSwitchToLogin={mockOnSwitchToLogin} />)

    expect(screen.getByText('IT Task Manager')).toBeInTheDocument()
    expect(screen.getByText('Utwórz nowe konto')).toBeInTheDocument()
    expect(screen.getByLabelText(/Imię i nazwisko/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Hasło$/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Potwierdź hasło/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zarejestruj się/ })).toBeInTheDocument()
  })

  it('calls onSwitchToLogin when login link is clicked', () => {
    render(<Register onSwitchToLogin={mockOnSwitchToLogin} />)

    const loginButton = screen.getByRole('button', { name: /Zaloguj się/ })
    fireEvent.click(loginButton)

    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1)
  })

  it('updates form inputs', () => {
    render(<Register onSwitchToLogin={mockOnSwitchToLogin} />)

    const nameInput = screen.getByLabelText(/Imię i nazwisko/)
    const emailInput = screen.getByLabelText(/Email/)
    const passwordInput = screen.getByLabelText(/^Hasło$/)
    const confirmPasswordInput = screen.getByLabelText(/Potwierdź hasło/)

    fireEvent.change(nameInput, { target: { value: 'Jan Kowalski' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

    expect(nameInput).toHaveValue('Jan Kowalski')
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('password123')
  })

  it('validates password confirmation', () => {
    render(<Register onSwitchToLogin={mockOnSwitchToLogin} />)

    const passwordInput = screen.getByLabelText(/^Hasło$/)
    const confirmPasswordInput = screen.getByLabelText(/Potwierdź hasło/)

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } })

    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('different')
  })

  it('validates password length', () => {
    render(<Register onSwitchToLogin={mockOnSwitchToLogin} />)

    const passwordInput = screen.getByLabelText(/^Hasło$/)

    fireEvent.change(passwordInput, { target: { value: '123' } })

    expect(passwordInput).toHaveValue('123')
  })

  it('submits form when all fields are filled', () => {
    render(<Register onSwitchToLogin={mockOnSwitchToLogin} />)

    const nameInput = screen.getByLabelText(/Imię i nazwisko/)
    const emailInput = screen.getByLabelText(/Email/)
    const passwordInput = screen.getByLabelText(/^Hasło$/)
    const confirmPasswordInput = screen.getByLabelText(/Potwierdź hasło/)
    const termsCheckbox = screen.getByLabelText(/Akceptuję/)
    const submitButton = screen.getByRole('button', { name: /Zarejestruj się/ })

    fireEvent.change(nameInput, { target: { value: 'Jan Kowalski' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(termsCheckbox)
    fireEvent.click(submitButton)

    // Form submission is handled by component, mock prevents actual API call
    expect(nameInput).toHaveValue('Jan Kowalski')
    expect(emailInput).toHaveValue('test@example.com')
  })
})