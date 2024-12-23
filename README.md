# TimeTracker - Technical Documentation

## Overview
TimeTracker is a full-stack web application built with Next.js and Express, featuring user authentication, role-based access control, and user management capabilities.

## Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js with JWT
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Backend (Express)
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator

## Core Features

### Authentication
- JWT-based authentication
- Protected routes using Next.js middleware
- Session management with NextAuth.js
- Role-based access control (Admin/User)

### User Management
- CRUD operations for users
- Pagination
- Sorting
- Filtering
- Search functionality
- Status tracking (Active/Pending/Inactive)

### Theme System
- Light/Dark mode support
- Theme persistence
- Custom color schemes
- Dynamic theme switching

## Directory Structure
```
├── src/
│ ├── app/ # Next.js app directory
│ │ ├── api/ # API routes
│ │ ├── dashboard/ # Dashboard pages
│ │ └── auth/ # Authentication pages
│ ├── components/ # React components
│ ├── contexts/ # React contexts
│ ├── hooks/ # Custom hooks
│ ├── providers/ # Provider components
│ └── types/ # TypeScript type definitions
├── server/
│ ├── src/
│ │ ├── controllers/ # Express controllers
│ │ ├── middleware/ # Express middleware
│ │ ├── routes/ # Express routes
│ │ └── services/ # Business logic
│ └── prisma/ # Prisma schema and migrations
```

## API Endpoints

### Authentication (TypeScript)
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### User Management (TypeScript)
``` 
GET /api/users # Get users (with pagination)
GET /api/users/:id # Get single user
PUT /api/users/:id # Update user
DELETE /api/users/:id # Delete user
```
## Database Schema
```
prisma
model User {
id String @id @default(cuid())
email String @unique
password String
firstName String
lastName String
mobile String?
photo String? @default("/placeholder-avatar.png")
role Role @default(USER)
status Status @default(PENDING)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
enum Role {
ADMIN
USER
}
enum Status {
ACTIVE
PENDING
INACTIVE
}
```


## Authentication Flow

1. **Login Process**:
   ```typescript
   // 1. User submits credentials
   const res = await signIn('credentials', {
     email: formData.get('email'),
     password: formData.get('password'),
     redirect: false,
   })

   // 2. Server validates and returns JWT
   // 3. Token stored in NextAuth.js session
   // 4. Protected routes check session status
   ```

2. **Route Protection**:
   ```typescript
   // Middleware checks for valid session
   export default withAuth(
     function middleware(req) {
       const isAuth = !!req.nextauth.token
       // ... route protection logic
     }
   )
   ```

## Testing

### Unit Tests (Jest)
```
bash
npm test # Run all tests
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

### E2E Tests (Cypress)
```
bash
npm run cypress:run # Run all E2E tests
```

### Test Files Structure
```
plaintext
├── tests/
│ ├── components/ # Component tests
│ ├── hooks/ # Hook tests
│ └── api/ # API tests
├── cypress/
│ └── e2e/ # E2E test specs
```

## Environment Variables

### Frontend (.env.local)
```
plaintext
NEXTAUTH_SECRET=your_secret_key
```

### Backend (.env)
```
plaintext
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```


## Development Setup

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**:
   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   ```

3. **Database Setup**:
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start Development Servers**:
   ```bash
   # Frontend
   npm run dev

   # Backend
   cd server
   npm run dev
   ```

## Build & Deployment

### Frontend
```
bash
npm run build
npm start
```

### Backend
```
bash
cd server
npm run build
npm start
```


## Error Handling

- Frontend form validation using custom hooks
- Backend validation using express-validator
- Global error handling middleware
- Type-safe error responses

## Performance Considerations

- Debounced search inputs
- Pagination for large datasets
- Optimized database queries
- Memoized React components
- Proper TypeScript types for type safety

## Security Measures

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation
- Type checking
- Session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License