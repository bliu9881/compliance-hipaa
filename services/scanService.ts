
import { ScanResult, ScanStatus, Finding } from '../types';
import { analyzeCodeForHIPAA } from './aiProviderService';
import { supabase } from './supabase';

const LOCAL_STORAGE_KEY = 'auroscan_scans';

/**
 * Saves a scan result to Supabase with LocalStorage fallback
 */
export const saveScan = async (scan: ScanResult) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Always save to local storage first as a buffer
  const localScans = getScansLocal();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([scan, ...localScans.filter(s => s.id !== scan.id)]));

  if (!user) {
    console.warn('Scan saved locally only: No authenticated user found.');
    return;
  }

  console.log('Attempting to sync scan to Supabase...', scan.id);

  const { error } = await supabase.from('scans').upsert({
    id: scan.id,
    user_id: user.id,
    timestamp: new Date(scan.timestamp).toISOString(),
    source: scan.source,
    source_name: scan.sourceName,
    status: scan.status,
    summary: scan.summary,
    findings: scan.findings,
    last_commit_hash: scan.lastCommitHash,
    files_scanned: scan.filesScanned || 0 // Add files scanned count
  });

  if (error) {
    console.error('Supabase Sync Error:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', 'Ensure the "scans" table exists and RLS policies allow INSERT.');
  } else {
    console.log('Successfully synced scan to Supabase.');
  }
};

/**
 * Retrieves scans for the current user (Combined Supabase + LocalStorage)
 */
export const getScans = async (): Promise<ScanResult[]> => {
  const local = getScansLocal();
  
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.warn('Supabase fetch failed (returning local history):', error.message);
    return local;
  }

  // Explicitly type as ScanResult[] to prevent inferred property requirement issues
  const remote: ScanResult[] = data.map(item => ({
    id: item.id,
    timestamp: new Date(item.timestamp).getTime(),
    source: item.source,
    sourceName: item.source_name,
    status: item.status as ScanStatus,
    summary: item.summary,
    findings: item.findings,
    lastCommitHash: item.last_commit_hash || undefined,
    filesScanned: item.files_scanned || 0 // Add files scanned count
  }));

  // Merge and deduplicate (Remote data is the source of truth)
  const combined = [...remote];
  local.forEach(l => {
    if (!combined.find(r => r.id === l.id)) {
      combined.push(l);
    }
  });

  return combined.sort((a, b) => b.timestamp - a.timestamp);
};

const getScansLocal = (): ScanResult[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Enhanced lookup checking both cloud and local storage
 */
export const getScanById = async (id: string): Promise<ScanResult | undefined> => {
  // 1. Try Supabase first
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!error && data) {
    return {
      id: data.id,
      timestamp: new Date(data.timestamp).getTime(),
      source: data.source,
      sourceName: data.source_name,
      status: data.status as ScanStatus,
      summary: data.summary,
      findings: data.findings,
      lastCommitHash: data.last_commit_hash,
      filesScanned: data.files_scanned || 0 // Add files scanned count
    };
  }

  // 2. Fallback to LocalStorage
  return getScansLocal().find(s => s.id === id);
};

export const clearScans = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  
  if (user) {
    await supabase.from('scans').delete().eq('user_id', user.id);
  }
};

const getSummary = (findings: Finding[]) => {
  return findings.reduce((acc, f) => {
    const key = f.severity.toLowerCase() as keyof typeof acc;
    if (acc.hasOwnProperty(key)) {
      acc[key]++;
    }
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });
};

