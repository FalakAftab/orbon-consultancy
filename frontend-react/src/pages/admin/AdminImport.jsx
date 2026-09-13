import { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Database,
  Download,
} from 'lucide-react';
import { uploadImport, uploadTemporaryImport, exportData } from '../../api/admin';
import { ErrorState } from '../../components/ui';

const STAGES = [
  { key: 'validating', label: 'Validating file' },
  { key: 'reading', label: 'Reading records' },
  { key: 'processing', label: 'Processing & indexing' },
  { key: 'complete', label: 'Import complete' },
];

export default function AdminImport() {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [stageIdx, setStageIdx] = useState(-1);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState('');

  const runStages = async (promise) => {
    setUploading(true);
    setResult(null);
    setError('');
    setStageIdx(0);
    // Advance through stages over time to simulate the pipeline
    const timers = [0, 900, 1900, 2800].map((delay) =>
      setTimeout(() => setStageIdx((i) => Math.min(i + 1, STAGES.length - 1)), delay)
    );
    try {
      const res = await promise;
      setStageIdx(STAGES.length - 1);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Could not process import.');
      setStageIdx(-1);
    } finally {
      setUploading(false);
      clearTimeout(timers);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setResult(null);
    setError('');
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    runStages(uploadImport(selectedFile));
  };

  const handleTemporary = () => {
    runStages(uploadTemporaryImport());
  };

  const handleExport = async (type) => {
    setExporting(type);
    try {
      const blob = await exportData(type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'universities' ? 'universities.xlsx' : 'programs.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Could not export data.');
    } finally {
      setExporting('');
    }
  };

  const stats = result?.import
    ? {
        total: result.import.total_rows ?? 0,
        processed: result.import.processed_rows ?? 0,
        failed: result.import.failed_rows ?? 0,
      }
    : null;

  return (
    <div className="admin-import flex flex-col gap-6">
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 600,
            letterSpacing: 'var(--letter-spacing-tight)',
            color: 'var(--color-charcoal)',
          }}
        >
          DAAD / Excel Import
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Import university & program data from Excel workbooks or the bundled DAAD dataset
        </p>
      </div>

      {/* Upload zone */}
      <div
        className="card"
        style={{
          borderRadius: 'var(--radius-2xl)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: dragOver ? '2px dashed var(--color-forest)' : '2px dashed var(--color-border-strong)',
          background: dragOver ? 'rgba(15, 23, 42, 0.04)' : 'var(--color-surface)',
          gap: '1rem',
          cursor: 'pointer',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileSelect(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: 'var(--radius-2xl)',
            background: 'rgba(15, 23, 42, 0.08)',
            color: 'var(--color-forest)',
          }}
        >
          <UploadCloud size={26} />
        </span>
        <div>
          <p className="font-semibold" style={{ color: 'var(--color-charcoal)' }}>Drop an Excel file here or click to browse</p>
          <p className="text-sm text-muted mt-1">Supports .xlsx, .xls, .csv (max 20MB)</p>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-3 mt-2 p-3" style={{ background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <FileSpreadsheet size={20} style={{ color: 'var(--color-forest)' }} />
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} aria-label="Remove file">
              <Trash2 size={15} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button type="button" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }} onClick={(e) => { e.stopPropagation(); handleUpload(); }} disabled={!selectedFile || uploading}>
            {uploading ? <Loader2 size={15} className="spin" /> : <UploadCloud size={15} />}
            {uploading ? 'Processing...' : 'Import File'}
          </button>
          <button type="button" className="btn btn-secondary" style={{ borderRadius: 'var(--radius-full)' }} onClick={(e) => { e.stopPropagation(); handleTemporary(); }} disabled={uploading}>
            <Database size={15} /> Import DAAD Dataset
          </button>
        </div>

        {dragOver && <p className="text-sm text-forest font-medium">Release to upload</p>}
      </div>

      {/* Export actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted">Export current data:</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleExport('universities')} disabled={!!exporting}>
          <Download size={14} /> {exporting === 'universities' ? 'Exporting...' : 'Universities (xlsx)'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleExport('programs')} disabled={!!exporting}>
          <Download size={14} /> {exporting === 'programs' ? 'Exporting...' : 'Programs (xlsx)'}
        </button>
      </div>

      {/* Error */}
      {error && <ErrorState title="Import failed" description={error} />}

      {/* Pipeline stages */}
      {uploading && (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.5rem' }}>
          <p className="font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>Processing pipeline</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {STAGES.map((stage, idx) => {
              const isDone = idx < stageIdx;
              const isActive = idx === stageIdx;
              return (
                <div key={stage.key} className="flex items-center gap-3">
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isDone ? 'var(--color-forest)' : isActive ? 'var(--color-gold)' : 'var(--color-surface-subtle)',
                      color: isDone || isActive ? '#fff' : 'var(--color-muted)',
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? <CheckCircle2 size={14} /> : <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{idx + 1}</span>}
                  </span>
                  <span className={`text-sm ${isActive ? 'font-semibold' : ''}`} style={{ color: isActive ? 'var(--color-charcoal)' : 'var(--color-muted)' }}>
                    {stage.label}
                  </span>
                  {isActive && <Loader2 size={14} className="spin text-muted" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result summary */}
      {result && (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem' }}>
          <div className="flex items-center gap-3 mb-4">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'var(--color-success-50)', color: '#15803d' }}>
              <CheckCircle2 size={20} />
            </span>
            <div>
              <p className="font-semibold" style={{ color: 'var(--color-charcoal)' }}>Import completed</p>
              <p className="text-sm text-muted">{result.message || 'Workbook processed successfully.'}</p>
            </div>
          </div>

          {stats && (
            <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>{stats.total}</p>
                <p className="text-xs uppercase tracking-wide text-muted font-semibold mt-1">Records Detected</p>
              </div>
              <div style={{ background: 'var(--color-success-50)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#15803d' }}>{stats.processed}</p>
                <p className="text-xs uppercase tracking-wide font-semibold mt-1" style={{ color: '#15803d' }}>Imported</p>
              </div>
              <div style={{ background: stats.failed > 0 ? 'var(--color-danger-50)' : 'var(--color-surface-subtle)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: stats.failed > 0 ? 'var(--color-danger)' : 'var(--color-charcoal)' }}>
                  {stats.failed}
                </p>
                <p className="text-xs uppercase tracking-wide text-muted font-semibold mt-1">Skipped / Errors</p>
              </div>
            </div>
          )}

          {Array.isArray(result.errors) && result.errors.length > 0 ? (
            <div className="mt-5 p-4" style={{ background: 'var(--color-danger-50)', borderRadius: 'var(--radius-lg)' }}>
              <p className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: 'var(--color-danger-600)' }}>
                <AlertCircle size={15} /> Import errors
              </p>
              <ul style={{ paddingLeft: '1.25rem', listStyle: 'disc' }}>
                {result.errors.slice(0, 20).map((err, i) => (
                  <li key={i} className="text-xs text-muted">{typeof err === 'string' ? err : JSON.stringify(err)}</li>
                ))}
              </ul>
            </div>
          ) : result?.import?.notes ? (
            <p className="text-xs text-muted mt-4">Notes: {result.import.notes}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
