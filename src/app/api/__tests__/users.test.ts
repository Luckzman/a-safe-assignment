import { getUsers } from '../users'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('users API', () => {
  const mockToken = 'mock-token'
  const mockResponse = {
    data: {
      users: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls the users endpoint with correct parameters', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse)

    await getUsers(mockToken, { page: 1, limit: 10 })

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:5000/api/users?page=1&limit=10',
      expect.any(Object)
    )
  })

  it('includes authorization header', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse)

    await getUsers(mockToken, { page: 1, limit: 10 })

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${mockToken}`
        }
      })
    )
  })

  it('handles search and filter parameters', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse)

    await getUsers(mockToken, {
      page: 1,
      limit: 10,
      search: 'test',
      status: 'ACTIVE',
      sortBy: 'name',
      sortOrder: 'asc'
    })

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('search=test'),
      expect.any(Object)
    )
  })
}) 