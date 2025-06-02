# Contributing to AStack

Thank you for your interest in contributing to AStack! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contribution Workflow](#contribution-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Component Design Principles](#component-design-principles)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## Development Setup

### Prerequisites

- Node.js >= 18
- pnpm 10.10.0 or later

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/astack.git
   cd astack
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Build the packages:
   ```bash
   pnpm build
   ```

5. Run tests:
   ```bash
   pnpm test
   ```

## Project Structure

AStack is a monorepo managed with pnpm workspaces, containing the following packages:

- `packages/core` - Core framework functionality
- `packages/components` - Ready-to-use AI components
- `packages/integrations` - Integration with third-party services
- `packages/tools` - Utility tools for AStack applications
- `examples` - Example applications and usage patterns
- `apps` - Full applications built with AStack

## Branching Strategy

AStack uses the following branching strategy:

- `dev` - Development branch where all new features and fixes are integrated
- `master` - Stable release branch, only updated for releases

## Contribution Workflow

1. Ensure you have the latest `dev` branch:
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. Create a new branch from `dev`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes

4. Create a changeset to document your changes:
   ```bash
   pnpm changeset
   ```
   Follow the prompts to describe your changes. Be specific about what you've changed and why.

5. Commit your changes:
   ```bash
   git commit -m "feat: add new feature"
   ```
   Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

6. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a pull request against the `dev` branch

## Pull Request Guidelines

- PR title should follow the [Conventional Commits](https://www.conventionalcommits.org/) format
- Include a reference to related issues (if applicable)
- Include a clear description of the changes
- Include tests for new functionality
- Update documentation for API changes
- Ensure all tests pass and linting is clean

## Coding Standards

AStack follows strict coding standards to ensure consistency and maintainability:

- TypeScript for all code
- ESLint for code linting
- Prettier for code formatting

### Key Principles

- Strongly typed interfaces
- Immutable data structures where possible
- Functional programming patterns
- Clear, descriptive naming

Run the linter before submitting:
```bash
pnpm lint
```

## Testing

We strive for high test coverage. Please include tests for new features and bug fixes:

- Unit tests for individual components
- Integration tests for component interactions
- E2E tests for complete workflows (where applicable)

Run tests with:
```bash
pnpm test
```

## Documentation

Documentation is crucial for AStack:

- Add JSDoc comments to all public APIs
- Update README files when changing package functionality
- Add examples for new features
- Update website documentation for significant changes

## Component Design Principles

When contributing new components, follow these principles:

### "Everything is a Component" Philosophy

- Components should inherit from the `Component` base class
- Components must have well-defined input and output ports
- Components should be reusable and composable

### Zero-Adaptation Design

- Avoid unnecessary adaptation layers
- Components should be directly compatible with their integrations
- Keep APIs consistent across the framework

### Dual Operation Modes

- Support standalone operation via `run()` method
- Support pipeline integration via the transform system

### Component Interface Guidelines

- Use semantic port naming
- Follow the established naming conventions
- Ensure proper type definitions
- Document the purpose and behavior of each port

## Getting Help

If you have questions or need help, you can:

- Open an issue with your question
- Reach out to the maintainers

Thank you for contributing to AStack!
