import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ThemeSwitcher from '../ThemeSwitcher'

describe('ThemeSwitcher', () => {
  const renderWithProvider = () => {
    return render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )
  }

  it('renders theme switcher button', () => {
    renderWithProvider()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows theme options when clicked', () => {
    renderWithProvider()
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })

  it('changes theme when option is selected', () => {
    renderWithProvider()
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Dark'))
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
}) 