# Contributing to Career Transition AI Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/career-transition-platform.git
   cd career-transition-platform
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/career-transition-platform.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up the development environment** (see [SETUP.md](./SETUP.md))

## Development Workflow

### 1. Create a Branch

Create a feature branch from `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's coding standards
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run backend tests (if available)
cd backend
npm test

# Run frontend tests (if available)
cd frontend
npm test

# Test manually
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

- Go to GitHub and create a Pull Request
- Fill out the PR template
- Link any related issues
- Wait for review

## Project Structure

```
career-transition-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── scripts/             # Utility scripts
│
└── frontend/
    ├── app/                 # Next.js app router pages
    ├── components/          # React components
    ├── contexts/            # React contexts
    ├── lib/                 # Utilities and helpers
    └── public/              # Static assets
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Avoid
const data: any = {...}
```

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### Backend

- Use async/await for asynchronous operations
- Implement proper error handling
- Add logging for important operations
- Validate input data

```typescript
// Good
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', { userId, error });
    throw new Error('Database query failed');
  }
}
```

### Styling

- Use Tailwind CSS classes
- Follow existing component patterns
- Ensure responsive design
- Maintain consistent spacing

### File Naming

- React components: PascalCase (`UserProfile.tsx`)
- Utilities/services: camelCase (`authService.ts`)
- Types: PascalCase (`UserTypes.ts`)
- Constants: UPPER_SNAKE_CASE

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(agents): add new AI advisor personality
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
refactor(api): simplify error handling logic
test(intake): add unit tests for intake service
chore(deps): update dependencies
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be in the next release!

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests (if available)
npm run test:e2e
```

### Writing Tests

- Add tests for new features
- Ensure edge cases are covered
- Mock external dependencies
- Keep tests focused and simple

## Areas to Contribute

### High Priority

- [ ] Add comprehensive test coverage
- [ ] Improve error handling
- [ ] Add input validation
- [ ] Performance optimizations
- [ ] Accessibility improvements

### Features

- [ ] Additional AI advisor personalities
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Social sharing
- [ ] Mobile app

### Documentation

- [ ] API documentation
- [ ] Component documentation
- [ ] Video tutorials
- [ ] Use case examples

### UI/UX

- [ ] Dark mode
- [ ] Animation improvements
- [ ] Mobile responsiveness
- [ ] Loading states

## Getting Help

- Create an [issue](https://github.com/OWNER/REPO/issues) for questions
- Join our community discussions
- Review existing PRs for examples
- Check the documentation

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Recognized in our community

Thank you for contributing! 🎉
