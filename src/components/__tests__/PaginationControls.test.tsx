import { render, screen, fireEvent } from '@testing-library/react'
import PaginationControls from '../PaginationControls'

describe('PaginationControls', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
    totalItems: 50,
    itemsPerPage: 10,
    onLimitChange: jest.fn(),
  }

  it('renders pagination controls correctly', () => {
    render(<PaginationControls {...defaultProps} />)
    
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('disables Previous button on first page', () => {
    render(<PaginationControls {...defaultProps} />)
    
    expect(screen.getByText('Previous')).toBeDisabled()
  })

  it('disables Next button on last page', () => {
    render(<PaginationControls {...defaultProps} currentPage={5} />)
    
    expect(screen.getByText('Next')).toBeDisabled()
  })

  it('calls onPageChange when clicking page numbers', () => {
    const onPageChange = jest.fn()
    render(<PaginationControls {...defaultProps} onPageChange={onPageChange} />)
    
    fireEvent.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onLimitChange when changing items per page', () => {
    const onLimitChange = jest.fn()
    render(<PaginationControls {...defaultProps} onLimitChange={onLimitChange} />)
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '25' } })
    expect(onLimitChange).toHaveBeenCalledWith(25)
  })
}) 