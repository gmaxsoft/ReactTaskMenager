import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Help from './Help'

describe('Help', () => {
  it('renders help title', () => {
    render(<Help />)

    expect(screen.getByText('Pomoc')).toBeInTheDocument()
  })

  it('renders help content', () => {
    render(<Help />)

    expect(screen.getByText('Jak korzystać z aplikacji')).toBeInTheDocument()
    expect(screen.getByText('Zarządzanie zadaniami')).toBeInTheDocument()
    expect(screen.getByText('Zarządzanie użytkownikami (tylko administratorzy)')).toBeInTheDocument()
  })

  it('renders help sections', () => {
    render(<Help />)

    expect(screen.getByText(/Przejdź do sekcji "Zadania"/)).toBeInTheDocument()
    expect(screen.getByText(/Użyj przycisku "Dodaj zadanie"/)).toBeInTheDocument()
    expect(screen.getByText(/Dashboard/)).toBeInTheDocument()
  })
})