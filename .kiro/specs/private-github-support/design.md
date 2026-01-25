# Design Document: Private GitHub Repository Support

## Overview

This design adds GitHub personal access token (PAT) authentication to GuardPHI's GitHub scanning feature. Users can optionally provide a token to scan private repositories. The implementation focuses on security (session-only storage, no logging), simplicity (minimal UI changes), and backward compatibility (public repos work without tokens).

## Architecture

### Component Structure

```
Scanner.tsx (existing)
├── GitHub Tab
│   ├── Repository URL input (existing)
│   ├── GitHub Token input (NEW)
│   │   ├── Password-masked input field
│   │   ├── Help text with link to GitHub docs
│   │   └── Token validation feedback
│   ├── Incremental Check toggle (existing)
│   └── Start Scan button (existing)
└── File Upload Tab (unchanged)
```

### Data Flow

```
User enters token
    ↓
Scanner stores in sessionStorage
    ↓
performGitHubScan() called
    ↓
Retrieve token from sessionStorage
    ↓
Pass token to all GitHub API functions
    ↓
Each API call includes Authorization header
    ↓
GitHub API responds (public or private repo)
    ↓
Scan proceeds or error is caught and displayed
```

### Session Storage Strategy

- **Key**: `github_token` (session storage only)
- **Lifetime**: Duration of browser session (cleared on page refresh/close)
- **Access**: Retrieved when scan starts, never persisted to disk
- **Clearing**: Automatic on page refresh, manual when user clears input

## Components and Interfaces

### Scanner.tsx Changes

**New State Variables:**
```typescript
const [githubToken, setGithubToken] = useState<string>('');
```

**New Handler Functions:**
```typescript
const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const token = e.target.value;
  setGithubToken(token);
  if (token) {
    sessionStorage.setItem('github_token', token);
  } else {
    sessionStorage.removeItem('github_token');
  }
};

const handleTokenClear = () => {
  setGithubToken('');
  sessionStorage.removeItem('github_token');
};
```

**New UI Elements:**
- Token input field (type="password") below repository URL
- Help text: "Optional: Provide a GitHub personal access token to scan private repositories"
- Link to GitHub token creation docs
- Token validation feedback (shows when token is invalid format)
- Clear button next to token input

**On Component Mount:**
```typescript
useEffect(() => {
  const storedToken = sessionStorage.getItem('github_token');
  if (storedToken) {
    setGithubToken(storedToken);
  }
}, []);
```

### scanService.ts Changes

**New Helper Function:**
```typescript
const getGitHubAuthHeader = (): Record<string, string> => {
  const token = sessionStorage.getItem('github_token');
  if (token) {
    return {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
  }
  return {};
};
```

**Updated API Functions:**

1. `getLatestCommitSha()` - Add auth headers to fetch
2. `getRepoFiles()` - Add auth headers to fetch
3. File content fetch in `performGitHubScan()` - Add auth headers

**Error Handling Enhancement:**
```typescript
const handleGitHubError = (response: Response, context: string): string => {
  if (response.status === 401) {
    return 'GitHub authentication failed. Please verify your token is valid and has "repo" scope permissions.';
  }
  if (response.status === 403) {
    return 'You do not have access to this repository. Please verify the URL and your token permissions.';
  }
  if (response.status === 404) {
    const token = sessionStorage.getItem('github_token');
    if (!token) {
      return 'Repository is private. Please provide a GitHub personal access token to scan private repositories.';
    }
    return 'Repository not found. Please verify the URL is correct.';
  }
  return `Failed to ${context}. Please try again.`;
};
```

## Data Models

### No new types needed

The existing `ScanResult` type already supports both public and private repos. Token is never stored in scan results.

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Token Session Isolation

**For any** GitHub token provided by a user, after the browser session ends (page refresh or close), the token SHALL be completely removed from memory and not accessible in subsequent sessions.

**Validates: Requirements 4.1, 4.4**

### Property 2: Token Not Persisted in Results

**For any** scan result saved to Supabase or localStorage, the GitHub token SHALL NOT appear anywhere in the saved data structure, including findings, metadata, or any nested objects.

**Validates: Requirements 4.5**

### Property 3: Authentication Header Consistency

