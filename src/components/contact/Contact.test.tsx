import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Contact from './Contact'

describe('Contact', () => {
  it('renders contact title', () => {
    render(<Contact />)

    expect(screen.getByText('Kontakt')).toBeInTheDocument()
  })

  it('renders contact content', () => {
    render(<Contact />)

    expect(screen.getByText('Skontaktuj się z nami')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<Contact />)

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('biuro@maxsoft.pl')).toBeInTheDocument()
    expect(screen.getByText('Telefon')).toBeInTheDocument()
    expect(screen.getByText('+48791821908')).toBeInTheDocument()
    expect(screen.getByText('Godziny pracy')).toBeInTheDocument()
  })

  it('renders warning message', () => {
    render(<Contact />)

    expect(screen.getByText(/W przypadku problemów technicznych/)).toBeInTheDocument()
  })
})