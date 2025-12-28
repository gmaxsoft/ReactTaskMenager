import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Footer from './Footer'

// Mock useNavigation hook
const mockSetCurrentView = vi.fn()
vi.mock('../../context/NavigationContext', () => ({
  useNavigation: () => ({
    setCurrentView: mockSetCurrentView,
  }),
}))

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/© \d{4} Menadżer Zadań/)).toBeInTheDocument()
  })

  it('renders Pomoc button', () => {
    render(<Footer />)
    const helpButton = screen.getByRole('button', { name: /Pomoc/i })
    expect(helpButton).toBeInTheDocument()
  })

  it('renders Kontakt button', () => {
    render(<Footer />)
    const contactButton = screen.getByRole('button', { name: /Kontakt/i })
    expect(contactButton).toBeInTheDocument()
  })

  it('calls setCurrentView when Pomoc button is clicked', () => {
    render(<Footer />)
    const helpButton = screen.getByRole('button', { name: /Pomoc/i })
    helpButton.click()
    expect(mockSetCurrentView).toHaveBeenCalledWith('help')
  })

  it('calls setCurrentView when Kontakt button is clicked', () => {
    render(<Footer />)
    const contactButton = screen.getByRole('button', { name: /Kontakt/i })
    contactButton.click()
    expect(mockSetCurrentView).toHaveBeenCalledWith('contact')
  })
})