**For any** GitHub API call made during a scan, if a token is stored in sessionStorage, the call SHALL include an Authorization header with format `token <token_value>`. If no token is stored, the call SHALL NOT include an Authorization header.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 4: Private Repo Access with Token

**For any** private GitHub repository URL and valid GitHub token with repo scope, the scanner SHALL successfully fetch repository metadata, file list, and file contents without 401/403 errors.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 5: Public Repo Access Without Token

**For any** public GitHub repository URL and no token provided, the scanner SHALL successfully fetch repository metadata, file list, and file contents without requiring authentication.

**Validates: Requirements 6.1, 6.2**

### Property 6: Error Message Accuracy

**For any** failed GitHub API call, the error message displayed to the user SHALL accurately reflect the failure reason (401 = auth failed, 403 = no access, 404 = private repo without token or not found).

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 7: Token Input Masking

**For any** GitHub token entered in the token input field, the displayed text SHALL be masked (shown as dots/asterisks) and the actual token value SHALL NOT be visible in the DOM or browser developer tools.

**Validates: Requirements 4.2**

### Property 8: Token Validation Format

**For any** token input, if the token is less than 40 characters, the scanner SHALL display validation feedback indicating the token format is invalid.

**Validates: Requirements 5.4**

## Error Handling

### GitHub API Error Scenarios

| Status | Scenario | User Message | Action |
|--------|----------|--------------|--------|
| 401 | Invalid/expired token | "GitHub authentication failed. Please verify your token is valid and has 'repo' scope permissions." | Show error, allow retry with new token |
| 403 | Token lacks permissions | "Your GitHub token does not have required permissions. Please ensure it has 'repo' scope." | Show error, link to token creation docs |
| 404 | Private repo without token | "Repository is private. Please provide a GitHub personal access token to scan private repositories." | Show error, focus token input |
| 404 | Repo doesn't exist | "Repository not found. Please verify the URL is correct." | Show error, allow URL correction |
| Network | Connection failed | "Failed to connect to GitHub. Please check your internet connection." | Show error, allow retry |

### Token Validation

- **Format**: Must be 40+ characters (GitHub PAT format)
- **Feedback**: Show inline validation message if < 40 chars
- **Clearing**: Allow user to clear token at any time

## Testing Strategy

### Unit Tests

1. **Token Storage Tests**
   - Token is stored in sessionStorage when entered
   - Token is removed from sessionStorage when cleared
   - Token is retrieved from sessionStorage on component mount
   - Token is not stored in localStorage

2. **Authentication Header Tests**
   - Auth header is included when token exists
   - Auth header is NOT included when token is empty
   - Auth header format is correct: `token <value>`

3. **Error Handling Tests**
   - 401 error shows correct message
   - 403 error shows correct message
   - 404 error shows correct message based on token presence
   - Network errors are handled gracefully

4. **Token Masking Tests**
   - Input field has type="password"
   - Token value is not visible in DOM
   - Token value is not logged to console

### Property-Based Tests

1. **Property 1: Token Session Isolation**
   - Generate random tokens
   - Store in sessionStorage
   - Simulate page refresh
   - Verify token is cleared

2. **Property 2: Token Not Persisted**
   - Generate random scan results with tokens
   - Save to mock storage
   - Verify token does not appear in saved data

3. **Property 3: Authentication Header Consistency**
   - Generate random tokens and API calls
   - Verify header presence/format matches token state

4. **Property 4: Private Repo Access**
   - Mock GitHub API responses for private repos
   - Verify successful access with valid token
   - Verify failure without token

5. **Property 5: Public Repo Access**
   - Mock GitHub API responses for public repos
   - Verify successful access without token

6. **Property 6: Error Message Accuracy**
   - Generate various HTTP error responses
   - Verify error messages match status codes

7. **Property 7: Token Input Masking**
   - Verify input type is "password"
   - Verify token not visible in rendered output

8. **Property 8: Token Validation Format**
   - Generate tokens of various lengths
   - Verify validation feedback for < 40 chars

### Integration Tests

1. **Full Scan Flow with Private Repo**
   - User enters token
   - User enters private repo URL
   - Scan completes successfully
   - Results are saved without token

2. **Token Expiration Handling**
   - User provides expired token
   - Scan fails with 401
   - User can update token and retry

3. **Backward Compatibility**
   - Public repo scan works without token
   - Incremental check works with token
   - Switching between public/private repos maintains token state

