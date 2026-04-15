'use client';

import { useState } from 'react';
import { useUpload, type UploadedFile } from '../../../hooks/useUpload';

export default function UploadsPage() {
  const { upload, loading } = useUpload();
  const [last, setLast] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h1>Uploads</h1>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <label>
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setError(null);
                try {
                  const uploaded = await upload(file);
                  setLast(uploaded);
                } catch (err: any) {
                  setError(err?.message || 'Upload failed');
                }
              }}
            />
            <span>
              <button className="primary" disabled={loading}>Choose file</button>
            </span>
          </label>
        </div>
        {error ? <div style={{ color: 'crimson', marginTop: 10 }}>{error}</div> : null}

        {last ? (
          <div style={{ marginTop: 12 }} className="card">
            <strong>Last upload</strong>
            <div style={{ opacity: 0.75, fontSize: 13 }}>{last.originalName}</div>
            <div style={{ opacity: 0.75, fontSize: 13 }}>{last.url}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
