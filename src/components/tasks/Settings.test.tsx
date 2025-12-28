import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Settings from './Settings'

// Mock child components
vi.mock('./TaskTable', () => ({
  default: () => <div data-testid="task-table">TaskTable Component</div>,
}))

vi.mock('./AddTask', () => ({
  default: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="add-task">
      AddTask Component
      <button onClick={onSuccess} data-testid="add-task-success">Success</button>
    </div>
  ),
}))

describe('Settings', () => {
  it('renders with default active tab as list', () => {
    render(<Settings />)

    expect(screen.getByText('Zadania')).toBeInTheDocument()
    expect(screen.getByText('Lista zadań')).toBeInTheDocument()
    expect(screen.getByText('Dodaj zadanie')).toBeInTheDocument()
    expect(screen.getByTestId('task-table')).toBeInTheDocument()
  })

  it('switches to add task tab when clicked', () => {
    render(<Settings />)

    const addTaskTab = screen.getByRole('button', { name: /Dodaj zadanie/ })
    fireEvent.click(addTaskTab)

    expect(screen.getByTestId('add-task')).toBeInTheDocument()
    expect(screen.queryByTestId('task-table')).not.toBeInTheDocument()
  })

  it('switches back to list tab when success callback is called', () => {
    render(<Settings />)

    // Switch to add task
    const addTaskTab = screen.getByRole('button', { name: /Dodaj zadanie/ })
    fireEvent.click(addTaskTab)

    expect(screen.getByTestId('add-task')).toBeInTheDocument()

    // Trigger success callback
    const successButton = screen.getByTestId('add-task-success')
    fireEvent.click(successButton)

    expect(screen.getByTestId('task-table')).toBeInTheDocument()
    expect(screen.queryByTestId('add-task')).not.toBeInTheDocument()
  })

  it('applies active styles to current tab', () => {
    render(<Settings />)

    const listTab = screen.getByRole('button', { name: /Lista zadań/ })
    const addTab = screen.getByRole('button', { name: /Dodaj zadanie/ })

    // List tab should be active by default
    expect(listTab).toHaveClass('border-indigo-500', 'text-indigo-600')
    expect(addTab).toHaveClass('border-transparent', 'text-gray-500')

    // Switch to add tab
    fireEvent.click(addTab)

    expect(addTab).toHaveClass('border-indigo-500', 'text-indigo-600')
    expect(listTab).toHaveClass('border-transparent', 'text-gray-500')
  })
})