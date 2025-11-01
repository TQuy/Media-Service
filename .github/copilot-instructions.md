# Copilot Instructions for media-service (NestJS)

## Big Picture Architecture
- This is a NestJS TypeScript backend service, organized by modules, controllers, and providers (services).
- Main entry: `src/main.ts` bootstraps the app and sets up the HTTP server.
- Core logic is in `src/app.controller.ts`, `src/app.service.ts`, and custom services under `src/services/`.
- Example: `src/services/computing/fibonacci.ts` implements a Fibonacci calculation service.

## Service Boundaries & Data Flow
- Controllers handle HTTP requests and delegate to services for business logic.
- Services are stateless and injected via NestJS dependency injection.
- New features should be added as services and exposed via controllers.
- Example: To expose Fibonacci calculation, create a controller in `src/services/computing/` and inject the service.

## Developer Workflows
- **Install dependencies:** `npm install`
- **Run in development:** `npm run start:dev`
- **Run in production:** `npm run start:prod`
- **Run unit tests:** `npm run test`
- **Run e2e tests:** `npm run test:e2e`
- **Test coverage:** `npm run test:cov`
- **Build for deployment:** `npm run build`

## Project-Specific Conventions
- Use NestJS's built-in `Logger` for logging; instantiate per class for context.
- Services are placed in `src/services/`, grouped by domain (e.g., `computing`).
- Controllers and services use dependency injection; avoid global state.
- TypeScript strictness is enforced via `tsconfig.json`.
- Tests are in `test/` for e2e and alongside source files for unit tests.

## Integration Points & External Dependencies
- No database or external API integration is present by default.
- Add new integrations as injectable services and document in the module.
- External dependencies are managed via `package.json`.

## Patterns & Examples
- **Service Example:**
  ```typescript
  import { Injectable } from '@nestjs/common';
  @Injectable()
  export class FibonacciService {
    getFibonacciNumber(n: number): number { /* ... */ }
  }
  ```
- **Controller Example:**
  ```typescript
  import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
  import { FibonacciService } from './fibonacci';
  @Controller('fibonacci')
  export class FibonacciController {
    constructor(private readonly fibonacciService: FibonacciService) {}
    @Get(':n')
    getFibonacci(@Param('n', ParseIntPipe) n: number) {
      return { input: n, result: this.fibonacciService.getFibonacciNumber(n) };
    }
  }
  ```

## Key Files & Directories
- `src/main.ts`: App entrypoint
- `src/app.module.ts`: Main module, register controllers/services here
- `src/services/`: Custom business logic
- `test/`: E2E and unit tests
- `package.json`: Scripts and dependencies
- `README.md`: Project setup and workflow reference

---

If any section is unclear or missing, please provide feedback to improve these instructions.

## Coding Style
- Use functional programming if possible, but can switch to hybrid approach between OOP and functional programming if closure is hard to comprehend, and having a explicit state is better.
- We will try to split code into three layers: `Controller`, `Service` and finally `Utility`. The `Utility` layer hold the re-usable, pure functions such as function to calculate fibonacci number.
- Don't update the path alias `@/*` to `../*` in files that are not test files