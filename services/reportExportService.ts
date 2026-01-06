import { ScanResult, Severity } from '../types';

export const exportToPDF = async (scan: ScanResult): Promise<void> => {
  // Create HTML content for PDF generation
  const htmlContent = generateHTMLReport(scan);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window. Please allow popups for this site.');
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HIPAA Compliance Report - ${scan.sourceName}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .summary-card {
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .critical { background-color: #fef2f2; border-color: #fecaca; }
          .high { background-color: #fff7ed; border-color: #fed7aa; }
          .medium { background-color: #fffbeb; border-color: #fde68a; }
          .low { background-color: #eff6ff; border-color: #bfdbfe; }
          .finding {
            margin-bottom: 25px;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #e2e8f0;
            background: #f8fafc;
          }
          .finding.critical { border-left-color: #ef4444; }
          .finding.high { border-left-color: #f97316; }
          .finding.medium { border-left-color: #eab308; }
          .finding.low { border-left-color: #3b82f6; }
          .severity-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .code-example {
            background: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            margin-top: 10px;
            overflow-x: auto;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .finding { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

export const exportToHTML = async (scan: ScanResult): Promise<void> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HIPAA Compliance Report - ${scan.sourceName}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .summary-card {
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .critical { background-color: #fef2f2; border-color: #fecaca; }
          .high { background-color: #fff7ed; border-color: #fed7aa; }
          .medium { background-color: #fffbeb; border-color: #fde68a; }
          .low { background-color: #eff6ff; border-color: #bfdbfe; }
          .finding {
            margin-bottom: 25px;
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #e2e8f0;
            background: #f8fafc;
          }
          .finding.critical { border-left-color: #ef4444; }
          .finding.high { border-left-color: #f97316; }
          .finding.medium { border-left-color: #eab308; }
          .finding.low { border-left-color: #3b82f6; }
          .severity-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .code-example {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 13px;
            margin-top: 15px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${generateHTMLReport(scan)}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hipaa-report-${scan.sourceName.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToJSON = async (scan: ScanResult): Promise<void> => {
  const jsonData = {
    report: {
      id: scan.id,
      timestamp: scan.timestamp,
      date: new Date(scan.timestamp).toISOString(),
      source: scan.source,
      sourceName: scan.sourceName,
      status: scan.status,
      summary: scan.summary,
      totalFindings: scan.findings.length,
      filesScanned: scan.filesScanned || 0
    },
    findings: scan.findings.map(finding => ({
      id: finding.id,
      title: finding.title,
      severity: finding.severity,
      category: finding.category,
      description: finding.description,
      recommendation: finding.recommendation,
      codeExample: finding.codeExample,
      file: finding.file,
      line: finding.line
    })),
    metadata: {
      exportedAt: new Date().toISOString(),
      exportedBy: 'GuardPHI HIPAA Compliance Scanner',
      version: '1.0'
    }
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hipaa-report-${scan.sourceName.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const generateHTMLReport = (scan: ScanResult): string => {
  const getSeverityClass = (severity: Severity): string => {
    return severity.toLowerCase();
  };

  const getSeverityBadgeStyle = (severity: Severity): string => {
    const styles = {
      [Severity.CRITICAL]: 'background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca;',
      [Severity.HIGH]: 'background-color: #fff7ed; color: #9a3412; border: 1px solid #fed7aa;',
      [Severity.MEDIUM]: 'background-color: #fffbeb; color: #92400e; border: 1px solid #fde68a;',
      [Severity.LOW]: 'background-color: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;',
    };
    return styles[severity];
  };

  return `
    <div class="header">
      <h1>HIPAA Compliance Report</h1>
      <h2>${scan.sourceName}</h2>
      <p>Generated on ${new Date(scan.timestamp).toLocaleDateString()} at ${new Date(scan.timestamp).toLocaleTimeString()}</p>
    </div>

    <div class="summary">
      <div class="summary-card critical">
        <h3>Critical</h3>
        <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${scan.summary.critical}</div>
      </div>
      <div class="summary-card high">
        <h3>High</h3>
        <div style="font-size: 24px; font-weight: bold; color: #ea580c;">${scan.summary.high}</div>
      </div>
      <div class="summary-card medium">
        <h3>Medium</h3>
        <div style="font-size: 24px; font-weight: bold; color: #d97706;">${scan.summary.medium}</div>
      </div>
      <div class="summary-card low">
        <h3>Low</h3>
        <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${scan.summary.low}</div>
      </div>
    </div>

    <h2>Detailed Findings (${scan.findings.length} total)</h2>
    
    ${scan.findings.map(finding => `
      <div class="finding ${getSeverityClass(finding.severity)}">
        <div class="severity-badge" style="${getSeverityBadgeStyle(finding.severity)}">
          ${finding.severity}
        </div>
        <h3>${finding.title}</h3>
        <p><strong>File:</strong> ${finding.file} (Line ${finding.line})</p>
        <p><strong>Category:</strong> ${finding.category}</p>
        <p><strong>Description:</strong> ${finding.description}</p>
        <p><strong>Recommendation:</strong> ${finding.recommendation}</p>
        ${finding.codeExample ? `
          <p><strong>Secure Code Example:</strong></p>
          <div class="code-example">${finding.codeExample}</div>
        ` : ''}
      </div>
    `).join('')}

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
      <p>Report generated by GuardPHI HIPAA Compliance Scanner</p>
      <p>Scan ID: ${scan.id} | Total Files Scanned: ${scan.filesScanned || 0}</p>
    </div>
  `;
};