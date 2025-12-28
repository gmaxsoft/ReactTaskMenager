import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Settings from './Settings'

// Mock child components
vi.mock('./UsersTable', () => ({
  default: () => <div data-testid="users-table">UsersTable Component</div>,
}))

vi.mock('./AddUser', () => ({
  default: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="add-user">
      AddUser Component
      <button onClick={onSuccess} data-testid="add-user-success">Success</button>
    </div>
  ),
}))

describe('Users Settings', () => {
  it('renders with default active tab as list', () => {
    render(<Settings />)

    expect(screen.getByText('Użytkownicy')).toBeInTheDocument()
    expect(screen.getByText('Lista użytkowników')).toBeInTheDocument()
    expect(screen.getByText('Dodaj użytkownika')).toBeInTheDocument()
    expect(screen.getByTestId('users-table')).toBeInTheDocument()
  })

  it('switches to add user tab when clicked', () => {
    render(<Settings />)

    const addUserTab = screen.getByRole('button', { name: /Dodaj użytkownika/ })
    fireEvent.click(addUserTab)

    expect(screen.getByTestId('add-user')).toBeInTheDocument()
    expect(screen.queryByTestId('users-table')).not.toBeInTheDocument()
  })

  it('switches back to list tab when success callback is called', () => {
    render(<Settings />)

    // Switch to add user
    const addUserTab = screen.getByRole('button', { name: /Dodaj użytkownika/ })
    fireEvent.click(addUserTab)

    expect(screen.getByTestId('add-user')).toBeInTheDocument()

    // Trigger success callback
    const successButton = screen.getByTestId('add-user-success')
    fireEvent.click(successButton)

    expect(screen.getByTestId('users-table')).toBeInTheDocument()
    expect(screen.queryByTestId('add-user')).not.toBeInTheDocument()
  })

  it('applies active styles to current tab', () => {
    render(<Settings />)

    const listTab = screen.getByRole('button', { name: /Lista użytkowników/ })
    const addTab = screen.getByRole('button', { name: /Dodaj użytkownika/ })

    // List tab should be active by default
    expect(listTab).toHaveClass('border-indigo-500', 'text-indigo-600')
    expect(addTab).toHaveClass('border-transparent', 'text-gray-500')

    // Switch to add tab
    fireEvent.click(addTab)

    expect(addTab).toHaveClass('border-indigo-500', 'text-indigo-600')
    expect(listTab).toHaveClass('border-transparent', 'text-gray-500')
  })
})