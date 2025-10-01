# School Management System API

A comprehensive REST API for managing school operations built with Node.js, Express, TypeScript, and MongoDB Atlas.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Teacher, Student, Parent)
- **User Management**: Complete CRUD operations for users with different roles
- **Class Management**: Create and manage classes with teachers and students
- **Subject Management**: Assign subjects to classes and teachers
- **Enrollment Management**: Enroll students in classes and subjects
- **Attendance Tracking**: Mark and track student attendance with bulk operations
- **Exam & Grade Management**: Create exams, record grades, and generate reports
- **Announcement System**: Create and manage announcements with audience targeting
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Security**: Helmet, CORS, rate limiting, input validation
- **Testing**: Jest with Supertest for API testing
- **Docker Support**: Containerized deployment ready
- **Logging**: Structured logging with Pino

## Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Logging**: Pino
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js 20+ 
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Server
   PORT=4000
   NODE_ENV=development
   API_PREFIX=/api/v1

   # MongoDB Atlas
   MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"

   # JWT Secrets (generate strong random strings)
   JWT_ACCESS_SECRET=your-access-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_ACCESS_TTL=15m
   JWT_REFRESH_TTL=7d

   # Email (optional for development)
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   SMTP_FROM="SchoolMS <no-reply@schoolms.local>"
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the API**
   - API Base URL: `http://localhost:4000/api/v1`
   - API Documentation: `http://localhost:4000/docs`
   - Health Check: `http://localhost:4000/health`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password (authenticated)

### Users (Admin only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Classes
- `GET /classes` - Get all classes
- `GET /classes/:id` - Get class by ID
- `POST /classes` - Create new class (Admin/Teacher)
- `PATCH /classes/:id` - Update class (Admin/Teacher)
- `DELETE /classes/:id` - Delete class (Admin)
- `POST /classes/:id/students` - Add student to class
- `DELETE /classes/:id/students/:studentId` - Remove student from class

### Subjects
- `GET /subjects` - Get all subjects
- `GET /subjects/:id` - Get subject by ID
- `POST /subjects` - Create new subject (Admin/Teacher)
- `PATCH /subjects/:id` - Update subject (Admin/Teacher)
- `DELETE /subjects/:id` - Delete subject (Admin)

### Enrollments
- `GET /enrollments` - Get all enrollments
- `GET /enrollments/:id` - Get enrollment by ID
- `POST /enrollments` - Create new enrollment (Admin/Teacher)
- `PATCH /enrollments/:id` - Update enrollment (Admin/Teacher)
- `DELETE /enrollments/:id` - Delete enrollment (Admin)
- `POST /enrollments/:id/subjects` - Add subject to enrollment
- `DELETE /enrollments/:id/subjects/:subjectId` - Remove subject from enrollment

### Attendance
- `GET /attendance` - Get all attendance records
- `GET /attendance/:id` - Get attendance record by ID
- `POST /attendance` - Mark attendance for a student (Admin/Teacher)
- `POST /attendance/bulk` - Mark bulk attendance for a class (Admin/Teacher)
- `PATCH /attendance/:id` - Update attendance record (Admin/Teacher)
- `DELETE /attendance/:id` - Delete attendance record (Admin)
- `GET /attendance/report` - Get attendance report

### Exams & Grades
- `GET /exams` - Get all exams
- `GET /exams/:id` - Get exam by ID
- `POST /exams` - Create new exam (Admin/Teacher)
- `PATCH /exams/:id` - Update exam (Admin/Teacher)
- `DELETE /exams/:id` - Delete exam (Admin)
- `GET /exams/:id/grades` - Get grades for a specific exam
- `GET /grades` - Get all grades
- `POST /grades` - Create new grade (Admin/Teacher)
- `GET /grades/student` - Get grades for a specific student

### Announcements
- `GET /announcements` - Get all announcements
- `GET /announcements/:id` - Get announcement by ID
- `GET /announcements/my` - Get my announcements
- `POST /announcements` - Create new announcement (Admin/Teacher)
- `PATCH /announcements/:id` - Update announcement (Admin/Teacher)
- `DELETE /announcements/:id` - Delete announcement (Admin/Teacher)
- `POST /announcements/:id/publish` - Publish announcement (Admin/Teacher)
- `POST /announcements/:id/archive` - Archive announcement (Admin/Teacher)

## User Roles

- **ADMIN**: Full system access, can manage all users, classes, and subjects
- **TEACHER**: Can manage classes and subjects, view students
- **STUDENT**: Can view their own data, classes, and subjects
- **PARENT**: Can view their children's data

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
```

### Project Structure

```
src/
├── config/          # Configuration files
├── db/             # Database connection
├── docs/           # API documentation
├── middleware/     # Express middleware
├── modules/        # Feature modules
│   ├── auth/       # Authentication
│   ├── users/      # User management
│   ├── classes/    # Class management
│   └── subjects/   # Subject management
├── tests/          # Test files
├── utils/          # Utility functions
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## Testing

The project includes comprehensive tests using Jest and Supertest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Tests use an in-memory MongoDB instance for isolation and speed.

## Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t school-management-api .

# Run the container
docker run -p 4000:4000 --env-file .env school-management-api
```

### Docker Compose (Optional)

Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/school-management
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
NODE_ENV=production
PORT=4000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_ACCESS_SECRET=your-strong-access-secret
JWT_REFRESH_SECRET=your-strong-refresh-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=your-email@domain.com
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Zod schema validation for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Password Hashing**: bcrypt with salt rounds
- **Environment Variables**: Sensitive data protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email jerickogarcia0@gmail.com or create an issue in the repository.

