/**
 * GitHub API Proxy Lambda Function
 * Handles GitHub API requests to bypass CORS restrictions
 *
 * This function proxies requests to GitHub's API, allowing the frontend
 * to fetch repository data and file contents without CORS issues.
 */
interface GitHubProxyResponse {
    success: boolean;
    data?: any;
    error?: string;
}
/**
 * Main Lambda handler
 */
export declare function handler(event: any): Promise<GitHubProxyResponse>;
export {};
