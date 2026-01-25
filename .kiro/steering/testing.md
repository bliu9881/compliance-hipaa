# Testing Guidelines

## Running Tests

### Correct Command
```bash
npm run test -- services/scanService.test.ts
```

### Common Mistakes to Avoid

❌ **WRONG** - Do NOT add `--run` twice:
```bash
npm run test -- services/scanService.test.ts --run
```
This causes: `Error: Expected a single value for option "--run", received [true, true]`

The `npm run test` script already includes `--run` in the package.json, so adding it again creates a duplicate flag error.

✅ **CORRECT** - Just use the file path:
```bash
npm run test -- services/scanService.test.ts
```

## Test Configuration

- **Test Framework**: Vitest 4.0.18
- **Environment**: jsdom (browser-like environment)
- **Property-Based Testing**: fast-check library
- **Minimum Iterations**: 100 runs per property-based test

## Running All Tests

```bash
npm run test
```

## Test File Organization

- Service tests: `services/*.test.ts`
- Component tests: `components/*.test.tsx`
- All tests use Vitest with jsdom environment

## Property-Based Testing Notes

When writing property-based tests:
- Use `fc.assert()` with `fc.property()` for universal properties
- Configure with `{ numRuns: 100 }` minimum
- Tag each test with: `Feature: {feature_name}, Property {number}: {property_text}`
- Reference requirements in test comments

## SessionStorage Testing

When testing sessionStorage behavior:
- Always `sessionStorage.clear()` in `beforeEach()` and `afterEach()`
- Remember: sessionStorage is cleared on page refresh (simulated with `sessionStorage.clear()`)
- localStorage persists across sessions (different from sessionStorage)
