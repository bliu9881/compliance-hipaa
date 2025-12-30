import { ScanResult, ScanStatus, Finding, Severity } from '../types.ts';
import { analyzeCodeForHIPAA } from './geminiService.ts';
import { supabase } from './supabase.ts';

const LOCAL_STORAGE_KEY = 'guardphi_scans';

export const saveScan = async (scan: ScanResult) => {
  const { data: { user } } = await supabase.auth.getUser();
  const localScans = getScansLocal();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([scan, ...localScans.filter(s => s.id !== scan.id)]));

  if (user) {
    await supabase.from('scans').upsert({
      id: scan.id,
      user_id: user.id,
      timestamp: new Date(scan.timestamp).toISOString(),
      source: scan.source,
      source_name: scan.sourceName,
      status: scan.status,
      summary: scan.summary,
      findings: scan.findings,
      last_commit_hash: scan.lastCommitHash
    });
  }
};

const getScansLocal = (): ScanResult[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getScans = async (): Promise<ScanResult[]> => {
  const local = getScansLocal();
  const { data, error } = await supabase.from('scans').select('*').order('timestamp', { ascending: false });

  if (error) return local;

  const remote: ScanResult[] = data.map(item => ({
    id: item.id,
    timestamp: new Date(item.timestamp).getTime(),
    source: item.source,
    sourceName: item.source_name,
    status: item.status as ScanStatus,
    summary: item.summary,
    findings: item.findings,
    lastCommitHash: item.last_commit_hash
  }));

  const combined = [...remote];
  local.forEach(l => {
    if (!combined.find(r => r.id === l.id)) combined.push(l);
  });

  return combined.sort((a, b) => b.timestamp - a.timestamp);
};

export const getScanById = async (id: string): Promise<ScanResult | undefined> => {
  const { data } = await supabase.from('scans').select('*').eq('id', id).maybeSingle();
  if (data) return {
    id: data.id,
    timestamp: new Date(data.timestamp).getTime(),
    source: data.source,
    sourceName: data.source_name,
    status: data.status as ScanStatus,
    summary: data.summary,
    findings: data.findings,
    lastCommitHash: data.last_commit_hash
  };
  return getScansLocal().find(s => s.id === id);
};

export const clearScans = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  if (user) await supabase.from('scans').delete().eq('user_id', user.id);
};

const getSummary = (findings: Finding[]) => {
  return findings.reduce((acc, f) => {
    const key = f.severity.toLowerCase() as keyof typeof acc;
    if (acc.hasOwnProperty(key)) acc[key]++;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });
};

const parseGitHubUrl = (url: string) => {
  try {
    const parts = url.replace(/\/$/, '').split('/');
    const repo = parts.pop();
    const owner = parts.pop();
    return owner && repo ? { owner, repo } : null;
  } catch { return null; }
};

const getLatestCommitSha = async (owner: string, repo: string) => {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/HEAD`);
  if (!response.ok) throw new Error('Repository not found or private');
  const data = await response.json();
  return data.sha;
};

export const performGitHubScan = async (repoUrl: string, isIncremental: boolean): Promise<ScanResult> => {
  const repoInfo = parseGitHubUrl(repoUrl);
  if (!repoInfo) throw new Error('Invalid GitHub URL');
  const { owner, repo } = repoInfo;
  const currentHash = await getLatestCommitSha(owner, repo);

  if (isIncremental) {
    const { data: lastScan } = await supabase.from('scans').select('*').eq('source_name', repoUrl).order('timestamp', { ascending: false }).limit(1).maybeSingle();
    if (lastScan?.last_commit_hash === currentHash) {
      return {
        id: lastScan.id,
        timestamp: Date.now(),
        source: 'github',
        sourceName: repoUrl,
        status: ScanStatus.COMPLETED,
        findings: lastScan.findings,
        summary: lastScan.summary,
        lastCommitHash: currentHash
      };
    }
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
  const contents = await response.json();
  const codeFiles = contents.filter((f: any) => f.type === 'file' && /\.(js|ts|tsx|jsx|py|go|java|php|rb|sql)$/i.test(f.name)).slice(0, 10);
  
  let allFindings: Finding[] = [];
  for (const file of codeFiles) {
    const code = await (await fetch(file.download_url)).text();
    allFindings = [...allFindings, ...await analyzeCodeForHIPAA(code, file.name)];
  }

  const result: ScanResult = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    source: 'github',
    sourceName: repoUrl,
    status: ScanStatus.COMPLETED,
    findings: allFindings,
    summary: getSummary(allFindings),
    lastCommitHash: currentHash
  };

  await saveScan(result);
  return result;
};

export const performFileUploadScan = async (files: File[]): Promise<ScanResult> => {
  let allFindings: Finding[] = [];
  for (const file of files) {
    const code = await file.text();
    allFindings = [...allFindings, ...await analyzeCodeForHIPAA(code, file.name)];
  }

  const result: ScanResult = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    source: 'upload',
    sourceName: `${files.length} file(s)`,
    status: ScanStatus.COMPLETED,
    findings: allFindings,
    summary: getSummary(allFindings)
  };

  await saveScan(result);
  return result;
};