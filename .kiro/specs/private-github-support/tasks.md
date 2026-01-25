# Implementation Plan: Private GitHub Repository Support

## Overview

This implementation adds GitHub personal access token (PAT) authentication to enable scanning of private repositories. The work is organized into discrete tasks that build incrementally, starting with service layer changes, then UI updates, and finally testing.

## Tasks

- [x] 1. Add GitHub authentication helper to scanService
  - Create `getGitHubAuthHeader()` function that retrieves token from sessionStorage
  - Returns Authorization header object if token exists, empty object otherwise
  - _Requirements: 2.1, 2.5_

- [x] 2. Update GitHub API calls with authentication headers
  - Modify `getLatestCommitSha()` to include auth headers in fetch call
  - Modify `getRepoFiles()` to include auth headers in fetch call
  - Modify file content fetch in `performGitHubScan()` to include auth headers
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 3. Implement enhanced error handling for GitHub API failures
  - Create `handleGitHubError()` function that maps HTTP status codes to user-friendly messages
  - Handle 401 (auth failed), 403 (no permissions), 404 (private repo or not found)
  - Update `performGitHubScan()` to use new error handler
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3.1 Write unit tests for error handling
  - **Property 6: Error Message Accuracy**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 4. Add GitHub token input UI to Scanner component
  - Add `githubToken` state variable
  - Add token input field (type="password") below repository URL
  - Add help text: "Optional: Provide a GitHub personal access token to scan private repositories"
  - Add link to GitHub token creation documentation
  - _Requirements: 1.1, 1.2, 5.1, 5.2_

- [x] 5. Implement token storage and retrieval
  - Create `handleTokenChange()` to store token in sessionStorage when user enters it
  - Create `handleTokenClear()` to remove token from sessionStorage
  - Add `useEffect` hook to retrieve token from sessionStorage on component mount
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 5.1 Write unit tests for token storage
  - **Property 1: Token Session Isolation**
  - **Validates: Requirements 1.3, 1.4, 1.5, 4.1, 4.4**

- [x] 6. Add token validation and feedback
  - Add validation to check token length (40+ characters)
  - Display validation message if token is invalid format
  - Show validation feedback inline below token input
  - _Requirements: 5.4_

- [x] 6.1 Write unit tests for token validation
  - **Property 8: Token Validation Format**
  - **Validates: Requirements 5.4**

- [x] 7. Ensure token input is masked
  - Verify input field has type="password"
  - Add CSS to ensure password masking works correctly
  - Test that token value is not visible in DOM
  - _Requirements: 4.2_

- [x] 7.1 Write unit tests for token masking
  - **Property 7: Token Input Masking**
  - **Validates: Requirements 4.2**

- [x] 8. Verify token is not persisted in scan results
  - Confirm `saveScan()` does not include token in saved data
  - Verify token is not logged to console anywhere
  - Check that Supabase sync does not include token
  - _Requirements: 4.3, 4.5_

- [x] 8.1 Write unit tests for token non-persistence
  - **Property 2: Token Not Persisted in Results**
  - **Validates: Requirements 4.3, 4.5**

- [x] 9. Checkpoint - Verify all service layer changes work
  - Test that auth headers are included in API calls when token exists
  - Test that auth headers are NOT included when token is empty
  - Test that error messages display correctly for different failure scenarios
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Test backward compatibility with public repos
  - Scan a public repository without providing a token
  - Verify scan completes successfully
  - Verify incremental check works without token
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 10.1 Write property test for public repo access
  - **Property 5: Public Repo Access Without Token**
  - **Validates: Requirements 6.1, 6.2**

- [x] 11. Test private repo scanning with token
  - Scan a private repository with a valid GitHub token
  - Verify scan completes successfully
  - Verify files are fetched and analyzed
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 11.1 Write property test for private repo access
  - **Property 4: Private Repo Access with Token**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [x] 12. Test authentication error scenarios
  - Test with invalid/expired token (should show 401 error)
  - Test with token lacking repo scope (should show 403 error)
  - Test with private repo and no token (should show 404 error)
  - Verify error messages guide user to solutions
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 12.1 Write property test for authentication header consistency
  - **Property 3: Authentication Header Consistency**
  - **Validates: Requirements 2.1, 2.5**

- [x] 13. Test token session isolation
  - Store a token in sessionStorage
  - Simulate page refresh
  - Verify token is cleared from sessionStorage
  - Verify token input field is empty
  - _Requirements: 1.5, 4.1, 4.4_

- [x] 14. Test UI state management
  - Enter token and verify it's stored
  - Clear token and verify it's removed
  - Switch between GitHub and File Upload tabs and verify token persists
  - Refresh page and verify token is cleared
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests
  - Run integration tests
  - Verify no console errors or warnings
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation
- Token is never logged to console for security
- Token is never included in saved scan results
- All changes maintain backward compatibility with public repos

