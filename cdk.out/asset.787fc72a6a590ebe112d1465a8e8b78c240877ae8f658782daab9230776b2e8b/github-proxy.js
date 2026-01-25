"use strict";
/**
 * GitHub API Proxy Lambda Function
 * Handles GitHub API requests to bypass CORS restrictions
 *
 * This function proxies requests to GitHub's API, allowing the frontend
 * to fetch repository data and file contents without CORS issues.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const GITHUB_API_BASE = 'https://api.github.com';
/**
 * Makes a request to GitHub API with proper headers
 */
async function makeGitHubRequest(endpoint, token) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GuardPHI-Scanner'
    };
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
        method: 'GET',
        headers
    });
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
/**
 * Gets the latest commit SHA for a repository
 */
async function getCommitSha(owner, repo, token) {
    const data = await makeGitHubRequest(`/repos/${owner}/${repo}/commits/HEAD`, token);
    return data.sha;
}
/**
 * Gets repository contents (file listing)
 */
async function getRepoContents(owner, repo, path = '', token) {
    const endpoint = path
        ? `/repos/${owner}/${repo}/contents/${path}`
        : `/repos/${owner}/${repo}/contents`;
    const data = await makeGitHubRequest(endpoint, token);
    return Array.isArray(data) ? data : [data];
}
/**
 * Gets file content from repository
 */
async function getFileContent(owner, repo, path, token) {
    const data = await makeGitHubRequest(`/repos/${owner}/${repo}/contents/${path}`, token);
    // GitHub API returns content as base64
    if (data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    throw new Error('No content found in GitHub response');
}
/**
 * Main Lambda handler
 */
async function handler(event) {
    // Set CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    };
    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    try {
        // Parse request body
        const body = typeof event.body === 'string'
            ? JSON.parse(event.body)
            : event.body;
        const request = body;
        // Validate required fields
        if (!request.action || !request.owner || !request.repo) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: action, owner, repo'
                })
            };
        }
        let result;
        switch (request.action) {
            case 'getCommitSha':
                result = await getCommitSha(request.owner, request.repo, request.token);
                break;
            case 'getRepoContents':
                result = await getRepoContents(request.owner, request.repo, request.path || '', request.token);
                break;
            case 'getFileContent':
                if (!request.path) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({
                            success: false,
                            error: 'Missing required field: path'
                        })
                    };
                }
                result = await getFileContent(request.owner, request.repo, request.path, request.token);
                break;
            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: `Unknown action: ${request.action}`
                    })
                };
        }
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: result
            })
        };
    }
    catch (error) {
        console.error('GitHub proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Unknown error'
            })
        };
    }
}