const parseGitHubUrl = (url: string) => {
  try {
    const cleanUrl = url.replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    const repo = parts.pop();
    const owner = parts.pop();
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch (e) {
    return null;
  }
};

const getLatestCommitSha = async (owner: string, repo: string) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/HEAD`);
  if (!response.ok) throw new Error('Failed to fetch commit info. Is the repo public?');
  const data = await response.json();
  return data.sha;
};

const getRepoFiles = async (owner: string, repo: string, path: string = '', maxFiles: number = 50): Promise<any[]> => {
  console.log(`📂 Scanning directory: ${path || 'root'}`);
  
  const url = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch repository contents for ${path || 'root'}`);
  const contents = await response.json();
  
  let allFiles: any[] = [];
  
  for (const item of contents) {
    if (allFiles.length >= maxFiles) {
      console.log(`⚠️ Reached maximum file limit (${maxFiles}), stopping scan`);
      break;
    }
    
    if (item.type === 'file') {
      // Check if it's a code file we want to scan
      if (/\.(js|ts|tsx|jsx|py|go|java|php|rb|sql|c|cpp|cs|swift|kt|scala|rs)$/i.test(item.name)) {
        console.log(`📄 Found code file: ${item.path}`);
        allFiles.push(item);
      }
    } else if (item.type === 'dir') {
      // Skip common directories that don't contain source code
      const skipDirs = ['node_modules', '.git', 'dist', 'build', 'target', 'bin', 'obj', '.next', 'coverage', '__pycache__'];
      if (!skipDirs.includes(item.name)) {
        console.log(`📁 Recursively scanning subdirectory: ${item.path}`);
        try {
          const subFiles = await getRepoFiles(owner, repo, item.path, maxFiles - allFiles.length);
          allFiles = [...allFiles, ...subFiles];
        } catch (error) {
          console.warn(`⚠️ Failed to scan subdirectory ${item.path}:`, error);
        }
      } else {
        console.log(`⏭️ Skipping directory: ${item.path}`);
      }
    }
  }
  
  return allFiles;
};

export const performGitHubScan = async (repoUrl: string, isIncremental: boolean): Promise<ScanResult> => {
  console.log("🚀 Starting GitHub scan for:", repoUrl);
  
  const repoInfo = parseGitHubUrl(repoUrl);
  if (!repoInfo) throw new Error('Invalid GitHub URL');

  const { owner, repo } = repoInfo;
  console.log("📂 Repository info:", { owner, repo });
  
  const currentHash = await getLatestCommitSha(owner, repo);
  console.log("🔗 Latest commit hash:", currentHash);

  if (isIncremental) {
    const { data: lastScan } = await supabase
      .from('scans')
      .select('id, last_commit_hash, findings, summary, source_name, source, timestamp')
      .eq('source_name', repoUrl)
      .eq('source', 'github')
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastScan?.last_commit_hash === currentHash) {
      console.log("♻️ Using cached scan result - no changes detected");
      return {
        id: lastScan.id,
        timestamp: new Date(lastScan.timestamp).getTime(),
        source: 'github',
        sourceName: repoUrl,
        status: ScanStatus.COMPLETED,
        findings: lastScan.findings,
        summary: lastScan.summary,
        lastCommitHash: currentHash
      };
    }
  }

  const filesToScan = await getRepoFiles(owner, repo);
  console.log("📁 Total files found for scanning:", filesToScan.length);
  console.log("📄 Files to scan:", filesToScan.map(f => f.path || f.name));
  
  let allFindings: Finding[] = [];

  for (const file of filesToScan) {
    console.log("🔍 Analyzing file:", file.path || file.name);
    const contentResponse = await fetch(file.download_url);
    const code = await contentResponse.text();
    console.log("📄 File content length:", code.length);
    
    const findings = await analyzeCodeForHIPAA(code, file.path || file.name);
    console.log("🎯 Findings for", file.path || file.name, ":", findings.length);
    
    allFindings = [...allFindings, ...findings];
  }

  console.log("📊 Total findings across all files:", allFindings.length);

  const result: ScanResult = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    source: 'github',
    sourceName: repoUrl,
    status: ScanStatus.COMPLETED,
    findings: allFindings,
    summary: getSummary(allFindings),
    lastCommitHash: currentHash,
    filesScanned: filesToScan.length // Track number of files scanned
  };

  console.log("💾 Saving scan result:", result.summary);
  await saveScan(result);
  return result;
};

export const performFileUploadScan = async (files: File[]): Promise<ScanResult> => {
  let allFindings: Finding[] = [];
  
  console.log("📁 Total files uploaded for scanning:", files.length);
  
  for (const file of files) {
    console.log("🔍 Analyzing uploaded file:", file.name);
    const text = await file.text();
    const findings = await analyzeCodeForHIPAA(text, file.name);
    console.log("🎯 Findings for", file.name, ":", findings.length);
    allFindings = [...allFindings, ...findings];
  }

  const result: ScanResult = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    source: 'upload',
    sourceName: `${files.length} file(s)`,
    status: ScanStatus.COMPLETED,
    findings: allFindings,
    summary: getSummary(allFindings),
    filesScanned: files.length // Track number of files scanned
  };

  await saveScan(result);
  return result;
};
